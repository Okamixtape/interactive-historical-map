'use client';

import { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import InteractiveMap from '@/components/map/InteractiveMap';
import Sidebar from '@/components/layout/Sidebar';
import pointsData from '@/data/points.json';
import type { PointFeature, PointCollection } from '@/lib/types';

// Dynamic import pour code splitting et éviter les erreurs SSR
const PointModal = dynamic(() => import('@/components/modal/PointModal'), {
  ssr: false,
});

type CategoryFilter = 'all' | 'urbanisme' | 'architecture' | 'industrie' | 'patrimoine-disparu';

export default function HomePage() {
  const [selectedPoint, setSelectedPoint] = useState<PointFeature | null>(null);
  const [hoveredPointId, setHoveredPointId] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<CategoryFilter>('all');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [pointIdToOpenPopup, setPointIdToOpenPopup] = useState<string | null>(null);
  const points = (pointsData as PointCollection).features;

  // Filtrer les points selon la catégorie active
  const filteredPoints = activeFilter === 'all'
    ? points
    : points.filter(p => p.properties.category === activeFilter);

  // Handler pour le clic sur carte sidebar - ouvre la popup (nouveau flux UX)
  const handleSidebarClick = useCallback((poiId: string) => {
    setPointIdToOpenPopup(poiId);
    // Reset après un court délai pour permettre de cliquer à nouveau sur la même carte
    setTimeout(() => setPointIdToOpenPopup(null), 100);
  }, []);

  return (
    <main className="relative">
      {/* Sidebar avec header intégré - passe tous les points pour les counts */}
      <Sidebar
        points={points}
        onPOISelect={handleSidebarClick}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        selectedPointId={selectedPoint?.properties.id}
        onHoverPoint={setHoveredPointId}
        isTransitioning={isTransitioning}
      />

      {/* Map */}
      <div
        role="region"
        aria-label="Carte interactive de Limoges"
        className="w-full h-screen"
      >
        <InteractiveMap
          points={points}
          onPointSelect={setSelectedPoint}
          hoveredPointId={hoveredPointId}
          onTransitionStateChange={setIsTransitioning}
          selectedPoint={selectedPoint}
          onHoverPoint={setHoveredPointId}
          activeFilter={activeFilter}
          pointIdToOpenPopup={pointIdToOpenPopup}
        />
      </div>

      {/* Modal */}
      {selectedPoint && (
        <PointModal 
          point={selectedPoint} 
          onClose={() => setSelectedPoint(null)} 
        />
      )}
    </main>
  );
}
