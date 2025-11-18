'use client';

import { memo } from 'react';
import { Marker } from 'react-map-gl/mapbox';

interface DirectionalArrowProps {
  longitude: number;
  latitude: number;
  bearing: number; // Angle de la photo (0-360°)
  mapBearing: number; // Rotation de la carte (0-360°)
  visible: boolean;
}

function DirectionalArrow({
  longitude,
  latitude,
  bearing,
  mapBearing,
  visible
}: DirectionalArrowProps) {
  if (!visible) return null;

  // Calculer la rotation compensée : bearing de la photo - bearing de la carte
  const adjustedBearing = bearing - mapBearing;

  return (
    <Marker
      longitude={longitude}
      latitude={latitude}
      anchor="bottom"
      offset={[0, 22]}
      style={{ pointerEvents: 'none', zIndex: 1 }}
    >
      <div
        className="transform transition-transform duration-300"
        style={{
          transform: `rotate(${adjustedBearing}deg)`,
        }}
        aria-hidden="true"
      >
        {/* Indicateur directionnel élégant (heritage-bordeaux) */}
        <svg width="120" height="120" viewBox="0 0 120 120" className="drop-shadow-md">
          {/* Ligne directionnelle (derrière, contexte visuel) */}
          <line
            x1="50"
            y1="80"
            x2="50"
            y2="35"
            stroke="#8B4513"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.5"
            strokeDasharray="4 3"
          />
          {/* Triangle inversé pointant vers le sujet photographié */}
          <path
            d="M50 28 L42 40 L58 40 Z"
            fill="#8B4513"
            opacity="0.85"
            className="drop-shadow-sm"
          />
        </svg>
      </div>
    </Marker>
  );
}

export default memo(DirectionalArrow);
