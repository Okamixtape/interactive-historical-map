'use client';

import { useState, useCallback, memo, useRef, useEffect } from 'react';
import Map, { Marker, Popup, MapRef } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import type { PointFeature } from '@/lib/types';
import { MAPBOX_TOKEN, INITIAL_VIEW_STATE, MAP_STYLE, getCategoryEmoji } from '@/lib/constants';
import DirectionalArrow from './DirectionalArrow';

interface Props {
  points: PointFeature[];
  onPointSelect: (point: PointFeature) => void;
  hoveredPointId?: string | null;
  onTransitionStateChange?: (isTransitioning: boolean) => void;
  selectedPoint?: PointFeature | null;
  onHoverPoint?: (poiId: string | null) => void;
}

function InteractiveMap({ points, onPointSelect, hoveredPointId, onTransitionStateChange, selectedPoint, onHoverPoint }: Props) {
  const [popupInfo, setPopupInfo] = useState<PointFeature | null>(null);
  const [is3DView, setIs3DView] = useState(false);
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

  // Toggle vue 3D avec transition smooth
  const toggle3DView = useCallback(() => {
    if (!mapRef.current) return;

    const map = mapRef.current.getMap();
    const targetPitch = is3DView ? 0 : 60; // 0 = 2D, 60 = 3D

    // Notifier que la transition commence (désactive animations sidebar)
    onTransitionStateChange?.(true);

    map.easeTo({
      pitch: targetPitch,
      duration: 1000, // 1 seconde
      easing: (t) => t * (2 - t) // easeOutQuad
    });

    // Attendre la fin de la transition
    setTimeout(() => {
      setIs3DView(!is3DView);
      onTransitionStateChange?.(false); // Réactive animations sidebar
    }, 1000);
  }, [is3DView, onTransitionStateChange]);

  // Raccourci clavier "3" pour toggle 3D
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === '3' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        toggle3DView();
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [toggle3DView]);

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

  // Fonctions de zoom custom
  const handleZoomIn = useCallback(() => {
    if (!mapRef.current) return;
    mapRef.current.getMap().zoomIn();
  }, []);

  const handleZoomOut = useCallback(() => {
    if (!mapRef.current) return;
    mapRef.current.getMap().zoomOut();
  }, []);

  return (
    <div className="relative w-full h-screen">
      <Map
        ref={mapRef}
        initialViewState={INITIAL_VIEW_STATE}
        style={{ width: '100%', height: '100%' }}
        mapStyle={MAP_STYLE}
        mapboxAccessToken={MAPBOX_TOKEN}
      >
        {points.map((point) => {
          const [lng, lat] = point.geometry.coordinates;
          if (lng === undefined || lat === undefined) return null;
          
          // Vérifier si ce marqueur est survolé depuis la sidebar
          const isHovered = hoveredPointId === point.properties.id;

          return (
            <Marker
              key={point.properties.id}
              longitude={lng}
              latitude={lat}
              anchor="bottom"
            >
              <button
                onClick={(e) => handleMarkerClick(e, point)}
                onMouseEnter={() => onHoverPoint?.(point.properties.id)}
                onMouseLeave={() => onHoverPoint?.(null)}
                className={`cursor-pointer transform transition-all bg-white rounded-full shadow-lg border-2 ${
                  isHovered
                    ? 'scale-150 text-3xl p-3 border-heritage-bordeaux shadow-2xl ring-4 ring-heritage-bordeaux/50'
                    : 'text-2xl p-2 border-heritage-bordeaux'
                }`}
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

      {/* Flèche directionnelle - montre l'angle de vue de la photo */}
      {hoveredPointId && (() => {
        const hoveredPoint = points.find(p => p.properties.id === hoveredPointId);
        if (!hoveredPoint) return null;

        return (
          <DirectionalArrow
            mapRef={mapRef}
            longitude={hoveredPoint.geometry.coordinates[0]}
            latitude={hoveredPoint.geometry.coordinates[1]}
            bearing={hoveredPoint.properties.mapboxCamera?.bearing || 0}
            visible={true}
          />
        );
      })()}

      {/* Contrôles en haut à droite */}
      <div className="absolute top-4 right-4 flex flex-col gap-2 z-20">
        {/* Bouton Toggle 3D */}
        <button
          onClick={toggle3DView}
          className="bg-white hover:bg-heritage-cream border-2 border-heritage-gold/40 rounded shadow-lg px-3 py-2 transition-colors flex items-center gap-2"
          aria-label={is3DView ? "Passer en vue 2D" : "Passer en vue 3D"}
          title={is3DView ? "Vue 2D (Appuyez sur 3)" : "Vue 3D (Appuyez sur 3)"}
        >
          <span className="font-serif font-bold text-sm text-heritage-bordeaux">
            {is3DView ? "2D" : "3D"}
          </span>
          <svg className="w-4 h-4 text-heritage-bordeaux" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        </button>

        {/* Contrôles de zoom */}
        <div className="bg-white border-2 border-heritage-gold/40 rounded shadow-lg overflow-hidden">
          {/* Zoom In */}
          <button
            onClick={handleZoomIn}
            className="w-full px-3 py-2 hover:bg-heritage-cream transition-colors border-b border-heritage-gold/20 flex items-center justify-center"
            aria-label="Zoom avant"
            title="Zoom avant"
          >
            <svg className="w-5 h-5 text-heritage-bordeaux" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
          </button>

          {/* Zoom Out */}
          <button
            onClick={handleZoomOut}
            className="w-full px-3 py-2 hover:bg-heritage-cream transition-colors flex items-center justify-center"
            aria-label="Zoom arrière"
            title="Zoom arrière"
          >
            <svg className="w-5 h-5 text-heritage-bordeaux" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 12H4" />
            </svg>
          </button>
        </div>
      </div>

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
