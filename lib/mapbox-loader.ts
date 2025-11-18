/**
 * Dynamic Mapbox CSS Loader
 *
 * Charge le CSS Mapbox de manière asynchrone pour améliorer le LCP.
 * Le CSS (1.6 MB non compressé) est chargé après le rendu initial.
 */

let cssLoaded = false;
let cssPromise: Promise<void> | null = null;

/**
 * Charge le CSS Mapbox de manière asynchrone
 * Utilise un cache pour éviter les chargements multiples
 */
export function loadMapboxCSS(): Promise<void> {
  // Si déjà chargé, retourne immédiatement
  if (cssLoaded) {
    return Promise.resolve();
  }

  // Si un chargement est en cours, retourne la promesse existante
  if (cssPromise) {
    return cssPromise;
  }

  cssPromise = new Promise((resolve, reject) => {
    // Vérifier si le CSS est déjà présent dans le DOM
    const existingLink = document.querySelector('link[href*="mapbox-gl.css"]');
    if (existingLink) {
      cssLoaded = true;
      resolve();
      return;
    }

    // Créer et injecter le lien CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://api.mapbox.com/mapbox-gl-js/v3.3.0/mapbox-gl.css';
    link.crossOrigin = 'anonymous';

    link.onload = () => {
      cssLoaded = true;
      resolve();
    };

    link.onerror = () => {
      cssPromise = null;
      reject(new Error('Failed to load Mapbox CSS'));
    };

    document.head.appendChild(link);
  });

  return cssPromise;
}

/**
 * Précharge le CSS Mapbox en arrière-plan
 * À appeler au plus tôt dans le cycle de vie de l'application
 */
export function preloadMapboxCSS(): void {
  // Utilise requestIdleCallback pour charger pendant les temps morts
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      loadMapboxCSS().catch(console.error);
    });
  } else {
    // Fallback pour Safari
    setTimeout(() => {
      loadMapboxCSS().catch(console.error);
    }, 100);
  }
}

/**
 * Vérifie si le CSS Mapbox est chargé
 */
export function isMapboxCSSLoaded(): boolean {
  return cssLoaded;
}
