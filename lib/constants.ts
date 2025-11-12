// lib/constants.ts
export const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

export const INITIAL_VIEW_STATE = {
  longitude: 1.2611,
  latitude: 45.8312,
  zoom: 13,
  pitch: 0,
  bearing: 0
};

export const MAP_STYLE = 'mapbox://styles/mapbox/streets-v12';
