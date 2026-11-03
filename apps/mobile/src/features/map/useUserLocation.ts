import * as Location from "expo-location";
import { useCallback, useEffect, useState } from "react";

import type { LatLng } from "@/lib/geo";

export type LocationStatus = "loading" | "granted" | "denied" | "unavailable";

// Bez sygnału GPS (np. w budynku) getCurrentPositionAsync potrafi czekać w nieskończoność.
const POSITION_TIMEOUT_MS = 10_000;

function toLatLng(position: Location.LocationObject): LatLng {
  return {
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
  };
}

function withTimeout<T>(promise: Promise<T>, ms: number) {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("timeout")), ms),
    ),
  ]);
}

export function useUserLocation() {
  const [location, setLocation] = useState<LatLng | null>(null);
  const [status, setStatus] = useState<LocationStatus>("loading");

  const refresh = useCallback(async () => {
    try {
      const permission = await Location.requestForegroundPermissionsAsync();

      if (!permission.granted) {
        setStatus("denied");
        return null;
      }

      // Ostatnia znana pozycja jest dostępna od razu - pokazujemy ją, zanim przyjdzie dokładniejsza.
      const lastKnown = await Location.getLastKnownPositionAsync();
      if (lastKnown) {
        setLocation(toLatLng(lastKnown));
        setStatus("granted");
      }

      const position = await withTimeout(
        Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        }),
        POSITION_TIMEOUT_MS,
      );
      const next = toLatLng(position);

      setLocation(next);
      setStatus("granted");
      return next;
    } catch {
      setStatus((current) => (current === "granted" ? current : "unavailable"));
      return null;
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { location, status, refresh };
}
