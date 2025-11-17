'use client';

import { useEffect, useCallback, useState } from 'react';
import type { PointFeature } from '@/lib/types';
import { getCategoryEmoji, getCategoryLabel } from '@/lib/constants';
import { ImageComparisonSlider } from './ImageComparisonSlider';
import Image from 'next/image';

interface Props {
  point: PointFeature;
  onClose: () => void;
}

export default function PointModal({ point, onClose }: Props) {
  const [isClosing, setIsClosing] = useState(false);

  // Fermer avec animation
  const handleClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 200); // Durée de l'animation
  }, [onClose]);

  // Fermer avec la touche Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    // Désactiver le scroll du body
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [handleClose]);

  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  }, [handleClose]);

  const { properties } = point;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 transition-opacity duration-200 ${
        isClosing ? 'opacity-0' : 'opacity-100'
      }`}
      onClick={handleBackdropClick}
    >
      <div className={`bg-heritage-cream w-full max-w-6xl max-h-[90vh] rounded border-2 border-heritage-gold/40 shadow-vintage-lg overflow-hidden flex flex-col transition-transform duration-200 ${
        isClosing ? 'scale-95' : 'scale-100'
      }`}>
        {/* Header */}
        <header className="bg-heritage-bordeaux text-heritage-cream px-6 py-5 border-b-2 border-heritage-gold/40">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl" aria-hidden="true">{getCategoryEmoji(properties.category)}</span>
                <div>
                  <h2 id="modal-title" className="text-2xl font-serif font-bold leading-tight">
                    {properties.title}
                  </h2>
                  <p className="text-sm opacity-90 mt-1 font-serif italic">{properties.address}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-heritage-cream/20 rounded border border-heritage-gold/30">
                  <span className="font-serif font-medium">{getCategoryLabel(properties.category)}</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-heritage-cream/20 rounded border border-heritage-gold/30">
                  <span className="font-serif font-medium">{properties.historical.year}</span>
                </span>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="flex-shrink-0 text-heritage-cream hover:text-heritage-gold transition-colors p-2 rounded hover:bg-heritage-cream/10"
              aria-label="Fermer la modal"
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
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Description */}
          <section className="px-6 py-5 border-b-2 border-heritage-gold/20 bg-white">
            <p className="text-heritage-ink leading-relaxed font-serif">{properties.description}</p>
            {properties.tags && properties.tags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {properties.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-heritage-cream border border-heritage-gold/30 text-heritage-ink text-xs font-serif rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </section>

          {/* Comparaison Images */}
          <section className="p-6 bg-heritage-cream/30">
            <ImageComparisonSlider point={point} />
          </section>

        </div>

        {/* Footer */}
        <footer className="border-t-2 border-heritage-gold/30 px-6 py-4 bg-white flex items-center justify-between">
          <p className="text-xs font-serif italic text-heritage-ink/60">
            Comparez le passé et le présent de Limoges
          </p>
          <button
            onClick={handleClose}
            className="px-6 py-2.5 bg-heritage-bordeaux text-heritage-cream rounded border-2 border-heritage-gold/40 hover:bg-heritage-ink hover:shadow-vintage-lg transition-all font-serif font-medium"
          >
            Fermer
          </button>
        </footer>
      </div>
    </div>
  );
}
