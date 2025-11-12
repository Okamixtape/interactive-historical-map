'use client';

import { useState, useCallback, memo } from 'react';
import Map, { Marker, Popup, NavigationControl } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import type { PointFeature } from '@/lib/types';
import { MAPBOX_TOKEN, INITIAL_VIEW_STATE, MAP_STYLE } from '@/lib/constants';

interface Props {
  points: PointFeature[];
  onPointSelect: (point: PointFeature) => void;
}

function InteractiveMap({ points, onPointSelect }: Props) {
  const [popupInfo, setPopupInfo] = useState<PointFeature | null>(null);

  const handleMarkerClick = useCallback((event: React.MouseEvent, point: PointFeature) => {
    event.stopPropagation();
    setPopupInfo(point);
  }, []);

  const handlePopupClose = useCallback(() => {
    setPopupInfo(null);
  }, []);

  const handleViewComparison = useCallback((point: PointFeature) => {
    onPointSelect(point);
    setPopupInfo(null);
  }, [onPointSelect]);

  // Fonction pour obtenir l'icône selon la catégorie
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'urbanisme':
        return '🏛️';
      case 'architecture':
        return '🏗️';
      case 'industrie':
        return '🏭';
      case 'patrimoine-disparu':
        return '🕰️';
      default:
        return '📍';
    }
  };

  return (
    <div className="relative w-full h-screen">
      <Map
        initialViewState={INITIAL_VIEW_STATE}
        style={{ width: '100%', height: '100%' }}
        mapStyle={MAP_STYLE}
        mapboxAccessToken={MAPBOX_TOKEN}
      >
        <NavigationControl position="top-right" />

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
                className="cursor-pointer transform transition-transform hover:scale-125 text-2xl"
                aria-label={point.properties.title}
              >
                {getCategoryIcon(point.properties.category)}
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
              anchor="top"
              className="max-w-sm"
            >
            <div className="p-3">
              <h3 className="font-bold text-lg mb-2 text-heritage-bordeaux">
                {popupInfo.properties.title}
              </h3>
              <p className="text-sm text-gray-600 mb-2">
                {popupInfo.properties.address}
              </p>
              <p className="text-sm mb-3">
                {popupInfo.properties.description}
              </p>
              <div className="text-xs text-gray-500 mb-3">
                Archive: {popupInfo.properties.historical.year}
              </div>
              <button
                onClick={() => handleViewComparison(popupInfo)}
                className="w-full bg-heritage-bordeaux text-white px-4 py-2 rounded-md hover:bg-heritage-sepia transition-colors text-sm font-medium"
              >
                Voir la comparaison
              </button>
            </div>
          </Popup>
          );
        })()}
      </Map>

      {/* Légende */}
      <div className="absolute bottom-8 left-8 bg-white/95 backdrop-blur-sm p-4 rounded-lg shadow-lg">
        <h4 className="font-bold text-sm mb-2 text-heritage-bordeaux">Catégories</h4>
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-lg">🏛️</span>
            <span>Urbanisme</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg">🏗️</span>
            <span>Architecture</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg">🏭</span>
            <span>Industrie</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg">🕰️</span>
            <span>Patrimoine disparu</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(InteractiveMap);
