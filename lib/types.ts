// lib/types.ts
import type { Feature, Point, FeatureCollection } from 'geojson';

/** Propriétés custom des points d'intérêt */
export interface PointProperties {
  id: string;
  title: string;
  address: string;
  category: 'urbanisme' | 'architecture' | 'industrie' | 'patrimoine-disparu';
  description: string;

  historical: {
    year: number;
    imageUrl: string;
    source: string;
    archiveReference?: string;
  };

  streetView: {
    latitude: number;
    longitude: number;
    heading?: number;   // 0-360
    pitch?: number;     // -90 to 90
    fov?: number;       // 10-120 (default 90)
  };

  tags?: string[];
}

/** Feature GeoJSON typé */
export type PointFeature = Feature<Point, PointProperties>;

/** Collection complète */
export type PointCollection = FeatureCollection<Point, PointProperties>;
