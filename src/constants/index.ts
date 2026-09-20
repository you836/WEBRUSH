/**
 * Centralized Application Constants & Configuration
 */

export const APP_CONFIG = {
  name: 'LIFE / RECEIPTS',
  tagline: 'Your life leaves traces. Discover the story between them.',
  version: '1.0.0',
  storageKey: 'life_receipts_state_v1',
  maxImportFileSizeMb: 25,
  pagination: {
    defaultPageSize: 24,
    mobilePageSize: 12,
  },
  correlation: {
    maxTimeDifferenceMinutes: 60,
    timeWeight: 0.50,
    categoryWeight: 0.30,
    keywordWeight: 0.20,
    minMatchThreshold: 0.35,
  },
  rendering: {
    webglDprMax: 2.0,
    frameloop: 'always' as const,
  },
} as const;

export const THEME_COLORS = {
  midnight: '#0a0806',
  charcoal: '#121110',
  surface: '#1c1a17',
  ivory: '#f5f0e8',
  amber: '#e8a849',
  music: '#1DB954',
  banking: '#e8a849',
  household: '#a78bfa',
} as const;
