'use client';

import { useState, useCallback, memo, useRef, useEffect } from 'react';
import Map, { Marker, Popup, MapRef } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import type { PointFeature } from '@/lib/types';
import { MAPBOX_TOKEN, INITIAL_VIEW_STATE, MAP_STYLE, getCategoryEmoji, LIMOGES_BOUNDS, MAP_ZOOM_LIMITS, getCardinalDirection } from '@/lib/constants';
import DirectionalArrow from './DirectionalArrow';

interface Props {
  points: PointFeature[];
  onPointSelect: (point: PointFeature) => void;
  hoveredPointId?: string | null;
  onTransitionStateChange?: (isTransitioning: boolean) => void;
  selectedPoint?: PointFeature | null;
  onHoverPoint?: (poiId: string | null) => void;
  activeFilter?: 'all' | 'urbanisme' | 'architecture' | 'industrie' | 'patrimoine-disparu';
  pointIdToOpenPopup?: string | null;
}

function InteractiveMap({ points, onPointSelect, hoveredPointId, onTransitionStateChange, selectedPoint, onHoverPoint, activeFilter = 'all', pointIdToOpenPopup }: Props) {
  const [popupInfo, setPopupInfo] = useState<PointFeature | null>(null);
  const [is3DView, setIs3DView] = useState(false);
  const [bearing, setBearing] = useState(0);
  const [show3DBuildings, setShow3DBuildings] = useState(false);
  const [currentZoom, setCurrentZoom] = useState(INITIAL_VIEW_STATE.zoom);
  const mapRef = useRef<MapRef>(null);

  // Filtrer les points à afficher sur la carte
  const filteredPoints = activeFilter === 'all'
    ? points
    : points.filter(p => p.properties.category === activeFilter);

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

    // ✅ SÉCURITÉ : Si retour en 2D, désactiver bâtiments
    if (is3DView) {
      // On passe de 3D → 2D
      setShow3DBuildings(false);
    }

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

  // Tracker les changements de bearing et zoom pour mise à jour UI
  useEffect(() => {
    if (!mapRef.current) return undefined;

    const map = mapRef.current.getMap();

    const updateBearing = () => {
      setBearing(map.getBearing());
    };

    const updateZoom = () => {
      setCurrentZoom(map.getZoom());
    };

    // ✅ FIX : Initialiser bearing et zoom au montage
    updateBearing();
    updateZoom();

    map.on('rotate', updateBearing);
    map.on('zoom', updateZoom);
    map.on('move', updateZoom); // Pour capturer les changements pendant les animations

    return () => {
      map.off('rotate', updateBearing);
      map.off('zoom', updateZoom);
      map.off('move', updateZoom);
    };
  }, []);

  // Ouvrir la popup quand un point est sélectionné depuis la sidebar
  useEffect(() => {
    if (!pointIdToOpenPopup || !mapRef.current) return;

    const point = points.find(p => p.properties.id === pointIdToOpenPopup);
    if (!point) return;

    // Ouvrir la popup
    setPopupInfo(point);

    // Centrer la carte sur ce point
    const [lng, lat] = point.geometry.coordinates;
    if (lng !== undefined && lat !== undefined) {
      try {
        const viewportHeight = window.innerHeight;
        const offsetY = Math.min(viewportHeight * 0.25, 200);

        if (typeof mapRef.current.easeTo === 'function') {
          mapRef.current.easeTo({
            center: [lng, lat],
            duration: 800,
            easing: (t) => t * (2 - t),
            offset: [0, offsetY]
          });
        }
      } catch (error) {
        console.error('Erreur lors du centrage de la carte:', error);
      }
    }
  }, [pointIdToOpenPopup, points]);

  // ✅ SÉCURITÉ : Fermer la popup automatiquement quand le filtre change
  // Évite les crashs si la popup affiche un point qui n'est plus dans le filtre actif
  useEffect(() => {
    if (!popupInfo) return;

    // Vérifier si le point de la popup est toujours dans les points filtrés
    const isPointStillVisible = filteredPoints.some(p => p.properties.id === popupInfo.properties.id);

    // Si le point n'est plus visible, fermer la popup
    if (!isPointStillVisible) {
      setPopupInfo(null);
    }
  }, [activeFilter, popupInfo, filteredPoints]);

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

  // Fonction pour changer le zoom via le slider
  const handleZoomChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    if (!mapRef.current) return;
    const newZoom = parseFloat(event.target.value);
    setCurrentZoom(newZoom); // Update state immédiatement pour UI responsive
    mapRef.current.getMap().zoomTo(newZoom, { duration: 200 });
  }, []);

  // Fonctions de rotation bearing
  const rotateLeft = useCallback(() => {
    if (!mapRef.current) return;
    const map = mapRef.current.getMap();
    const currentBearing = map.getBearing();
    const newBearing = currentBearing + 15; // Rotation +15° par clic (sens horaire)

    // ✅ FIX : Mettre à jour bearing state immédiatement
    setBearing(newBearing);

    map.easeTo({
      bearing: newBearing,
      duration: 300
    });
  }, []);

  const rotateRight = useCallback(() => {
    if (!mapRef.current) return;
    const map = mapRef.current.getMap();
    const currentBearing = map.getBearing();
    const newBearing = currentBearing - 15; // Rotation -15° par clic (sens anti-horaire)

    // ✅ FIX : Mettre à jour bearing state immédiatement
    setBearing(newBearing);

    map.easeTo({
      bearing: newBearing,
      duration: 300
    });
  }, []);

  const resetNorth = useCallback(() => {
    if (!mapRef.current) return;
    const map = mapRef.current.getMap();

    // ✅ FIX : Mettre à jour bearing state immédiatement
    setBearing(0);

    map.easeTo({
      bearing: 0,
      // Garde le pitch actuel (ne reset pas la vue 3D)
      duration: 500
    });
  }, []);

  // Toggle bâtiments 3D
  const toggle3DBuildings = useCallback(() => {
    if (!is3DView) return; // Ne fonctionne qu'en mode 3D
    setShow3DBuildings(!show3DBuildings);
  }, [show3DBuildings, is3DView]);

  // Gérer l'affichage des bâtiments 3D
  useEffect(() => {
    if (!mapRef.current) return undefined;

    const map = mapRef.current.getMap();

    const handleMapLoad = () => {
      try {
        if (show3DBuildings) {
          // Ajouter la layer des bâtiments 3D si elle n'existe pas
          if (!map.getLayer('building-3d')) {
            map.addLayer({
              id: 'building-3d',
              source: 'composite',
              'source-layer': 'building',
              filter: ['==', 'extrude', 'true'],
              type: 'fill-extrusion',
              minzoom: 14,
              paint: {
                'fill-extrusion-color': '#aaa',
                'fill-extrusion-height': [
                  'interpolate',
                  ['linear'],
                  ['zoom'],
                  14,
                  0,
                  15.05,
                  ['get', 'height']
                ],
                'fill-extrusion-base': [
                  'interpolate',
                  ['linear'],
                  ['zoom'],
                  14,
                  0,
                  15.05,
                  ['get', 'min_height']
                ],
                'fill-extrusion-opacity': 0.6
              }
            });
          } else {
            // Si la layer existe déjà, la rendre visible
            map.setLayoutProperty('building-3d', 'visibility', 'visible');
          }
        } else {
          // Masquer la layer si elle existe
          if (map.getLayer('building-3d')) {
            map.setLayoutProperty('building-3d', 'visibility', 'none');
          }
        }
      } catch (error) {
        console.error('Erreur lors de la gestion des bâtiments 3D:', error);
      }
    };

    if (map.loaded()) {
      handleMapLoad();
    } else {
      map.on('load', handleMapLoad);
    }

    return () => {
      if (map && map.off) {
        map.off('load', handleMapLoad);
      }
    };
  }, [show3DBuildings]);

  return (
    <div className="relative w-full h-screen">
      <Map
        ref={mapRef}
        initialViewState={INITIAL_VIEW_STATE}
        style={{ width: '100%', height: '100%' }}
        mapStyle={MAP_STYLE}
        mapboxAccessToken={MAPBOX_TOKEN}
        maxBounds={LIMOGES_BOUNDS}
        minZoom={MAP_ZOOM_LIMITS.minZoom}
        maxZoom={MAP_ZOOM_LIMITS.maxZoom}
      >
        {filteredPoints.map((point) => {
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
                className={`cursor-pointer transform transition-all duration-200 bg-white rounded-full shadow-lg border-2 ${
                  isHovered
                    ? 'scale-125 text-2xl p-2.5 border-heritage-bordeaux shadow-xl ring-2 ring-heritage-bordeaux/40'
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
      {(() => {
        // ✅ SÉCURITÉ : Afficher la flèche uniquement pour les points visibles
        // Priorité : popup ouverte > point survolé (mais seulement si visible dans le filtre)
        let pointToShowArrow = null;

        if (popupInfo) {
          // Si popup ouverte, utiliser ce point (déjà vérifié par l'useEffect ci-dessus)
          pointToShowArrow = popupInfo;
        } else if (hoveredPointId) {
          // Sinon, chercher le point survolé UNIQUEMENT dans les points filtrés
          pointToShowArrow = filteredPoints.find(p => p.properties.id === hoveredPointId) || null;
        }

        if (!pointToShowArrow) return null;

        const [lng, lat] = pointToShowArrow.geometry.coordinates;
        if (lng === undefined || lat === undefined) return null;

        return (
          <DirectionalArrow
            mapRef={mapRef}
            longitude={lng}
            latitude={lat}
            bearing={pointToShowArrow.properties.mapboxCamera?.bearing || 0}
            visible={true}
          />
        );
      })()}

      {/* Contrôles en haut à droite */}
      <div className="absolute top-4 right-4 flex flex-col gap-2 z-20">
        {/* Bouton Toggle 3D */}
        <button
          onClick={toggle3DView}
          className="bg-white hover:bg-heritage-cream border-2 border-heritage-gold/40 rounded shadow-lg px-3 py-2 transition-colors flex items-center justify-center gap-2"
          aria-label={is3DView ? "Passer en vue 2D" : "Passer en vue 3D"}
          title={is3DView ? "Vue 2D (Appuyez sur 3)" : "Vue 3D (Appuyez sur 3)"}
        >
          <span className="font-serif font-bold text-sm text-heritage-bordeaux">
            {is3DView ? "2D" : "3D"}
          </span>
          {is3DView ? (
            // Icône plan 2D (carte plate vue du dessus)
            <svg className="w-4 h-4 text-heritage-bordeaux" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <rect x="3" y="3" width="18" height="18" strokeWidth={2} rx="1" />
              <path d="M3 9h18M3 15h18M9 3v18M15 3v18" strokeWidth={1.5} opacity="0.5" />
            </svg>
          ) : (
            // Icône cube 3D
            <svg className="w-4 h-4 text-heritage-bordeaux" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          )}
        </button>

        {/* Toggle Bâtiments 3D - Disponible uniquement en mode 3D */}
        <button
          onClick={toggle3DBuildings}
          disabled={!is3DView}
          className={`border-2 border-heritage-gold/40 rounded shadow-lg px-3 py-2 transition-colors flex items-center justify-center gap-2 ${
            !is3DView
              ? 'bg-gray-100 cursor-not-allowed opacity-50'
              : show3DBuildings
                ? 'bg-heritage-cream ring-2 ring-heritage-bordeaux/30'
                : 'bg-white hover:bg-heritage-cream'
          }`}
          aria-label={!is3DView ? "Bâtiments 3D (disponible en mode 3D uniquement)" : show3DBuildings ? "Masquer les bâtiments 3D" : "Afficher les bâtiments 3D"}
          title={!is3DView ? "Activez d'abord le mode 3D pour afficher les bâtiments" : show3DBuildings ? "Masquer les bâtiments 3D" : "Afficher les bâtiments 3D"}
        >
          <svg className={`w-4 h-4 ${!is3DView ? 'text-gray-400' : 'text-heritage-bordeaux'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <span className={`font-serif text-xs font-medium ${!is3DView ? 'text-gray-400' : 'text-heritage-bordeaux'}`}>
            Bâtiments
          </span>
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

        {/* Contrôles de rotation bearing */}
        <div className="bg-white border-2 border-heritage-gold/40 rounded shadow-lg overflow-hidden flex">
          {/* Rotation gauche (↶) */}
          <button
            onClick={rotateLeft}
            className="px-3 py-2 hover:bg-heritage-cream transition-colors border-r border-heritage-gold/20 flex items-center justify-center"
            aria-label="Rotation gauche"
            title="Rotation gauche (15°)"
          >
            <svg className="w-5 h-5 text-heritage-bordeaux" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 3v5h-5" />
            </svg>
          </button>

          {/* Rotation droite (↷) */}
          <button
            onClick={rotateRight}
            className="px-3 py-2 hover:bg-heritage-cream transition-colors flex items-center justify-center"
            aria-label="Rotation droite"
            title="Rotation droite (15°)"
          >
            <svg className="w-5 h-5 text-heritage-bordeaux" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3v5h5" />
            </svg>
          </button>
        </div>

        {/* Slider de zoom vertical */}
        <div className="bg-white border-2 border-heritage-gold/40 rounded shadow-lg px-2 py-3 flex flex-col items-center gap-2">
          {/* Max zoom label */}
          <span className="text-[9px] font-serif font-medium text-heritage-ink/50">
            {MAP_ZOOM_LIMITS.maxZoom}
          </span>

          {/* Container pour le slider roté */}
          <div className="relative" style={{ width: '24px', height: '120px' }}>
            <input
              type="range"
              min={MAP_ZOOM_LIMITS.minZoom}
              max={MAP_ZOOM_LIMITS.maxZoom}
              step="0.1"
              value={currentZoom}
              onChange={handleZoomChange}
              className="zoom-slider-vertical"
              aria-label="Niveau de zoom"
              title={`Zoom: ${currentZoom.toFixed(1)}`}
              style={{
                position: 'absolute',
                width: '120px',
                height: '24px',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%) rotate(270deg)',
                transformOrigin: 'center center'
              }}
            />
          </div>

          {/* Current zoom value */}
          <div className="flex items-center justify-center bg-heritage-cream rounded px-1.5 py-0.5 min-w-[32px]">
            <span className="text-[10px] font-serif font-bold text-heritage-bordeaux">
              {currentZoom.toFixed(1)}
            </span>
          </div>

          {/* Min zoom label */}
          <span className="text-[9px] font-serif font-medium text-heritage-ink/50">
            {MAP_ZOOM_LIMITS.minZoom}
          </span>
        </div>

        {/* Reset Nord (boussole) */}
        <button
          onClick={resetNorth}
          className="bg-white hover:bg-heritage-cream border-2 border-heritage-gold/40 rounded shadow-lg px-3 py-2 transition-colors flex items-center justify-center"
          aria-label="Réinitialiser orientation"
          title={`Retour au Nord (actuellement : ${getCardinalDirection(bearing)} - ${Math.round(((bearing % 360) + 360) % 360)}°)`}
        >
          <svg
            className="w-6 h-6 transition-transform duration-300"
            viewBox="0 0 24 24"
            style={{ transform: `rotate(${-(bearing || 0)}deg)` }}
          >
            {/* Cercle boussole */}
            <circle cx="12" cy="12" r="10" fill="white" stroke="#8B4513" strokeWidth={1.5} />
            
            {/* Aiguille Nord (rouge vif) */}
            <path 
              d="M12 4 L14 12 L12 11 L10 12 Z" 
              fill="#DC2626" 
              stroke="#7F1D1D" 
              strokeWidth={1}
            />
            
            {/* Aiguille Sud (gris) */}
            <path 
              d="M12 20 L14 12 L12 13 L10 12 Z" 
              fill="#6B7280" 
              stroke="#374151" 
              strokeWidth={1}
            />
            
            {/* Point central */}
            <circle cx="12" cy="12" r="2" fill="#8B4513" />
            
            {/* Lettre N (Nord) */}
            <text 
              x="12" 
              y="6" 
              textAnchor="middle" 
              fontSize="4" 
              fontWeight="bold" 
              fill="#DC2626"
            >
              N
            </text>
          </svg>
        </button>
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
