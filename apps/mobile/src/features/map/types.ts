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

// The user's answer to "is the deal still there?" - kept locally until voting is saved in the database (KAN-17).
export type Vote = "up" | "down";

// Camera target passed as a prop - changing `id` triggers an animation to this point,
// or, when `bounds` is set, to a view that fits the whole area.
// (DOM components don't reliably call methods through a ref, so the map is driven by props.)
export type CameraTarget = LatLng & {
  zoom?: number;
  bounds?: { southWest: LatLng; northEast: LatLng };
  id: number;
};
