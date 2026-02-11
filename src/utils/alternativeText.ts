import type { Alternative } from '../types';

export function getLocalizedAlternativeDescription(alternative: Alternative, language: string): string {
  if (language.startsWith('de') && alternative.localizedDescriptions?.de) {
    return alternative.localizedDescriptions.de;
  }
  return alternative.description;
}
