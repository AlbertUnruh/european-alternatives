import type { Alternative, CountryCode, Reservation } from '../types';

export interface CalculatedTrustScore {
  score: number;
  breakdown: {
    jurisdiction: number;
    openness: number;
    privacySignals: number;
    sovereigntyBonus: number;
    reservationPenalty: number;
    usCapApplied: boolean;
  };
}

const euMemberStates = new Set<CountryCode>([
  'at', 'be', 'bg', 'hr', 'cy', 'cz', 'dk', 'ee', 'fi', 'fr', 'de', 'gr', 'hu', 'ie', 'it',
  'lv', 'lt', 'lu', 'mt', 'nl', 'pl', 'pt', 'ro', 'sk', 'si', 'es', 'se',
]);

const europeanNonEU = new Set<CountryCode>(['ch', 'no', 'gb', 'is']);

const privacyTagGroupPrimary = new Set([
  'privacy',
  'gdpr',
  'encryption',
  'zero-knowledge',
  'no-logs',
]);

const privacyTagGroupSecondary = new Set([
  'offline',
  'federated',
  'local',
]);

function getJurisdictionScore(country: CountryCode): number {
  if (euMemberStates.has(country)) return 4;
  if (europeanNonEU.has(country)) return 3;
  if (country === 'eu') return 3;
  if (country === 'us') return 1;
  return 2;
}

function getOpennessScore(alternative: Pick<Alternative, 'isOpenSource' | 'openSourceLevel'>): number {
  switch (alternative.openSourceLevel) {
    case 'full':
      return 3;
    case 'partial':
      return 2;
    case 'none':
      return 1;
    default:
      return alternative.isOpenSource ? 2 : 1;
  }
}

function getPrivacySignalScore(tags: string[]): number {
  const normalized = new Set(tags.map((tag) => tag.toLowerCase()));

  let score = 0;
  if (Array.from(privacyTagGroupPrimary).some((tag) => normalized.has(tag))) score += 1;
  if (Array.from(privacyTagGroupSecondary).some((tag) => normalized.has(tag))) score += 1;

  return score;
}

function getSovereigntyScore(selfHostable: boolean): number {
  return selfHostable ? 2 : 0;
}

function getReservationPenalty(reservations: Reservation[]): number {
  return reservations.reduce((sum, reservation) => {
    switch (reservation.severity) {
      case 'major':
        return sum + 3;
      case 'moderate':
        return sum + 2;
      case 'minor':
      default:
        return sum + 1;
    }
  }, 0);
}

function clampScore(value: number): number {
  return Math.min(10, Math.max(1, value));
}

export function calculateTrustScore(
  alternative: Pick<Alternative, 'country' | 'isOpenSource' | 'openSourceLevel' | 'tags'> & {
    selfHostable?: boolean;
    reservations?: Reservation[];
  },
): CalculatedTrustScore {
  const jurisdiction = getJurisdictionScore(alternative.country);
  const openness = getOpennessScore(alternative);
  const privacySignals = getPrivacySignalScore(alternative.tags);
  const sovereigntyBonus = getSovereigntyScore(alternative.selfHostable ?? false);
  const reservationPenalty = getReservationPenalty(alternative.reservations ?? []);

  const rawScore = jurisdiction + openness + privacySignals + sovereigntyBonus - reservationPenalty;
  const clampedScore = clampScore(rawScore);

  const selfHostable = alternative.selfHostable ?? false;
  const usCapApplied = alternative.country === 'us' && !selfHostable && clampedScore > 4;
  const score = usCapApplied ? 4 : clampedScore;

  return {
    score,
    breakdown: {
      jurisdiction,
      openness,
      privacySignals,
      sovereigntyBonus,
      reservationPenalty,
      usCapApplied,
    },
  };
}

export function getEffectiveTrustScore(
  alternative: Pick<
    Alternative,
    'country' | 'isOpenSource' | 'openSourceLevel' | 'tags' | 'selfHostable' | 'reservations' | 'trustScore'
  >,
): number {
  if (alternative.trustScore != null) {
    return alternative.trustScore;
  }

  return calculateTrustScore({
    country: alternative.country,
    isOpenSource: alternative.isOpenSource,
    openSourceLevel: alternative.openSourceLevel,
    tags: alternative.tags,
    selfHostable: alternative.selfHostable,
    reservations: alternative.reservations,
  }).score;
}
