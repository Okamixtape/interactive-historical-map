'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import InteractiveMap from '@/components/map/InteractiveMap';
import pointsData from '@/data/points.json';
import type { PointFeature, PointCollection } from '@/lib/types';

// Dynamic import pour code splitting et éviter les erreurs SSR
const PointModal = dynamic(() => import('@/components/modal/PointModal'), {
  ssr: false,
});

export default function HomePage() {
  const [selectedPoint, setSelectedPoint] = useState<PointFeature | null>(null);
  const points = (pointsData as PointCollection).features;

  return (
    <main className="relative">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-10 bg-heritage-bordeaux/95 backdrop-blur-sm text-white px-6 py-4 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold">Carte Patrimoniale de Limoges</h1>
          <p className="text-sm opacity-90 mt-1">
            Comparez le passé et le présent de la ville
          </p>
        </div>
      </header>

      {/* Map */}
      <div className="w-full h-screen pt-20">
        <InteractiveMap points={points} onPointSelect={setSelectedPoint} />
      </div>

      {/* Modal */}
      {selectedPoint && (
        <PointModal point={selectedPoint} onClose={() => setSelectedPoint(null)} />
      )}
    </main>
  );
}
