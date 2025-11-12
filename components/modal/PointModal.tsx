'use client';

import { useEffect, useCallback } from 'react';
import type { PointFeature } from '@/lib/types';
import { StreetViewEmbed } from './StreetViewEmbed';
import Image from 'next/image';

interface Props {
  point: PointFeature;
  onClose: () => void;
}

export default function PointModal({ point, onClose }: Props) {
  // Fermer avec la touche Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    // Désactiver le scroll du body
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }, [onClose]);

  const { properties } = point;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-heritage-cream w-full max-w-6xl max-h-[90vh] rounded-lg shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-heritage-bordeaux text-white px-6 py-4 flex items-center justify-between">
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-1">{properties.title}</h2>
            <p className="text-sm opacity-90">{properties.address}</p>
          </div>
          <button
            onClick={onClose}
            className="ml-4 text-white hover:text-heritage-cream transition-colors p-2"
            aria-label="Fermer"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Description */}
          <div className="px-6 py-4 border-b border-sepia-200">
            <p className="text-gray-700">{properties.description}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {properties.tags?.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-sepia-100 text-sepia-800 text-xs rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Comparaison Images */}
          <div className="grid md:grid-cols-2 gap-4 p-6">
            {/* Image Historique */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-heritage-bordeaux">
                  Vue Historique
                </h3>
                <span className="text-sm text-gray-600">
                  {properties.historical.year}
                </span>
              </div>
              <div className="relative aspect-[4/3] bg-gray-100 rounded-lg overflow-hidden shadow-md">
                <Image
                  src={properties.historical.imageUrl}
                  alt={`${properties.title} - ${properties.historical.year}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="text-xs text-gray-600 space-y-1">
                <p>
                  <strong>Source:</strong> {properties.historical.source}
                </p>
                {properties.historical.archiveReference && (
                  <p>
                    <strong>Référence:</strong>{' '}
                    {properties.historical.archiveReference}
                  </p>
                )}
              </div>
            </div>

            {/* Street View Actuel */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-heritage-bordeaux">
                  Vue Actuelle
                </h3>
                <span className="text-sm text-gray-600">Google Street View</span>
              </div>
              <div className="relative aspect-[4/3] bg-gray-100 rounded-lg overflow-hidden shadow-md">
                <StreetViewEmbed
                  latitude={properties.streetView.latitude}
                  longitude={properties.streetView.longitude}
                  heading={properties.streetView.heading}
                  pitch={properties.streetView.pitch}
                  fov={properties.streetView.fov}
                />
              </div>
              <div className="text-xs text-gray-600">
                <p>
                  <strong>Coordonnées:</strong> {properties.streetView.latitude.toFixed(6)},{' '}
                  {properties.streetView.longitude.toFixed(6)}
                </p>
              </div>
            </div>
          </div>

          {/* Informations supplémentaires */}
          <div className="px-6 pb-6">
            <div className="bg-sepia-50 rounded-lg p-4 border border-sepia-200">
              <h4 className="font-bold text-sm text-heritage-bordeaux mb-2">
                Catégorie
              </h4>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white rounded-md text-sm">
                <span className="w-2 h-2 rounded-full bg-heritage-bordeaux"></span>
                {properties.category.charAt(0).toUpperCase() + properties.category.slice(1)}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-sepia-200 px-6 py-4 bg-white">
          <button
            onClick={onClose}
            className="w-full md:w-auto px-6 py-2 bg-heritage-bordeaux text-white rounded-md hover:bg-heritage-sepia transition-colors font-medium"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}
