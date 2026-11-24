"use dom";

import type { DOMProps } from "expo/dom";
import type maplibregl from "maplibre-gl";
import { useEffect, useRef, useState } from "react";

import type { LatLng } from "@/lib/geo";
import type { StoreLocation } from "../services/storeLocationsService";

const STYLE_URL = "https://tiles.openfreemap.org/styles/bright";
const MAPLIBRE_VERSION = "5.24.0";
const MAPLIBRE_JS = `https://unpkg.com/maplibre-gl@${MAPLIBRE_VERSION}/dist/maplibre-gl.js`;
const MAPLIBRE_JS_SRI =
  "sha384-5+cfbwT0iiub6VsQAdn6yz16nr6sDiQoHx6tm4O8OVYXHYOxcffFmCJBL0dgdvGp";
const MAPLIBRE_CSS = `https://unpkg.com/maplibre-gl@${MAPLIBRE_VERSION}/dist/maplibre-gl.css`;
const MAPLIBRE_CSS_SRI =
  "sha384-uTttxo/aOKbdE5RlD/SPzSDoDmNvGlUYPjONi2MN/b7c9HPSvW07OIuyP7uL6jxK";

type MapLibre = typeof maplibregl;

declare global {
  interface Window {
    maplibregl?: MapLibre;
  }
}

function loadMapLibre(): Promise<MapLibre> {
  if (window.maplibregl) return Promise.resolve(window.maplibregl);

  return new Promise((resolve, reject) => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = MAPLIBRE_CSS;
    link.integrity = MAPLIBRE_CSS_SRI;
    link.crossOrigin = "anonymous";
    document.head.appendChild(link);

    const script = document.createElement("script");
    script.src = MAPLIBRE_JS;
    script.integrity = MAPLIBRE_JS_SRI;
    script.crossOrigin = "anonymous";
    script.onload = () =>
      window.maplibregl
        ? resolve(window.maplibregl)
        : reject(new Error("MapLibre not found"));
    script.onerror = () => reject(new Error("Failed to load MapLibre"));
    document.head.appendChild(script);
  });
}

const CSS = `
  html, body, #root { margin: 0; padding: 0; width: 100%; height: 100%; overflow: hidden; }
  .map { position: fixed; inset: 0; }
  .pin-marker {
    width: 36px; height: 36px; border-radius: 50% 50% 50% 0;
    transform: rotate(-45deg);
    background: #D2733A; border: 3px solid #fff;
    box-shadow: 0 4px 10px rgba(0,0,0,.35);
    cursor: grab; display: flex; align-items: center; justify-content: center;
  }
  .pin-marker:active { cursor: grabbing; transform: rotate(-45deg) scale(1.1); }
  .pin-icon { transform: rotate(45deg); font-size: 16px; line-height: 1; }
  .store-pin {
    padding: 3px 8px; border-radius: 12px;
    background: #25232A; color: #fff; font-size: 11px; font-weight: 600;
    font-family: sans-serif; border: 2px solid #fff;
    box-shadow: 0 2px 6px rgba(0,0,0,.25); cursor: pointer;
    white-space: nowrap; max-width: 110px; overflow: hidden; text-overflow: ellipsis;
  }
  .store-pin--selected { background: #E07B1A; border-color: #fff; transform: scale(1.1); }
  .me {
    width: 14px; height: 14px; border-radius: 50%;
    background: #2F6FDE; border: 3px solid #fff;
    box-shadow: 0 0 0 2px rgba(47,111,222,.4), 0 2px 6px rgba(0,0,0,.3);
  }
`;

type Props = {
  initialCenter: LatLng;
  selectedLocation: LatLng;
  stores: StoreLocation[];
  selectedStoreId: string | null;
  userLocation: LatLng | null;
  onLocationChange: (location: LatLng) => Promise<void>;
  onStoreSelect: (storeId: string) => Promise<void>;
  dom?: DOMProps;
};

