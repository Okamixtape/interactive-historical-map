// lib/constants.ts
export const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

export const INITIAL_VIEW_STATE = {
  longitude: 1.2611,
  latitude: 45.8312,
  zoom: 13,
  pitch: 0,
  bearing: 0
};

export const MAP_STYLE = 'mapbox://styles/mapbox/streets-v12';

// Catégories de POIs - Source unique de vérité
export const CATEGORIES = {
  'all': { label: 'Tous', emoji: '📍' },
  'urbanisme': { label: 'Urbanisme', emoji: '🏛️' },
  'architecture': { label: 'Architecture', emoji: '🏗️' },
  'industrie': { label: 'Industrie', emoji: '🏭' },
  'patrimoine-disparu': { label: 'Patrimoine disparu', emoji: '🕰️' },
} as const;

export type CategoryId = keyof typeof CATEGORIES;

// Helper pour obtenir l'émoji d'une catégorie
export const getCategoryEmoji = (category: string): string => {
  return CATEGORIES[category as CategoryId]?.emoji || CATEGORIES.all.emoji;
};

// Helper pour obtenir le label d'une catégorie
export const getCategoryLabel = (category: string): string => {
  return CATEGORIES[category as CategoryId]?.label || category;
};
