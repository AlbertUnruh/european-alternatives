export interface Alternative {
  id: string;
  name: string;
  description: string;
  website: string;
  logo?: string;
  country: CountryCode;
  category: CategoryId;
  replacesUS: string[];
  isOpenSource: boolean;
  githubUrl?: string;
  pricing: 'free' | 'freemium' | 'paid';
  tags: string[];
  foundedYear?: number;
  headquartersCity?: string;
  license?: string;
}

export type CountryCode =
  | 'at' | 'be' | 'bg' | 'hr' | 'cy' | 'cz' | 'dk' | 'ee'
  | 'fi' | 'fr' | 'de' | 'gr' | 'hu' | 'ie' | 'it' | 'lv'
  | 'lt' | 'lu' | 'mt' | 'nl' | 'pl' | 'pt' | 'ro' | 'sk'
  | 'si' | 'es' | 'se'
  | 'ch' | 'no' | 'gb' | 'is'
  | 'eu';

export type CategoryId =
  | 'cloud-storage'
  | 'email'
  | 'search-engine'
  | 'social-media'
  | 'messaging'
  | 'video-hosting'
  | 'office-suite'
  | 'maps'
  | 'browser'
  | 'vpn'
  | 'analytics'
  | 'project-management'
  | 'password-manager'
  | 'ai-ml'
  | 'hosting'
  | 'payments'
  | 'ecommerce'
  | 'other';

export interface Category {
  id: CategoryId;
  name: string;
  description: string;
  usGiants: string[];
  emoji: string;
}

export type SortBy = 'name' | 'country' | 'category';
export type ViewMode = 'grid' | 'list';

export interface SelectedFilters {
  category: CategoryId[];
  country: CountryCode[];
  pricing: string[];
  openSourceOnly: boolean;
}
