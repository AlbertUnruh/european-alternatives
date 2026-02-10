import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { categories } from '../data';
import type { SelectedFilters, SortBy, ViewMode } from '../types';

const countryOptions = [
  { code: 'de', name: 'Germany' },
  { code: 'fr', name: 'France' },
  { code: 'nl', name: 'Netherlands' },
  { code: 'se', name: 'Sweden' },
  { code: 'fi', name: 'Finland' },
  { code: 'es', name: 'Spain' },
  { code: 'it', name: 'Italy' },
  { code: 'at', name: 'Austria' },
  { code: 'ch', name: 'Switzerland' },
  { code: 'no', name: 'Norway' },
  { code: 'dk', name: 'Denmark' },
  { code: 'pl', name: 'Poland' },
  { code: 'cz', name: 'Czechia' },
  { code: 'ie', name: 'Ireland' },
  { code: 'pt', name: 'Portugal' },
  { code: 'ee', name: 'Estonia' },
  { code: 'gb', name: 'United Kingdom' },
] as const;

const pricingOptions = [
  { value: 'free', label: 'Free' },
  { value: 'freemium', label: 'Freemium' },
  { value: 'paid', label: 'Paid' },
];

interface FiltersProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  selectedFilters: SelectedFilters;
  onFilterChange: (filterType: keyof SelectedFilters, values: string[] | boolean) => void;
  onClearAll: () => void;
  sortBy: SortBy;
  onSortChange: (sort: SortBy) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  totalCount: number;
  filteredCount: number;
}

export default function Filters({
  searchTerm,
  onSearchChange,
  selectedFilters,
  onFilterChange,
  onClearAll,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  totalCount,
  filteredCount,
}: FiltersProps) {
  const [showFilters, setShowFilters] = useState(false);

  const hasActiveFilters =
    selectedFilters.category.length > 0 ||
    selectedFilters.country.length > 0 ||
    selectedFilters.pricing.length > 0 ||
    selectedFilters.openSourceOnly;

  const clearAllFilters = () => {
    onClearAll();
  };

  const toggleFilter = (type: 'category' | 'country' | 'pricing', value: string) => {
    const current = selectedFilters[type] as string[];
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    onFilterChange(type, updated);
  };

  return (
    <div className="distro-filters">
      <div className="filters-search">
        <svg className="search-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
        </svg>
        <input
          type="text"
          placeholder="Search alternatives..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label="Search alternatives"
        />
        {searchTerm && (
          <button
            className="search-clear"
            onClick={() => onSearchChange('')}
            aria-label="Clear search"
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        )}
      </div>

      <div className="filters-controls-row">
        <span className="filters-count">
          {filteredCount} of {totalCount} alternatives
        </span>

        <div className="filters-controls-right">
          <div className="filters-sort">
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as SortBy)}
              aria-label="Sort by"
            >
              <option value="name">Name (A-Z)</option>
              <option value="country">Country</option>
              <option value="category">Category</option>
            </select>
            <svg className="sort-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M7 10l5 5 5-5z"/>
            </svg>
          </div>

          <div className="filters-view-toggle">
            <button
              className={`view-toggle-button ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => onViewModeChange('grid')}
              aria-label="Grid view"
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M4 11h5V5H4v6zm0 7h5v-6H4v6zm6 0h5v-6h-5v6zm6 0h5v-6h-5v6zm-6-7h5V5h-5v6zm6-6v6h5V5h-5z"/>
              </svg>
            </button>
            <button
              className={`view-toggle-button ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => onViewModeChange('list')}
              aria-label="List view"
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M4 14h4v-4H4v4zm0 5h4v-4H4v4zM4 9h4V5H4v4zm5 5h12v-4H9v4zm0 5h12v-4H9v4zM9 5v4h12V5H9z"/>
              </svg>
            </button>
          </div>

          <button
            className="filters-mobile-toggle"
            onClick={() => setShowFilters(!showFilters)}
            aria-expanded={showFilters}
            aria-controls="filter-section"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z"/>
            </svg>
            Filters
            {hasActiveFilters && <span className="filter-badge" />}
          </button>
        </div>
      </div>

      {hasActiveFilters && (
        <button className="filters-clear" onClick={clearAllFilters}>
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
          Clear all filters
        </button>
      )}

      <AnimatePresence>
        {showFilters && (
          <motion.div
            id="filter-section"
            className="filters-section"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <div className="filters-section-content">
              <div className="filters-group">
                <h4 className="filters-group-title">Category</h4>
                {categories.map((cat) => (
                  <label key={cat.id} className="filter-label">
                    <input
                      type="checkbox"
                      className="filter-checkbox"
                      checked={selectedFilters.category.includes(cat.id)}
                      onChange={() => toggleFilter('category', cat.id)}
                    />
                    <span className="filter-checkbox-custom">
                      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                      </svg>
                    </span>
                    <span className="filter-label-text">
                      <span className="filter-emoji">{cat.emoji}</span>
                      {cat.name}
                    </span>
                  </label>
                ))}
              </div>

              <div className="filters-group">
                <h4 className="filters-group-title">Country</h4>
                {countryOptions.map((c) => (
                  <label key={c.code} className="filter-label">
                    <input
                      type="checkbox"
                      className="filter-checkbox"
                      checked={selectedFilters.country.includes(c.code)}
                      onChange={() => toggleFilter('country', c.code)}
                    />
                    <span className="filter-checkbox-custom">
                      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                      </svg>
                    </span>
                    <span className="filter-label-text">
                      <span className={`fi fi-${c.code} filter-flag`}></span>
                      {c.name}
                    </span>
                  </label>
                ))}
              </div>

              <div className="filters-group">
                <h4 className="filters-group-title">Pricing</h4>
                {pricingOptions.map((p) => (
                  <label key={p.value} className="filter-label">
                    <input
                      type="checkbox"
                      className="filter-checkbox"
                      checked={selectedFilters.pricing.includes(p.value)}
                      onChange={() => toggleFilter('pricing', p.value)}
                    />
                    <span className="filter-checkbox-custom">
                      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                      </svg>
                    </span>
                    <span className="filter-label-text">{p.label}</span>
                  </label>
                ))}

                <div className="filter-separator" />

                <label className="filter-label">
                  <input
                    type="checkbox"
                    className="filter-checkbox"
                    checked={selectedFilters.openSourceOnly}
                    onChange={() => onFilterChange('openSourceOnly', !selectedFilters.openSourceOnly)}
                  />
                  <span className="filter-checkbox-custom">
                    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                    </svg>
                  </span>
                  <span className="filter-label-text">Open Source Only</span>
                </label>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
