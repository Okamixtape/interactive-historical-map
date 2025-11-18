/**
 * Street View Static API Cache
 *
 * Cache les URLs Street View pour éviter les requêtes API répétées.
 * Utilise localStorage avec expiration pour persistance entre sessions.
 */

const CACHE_KEY = 'streetview-cache';
const CACHE_TTL = 7 * 24 * 60 * 60 * 1000; // 7 jours en ms
const MAX_CACHE_SIZE = 50; // Nombre max d'entrées

interface CacheEntry {
  url: string;
  timestamp: number;
}

interface CacheStore {
  entries: Record<string, CacheEntry>;
  version: number;
}

/**
 * Génère une clé de cache unique pour les paramètres Street View
 */
function generateCacheKey(
  lat: number,
  lng: number,
  heading: number,
  pitch: number,
  fov: number,
  width: number,
  height: number
): string {
  // Arrondir les coordonnées à 5 décimales (~1m de précision)
  const roundedLat = lat.toFixed(5);
  const roundedLng = lng.toFixed(5);
  return `${roundedLat},${roundedLng},${heading},${pitch},${fov},${width}x${height}`;
}

/**
 * Récupère le cache depuis localStorage
 */
function getCache(): CacheStore {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const store = JSON.parse(cached) as CacheStore;
      // Vérifier la version du cache
      if (store.version === 1) {
        return store;
      }
    }
  } catch (error) {
    console.warn('Error reading Street View cache:', error);
  }

  return { entries: {}, version: 1 };
}

/**
 * Sauvegarde le cache dans localStorage
 */
function setCache(store: CacheStore): void {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(store));
  } catch (error) {
    console.warn('Error saving Street View cache:', error);
    // Si localStorage est plein, nettoyer le cache
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      clearCache();
    }
  }
}

/**
 * Nettoie les entrées expirées et limite la taille du cache
 */
function pruneCache(store: CacheStore): CacheStore {
  const now = Date.now();
  const entries = Object.entries(store.entries);

  // Filtrer les entrées expirées
  const validEntries = entries.filter(
    ([, entry]) => now - entry.timestamp < CACHE_TTL
  );

  // Si trop d'entrées, garder les plus récentes
  if (validEntries.length > MAX_CACHE_SIZE) {
    validEntries.sort((a, b) => b[1].timestamp - a[1].timestamp);
    validEntries.length = MAX_CACHE_SIZE;
  }

  return {
    entries: Object.fromEntries(validEntries),
    version: 1
  };
}

/**
 * Récupère une URL depuis le cache
 */
export function getCachedStreetViewUrl(
  lat: number,
  lng: number,
  heading: number,
  pitch: number,
  fov: number,
  width: number,
  height: number
): string | null {
  const key = generateCacheKey(lat, lng, heading, pitch, fov, width, height);
  const store = getCache();
  const entry = store.entries[key];

  if (entry && Date.now() - entry.timestamp < CACHE_TTL) {
    return entry.url;
  }

  return null;
}

/**
 * Ajoute une URL au cache
 */
export function cacheStreetViewUrl(
  lat: number,
  lng: number,
  heading: number,
  pitch: number,
  fov: number,
  width: number,
  height: number,
  url: string
): void {
  const key = generateCacheKey(lat, lng, heading, pitch, fov, width, height);
  let store = getCache();

  // Ajouter l'entrée
  store.entries[key] = {
    url,
    timestamp: Date.now()
  };

  // Nettoyer et sauvegarder
  store = pruneCache(store);
  setCache(store);
}

/**
 * Vide complètement le cache
 */
export function clearCache(): void {
  try {
    localStorage.removeItem(CACHE_KEY);
  } catch (error) {
    console.warn('Error clearing Street View cache:', error);
  }
}

/**
 * Retourne les statistiques du cache
 */
export function getCacheStats(): { size: number; oldestEntry: number | null } {
  const store = getCache();
  const entries = Object.values(store.entries);

  if (entries.length === 0) {
    return { size: 0, oldestEntry: null };
  }

  const oldestTimestamp = Math.min(...entries.map(e => e.timestamp));

  return {
    size: entries.length,
    oldestEntry: oldestTimestamp
  };
}
