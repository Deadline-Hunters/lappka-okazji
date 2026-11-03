"use dom";

import type { DOMProps } from "expo/dom";
import type maplibregl from "maplibre-gl";
import { useEffect, useRef, useState } from "react";

import type { LatLng } from "@/lib/geo";

import type { CameraTarget, MapMarker } from "./types";

// Komponent DOM (Expo "use dom"): ten plik działa w WebView na mobile i jako zwykły komponent na webie.
// Mapa: MapLibre GL JS + wektorowe kafelki OpenFreeMap (dane OSM, bez klucza i limitów).
// Atrybucję (OpenFreeMap, OpenMapTiles, OpenStreetMap) MapLibre dodaje automatycznie ze stylu.
const STYLE_URL = "https://tiles.openfreemap.org/styles/bright";

// MapLibre ładujemy z CDN zamiast bundlować przez Metro: Babel wstrzykuje helpery do kodu biblioteki,
// a MapLibre tworzy z tego kodu Web Workera (blob), w którym helperów nie ma -> kafelki się nie rysują.
// Paczka npm "maplibre-gl" jest w projekcie tylko dla typów.
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

type Props = {
  initialCenter: LatLng;
  initialZoom?: number;
  markers: MapMarker[];
  userLocation: LatLng | null;
  selectedMarkerId: string | null;
  camera: CameraTarget | null;
  onMarkerPress: (id: string) => Promise<void>;
  onMapPress: () => Promise<void>;
  onOpenUrl: (url: string) => Promise<void>;
  dom?: DOMProps;
};

const CSS = `
  html, body, #root { margin: 0; padding: 0; width: 100%; height: 100%; overflow: hidden; }
  .map { position: fixed; inset: 0; }
  .marker { display: flex; flex-direction: column; align-items: center; cursor: pointer; }
  .pin {
    position: relative; width: 38px; height: 38px; border-radius: 50%;
    background: var(--c); border: 3px solid #fff; box-shadow: 0 2px 6px rgba(0,0,0,.3);
    display: flex; align-items: center; justify-content: center; font-size: 19px;
    transition: transform .15s ease-out;
  }
  .pin::after {
    content: ""; position: absolute; bottom: -9px; left: 50%; transform: translateX(-50%);
    border-left: 6px solid transparent; border-right: 6px solid transparent; border-top: 8px solid #fff;
  }
  .marker--selected .pin { transform: scale(1.25); }
  .marker--selected { z-index: 1; }
  .marker--fresh .pin::before {
    content: ""; position: absolute; inset: -6px; border-radius: 50%;
    border: 3px solid var(--c); opacity: .6; animation: pulse 1.6s ease-out infinite;
  }
  .label {
    margin-top: 10px; padding: 2px 6px; border-radius: 999px; background: #1e1b24; color: #fff;
    font: 600 11px/1.3 -apple-system, system-ui, sans-serif; white-space: nowrap;
  }
  .me { position: relative; width: 18px; height: 18px; border-radius: 50%; background: #2f6fde; border: 3px solid #fff; box-shadow: 0 0 4px rgba(0,0,0,.35); }
  .me::before {
    content: ""; position: absolute; inset: -12px; border-radius: 50%;
    background: rgba(47,111,222,.25); animation: pulse 2s ease-out infinite;
  }
  @keyframes pulse { from { transform: scale(.6); opacity: .8; } to { transform: scale(1.6); opacity: 0; } }
`;

function createMarkerElement(marker: MapMarker) {
  const root = document.createElement("div");
  root.className = "marker" + (marker.fresh ? " marker--fresh" : "");

  const pin = document.createElement("div");
  pin.className = "pin";
  pin.style.setProperty("--c", marker.color);
  pin.textContent = marker.emoji;
  root.appendChild(pin);

  if (marker.label) {
    const label = document.createElement("div");
    label.className = "label";
    label.textContent = marker.label;
    root.appendChild(label);
  }

  return root;
}

