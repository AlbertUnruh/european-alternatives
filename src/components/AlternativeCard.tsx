import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { categories } from '../data';
import type { Alternative, ViewMode } from '../types';

interface AlternativeCardProps {
  alternative: Alternative;
  viewMode: ViewMode;
}

const pricingLabels: Record<string, string> = {
  free: 'Free',
  freemium: 'Freemium',
  paid: 'Paid',
};

export default function AlternativeCard({ alternative, viewMode }: AlternativeCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [logoError, setLogoError] = useState(false);

  const category = categories.find((c) => c.id === alternative.category);
  const description =
    viewMode === 'grid' && alternative.description.length > 120
      ? alternative.description.slice(0, 120).trim() + '...'
      : alternative.description;

  return (
    <motion.div
      className={`alt-card ${viewMode === 'list' ? 'list-view' : ''}`}
      whileHover={{ scale: viewMode === 'grid' ? 1.02 : 1.01 }}
      transition={{ duration: 0.2 }}
      layout
    >
      <div className="alt-card-header">
        <div className="alt-card-logo-wrap">
          {alternative.logo && !logoError ? (
            <img
              src={alternative.logo}
              alt={`${alternative.name} logo`}
              className="alt-card-logo"
              loading="lazy"
              onError={() => setLogoError(true)}
            />
          ) : (
            <span className={`fi fi-${alternative.country} alt-card-logo-fallback`}></span>
          )}
          <span className={`fi fi-${alternative.country} alt-card-flag-badge`}></span>
        </div>
        <div className="alt-card-title-section">
          <h3 className="alt-card-name">{alternative.name}</h3>
          {category && (
            <span className="alt-card-category">
              <span className="alt-card-category-emoji">{category.emoji}</span>
              {category.name}
            </span>
          )}
        </div>
      </div>

      <p className="alt-card-description">{description}</p>

      <div className="alt-card-replaces">
        <span className="alt-card-replaces-label">Replaces:</span>
        <div className="alt-card-replaces-list">
          {alternative.replacesUS.map((name) => (
            <span key={name} className="alt-card-replaces-item">{name}</span>
          ))}
        </div>
      </div>

      <div className="alt-card-badges">
        <span className={`alt-card-badge alt-card-badge-pricing ${alternative.pricing}`}>
          {pricingLabels[alternative.pricing]}
        </span>
        {alternative.isOpenSource && (
          <span className="alt-card-badge alt-card-badge-oss">
            <svg viewBox="0 0 24 24" fill="currentColor" width="12" height="12" aria-hidden="true">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            Open Source
          </span>
        )}
        {alternative.tags.slice(0, 2).map((tag) => (
          <span key={tag} className="alt-card-badge alt-card-badge-tag">{tag}</span>
        ))}
      </div>

      <button
        className="alt-card-expand"
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
        aria-controls={`alt-details-${alternative.id}`}
      >
        <span>{expanded ? 'Show less' : 'Show more'}</span>
        <svg
          className={`alt-card-expand-icon ${expanded ? 'rotated' : ''}`}
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
        </svg>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            id={`alt-details-${alternative.id}`}
            className="alt-card-details"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <div className="alt-card-details-content">
              <div className="alt-detail-section">
                <h4 className="alt-detail-title">About</h4>
                <p className="alt-detail-text">{alternative.description}</p>
              </div>

              {(alternative.foundedYear != null || alternative.headquartersCity || alternative.license) && (
                <div className="alt-detail-section">
                  <h4 className="alt-detail-title">Details</h4>
                  <div className="alt-detail-meta">
                    {alternative.foundedYear != null && (
                      <div className="alt-detail-meta-item">
                        <span className="alt-detail-meta-label">Founded</span>
                        <span className="alt-detail-meta-value">{alternative.foundedYear}</span>
                      </div>
                    )}
                    {alternative.headquartersCity && (
                      <div className="alt-detail-meta-item">
                        <span className="alt-detail-meta-label">Headquarters</span>
                        <span className="alt-detail-meta-value">
                          {alternative.headquartersCity}
                          <span className={`fi fi-${alternative.country} alt-detail-meta-flag`}></span>
                        </span>
                      </div>
                    )}
                    {alternative.license && (
                      <div className="alt-detail-meta-item">
                        <span className="alt-detail-meta-label">License</span>
                        <span className="alt-detail-meta-value">{alternative.license}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {alternative.tags.length > 0 && (
                <div className="alt-detail-section">
                  <h4 className="alt-detail-title">Tags</h4>
                  <div className="alt-detail-tags">
                    {alternative.tags.map((tag) => (
                      <span key={tag} className="alt-detail-tag">{tag}</span>
                    ))}
                  </div>
                </div>
              )}

              <div className="alt-card-actions">
                <a
                  href={alternative.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="alt-card-link alt-card-link-primary"
                  aria-label={`Visit ${alternative.name} website (opens in new tab)`}
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                  </svg>
                  Website
                </a>
                {alternative.githubUrl && (
                  <a
                    href={alternative.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="alt-card-link alt-card-link-secondary"
                    aria-label={`${alternative.name} on GitHub (opens in new tab)`}
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    GitHub
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
