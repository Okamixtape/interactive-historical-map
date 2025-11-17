'use client';

import { ReactCompareSlider, ReactCompareSliderImage } from 'react-compare-slider';
import { useState } from 'react';
import type { PointFeature } from '@/lib/types';
import { getStreetViewStaticUrl } from '@/lib/streetview';

interface Props {
  point: PointFeature;
}

export function ImageComparisonSlider({ point }: Props) {
  const { properties } = point;
  const [sliderPosition, setSliderPosition] = useState(50);

  // Générer l'URL Street View statique (optimisée pour le slider)
  // Format 2:1 pour matcher les photos historiques (1600×803, 3424×1718)
  // IMPORTANT : Google Street View Static API limite gratuite = 640×640px max
  const streetViewUrl = getStreetViewStaticUrl(
    properties.streetView.latitude,
    properties.streetView.longitude,
    properties.streetView.heading ?? 0,
    properties.streetView.pitch ?? 0,
    properties.streetView.fov ?? 90,
    640, // Width max API gratuite
    320  // Height (ratio 2:1 respecté)
  );

  return (
    <div className="space-y-3">
      {/* En-têtes avec position dynamique */}
      <div className="flex items-center justify-between px-2">
        <div className={`flex items-center gap-1.5 transition-opacity ${sliderPosition > 40 ? 'opacity-100' : 'opacity-50'}`}>
          <h3 className="text-sm font-serif font-bold text-heritage-bordeaux">
            Historique
          </h3>
          <span className="text-xs font-serif font-medium text-heritage-ink bg-heritage-cream px-1.5 py-0.5 rounded border border-heritage-gold/30">
            {properties.historical.year}
          </span>
        </div>
        <div className={`flex items-center gap-1.5 transition-opacity ${sliderPosition < 60 ? 'opacity-100' : 'opacity-50'}`}>
          <h3 className="text-sm font-serif font-bold text-heritage-bordeaux">
            Actuelle
          </h3>
          <span className="text-xs font-serif font-medium text-heritage-ink bg-heritage-cream px-1.5 py-0.5 rounded border border-heritage-gold/30">
            2024
          </span>
        </div>
      </div>

      {/* Slider de comparaison */}
      {/* Format 2:1 panoramique pour correspondre aux photos historiques */}
      <div className="relative aspect-[2/1] rounded border-2 border-heritage-gold/30 overflow-hidden shadow-vintage-lg">
        <ReactCompareSlider
          position={sliderPosition}
          onPositionChange={setSliderPosition}
          itemOne={
            <ReactCompareSliderImage
              src={properties.historical.imageUrl}
              alt={`${properties.title} - ${properties.historical.year}`}
              className="object-cover w-full h-full"
            />
          }
          itemTwo={
            <ReactCompareSliderImage
              src={streetViewUrl}
              alt={`${properties.title} - Vue actuelle 2024`}
              className="object-cover w-full h-full"
            />
          }
          portrait={false}
          handle={
            <div
              className="flex items-center justify-center w-12 h-12 bg-heritage-bordeaux border-4 border-heritage-gold shadow-vintage-lg rounded-full cursor-ew-resize transition-transform hover:scale-110 focus:scale-110 focus:outline-none focus:ring-4 focus:ring-heritage-gold/50"
              aria-label="Glisser pour comparer les images"
              role="slider"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(sliderPosition)}
              aria-valuetext={`${Math.round(sliderPosition)}% image historique visible`}
              tabIndex={0}
            >
              <svg
                className="w-6 h-6 text-heritage-cream"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="3"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path d="M8 7l-5 5 5 5M16 7l5 5-5 5" />
              </svg>
            </div>
          }
          style={{
            width: '100%',
            height: '100%',
          }}
          className="cursor-ew-resize"
        />

        {/* Indicateur de position */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 bg-heritage-bordeaux/90 text-heritage-cream text-xs font-serif rounded border border-heritage-gold/50 pointer-events-none">
          {Math.round(sliderPosition)}% historique
        </div>
      </div>

      {/* Métadonnées en bas */}
      <div className="grid md:grid-cols-2 gap-3">
        {/* Source historique */}
        <div className="bg-white rounded border border-heritage-gold/20 p-3 text-xs font-serif text-heritage-ink/80 space-y-1.5">
          <p>
            <strong className="text-heritage-bordeaux">Source :</strong> {properties.historical.source}
          </p>
          {properties.historical.archiveReference && (
            <p>
              <strong className="text-heritage-bordeaux">Référence :</strong>{' '}
              {properties.historical.archiveReference}
            </p>
          )}
        </div>

        {/* Coordonnées Street View + lien interactif */}
        <div className="bg-white rounded border border-heritage-gold/20 p-3 text-xs font-serif text-heritage-ink/80 space-y-2">
          <p>
            <strong className="text-heritage-bordeaux">Coordonnées :</strong>{' '}
            {properties.streetView.latitude.toFixed(6)}, {properties.streetView.longitude.toFixed(6)}
          </p>
          <a
            href={`https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${properties.streetView.latitude},${properties.streetView.longitude}&heading=${properties.streetView.heading ?? 0}&pitch=${properties.streetView.pitch ?? 0}&fov=${properties.streetView.fov ?? 90}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-heritage-bordeaux hover:text-heritage-ink underline"
          >
            <span>Voir en interactif</span>
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </div>

      {/* Instructions d'utilisation (accessibilité) */}
      <div className="bg-heritage-cream/50 rounded border border-heritage-gold/20 p-2 text-xs font-serif text-heritage-ink/70 italic">
        💡 Glissez le curseur (souris, doigt ou flèches ←→) pour comparer
      </div>
    </div>
  );
}