export default function LocationPickerMap({
  initialCenter,
  selectedLocation,
  stores,
  selectedStoreId,
  userLocation,
  onLocationChange,
  onStoreSelect,
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [map, setMap] = useState<maplibregl.Map | null>(null);
  const [lib, setLib] = useState<MapLibre | null>(null);

  const callbacks = useRef({ onLocationChange, onStoreSelect });
  callbacks.current = { onLocationChange, onStoreSelect };

  const pinMarkerRef = useRef<maplibregl.Marker | null>(null);
  const userMarkerRef = useRef<maplibregl.Marker | null>(null);
  const storeMarkerRefs = useRef<Map<string, maplibregl.Marker>>(new Map());

  // Initialize MapLibre
  useEffect(() => {
    let cancelled = false;
    let created: maplibregl.Map | null = null;

    loadMapLibre()
      .then((maplibre) => {
        if (cancelled || !containerRef.current) return;

        created = new maplibre.Map({
          container: containerRef.current,
          style: STYLE_URL,
          center: [initialCenter.longitude, initialCenter.latitude],
          zoom: 16,
          attributionControl: { compact: true },
        });

        created.on("click", (event) => {
          // If clicked a store pin, store click event handles it
          const isStore = (
            event.originalEvent.target as Element | null
          )?.closest?.(".store-pin");
          if (isStore) return;

          const lat = event.lngLat.lat;
          const lng = event.lngLat.lng;
          void callbacks.current.onLocationChange({
            latitude: lat,
            longitude: lng,
          });
        });

        const mapInstance = created;
        mapInstance.on("style.load", () => {
          for (const layer of mapInstance.getStyle().layers) {
            if (
              layer.type === "symbol" &&
              mapInstance.getLayoutProperty(layer.id, "text-field")
            ) {
              mapInstance.setLayoutProperty(layer.id, "text-field", [
                "coalesce",
                ["get", "name:pl"],
                ["get", "name"],
              ]);
            }
          }
        });

        mapInstance.on("styleimagemissing", (event) => {
          if (!mapInstance.hasImage(event.id)) {
            mapInstance.addImage(event.id, {
              width: 1,
              height: 1,
              data: new Uint8Array(4),
            });
          }
        });

        setLib(maplibre);
        setMap(mapInstance);
      })
      .catch((err: Error) =>
        console.error("[LocationPickerMap] Failed to load:", err.message),
      );

    return () => {
      cancelled = true;
      created?.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update Deal Pin (Draggable)
  useEffect(() => {
    if (!map || !lib) return;

    if (!pinMarkerRef.current) {
      const pinEl = document.createElement("div");
      pinEl.className = "pin-marker";
      pinEl.innerHTML = '<span class="pin-icon">📍</span>';

      const marker = new lib.Marker({
        element: pinEl,
        draggable: true,
        anchor: "bottom",
      })
        .setLngLat([selectedLocation.longitude, selectedLocation.latitude])
        .addTo(map);

      marker.on("dragend", () => {
        const lngLat = marker.getLngLat();
        void callbacks.current.onLocationChange({
          latitude: lngLat.lat,
          longitude: lngLat.lng,
        });
      });

      pinMarkerRef.current = marker;
    } else {
      pinMarkerRef.current.setLngLat([
        selectedLocation.longitude,
        selectedLocation.latitude,
      ]);
    }
  }, [map, lib, selectedLocation]);

  // Update User Location Dot
  useEffect(() => {
    if (!map || !lib) return;

    if (!userLocation) {
      userMarkerRef.current?.remove();
      userMarkerRef.current = null;
      return;
    }

    if (!userMarkerRef.current) {
      const el = document.createElement("div");
      el.className = "me";
      userMarkerRef.current = new lib.Marker({ element: el })
        .setLngLat([userLocation.longitude, userLocation.latitude])
        .addTo(map);
    } else {
      userMarkerRef.current.setLngLat([
        userLocation.longitude,
        userLocation.latitude,
      ]);
    }
  }, [map, lib, userLocation]);

  // Update Store Pins
  useEffect(() => {
    if (!map || !lib) return;

    storeMarkerRefs.current.forEach((marker) => marker.remove());
    storeMarkerRefs.current.clear();

    for (const store of stores) {
      const el = document.createElement("div");
      el.className = `store-pin ${store.id === selectedStoreId ? "store-pin--selected" : ""}`;
      el.textContent = store.name;
      el.title = store.address
        ? `${store.name} (${store.address})`
        : store.name;

      el.addEventListener("click", (e) => {
        e.stopPropagation();
        void callbacks.current.onStoreSelect(store.id);
      });

      const marker = new lib.Marker({ element: el, anchor: "bottom" })
        .setLngLat([store.longitude, store.latitude])
        .addTo(map);

      storeMarkerRefs.current.set(store.id, marker);
    }
  }, [map, lib, stores, selectedStoreId]);

  return (
    <>
      <style>{CSS}</style>
      <div ref={containerRef} className="map" />
    </>
  );
}
