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

  const embedUrl = `https://www.google.com/maps/embed/v1/streetview?key=${apiKey}&location=${latitude},${longitude}&heading=${heading}&pitch=${pitch}&fov=${fov}`;

  return (
    <iframe
      src={embedUrl}
      className="w-full h-full border-0"
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      title="Google Street View"
      allow="fullscreen"
    />
  );
}
