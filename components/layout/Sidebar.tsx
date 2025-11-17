'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import type { PointFeature } from '@/lib/types';
import { CATEGORIES, type CategoryId } from '@/lib/constants';

type CategoryFilter = CategoryId;

interface SidebarProps {
  points: PointFeature[];
  onPOISelect: (poiId: string) => void;
  activeFilter: CategoryFilter;
  onFilterChange: (filter: CategoryFilter) => void;
  selectedPointId?: string;
  onHoverPoint: (poiId: string | null) => void;
  isTransitioning?: boolean;
}

// Convertir CATEGORIES object en array pour le mapping
const CATEGORIES_ARRAY = Object.entries(CATEGORIES).map(([id, data]) => ({
  id: id as CategoryId,
  ...data
}));

export default function Sidebar({ points, onPOISelect, activeFilter, onFilterChange, selectedPointId, onHoverPoint, isTransitioning = false }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(true);

  // Filtrer les points selon la catégorie active
  const filteredPoints = useMemo(() => {
    if (activeFilter === 'all') return points;
    return points.filter(p => p.properties.category === activeFilter);
  }, [points, activeFilter]);

  // Compter les POI par catégorie
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: points.length };
    points.forEach(p => {
      const cat = p.properties.category;
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return counts;
  }, [points]);

  return (
    <>
      {/* Sidebar */}
      <aside
        role="complementary"
        aria-label="Navigation des points d'intérêt"
        className={`fixed left-0 top-0 h-screen bg-heritage-cream shadow-vintage-lg z-50 transition-transform duration-300 ease-in-out border-r-2 border-heritage-gold/30 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } w-80 lg:w-96 flex flex-col`}
      >
        {/* Header */}
        <header className="px-6 py-5 bg-heritage-bordeaux text-heritage-cream border-b-2 border-heritage-gold/40">
          <h1 className="text-xl font-serif font-bold leading-tight tracking-wide">
            Carte Patrimoniale de Limoges
          </h1>
          <p className="text-xs opacity-90 mt-1.5 font-serif italic">
            Comparez le passé et le présent de la ville
          </p>
        </header>

        {/* Filtres */}
        <nav aria-label="Filtres par catégorie" className="px-4 py-4 border-b border-heritage-gold/20">
          <h2 className="text-sm font-serif font-bold text-heritage-bordeaux mb-3">
            Filtrer par thème
          </h2>
          <div role="group" aria-label="Boutons de filtrage" className="flex flex-wrap gap-2">
            {CATEGORIES_ARRAY.map(category => {
              const count = categoryCounts[category.id] || 0;
              const isActive = activeFilter === category.id;
              const isEmpty = count === 0 && category.id !== 'all';

              return (
                <button
                  key={category.id}
                  onClick={() => !isEmpty && onFilterChange(category.id)}
                  disabled={isEmpty}
                  aria-pressed={isActive}
                  aria-label={`Filtrer par ${category.label} (${count} point${count > 1 ? 's' : ''})`}
                  className={`
                    flex items-center gap-2 px-3 py-2 rounded text-sm font-medium
                    transition-all duration-200 border
                    ${isActive
                      ? 'bg-heritage-bordeaux text-heritage-cream shadow-vintage border-heritage-gold/50'
                      : isEmpty
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200'
                      : 'bg-white text-heritage-ink hover:bg-heritage-cream hover:shadow-vintage border-heritage-gold/20'
                    }
                  `}
                >
                  <span className="text-lg">{category.emoji}</span>
                  <span className="font-medium">{category.label}</span>
                  <span className={`ml-auto text-sm font-bold ${
                    isActive ? 'text-heritage-cream' : 'text-heritage-bordeaux'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* Liste des POI */}
        <section aria-label="Liste des points d'intérêt" className="flex-1 overflow-y-auto">
          <div className="px-4 py-3">
            <h2 id="poi-list-heading" className="text-sm font-serif font-bold text-heritage-bordeaux mb-3">
              {activeFilter === 'all' 
                ? `Tous les lieux (${filteredPoints.length})`
                : CATEGORIES_ARRAY.find(c => c.id === activeFilter)?.label || 'Lieux'
              }
            </h2>
            <ul role="list" aria-labelledby="poi-list-heading" className="space-y-3">
              {filteredPoints.map((point, index) => {
                const category = CATEGORIES_ARRAY.find(c => c.id === point.properties.category);
                // Précharger seulement la première image pour éviter surcharge mémoire
                const isPriority = index === 0;
                // Vérifier si ce POI est sélectionné (ouvert dans la modal)
                const isSelected = selectedPointId === point.properties.id;
                
                return (
                  <li key={point.properties.id}>
                    <button
                      onClick={() => onPOISelect(point.properties.id)}
                      onMouseEnter={() => onHoverPoint(point.properties.id)}
                      onMouseLeave={() => onHoverPoint(null)}
                      aria-label={`Voir ${point.properties.title}, ${point.properties.historical.year}`}
                      aria-pressed={isSelected}
                      className={`w-full text-left bg-white rounded overflow-hidden cursor-pointer transition-all duration-200 group ${
                        isSelected 
                          ? 'border-2 border-heritage-bordeaux ring-2 ring-heritage-bordeaux/30' 
                          : 'border-2 border-heritage-gold/20'
                      }`}
                    >
                    {/* Thumbnail */}
                    <div className="relative w-full aspect-[4/3] bg-sepia-100 overflow-hidden">
                      <Image
                        src={point.properties.historical.imageUrl}
                        alt={point.properties.title}
                        fill
                        className={`object-cover ${!isTransitioning ? 'group-hover:scale-105 transition-transform duration-300' : ''}`}
                        sizes="(max-width: 1023px) 320px, 384px"
                        quality={50}
                        loading={isPriority ? undefined : "lazy"}
                        priority={isPriority}
                        unoptimized={false}
                      />
                    </div>

                    {/* Infos */}
                    <div className="p-3">
                      <h3 className={`font-serif font-semibold text-base text-heritage-ink line-clamp-2 mb-2 ${!isTransitioning ? 'group-hover:text-heritage-bordeaux transition-colors' : ''}`}>
                        {point.properties.title}
                      </h3>
                      <div className="space-y-1">
                        <p className="text-sm font-serif font-bold text-heritage-bordeaux flex items-center gap-1.5">
                          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {point.properties.historical.year}
                        </p>
                        <p className="text-xs text-heritage-ink/80 truncate">
                          📍 {point.properties.address}
                        </p>
                      </div>
                    </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        {/* Footer */}
        <footer className="px-4 py-3 border-t-2 border-heritage-gold/30 bg-heritage-cream/50">
          <p className="text-xs font-serif italic text-heritage-ink/60 text-center">
            Archives : Haute-Vienne
          </p>
        </footer>
      </aside>

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          fixed top-4 z-50 bg-heritage-cream shadow-vintage border-2 border-heritage-gold/40 rounded-r px-3 py-3
          hover:bg-white hover:shadow-vintage-lg transition-all duration-300
          ${isOpen ? 'left-80 lg:left-96' : 'left-0'}
        `}
        aria-label={isOpen ? 'Fermer la sidebar' : 'Ouvrir la sidebar'}
      >
        <svg
          className="w-5 h-5 text-heritage-bordeaux"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {isOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          )}
        </svg>
      </button>

      {/* Overlay mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
