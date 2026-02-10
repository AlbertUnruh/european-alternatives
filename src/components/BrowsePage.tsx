import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { alternatives, categories } from '../data';
import AlternativeCard from './AlternativeCard';
import Filters from './Filters';
import type { CategoryId, CountryCode, SelectedFilters, SortBy, ViewMode } from '../types';

const validCategoryIds = new Set<string>(categories.map((c) => c.id));

export default function BrowsePage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Stable ref for setSearchParams to avoid dependency array issues
  const setSearchParamsRef = useRef(setSearchParams);
  useEffect(() => {
    setSearchParamsRef.current = setSearchParams;
  }, [setSearchParams]);

  // URL is the source of truth for category and search term.
  // Deriving these from searchParams (instead of local state) ensures
  // external navigations (e.g. LandingPage category links) are reflected.
  const searchTerm = searchParams.get('q') ?? '';
  const categoryFilters = useMemo(
    () => searchParams.getAll('category').filter((c) => validCategoryIds.has(c)) as CategoryId[],
    [searchParams],
  );

  // Ref tracking the latest URL params to avoid stale reads from
  // window.location.search when multiple handlers fire in the same tick.
  const latestParamsRef = useRef(new URLSearchParams(searchParams));
  useEffect(() => {
    latestParamsRef.current = new URLSearchParams(searchParams);
  }, [searchParams]);

  // Local-only state (not synced to URL)
  const [countryFilters, setCountryFilters] = useState<CountryCode[]>([]);
  const [pricingFilters, setPricingFilters] = useState<string[]>([]);
  const [openSourceOnly, setOpenSourceOnly] = useState(false);
  const [sortBy, setSortBy] = useState<SortBy>('name');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  // Combined filters for child components
  const selectedFilters: SelectedFilters = useMemo(() => ({
    category: categoryFilters,
    country: countryFilters,
    pricing: pricingFilters,
    openSourceOnly,
  }), [categoryFilters, countryFilters, pricingFilters, openSourceOnly]);

  const handleSearchChange = useCallback((term: string) => {
    const params = new URLSearchParams(latestParamsRef.current);
    if (term) {
      params.set('q', term);
    } else {
      params.delete('q');
    }
    latestParamsRef.current = params;
    setSearchParamsRef.current(params, { replace: true });
  }, []);

  const handleFilterChange = useCallback((filterType: keyof SelectedFilters, values: string[] | boolean) => {
    switch (filterType) {
      case 'category': {
        const params = new URLSearchParams(latestParamsRef.current);
        params.delete('category');
        for (const cat of values as string[]) {
          params.append('category', cat);
        }
        latestParamsRef.current = params;
        setSearchParamsRef.current(params, { replace: true });
        break;
      }
      case 'country':
        setCountryFilters(values as CountryCode[]);
        break;
      case 'pricing':
        setPricingFilters(values as string[]);
        break;
      case 'openSourceOnly':
        setOpenSourceOnly(values as boolean);
        break;
    }
  }, []);

  // Atomic clear: resets filter checkboxes but preserves search term
  // (search has its own clear button in the input field)
  const handleClearAll = useCallback(() => {
    const params = new URLSearchParams();
    const currentQ = latestParamsRef.current.get('q');
    if (currentQ) {
      params.set('q', currentQ);
    }
    latestParamsRef.current = params;
    setSearchParamsRef.current(params, { replace: true });
    setCountryFilters([]);
    setPricingFilters([]);
    setOpenSourceOnly(false);
  }, []);

  const filteredAlternatives = useMemo(() => {
    let result = [...alternatives];

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (alt) =>
          alt.name.toLowerCase().includes(term) ||
          alt.description.toLowerCase().includes(term) ||
          alt.replacesUS.some((r) => r.toLowerCase().includes(term)) ||
          alt.tags.some((t) => t.toLowerCase().includes(term))
      );
    }

    if (selectedFilters.category.length > 0) {
      result = result.filter((alt) =>
        selectedFilters.category.includes(alt.category as CategoryId)
      );
    }

    if (selectedFilters.country.length > 0) {
      result = result.filter((alt) =>
        selectedFilters.country.includes(alt.country)
      );
    }

    if (selectedFilters.pricing.length > 0) {
      result = result.filter((alt) =>
        selectedFilters.pricing.includes(alt.pricing)
      );
    }

    if (selectedFilters.openSourceOnly) {
      result = result.filter((alt) => alt.isOpenSource);
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'country':
          return a.country.localeCompare(b.country);
        case 'category':
          return a.category.localeCompare(b.category);
        default:
          return 0;
      }
    });

    return result;
  }, [searchTerm, selectedFilters, sortBy]);

  return (
    <div className="browse-page">
      <motion.div
        className="browse-header"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="browse-title">All Alternatives</h1>
        <p className="browse-subtitle">
          Explore European and open-source alternatives to US tech giants.
          Filter by category, country, or pricing to find what you need.
        </p>
      </motion.div>

      <motion.div
        className="browse-content"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Filters
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          selectedFilters={selectedFilters}
          onFilterChange={handleFilterChange}
          onClearAll={handleClearAll}
          sortBy={sortBy}
          onSortChange={setSortBy}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          totalCount={alternatives.length}
          filteredCount={filteredAlternatives.length}
        />

        {filteredAlternatives.length > 0 ? (
          <div className={`alt-grid${viewMode === 'list' ? ' list-view' : ''}`}>
            {filteredAlternatives.map((alt, index) => (
              <motion.div
                key={alt.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: Math.min(0.1 + index * 0.05, 1) }}
              >
                <AlternativeCard alternative={alt} viewMode={viewMode} />
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            className="no-results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            {alternatives.length === 0 ? (
              <div className="empty-catalogue">
                <div className="empty-icon" aria-hidden="true">
                  <span className="fi fi-eu"></span>
                </div>
                <h2>Catalogue Coming Soon</h2>
                <p>
                  We're building a comprehensive directory of European and open-source
                  alternatives. Check back soon or contribute to the project.
                </p>
              </div>
            ) : (
              <div className="empty-catalogue">
                <div className="empty-icon" aria-hidden="true">
                  <svg className="empty-search-icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                  </svg>
                </div>
                <h2>No Results Found</h2>
                <p>No alternatives match your current filters. Try adjusting your search or filter criteria.</p>
              </div>
            )}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
