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
  const [showShortcutsModal, setShowShortcutsModal] = useState(false);
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

  // Synchroniser bearing et zoom avec tous les mouvements de carte
  // Utilise onMove du composant Map pour cohérence maximale
  const handleMapMove = useCallback((evt: any) => {
    setBearing(evt.viewState.bearing);
    setCurrentZoom(evt.viewState.zoom);
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
    // La synchronisation de currentZoom se fait automatiquement via onMove
    mapRef.current.getMap().zoomTo(newZoom, { duration: 200 });
  }, []);

  // Fonctions de rotation bearing
  const rotateLeft = useCallback(() => {
    if (!mapRef.current) return;
    const map = mapRef.current.getMap();
    const currentBearing = map.getBearing();
    const newBearing = currentBearing + 15; // Rotation +15° par clic (sens horaire)

    // La synchronisation de bearing se fait automatiquement via onMove
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

    // La synchronisation de bearing se fait automatiquement via onMove
    map.easeTo({
      bearing: newBearing,
      duration: 300
    });
  }, []);

  const resetNorth = useCallback(() => {
    if (!mapRef.current) return;
    const map = mapRef.current.getMap();

    // La synchronisation de bearing se fait automatiquement via onMove
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
    if (!map) return undefined;

    const handleMapLoad = () => {
      try {
        // ✅ SÉCURITÉ : Vérifier que la carte est chargée et le style aussi
        if (!map.isStyleLoaded()) {
          console.warn('Style pas encore chargé, on attend...');
          setTimeout(handleMapLoad, 100);
          return;
        }

        if (show3DBuildings) {
          // Ajouter la layer des bâtiments 3D si elle n'existe pas
          if (!map.getLayer('building-3d')) {
            console.log('Ajout layer bâtiments 3D...');
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
            console.log('✅ Layer bâtiments 3D ajoutée');
          } else {
            // Si la layer existe déjà, la rendre visible
            console.log('Layer bâtiments 3D existe, on la rend visible');
            map.setLayoutProperty('building-3d', 'visibility', 'visible');
          }
        } else {
          // Masquer la layer si elle existe
          if (map.getLayer('building-3d')) {
            console.log('Masquage layer bâtiments 3D');
            map.setLayoutProperty('building-3d', 'visibility', 'none');
          }
        }
      } catch (error) {
        console.error('❌ Erreur lors de la gestion des bâtiments 3D:', error);
        if (error instanceof Error) {
          console.error('Stack trace:', error.stack);
        }
      }
    };

    // ✅ Attendre que le style soit complètement chargé
    if (map.isStyleLoaded()) {
      handleMapLoad();
    } else {
      map.on('style.load', handleMapLoad);
    }

    return () => {
      if (map && map.off) {
        map.off('style.load', handleMapLoad);
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
        onMove={handleMapMove}
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
                {/* Icône comparaison avant/après (slider) */}
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  {/* Rectangle divisé en deux */}
                  <rect x="3" y="5" width="18" height="14" rx="2" strokeWidth="2"/>
                  {/* Ligne de séparation verticale avec slider */}
                  <line x1="12" y1="5" x2="12" y2="19" strokeWidth="2"/>
                  {/* Cercle de contrôle slider */}
                  <circle cx="12" cy="12" r="2.5" fill="currentColor" stroke="currentColor" strokeWidth="1.5"/>
                  {/* Flèches gauche/droite dans le cercle */}
                  <path d="M10.5 12 L9.5 12 M13.5 12 L14.5 12" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                Comparer avant/après
              </button>
            </div>
          </Popup>
          );
        })()}

        {/* Flèche directionnelle indiquant l'angle de prise de vue */}
        {(() => {
          // Afficher la flèche uniquement pour les points visibles
          // Priorité : popup ouverte > point survolé (mais seulement si visible dans le filtre)
          let pointToShowArrow = null;

          if (popupInfo) {
            // Si popup ouverte, utiliser ce point
            pointToShowArrow = popupInfo;
          } else if (hoveredPointId) {
            // Sinon, chercher le point survolé UNIQUEMENT dans les points filtrés
            pointToShowArrow = filteredPoints.find(p => p.properties.id === hoveredPointId) || null;
          }

          if (!pointToShowArrow) return null;

          const [lng, lat] = pointToShowArrow.geometry.coordinates;
          if (lng === undefined || lat === undefined) return null;

          // Utiliser streetView.heading (direction de la caméra)
          const heading = pointToShowArrow.properties.streetView?.heading ?? 0;

          return (
            <DirectionalArrow
              longitude={lng}
              latitude={lat}
              bearing={heading}
              mapBearing={bearing}
              visible={true}
            />
          );
        })()}

        {/* Contrôles en haut à droite */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 z-20">
          {/* Bouton Info Shortcuts */}
          <button
            onClick={() => setShowShortcutsModal(true)}
            className="bg-white hover:bg-heritage-cream border-2 border-heritage-gold/40 rounded-full shadow-lg w-10 h-10 transition-colors flex items-center justify-center self-center"
            aria-label="Afficher les raccourcis clavier"
            title="Raccourcis clavier et contrôles"
          >
            <svg className="w-5 h-5 text-heritage-bordeaux" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>

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
            className="flex-1 py-2 hover:bg-heritage-cream transition-colors border-r border-heritage-gold/20 flex items-center justify-center"
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
            className="flex-1 py-2 hover:bg-heritage-cream transition-colors flex items-center justify-center"
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
          <span className="text-[9px] font-serif font-medium text-heritage-ink/70">
            Max
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
              x{((currentZoom - MAP_ZOOM_LIMITS.minZoom) / (MAP_ZOOM_LIMITS.maxZoom - MAP_ZOOM_LIMITS.minZoom) * 2 + 1).toFixed(1)}
            </span>
          </div>

          {/* Min zoom label */}
          <span className="text-[9px] font-serif font-medium text-heritage-ink/70">
            Min
          </span>
        </div>

        {/* Reset Nord (boussole) */}
        <button
          onClick={resetNorth}
          className="bg-white hover:bg-heritage-cream border-2 border-heritage-gold/40 rounded shadow-lg p-2 transition-colors flex items-center justify-center"
          aria-label="Réinitialiser orientation"
          title={`La carte pointe vers le ${getCardinalDirection(bearing)} (${Math.round(((bearing % 360) + 360) % 360)}°)`}
        >
          <svg
            className="w-20 h-20"
            viewBox="0 0 64 64"
          >
            {/* Cercle extérieur */}
            <circle cx="32" cy="32" r="18" fill="white" stroke="#8B4513" strokeWidth="2.5"/>
            
            {/* Points cardinaux FIXES (ne tournent jamais) */}
            <text 
              x="32" 
              y="7" 
              textAnchor="middle" 
              dominantBaseline="middle"
              fontSize="11" 
              fontWeight="bold" 
              fill="#DC2626"
              fontFamily="serif"
            >
              N
            </text>
            <text 
              x="57" 
              y="32" 
              textAnchor="middle" 
              dominantBaseline="middle"
              fontSize="9" 
              fill="#666"
              fontFamily="serif"
            >
              E
            </text>
            <text 
              x="32" 
              y="57" 
              textAnchor="middle" 
              dominantBaseline="middle"
              fontSize="9" 
              fill="#666"
              fontFamily="serif"
            >
              S
            </text>
            <text 
              x="7" 
              y="32" 
              textAnchor="middle" 
              dominantBaseline="middle"
              fontSize="9" 
              fill="#666"
              fontFamily="serif"
            >
              O
            </text>
            
            {/* Aiguille pivotante (indique où regarde la carte) */}
            <g transform={`rotate(${-(bearing || 0)}, 32, 32)`}>
              {/* Partie Nord (rouge) */}
              <path 
                d="M32 16 L34 32 L32 34 L30 32 Z" 
                fill="#DC2626"
                stroke="#7F1D1D"
                strokeWidth="1"
              />
              {/* Partie Sud (gris) */}
              <path 
                d="M32 34 L34 32 L32 48 L30 32 Z" 
                fill="#6B7280"
                stroke="#374151"
                strokeWidth="1"
              />
            </g>
            
            {/* Point central */}
            <circle cx="32" cy="32" r="3" fill="#8B4513"/>
          </svg>
        </button>
      </div>
      </Map>

      {/* Modal Shortcuts */}
      {showShortcutsModal && (
        <div 
          className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setShowShortcutsModal(false)}
        >
          <div 
            className="bg-heritage-cream border-4 border-heritage-gold/60 rounded-lg shadow-2xl p-6 max-w-md mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif font-bold text-2xl text-heritage-bordeaux">
                Comment utiliser la carte ?
              </h3>
              <button
                onClick={() => setShowShortcutsModal(false)}
                className="text-heritage-ink/50 hover:text-heritage-bordeaux transition-colors"
                aria-label="Fermer"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Contenu simplifié */}
            <div className="space-y-4 font-serif text-heritage-ink">
              {/* Introduction */}
              <p className="text-base leading-relaxed">
                Explorez le patrimoine historique de Limoges en naviguant sur la carte interactive.
              </p>

              {/* Navigation de base */}
              <div className="bg-white/50 rounded-lg p-4 space-y-3">
                <h4 className="font-bold text-heritage-bordeaux text-lg mb-2">
                  🗺️ Naviguer sur la carte
                </h4>
                <p className="text-sm leading-relaxed">
                  <strong>Déplacer :</strong> Cliquez et glissez sur la carte
                </p>
                <p className="text-sm leading-relaxed">
                  <strong>Zoomer :</strong> Utilisez la molette de la souris ou les boutons <span className="font-bold">+</span> et <span className="font-bold">−</span>
                </p>
                <p className="text-sm leading-relaxed">
                  <strong>Pivoter :</strong> Maintenez <kbd className="px-1.5 py-0.5 bg-heritage-cream border border-heritage-gold/40 rounded text-xs font-mono">Ctrl</kbd> et glissez
                </p>
              </div>

              {/* Points d'intérêt */}
              <div className="bg-white/50 rounded-lg p-4 space-y-2">
                <h4 className="font-bold text-heritage-bordeaux text-lg mb-2">
                  📍 Découvrir les lieux
                </h4>
                <p className="text-sm leading-relaxed">
                  Cliquez sur les icônes (🏛️ 🏗️ 🏭 🕰️) pour afficher les informations historiques.
                </p>
              </div>

              {/* Vue 3D */}
              <div className="bg-white/50 rounded-lg p-4 space-y-2">
                <h4 className="font-bold text-heritage-bordeaux text-lg mb-2">
                  🎬 Mode 3D
                </h4>
                <p className="text-sm leading-relaxed">
                  Appuyez sur la touche <kbd className="px-2 py-1 bg-heritage-cream border border-heritage-gold/40 rounded text-sm font-mono font-bold">3</kbd> pour basculer en vue 3D et explorer la ville en relief.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-6 pt-4 border-t border-heritage-gold/30">
              <button
                onClick={() => setShowShortcutsModal(false)}
                className="w-full bg-heritage-bordeaux hover:bg-heritage-bordeaux/90 text-white font-serif font-bold py-2 px-4 rounded transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default memo(InteractiveMap);
