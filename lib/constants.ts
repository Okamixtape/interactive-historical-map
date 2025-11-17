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

// Limites géographiques pour Limoges (évite scroll excessif)
// Southwest: [longitude, latitude], Northeast: [longitude, latitude]
export const LIMOGES_BOUNDS: [[number, number], [number, number]] = [
  [1.2, 45.78],   // Southwest (sud-ouest)
  [1.35, 45.88]   // Northeast (nord-est)
];

// Limites zoom
export const MAP_ZOOM_LIMITS = {
  minZoom: 11,   // Vue région Limoges
  maxZoom: 18    // Vue détaillée rue
};

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

// Helper pour convertir bearing (degrés) en direction cardinale lisible
export const getCardinalDirection = (bearing: number): string => {
  // Normaliser bearing entre 0 et 360
  const normalized = ((bearing % 360) + 360) % 360;

  // 8 directions cardinales (chaque secteur = 45°)
  if (normalized >= 337.5 || normalized < 22.5) return 'Nord';
  if (normalized >= 22.5 && normalized < 67.5) return 'Nord-Est';
  if (normalized >= 67.5 && normalized < 112.5) return 'Est';
  if (normalized >= 112.5 && normalized < 157.5) return 'Sud-Est';
  if (normalized >= 157.5 && normalized < 202.5) return 'Sud';
  if (normalized >= 202.5 && normalized < 247.5) return 'Sud-Ouest';
  if (normalized >= 247.5 && normalized < 292.5) return 'Ouest';
  if (normalized >= 292.5 && normalized < 337.5) return 'Nord-Ouest';

  return 'Nord'; // Fallback
};

