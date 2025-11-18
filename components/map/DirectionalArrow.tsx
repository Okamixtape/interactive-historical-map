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
        {/* Flèche directionnelle élégante (heritage-bordeaux) */}
        <svg width="120" height="120" viewBox="0 0 120 120" className="drop-shadow-md">
          {/* Ligne de la flèche (part du bas du SVG = centre marqueur avec offset) */}
          <line
            x1="60"
            y1="120"
            x2="60"
            y2="20"
            stroke="#8B4513"
            strokeWidth="2.5"
            strokeLinecap="round"
            opacity="0.7"
          />
          {/* Pointe de la flèche (triangle) */}
          <path
            d="M60 15 L68 27 L52 27 Z"
            fill="#8B4513"
            opacity="0.75"
          />
        </svg>
      </div>
    </Marker>
  );
}

export default memo(DirectionalArrow);
