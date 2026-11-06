import type { LatLng } from "@/lib/geo";

export type MapMarker = {
  id: string;
  latitude: number;
  longitude: number;
  emoji: string;
  color: string;
  label?: string;
  fresh?: boolean;
};

// Camera target passed as a prop - changing `id` triggers an animation to this point.
// (DOM components don't reliably call methods through a ref, so the map is driven by props.)
export type CameraTarget = LatLng & {
  zoom?: number;
  id: number;
};
