import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { alternatives, categories } from '../data';

const stagger = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

export default function LandingPage() {
  const totalAlternatives = alternatives.length;
  const totalCategories = categories.filter(
    (c) => alternatives.some((a) => a.category === c.id)
  ).length;
  const totalCountries = new Set(alternatives.map((a) => a.country)).size;
  const openSourceCount = alternatives.filter((a) => a.isOpenSource).length;
  const featured = alternatives[0] ?? null;
  const [featuredLogoError, setFeaturedLogoError] = useState(false);

  return (
    <div className="landing-page">
      <motion.div
        className="landing-content"
        initial="initial"
        animate="animate"
        variants={stagger}
      >
        {/* Hero Section */}
        <motion.div className="landing-hero" variants={fadeUp}>
          <div className="landing-eu-flag" aria-hidden="true">
            <span className="fi fi-eu landing-flag-icon"></span>
          </div>

          <h1 className="landing-headline">European Alternatives</h1>

          <p className="landing-subtext">
            Discover European and open-source alternatives to US tech giants.
            Support digital sovereignty, data privacy, and local innovation.
          </p>
        </motion.div>

        {/* Stats Bar */}
        {totalAlternatives > 0 && (
          <motion.div className="landing-stats" variants={fadeUp}>
            <div className="landing-stats-item">
              <span className="landing-stats-number">{totalAlternatives}</span>
              <span className="landing-stats-label">Alternatives</span>
            </div>
            <div className="landing-stats-divider" />
            <div className="landing-stats-item">
              <span className="landing-stats-number">{totalCategories}</span>
              <span className="landing-stats-label">Categories</span>
            </div>
            <div className="landing-stats-divider" />
            <div className="landing-stats-item">
              <span className="landing-stats-number">{totalCountries}</span>
              <span className="landing-stats-label">{totalCountries === 1 ? 'Country' : 'Countries'}</span>
            </div>
            <div className="landing-stats-divider" />
            <div className="landing-stats-item">
              <span className="landing-stats-number">{openSourceCount}</span>
              <span className="landing-stats-label">Open Source</span>
            </div>
          </motion.div>
        )}

        {/* Category Grid */}
        <motion.div className="landing-categories" variants={fadeUp}>
          <h2 className="landing-section-title">Browse by Category</h2>
          <div className="landing-categories-grid">
            {categories
              .filter((c) => c.id !== 'other')
              .map((cat) => {
                const count = alternatives.filter((a) => a.category === cat.id).length;
                return (
                  <Link
                    key={cat.id}
                    to={`/browse?category=${cat.id}`}
                    className="landing-category-card"
                  >
                    <span className="landing-category-emoji" aria-hidden="true">
                      {cat.emoji}
                    </span>
                    <span className="landing-category-name">{cat.name}</span>
                    <span className="landing-category-count">
                      {count} {count === 1 ? 'alternative' : 'alternatives'}
                    </span>
                    {cat.usGiants.length > 0 && (
                      <span className="landing-category-replaces">
                        Replaces {cat.usGiants.slice(0, 2).join(', ')}
                        {cat.usGiants.length > 2 ? ` +${cat.usGiants.length - 2}` : ''}
                      </span>
                    )}
                  </Link>
                );
              })}
          </div>
        </motion.div>

        {/* Featured Alternative */}
        {featured && (
          <motion.div className="landing-featured" variants={fadeUp}>
            <h2 className="landing-section-title">Featured Alternative</h2>
            <div className="landing-featured-card">
              <div className="landing-featured-header">
                {featured.logo && !featuredLogoError ? (
                  <img
                    src={featured.logo}
                    alt={`${featured.name} logo`}
                    className="landing-featured-logo"
                    onError={() => setFeaturedLogoError(true)}
                  />
                ) : (
                  <span className={`fi fi-${featured.country} landing-featured-logo-fallback`}></span>
                )}
                <div className="landing-featured-info">
                  <h3 className="landing-featured-name">{featured.name}</h3>
                  <div className="landing-featured-meta">
                    <span className={`fi fi-${featured.country} landing-featured-flag`}></span>
                    <span className="landing-featured-category">
                      {categories.find((c) => c.id === featured.category)?.name}
                    </span>
                  </div>
                </div>
              </div>
              <p className="landing-featured-description">{featured.description}</p>
              <div className="landing-featured-replaces">
                <span className="landing-featured-replaces-label">Replaces:</span>
                {featured.replacesUS.map((name) => (
                  <span key={name} className="landing-featured-replaces-item">{name}</span>
                ))}
              </div>
              <div className="landing-featured-badges">
                {featured.isOpenSource && (
                  <span className="landing-featured-badge oss">Open Source</span>
                )}
                <span className={`landing-featured-badge ${featured.pricing}`}>
                  {featured.pricing === 'free' ? 'Free' : featured.pricing === 'freemium' ? 'Freemium' : 'Paid'}
                </span>
              </div>
              <div className="landing-featured-actions">
                <a
                  href={featured.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="landing-featured-link-primary"
                >
                  Visit {featured.name}
                  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
                  </svg>
                </a>
                <Link to="/browse" className="landing-featured-link-secondary">
                  See All Alternatives
                </Link>
              </div>
            </div>
          </motion.div>
        )}

        {/* Values Section */}
        <motion.div className="landing-values" variants={fadeUp}>
          <div className="landing-value-card">
            <div className="landing-value-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>
              </svg>
            </div>
            <strong>GDPR Compliant</strong>
            <span>European services built with privacy-first principles and strict data protection</span>
          </div>
          <div className="landing-value-card">
            <div className="landing-value-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
              </svg>
            </div>
            <strong>Digital Sovereignty</strong>
            <span>Keep your data in Europe, under European law and jurisdiction</span>
          </div>
          <div className="landing-value-card">
            <div className="landing-value-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            <strong>Open Source Options</strong>
            <span>Transparent, auditable, and community-driven software you can trust</span>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div className="landing-buttons" variants={fadeUp}>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link to="/browse" className="cta-button">
              Browse Alternatives
              <svg className="cta-arrow" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
              </svg>
            </Link>
          </motion.div>
        </motion.div>

        <motion.p className="landing-note" variants={fadeUp}>
          Community-curated catalogue. Contributions welcome.
        </motion.p>
      </motion.div>
    </div>
  );
}
