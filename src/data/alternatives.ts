import type { Alternative } from '../types';

// Alternative catalogue - add entries here.
// Each entry represents a European or open-source alternative to a US tech product.
//
// To add a new alternative:
// 1. Add the logo SVG to public/logos/<id>.svg
// 2. Add the entry below with all required fields
// 3. Run `npm run build` to verify

export const alternatives: Alternative[] = [
  {
    id: 'tuta',
    name: 'Tuta',
    description:
      'End-to-end encrypted email service built in Germany. Formerly known as Tutanota, Tuta offers secure email, calendar, and contacts with zero-knowledge encryption and post-quantum cryptography.',
    website: 'https://tuta.com',
    logo: '/logos/tuta.svg',
    country: 'de',
    category: 'email',
    replacesUS: ['Gmail', 'Outlook', 'Yahoo Mail'],
    isOpenSource: true,
    githubUrl: 'https://github.com/tutao/tutanota',
    pricing: 'freemium',
    tags: ['encryption', 'privacy', 'GDPR', 'zero-knowledge', 'ad-free', 'post-quantum'],
    foundedYear: 2011,
    headquartersCity: 'Hanover',
    license: 'GPL-3.0',
  },
];