export default function DealsMap({
  initialCenter,
  initialZoom = 15,
  markers,
  userLocation,
  selectedMarkerId,
  camera,
  onMarkerPress,
  onMapPress,
  onOpenUrl,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  // Mapa w stanie (nie w refie), żeby efekty markerów/kamery uruchomiły się, gdy MapLibre się załaduje.
  const [lib, setLib] = useState<MapLibre | null>(null);
  const [map, setMap] = useState<maplibregl.Map | null>(null);
  const markerRefs = useRef(
    new Map<string, { marker: maplibregl.Marker; element: HTMLElement }>(),
  );
  const userMarkerRef = useRef<maplibregl.Marker | null>(null);

  // Callbacki w refie, żeby handlery mapy nie musiały się przepinać przy każdym renderze.
  const callbacks = useRef({ onMarkerPress, onMapPress, onOpenUrl });
  callbacks.current = { onMarkerPress, onMapPress, onOpenUrl };

  useEffect(() => {
    let cancelled = false;
    let created: maplibregl.Map | null = null;

    // Linki (np. atrybucja) otwieramy w przeglądarce - nawigacja w WebView podmieniłaby mapę.
    function handleLinkClick(event: MouseEvent) {
      const link = (event.target as Element | null)?.closest?.("a");
      if (link && link.href.startsWith("http")) {
        event.preventDefault();
        void callbacks.current.onOpenUrl(link.href);
      }
    }
    document.addEventListener("click", handleLinkClick, true);

    loadMapLibre()
      .then((maplibre) => {
        if (cancelled || !containerRef.current) {
          return;
        }
        created = new maplibre.Map({
          container: containerRef.current,
          style: STYLE_URL,
          center: [initialCenter.longitude, initialCenter.latitude],
          zoom: initialZoom,
          attributionControl: { compact: false },
        });
        created.on("click", (event) => {
          // Klik w marker obsługuje sam marker.
          if (
            (event.originalEvent.target as Element | null)?.closest?.(".marker")
          ) {
            return;
          }
          void callbacks.current.onMapPress();
        });
        created.on("error", (event) => {
          console.warn(
            "[DealsMap] map error:",
            (event.error as Error | undefined)?.message,
          );
        });

        const map = created;
        // Styl domyślnie pokazuje nazwy angielskie ("Krakow", "Cloth Hall") - wolimy polskie.
        map.on("style.load", () => {
          for (const layer of map.getStyle().layers) {
            if (
              layer.type === "symbol" &&
              map.getLayoutProperty(layer.id, "text-field")
            ) {
              map.setLayoutProperty(layer.id, "text-field", [
                "coalesce",
                ["get", "name:pl"],
                ["get", "name"],
              ]);
            }
          }
        });
        // Część ikon ze stylu OpenFreeMap nie istnieje w jego sprite - wstawiamy pusty obrazek,
        // żeby nie zalewać logów ostrzeżeniami.
        map.on("styleimagemissing", (event) => {
          if (!map.hasImage(event.id)) {
            map.addImage(event.id, {
              width: 1,
              height: 1,
              data: new Uint8Array(4),
            });
          }
        });

        setLib(maplibre);
        setMap(created);
      })
      .catch((error: Error) => console.error("[DealsMap]", error.message));

    return () => {
      cancelled = true;
      document.removeEventListener("click", handleLinkClick, true);
      created?.remove();
    };
    // Mapę tworzymy raz; początkowy środek i zoom są potrzebne tylko przy starcie.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!map || !lib) return;

    markerRefs.current.forEach(({ marker }) => marker.remove());
    markerRefs.current.clear();

    for (const data of markers) {
      const element = createMarkerElement(data);
      element.addEventListener("click", (event) => {
        event.stopPropagation();
        void callbacks.current.onMarkerPress(data.id);
      });
      const marker = new lib.Marker({
        element,
        anchor: "bottom",
        offset: [0, 18],
      })
        .setLngLat([data.longitude, data.latitude])
        .addTo(map);
      markerRefs.current.set(data.id, { marker, element });
    }
  }, [map, lib, markers]);

  useEffect(() => {
    markerRefs.current.forEach(({ element }, id) => {
      element.classList.toggle("marker--selected", id === selectedMarkerId);
    });
  }, [map, markers, selectedMarkerId]);

  useEffect(() => {
    if (!map || !lib) return;

    if (!userLocation) {
      userMarkerRef.current?.remove();
      userMarkerRef.current = null;
      return;
    }

    const lngLat: [number, number] = [
      userLocation.longitude,
      userLocation.latitude,
    ];
    if (userMarkerRef.current) {
      userMarkerRef.current.setLngLat(lngLat);
    } else {
      const element = document.createElement("div");
      element.className = "me";
      userMarkerRef.current = new lib.Marker({ element })
        .setLngLat(lngLat)
        .addTo(map);
    }
  }, [map, lib, userLocation]);

  useEffect(() => {
    if (!map || !camera) return;

    map.flyTo({
      center: [camera.longitude, camera.latitude],
      zoom: camera.zoom ?? map.getZoom(),
      duration: 600,
    });
    // Animujemy tylko przy nowym celu (nowe id) albo gdy mapa właśnie powstała.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, camera?.id]);

  return (
    <>
      <style>{CSS}</style>
      <div ref={containerRef} className="map" />
    </>
  );
}
