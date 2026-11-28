import { DEFAULT_CENTER, type LatLng } from "@/lib/geo";
import { supabase } from "@/lib/supabase";

export type StoreLocation = {
  id: string;
  name: string;
  address?: string;
  latitude: number;
  longitude: number;
  distanceMeters?: number;
};

/** Fetches nearby stores ordered by proximity to the provided center coordinate. */
export async function getNearbyStores(
  center: LatLng = DEFAULT_CENTER,
  radiusMeters = 5000,
): Promise<StoreLocation[]> {
  const { data, error } = await supabase.rpc("locations_near", {
    p_latitude: center.latitude,
    p_longitude: center.longitude,
    p_radius_m: radiusMeters,
    p_limit: 50,
  });

  if (error) throw error;

  return data.map((item) => ({
    id: item.id,
    name: item.name,
    address: item.address ?? undefined,
    latitude: item.latitude,
    longitude: item.longitude,
    distanceMeters: Math.round(item.distance_m),
  }));
}
