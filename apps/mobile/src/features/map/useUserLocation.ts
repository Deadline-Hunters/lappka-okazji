import * as Location from "expo-location";
import { useCallback, useEffect, useState } from "react";

import type { LatLng } from "@/lib/geo";

export type LocationStatus = "loading" | "granted" | "denied" | "unavailable";

// Without a GPS signal (e.g. indoors) getCurrentPositionAsync can wait forever.
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

      // The last known position is available immediately - show it before a more accurate one arrives.
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
