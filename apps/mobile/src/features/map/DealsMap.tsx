"use dom";

import type { DOMProps } from "expo/dom";
import type maplibregl from "maplibre-gl";
import { useEffect, useRef, useState } from "react";

import type { LatLng } from "@/lib/geo";

import type { CameraTarget, MapMarker } from "./types";

// DOM component (Expo "use dom"): this file runs in a WebView on mobile and as a regular component on web.
// Map: MapLibre GL JS + OpenFreeMap vector tiles (OSM data, no API key, no limits).
// MapLibre adds the attribution (OpenFreeMap, OpenMapTiles, OpenStreetMap) automatically from the style.
const STYLE_URL = "https://tiles.openfreemap.org/styles/bright";

// MapLibre is loaded from a CDN instead of bundled by Metro: Babel injects helpers into the library code,
// and MapLibre builds a Web Worker (blob) from that code where the helpers don't exist -> no tiles render.
// The "maplibre-gl" npm package is in the project for types only.
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

// Pins from the Figma mockup: a teardrop (a square with one sharp corner, rotated by 45°) whose tip points
// exactly at the deal. The marker box is 40x48 px - the tip ends at its bottom edge, which is the anchor.
// The scale on selection happens on .marker__body, because MapLibre positions .marker itself with a transform.
// Don't set "position" on .marker / .me - MapLibre makes markers absolute; overriding it stacks them in the
// page flow and every pin ends up shifted down by the ones before it.
const CSS = `
  html, body, #root { margin: 0; padding: 0; width: 100%; height: 100%; overflow: hidden; }
  .map { position: fixed; inset: 0; }
  .marker { width: 40px; height: 48px; cursor: pointer; }
  .marker--selected { z-index: 2; }
  .marker__body {
    position: absolute; inset: 0; transform-origin: 50% 100%; transition: transform .15s ease-out;
  }
  .marker--selected .marker__body { transform: scale(1.2); }
  .pin {
    position: absolute; top: 0; left: 0; box-sizing: border-box; width: 40px; height: 40px;
    border-radius: 50% 50% 50% 0; transform: rotate(-45deg);
    background: var(--c); border: 3px solid #fff; box-shadow: 0 2px 6px rgba(0,0,0,.3);
    display: flex; align-items: center; justify-content: center;
  }
  .marker--selected .pin { box-shadow: 0 0 0 4px rgba(210,115,58,.4), 0 3px 8px rgba(0,0,0,.35); }
  .pin__icon { transform: rotate(45deg); font-size: 18px; line-height: 1; }
  .dot {
    position: absolute; top: -2px; right: -2px; width: 12px; height: 12px; box-sizing: border-box;
    border-radius: 50%; background: #d2733a; border: 2px solid #fff;
  }
  .dot::after {
    content: ""; position: absolute; inset: -5px; border-radius: 50%;
    border: 2px solid #d2733a; animation: pulse 1.6s ease-out infinite;
  }
  .label {
    position: absolute; top: 52px; left: 50%; transform: translateX(-50%);
    padding: 2px 7px; border-radius: 999px; background: #1e1b24; color: #fff;
    font: 600 11px/1.3 -apple-system, system-ui, sans-serif; white-space: nowrap;
    box-shadow: 0 1px 3px rgba(0,0,0,.25);
  }
  .me { width: 18px; height: 18px; box-sizing: border-box; border-radius: 50%; background: #2f6fde; border: 3px solid #fff; box-shadow: 0 0 4px rgba(0,0,0,.35); }
  .me::before {
    content: ""; position: absolute; inset: -12px; border-radius: 50%;
    background: rgba(47,111,222,.25); animation: pulse 2s ease-out infinite;
  }
  .me__label {
    position: absolute; top: 24px; left: 50%; transform: translateX(-50%);
    padding: 2px 8px; border-radius: 999px; background: #fff; color: #1e1b24;
    font: 600 11px/1.3 -apple-system, system-ui, sans-serif; white-space: nowrap;
    box-shadow: 0 1px 4px rgba(0,0,0,.25);
  }
  @keyframes pulse { from { transform: scale(.6); opacity: .8; } to { transform: scale(1.6); opacity: 0; } }
`;

function createMarkerElement(marker: MapMarker) {
  const root = document.createElement("div");
  root.className = "marker";

  const body = document.createElement("div");
  body.className = "marker__body";
  root.appendChild(body);

  const pin = document.createElement("div");
  pin.className = "pin";
  pin.style.setProperty("--c", marker.color);
  body.appendChild(pin);

  const icon = document.createElement("span");
  icon.className = "pin__icon";
  icon.textContent = marker.emoji;
  pin.appendChild(icon);

  // Fresh deal (added recently) - a small pulsing dot like in the mockup.
  if (marker.fresh) {
    const dot = document.createElement("div");
    dot.className = "dot";
    body.appendChild(dot);
  }

  if (marker.label) {
    const label = document.createElement("div");
    label.className = "label";
    label.textContent = marker.label;
    root.appendChild(label);
  }

  return root;
}

function createUserElement() {
  const root = document.createElement("div");
  root.className = "me";

  const label = document.createElement("div");
  label.className = "me__label";
  label.textContent = "Ty tu jesteś";
  root.appendChild(label);

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
  // Map kept in state (not a ref) so the marker/camera effects run once MapLibre has loaded.
  const [lib, setLib] = useState<MapLibre | null>(null);
  const [map, setMap] = useState<maplibregl.Map | null>(null);
  const markerRefs = useRef(
    new Map<string, { marker: maplibregl.Marker; element: HTMLElement }>(),
  );
  const userMarkerRef = useRef<maplibregl.Marker | null>(null);

  // Callbacks kept in a ref so the map handlers don't need re-binding on every render.
  const callbacks = useRef({ onMarkerPress, onMapPress, onOpenUrl });
  callbacks.current = { onMarkerPress, onMapPress, onOpenUrl };

  useEffect(() => {
    let cancelled = false;
    let created: maplibregl.Map | null = null;

    // Links (e.g. attribution) open in the browser - navigating inside the WebView would replace the map.
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
          // Marker clicks are handled by the marker itself.
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
        // The style shows English names by default ("Krakow", "Cloth Hall") - we want Polish ones.
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
        // Some icons referenced by the OpenFreeMap style are missing from its sprite - add a blank image
        // so the logs aren't flooded with warnings.
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
    // The map is created once; the initial center and zoom only matter at startup.
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
      // The pin's tip is the bottom edge of the element, so "bottom" puts it right on the deal.
      const marker = new lib.Marker({ element, anchor: "bottom" })
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
      userMarkerRef.current = new lib.Marker({ element: createUserElement() })
        .setLngLat(lngLat)
        .addTo(map);
    }
  }, [map, lib, userLocation]);

  useEffect(() => {
    if (!map || !camera) return;

    if (camera.bounds) {
      const { southWest, northEast } = camera.bounds;
      map.fitBounds(
        [
          [southWest.longitude, southWest.latitude],
          [northEast.longitude, northEast.latitude],
        ],
        // Room for the search bar on top and for the pins and their labels.
        {
          padding: { top: 120, bottom: 70, left: 50, right: 50 },
          maxZoom: 16,
          duration: 600,
        },
      );
      return;
    }

    map.flyTo({
      center: [camera.longitude, camera.latitude],
      zoom: camera.zoom ?? map.getZoom(),
      duration: 600,
    });
    // Animate only for a new target (new id) or when the map has just been created.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, camera?.id]);

  return (
    <>
      <style>{CSS}</style>
      <div ref={containerRef} className="map" />
    </>
  );
}
