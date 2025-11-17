/**
 * Génère une URL pour l'API Google Street View Static
 * @see https://developers.google.com/maps/documentation/streetview/overview
 */
export function getStreetViewStaticUrl(
  lat: number,
  lng: number,
  heading: number,
  pitch: number,
  fov: number = 90,
  width: number = 640,
  height: number = 480
): string {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    console.error('NEXT_PUBLIC_GOOGLE_MAPS_API_KEY not found in environment variables');
    // Fallback : retourner une URL placeholder (évite les crashes)
    return `https://via.placeholder.com/${width}x${height}/8B4513/FFFAED?text=Street+View+Unavailable`;
  }

  const params = new URLSearchParams({
    size: `${width}x${height}`,
    location: `${lat},${lng}`,
    heading: heading.toString(),
    pitch: pitch.toString(),
    fov: fov.toString(),
    key: apiKey,
  });

  return `https://maps.googleapis.com/maps/api/streetview?${params.toString()}`;
}

/**
 * Génère un lien vers Google Maps Street View interactif
 */
export function getStreetViewInteractiveUrl(
  lat: number,
  lng: number,
  heading: number,
  pitch: number,
  fov: number = 90
): string {
  const params = new URLSearchParams({
    api: '1',
    map_action: 'pano',
    viewpoint: `${lat},${lng}`,
    heading: heading.toString(),
    pitch: pitch.toString(),
    fov: fov.toString(),
  });

  return `https://www.google.com/maps/@?${params.toString()}`;
}
