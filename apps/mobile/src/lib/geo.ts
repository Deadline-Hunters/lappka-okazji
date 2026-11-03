export type LatLng = {
  latitude: number;
  longitude: number;
};

// Rynek Główny w Krakowie - domyślny punkt, gdy brak zgody na lokalizację.
export const DEFAULT_CENTER: LatLng = { latitude: 50.0617, longitude: 19.9373 };

const EARTH_RADIUS_M = 6_371_000;

function toRadians(deg: number) {
  return (deg * Math.PI) / 180;
}

export function distanceInMeters(a: LatLng, b: LatLng) {
  const dLat = toRadians(b.latitude - a.latitude);
  const dLng = toRadians(b.longitude - a.longitude);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(a.latitude)) * Math.cos(toRadians(b.latitude)) * Math.sin(dLng / 2) ** 2;

  return 2 * EARTH_RADIUS_M * Math.asin(Math.sqrt(h));
}

export function formatDistance(meters: number) {
  if (meters < 1000) {
    return `${Math.round(meters / 10) * 10} m`;
  }

  return `${(meters / 1000).toFixed(1).replace(".", ",")} km`;
}
