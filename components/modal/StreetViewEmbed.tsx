'use client';

interface Props {
  latitude: number;
  longitude: number;
  heading?: number;
  pitch?: number;
  fov?: number;
}

export function StreetViewEmbed({
  latitude,
  longitude,
  heading = 0,
  pitch = 0,
  fov = 90
}: Props) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';
  
  // Vérifier que l'API key est présente
  if (!apiKey) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-600 text-sm font-serif">
        API Google Maps non configurée
      </div>
    );
  }

  // Construire l'URL de l'API Embed officielle
  const baseUrl = 'https://www.google.com/maps/embed/v1/streetview';
  const params = new URLSearchParams({
    key: apiKey,
    location: `${latitude},${longitude}`,
    heading: heading.toString(),
    pitch: pitch.toString(),
    fov: fov.toString(),
  });
  const embedUrl = `${baseUrl}?${params.toString()}`;

  return (
    <iframe
      src={embedUrl}
      className="w-full h-full border-0"
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      title="Google Street View"
      allow="accelerometer; gyroscope; fullscreen"
    />
  );
}
