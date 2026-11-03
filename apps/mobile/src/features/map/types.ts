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

// Cel kamery przekazywany propsem - zmiana `id` uruchamia animację do tego punktu.
// (DOM components nie wywołują niezawodnie metod przez ref, więc sterujemy mapą propsami.)
export type CameraTarget = LatLng & {
  zoom?: number;
  id: number;
};
