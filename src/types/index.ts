// Strict privacy tag definitions — single source of truth for trust scoring.
// Only tags in these lists contribute to the privacy-signal component of the trust score.
// Types are exported for the planned audit script (see issue #163 point 4).
export const PRIMARY_PRIVACY_TAGS = ['privacy', 'gdpr', 'encryption', 'zero-knowledge', 'no-logs'] as const;
export const SECONDARY_PRIVACY_TAGS = ['offline', 'federated', 'local'] as const;
export type PrimaryPrivacyTag = typeof PRIMARY_PRIVACY_TAGS[number];
export type SecondaryPrivacyTag = typeof SECONDARY_PRIVACY_TAGS[number];
export type PrivacyTag = PrimaryPrivacyTag | SecondaryPrivacyTag;

export interface AlternativeActionLink {
  label: string;
  url: string;
}

export interface Alternative {
  id: string;
  name: string;
  description: string;
  localizedDescriptions?: {
    de?: string;
  };
  website: string;
  logo?: string;
  country: CountryCode;
  category: CategoryId;
  replacesUS: string[];
  usVendorComparisons?: USVendorComparison[];
  isOpenSource: boolean;
  openSourceLevel?: OpenSourceLevel;
  openSourceAuditUrl?: string;
  sourceCodeUrl?: string;
  actionLinks?: AlternativeActionLink[];
  pricing: 'free' | 'freemium' | 'paid';
  selfHostable?: boolean;
  tags: string[];
  foundedYear?: number;
  headquartersCity?: string;
  license?: string;
  reservations?: Reservation[];
  trustScore?: number;
  trustScoreStatus?: TrustScoreStatus;
  trustScoreBreakdown?: TrustScoreBreakdown;
}

export interface USVendorComparison {
  id: string;
  name: string;
  trustScoreStatus: TrustScoreStatus;
  trustScore?: number;
  description?: string;
  descriptionDe?: string;
  reservations?: Reservation[];
}

export interface Reservation {
  id: string;
  text: string;
  textDe?: string;
  severity: ReservationSeverity;
  date?: string;
  sourceUrl?: string;
}

// Tier 1: EU member states + European non-EU (CH, NO, GB, IS)
// Tier 2: Any jurisdiction not in Tier 1 (see DECISION_MATRIX.md)
// Extend this union when adding alternatives from new jurisdictions.
export type CountryCode =
  // Tier 1 — EU member states
  | 'at' | 'be' | 'bg' | 'hr' | 'cy' | 'cz' | 'dk' | 'ee'
  | 'fi' | 'fr' | 'de' | 'gr' | 'hu' | 'ie' | 'it' | 'lv'
  | 'lt' | 'lu' | 'mt' | 'nl' | 'pl' | 'pt' | 'ro' | 'sk'
  | 'si' | 'es' | 'se'
  // Tier 1 — European non-EU
  | 'ch' | 'no' | 'gb' | 'is'
  // Tier 2 — Non-Tier-1 jurisdictions (extend as needed)
  | 'ca' | 'us'
  // Meta
  | 'eu';

export type CategoryId =
  | 'cloud-storage'
  | 'email'
  | 'mail-client'
  | 'search-engine'
  | 'social-media'
  | 'messaging'
  | 'meeting-software'
  | 'video-hosting'
  | 'office-suite'
  | 'maps'
  | 'browser'
  | 'desktop-os'
  | 'mobile-os'
  | 'vpn'
  | 'analytics'
  | 'project-management'
  | 'password-manager'
  | '2fa-authenticator'
  | 'ai-ml'
  | 'hosting'
  | 'payments'
  | 'smart-home'
  | 'ecommerce'
  | 'version-control'
  | 'other';

export interface Category {
  id: CategoryId;
  name: string;
  description: string;
  usGiants: string[];
  emoji: string;
}

export type OpenSourceLevel = 'full' | 'partial' | 'none';
export type ReservationSeverity = 'minor' | 'moderate' | 'major';
export type TrustScoreStatus = 'pending' | 'ready';

export interface TrustScoreBreakdown {
  jurisdiction: number;
  openness: number;
  privacySignals: number;
  sovereigntyBonus: number;
  reservationPenalty: number;
  usCapApplied: boolean;
}

export type SortBy = 'trustScore' | 'name' | 'country' | 'category';
export type ViewMode = 'grid' | 'list';

export interface SelectedFilters {
  category: CategoryId[];
  country: CountryCode[];
  pricing: string[];
  openSourceOnly: boolean;
}
