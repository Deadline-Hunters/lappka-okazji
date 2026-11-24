import { DEFAULT_CENTER, distanceInMeters, type LatLng } from "@/lib/geo";
import { supabase } from "@/lib/supabase";

export type StoreLocation = {
  id: string;
  name: string;
  address?: string;
  latitude: number;
  longitude: number;
  distanceMeters?: number;
};

type LocationRpcRow = {
  id: string;
  name: string;
  address: string | null;
  latitude: number;
  longitude: number;
  distance_m: number;
};

/**
 * Fetches nearby stores/locations ordered by proximity to the provided center coordinate.
 * Queries Supabase database directly without offline mock fallback.
 */
export async function getNearbyStores(
  center: LatLng = DEFAULT_CENTER,
  radiusMeters = 5000,
): Promise<StoreLocation[]> {
  try {
    // 1. Try spatial RPC function first
    const { data: rpcData, error: rpcError } = await supabase.rpc(
      "locations_near",
      {
        p_latitude: center.latitude,
        p_longitude: center.longitude,
        p_radius_m: radiusMeters,
        p_limit: 50,
      },
    );

    if (!rpcError && Array.isArray(rpcData)) {
      return (rpcData as LocationRpcRow[]).map((item) => ({
        id: item.id,
        name: item.name,
        address: item.address ?? undefined,
        latitude: item.latitude,
        longitude: item.longitude,
        distanceMeters: Math.round(item.distance_m),
      }));
    }

    // 2. Direct table fallback if RPC is not deployed yet
    const { data: tableData, error: tableError } = await supabase
      .from("locations")
      .select("id, name, address, latitude, longitude")
      .limit(50);

    if (!tableError && Array.isArray(tableData)) {
      return tableData
        .map((loc) => ({
          id: loc.id,
          name: loc.name,
          address: loc.address ?? undefined,
          latitude: loc.latitude,
          longitude: loc.longitude,
          distanceMeters: Math.round(
            distanceInMeters(center, {
              latitude: loc.latitude,
              longitude: loc.longitude,
            }),
          ),
        }))
        .filter(
          (loc) =>
            loc.distanceMeters === undefined ||
            loc.distanceMeters <= radiusMeters,
        )
        .sort((a, b) => (a.distanceMeters ?? 0) - (b.distanceMeters ?? 0));
    }
  } catch (err) {
    console.warn("[storeLocationsService] Failed to fetch stores:", err);
  }

  return [];
}
