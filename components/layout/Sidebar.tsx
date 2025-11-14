'use client';

import { useState, useMemo } from 'react';
import type { PointFeature } from '@/lib/types';

type CategoryFilter = 'all' | 'urbanisme' | 'architecture' | 'industrie' | 'patrimoine-disparu';

interface SidebarProps {
  points: PointFeature[];
  onPOISelect: (poiId: string) => void;
  activeFilter: CategoryFilter;
  onFilterChange: (filter: CategoryFilter) => void;
}

const CATEGORIES = [
  { id: 'all' as const, label: 'Tous', emoji: '📍' },
  { id: 'urbanisme' as const, label: 'Urbanisme', emoji: '🏛️' },
  { id: 'architecture' as const, label: 'Architecture', emoji: '🏗️' },
  { id: 'industrie' as const, label: 'Industrie', emoji: '🏭' },
  { id: 'patrimoine-disparu' as const, label: 'Patrimoine disparu', emoji: '🕰️' },
] as const;

export default function Sidebar({ points, onPOISelect, activeFilter, onFilterChange }: SidebarProps) {
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
          <h2 className="text-xs font-serif font-semibold text-heritage-ink uppercase tracking-widest mb-3">
            Catégories
          </h2>
          <div role="group" aria-label="Boutons de filtrage" className="flex flex-wrap gap-2">
            {CATEGORIES.map(category => {
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
                    flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-medium
                    transition-all duration-200 border
                    ${isActive
                      ? 'bg-heritage-bordeaux text-heritage-cream shadow-vintage border-heritage-gold/50'
                      : isEmpty
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200'
                      : 'bg-white text-heritage-ink hover:bg-heritage-cream hover:shadow-vintage border-heritage-gold/20'
                    }
                  `}
                >
                  <span className="text-base">{category.emoji}</span>
                  <span>{category.label}</span>
                  <span className={`text-xs ${isActive ? 'opacity-90' : 'opacity-60'}`}>
                    ({count})
                  </span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* Liste des POI */}
        <section aria-label="Liste des points d'intérêt" className="flex-1 overflow-y-auto">
          <div className="px-4 py-3">
            <h2 id="poi-list-heading" className="text-xs font-serif font-semibold text-heritage-ink uppercase tracking-widest mb-3">
              Points d'intérêt ({filteredPoints.length})
            </h2>
            <ul role="list" aria-labelledby="poi-list-heading" className="space-y-3">
              {filteredPoints.map(point => {
                const category = CATEGORIES.find(c => c.id === point.properties.category);
                
                return (
                  <li key={point.properties.id}>
                    <button
                      onClick={() => onPOISelect(point.properties.id)}
                      aria-label={`Voir ${point.properties.title}, ${point.properties.historical.year}`}
                      className="w-full text-left bg-white border-2 border-heritage-gold/20 rounded overflow-hidden hover:shadow-vintage-lg hover:border-heritage-gold/50 transition-all duration-200 group"
                    >
                    {/* Thumbnail */}
                    <div className="relative w-full aspect-[4/3] bg-sepia-100 overflow-hidden">
                      <img
                        src={point.properties.historical.imageUrl}
                        alt={point.properties.title}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      {/* Badge catégorie */}
                      <div className="absolute top-2 right-2 bg-white/95 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 shadow-sm">
                        <span>{category?.emoji}</span>
                      </div>
                    </div>

                    {/* Infos */}
                    <div className="p-3">
                      <h3 className="font-serif font-semibold text-sm text-heritage-ink line-clamp-2 group-hover:text-heritage-bordeaux transition-colors">
                        {point.properties.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-1.5 text-xs text-heritage-ink/70">
                        <span className="font-serif font-medium">
                          {point.properties.historical.year}
                        </span>
                        <span>•</span>
                        <span className="truncate">
                          {point.properties.address}
                        </span>
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
