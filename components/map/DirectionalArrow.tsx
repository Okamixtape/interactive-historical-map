'use client';

import { useEffect, useState, useRef } from 'react';
import type { MapRef } from 'react-map-gl/mapbox';

interface DirectionalArrowProps {
  mapRef: React.RefObject<MapRef>;
  longitude: number;
  latitude: number;
  bearing: number; // Angle de la photo (0-360°)
  visible: boolean;
}

export default function DirectionalArrow({
  mapRef,
  longitude,
  latitude,
  bearing,
  visible
}: DirectionalArrowProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [mapBearing, setMapBearing] = useState(0);
  const arrowRef = useRef<HTMLDivElement>(null);

  // Convertir lng/lat en coordonnées écran (x/y pixels)
  useEffect(() => {
    if (!mapRef.current || !visible) return;

    const updatePosition = () => {
      try {
        const map = mapRef.current?.getMap();
        if (!map) return;

        // Projeter les coordonnées géographiques en pixels écran
        const point = map.project([longitude, latitude]);

        setPosition({
          x: point.x,
          y: point.y
        });
      } catch (error) {
        console.error('Error projecting arrow position:', error);
      }
    };

    // Calculer position initiale
    updatePosition();

    // Recalculer quand la carte bouge (pan/zoom/rotate)
    const map = mapRef.current.getMap();
    
    const updateBearing = () => {
      setMapBearing(map.getBearing());
    };
    
    map.on('move', updatePosition);
    map.on('zoom', updatePosition);
    map.on('rotate', updateBearing);
    
    // Init bearing
    updateBearing();

    return () => {
      map.off('move', updatePosition);
      map.off('zoom', updatePosition);
      map.off('rotate', updateBearing);
    };
  }, [mapRef, longitude, latitude, visible]);

  if (!visible) return null;

  return (
    <div
      ref={arrowRef}
      className="absolute pointer-events-none z-30"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        // Rotation = bearing de la photo - bearing de la carte
        transform: `translate(-50%, -50%) rotate(${bearing - mapBearing}deg)`,
        transition: 'transform 0.3s ease-out',
      }}
      aria-hidden="true"
    >
      {/* Flèche SVG rouge pointant vers le haut (0°) */}
      <svg width="80" height="80" viewBox="0 0 80 80">
        {/* Ombre pour contraste */}
        <path
          d="M40 10 L60 60 L40 50 L20 60 Z"
          fill="rgba(0, 0, 0, 0.3)"
          transform="translate(2, 2)"
        />
        {/* Flèche principale */}
        <path
          d="M40 10 L60 60 L40 50 L20 60 Z"
          fill="#DC2626"
          stroke="#7F1D1D"
          strokeWidth="2"
          opacity="0.9"
        />
        {/* Point central pour meilleure visibilité */}
        <circle
          cx="40"
          cy="40"
          r="6"
          fill="white"
          stroke="#DC2626"
          strokeWidth="2"
        />
      </svg>
    </div>
  );
}
