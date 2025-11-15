'use client';

import { useState, useCallback, memo, useRef, useEffect } from 'react';
import Map, { Marker, Popup, NavigationControl, MapRef } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import type { PointFeature } from '@/lib/types';
import { MAPBOX_TOKEN, INITIAL_VIEW_STATE, MAP_STYLE, getCategoryEmoji } from '@/lib/constants';

interface Props {
  points: PointFeature[];
  onPointSelect: (point: PointFeature) => void;
}

function InteractiveMap({ points, onPointSelect }: Props) {
  const [popupInfo, setPopupInfo] = useState<PointFeature | null>(null);
  const mapRef = useRef<MapRef>(null);

  // Cleanup explicite pour compatibilité React StrictMode
  // Résout le problème de double render qui cause accumulation ressources GPU
  useEffect(() => {
    return () => {
      if (mapRef.current) {
        try {
          const map = mapRef.current.getMap();
          if (map && typeof map.remove === 'function') {
            map.remove();
          }
        } catch (error) {
          console.error('Error cleaning up Mapbox:', error);
        }
      }
    };
  }, []);

  const handleMarkerClick = useCallback((event: React.MouseEvent, point: PointFeature) => {
    event.stopPropagation();
    setPopupInfo(point);
    
    // Centrage avec espace pour la popup
    const [lng, lat] = point.geometry.coordinates;
    if (mapRef.current && lng !== undefined && lat !== undefined) {
      try {
        // Calculer l'offset dynamique en fonction de la hauteur de l'écran
        const viewportHeight = window.innerHeight;
        const offsetY = Math.min(viewportHeight * 0.25, 200); // 25% de la hauteur ou 200px max
        
        // Vérifier que easeTo existe avant de l'appeler
        if (typeof mapRef.current.easeTo === 'function') {
          mapRef.current.easeTo({
            center: [lng, lat],
            duration: 800,
            easing: (t) => t * (2 - t), // easeOutQuad
            offset: [0, offsetY] // POSITIF = décale la vue vers le BAS = marqueur monte à l'écran
          });
        }
      } catch (error) {
        console.error('Erreur lors du centrage de la carte:', error);
      }
    }
  }, []);

  const handlePopupClose = useCallback(() => {
    setPopupInfo(null);
  }, []);

  const handleViewComparison = useCallback((point: PointFeature) => {
    onPointSelect(point);
    setPopupInfo(null);
  }, [onPointSelect]);

  return (
    <div className="relative w-full h-screen">
      <Map
        ref={mapRef}
        initialViewState={INITIAL_VIEW_STATE}
        style={{ width: '100%', height: '100%' }}
        mapStyle={MAP_STYLE}
        mapboxAccessToken={MAPBOX_TOKEN}
      >
        <NavigationControl position="top-right" showCompass={false} />

        {points.map((point) => {
          const [lng, lat] = point.geometry.coordinates;
          if (lng === undefined || lat === undefined) return null;

          return (
            <Marker
              key={point.properties.id}
              longitude={lng}
              latitude={lat}
              anchor="bottom"
            >
              <button
                onClick={(e) => handleMarkerClick(e, point)}
                className="cursor-pointer transform transition-all hover:scale-110 text-2xl bg-white rounded-full p-2 shadow-lg border-2 border-heritage-bordeaux hover:shadow-xl"
                aria-label={point.properties.title}
              >
                {getCategoryEmoji(point.properties.category)}
              </button>
            </Marker>
          );
        })}

        {popupInfo && (() => {
          const [lng, lat] = popupInfo.geometry.coordinates;
          if (lng === undefined || lat === undefined) return null;

          return (
            <Popup
              longitude={lng}
              latitude={lat}
              onClose={handlePopupClose}
              closeButton={true}
              closeOnClick={false}
              anchor="bottom"
              offset={56}
              className="max-w-sm"
            >
            <div className="p-4">
              {/* Titre avec émoji */}
              <div className="flex items-start gap-2 mb-3">
                <span className="text-2xl flex-shrink-0" aria-hidden="true">
                  {getCategoryEmoji(popupInfo.properties.category)}
                </span>
                <div className="flex-1">
                  <h3 className="font-serif font-bold text-base leading-tight text-heritage-bordeaux mb-1">
                    {popupInfo.properties.title}
                  </h3>
                  <p className="text-xs font-serif text-heritage-ink/70">
                    {popupInfo.properties.address}
                  </p>
                </div>
              </div>

              {/* Badge année */}
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-heritage-cream border border-heritage-gold/30 rounded mb-3">
                <svg className="w-3.5 h-3.5 text-heritage-bordeaux" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-xs font-serif font-medium text-heritage-ink">
                  {popupInfo.properties.historical.year}
                </span>
              </div>

              {/* Description */}
              <p className="text-sm font-serif text-heritage-ink leading-relaxed mb-4">
                {popupInfo.properties.description}
              </p>

              {/* Bouton CTA */}
              <button
                onClick={() => handleViewComparison(popupInfo)}
                className="w-full bg-heritage-bordeaux text-heritage-cream px-4 py-2.5 rounded border-2 border-heritage-gold/40 hover:bg-heritage-ink hover:shadow-vintage transition-all text-sm font-serif font-medium flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Voir la comparaison
              </button>
            </div>
          </Popup>
          );
        })()}
      </Map>

      {/* Légende */}
      <div className="absolute bottom-4 right-4 md:bottom-8 md:right-8 bg-heritage-cream/95 backdrop-blur-sm p-3 md:p-4 rounded border-2 border-heritage-gold/40 shadow-vintage-lg max-h-[40vh] overflow-y-auto z-10">
        <h4 className="font-serif font-bold text-xs md:text-sm mb-2 text-heritage-bordeaux tracking-wide">Catégories</h4>
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-base md:text-lg">🏛️</span>
            <span className="text-[10px] md:text-xs font-serif text-heritage-ink">Urbanisme</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-base md:text-lg">🏗️</span>
            <span className="text-[10px] md:text-xs font-serif text-heritage-ink">Architecture</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-base md:text-lg">🏭</span>
            <span className="text-[10px] md:text-xs font-serif text-heritage-ink">Industrie</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-base md:text-lg">🕰️</span>
            <span className="text-[10px] md:text-xs font-serif text-heritage-ink">Patrimoine disparu</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(InteractiveMap);
