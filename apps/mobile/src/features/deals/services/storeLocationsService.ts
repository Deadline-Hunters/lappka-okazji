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

// Seed store locations in Kraków (matches initial database seed data for local/offline dev)
const FALLBACK_STORES: StoreLocation[] = [
  {
    id: "10000000-0000-0000-0000-000000000001",
    name: "Żabka",
    address: "Rynek Główny 14",
    latitude: 50.0624,
    longitude: 19.9385,
  },
  {
    id: "10000000-0000-0000-0000-000000000002",
    name: "Biedronka",
    address: "ul. Floriańska 32",
    latitude: 50.0638,
    longitude: 19.9398,
  },
  {
    id: "10000000-0000-0000-0000-000000000003",
    name: "Ksero Pod Palmą",
    address: "ul. Karmelicka 5",
    latitude: 50.064,
    longitude: 19.9315,
  },
  {
    id: "10000000-0000-0000-0000-000000000004",
    name: "Piekarnia Pawlak",
    address: "ul. Szewska 8",
    latitude: 50.0619,
    longitude: 19.9348,
  },
  {
    id: "10000000-0000-0000-0000-000000000005",
    name: "Kino Pod Baranami",
    address: "Rynek Główny 27",
    latitude: 50.0612,
    longitude: 19.9356,
  },
  {
    id: "10000000-0000-0000-0000-000000000006",
    name: "Media Expert",
    address: "ul. Floriańska 12",
    latitude: 50.0645,
    longitude: 19.9399,
  },
  {
    id: "10000000-0000-0000-0000-000000000007",
    name: "Pizzeria Trattoria",
    address: "ul. Mikołajska 4",
    latitude: 50.063,
    longitude: 19.936,
  },
  {
    id: "10000000-0000-0000-0000-000000000008",
    name: "Awiteks",
    address: "ul. Grodzka 12",
    latitude: 50.0576,
    longitude: 19.9375,
  },
  {
    id: "10000000-0000-0000-0000-000000000009",
    name: "Empik",
    address: "Rynek Główny 5",
    latitude: 50.0615,
    longitude: 19.9365,
  },
  {
    id: "10000000-0000-0000-0000-000000000010",
    name: "Rossmann",
    address: "ul. Karmelicka 18",
    latitude: 50.0652,
    longitude: 19.9298,
  },
];

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
 * Attempts Supabase RPC first, then fallback to local seed data.
 */
export async function getNearbyStores(
  center: LatLng = DEFAULT_CENTER,
  radiusMeters = 5000,
): Promise<StoreLocation[]> {
  try {
    const { data, error } = await supabase.rpc("locations_near", {
      p_latitude: center.latitude,
      p_longitude: center.longitude,
      p_radius_m: radiusMeters,
      p_limit: 50,
    });

    if (!error && Array.isArray(data) && data.length > 0) {
      return (data as LocationRpcRow[]).map((item) => ({
        id: item.id,
        name: item.name,
        address: item.address ?? undefined,
        latitude: item.latitude,
        longitude: item.longitude,
        distanceMeters: Math.round(item.distance_m),
      }));
    }
  } catch (err) {
    console.warn(
      "[storeLocationsService] RPC locations_near unavailable:",
      err,
    );
  }

  // Graceful fallback for offline dev/mock
  return FALLBACK_STORES.map((store) => {
    const distance = distanceInMeters(center, {
      latitude: store.latitude,
      longitude: store.longitude,
    });
    return {
      ...store,
      distanceMeters: Math.round(distance),
    };
  }).sort((a, b) => (a.distanceMeters ?? 0) - (b.distanceMeters ?? 0));
}
