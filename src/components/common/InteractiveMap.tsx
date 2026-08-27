"use client";

import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export interface MarkerData {
  id?: string;
  lat: number;
  lng: number;
  title?: string;
  popupText?: string;
  iconType?: "driver" | "pickup" | "dropoff";
}

interface InteractiveMapProps {
  center: [number, number];
  zoom?: number;
  markers?: MarkerData[];
  mapType?: "standard" | "satellite";
  height?: string;
}

const driverIconHtml = `
  <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 36px; height: 36px;">
    <span style="position: absolute; width: 36px; height: 36px; border-radius: 50%; background-color: rgba(16, 185, 129, 0.35); animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></span>
    <div style="position: relative; z-index: 10; width: 28px; height: 28px; border-radius: 50%; background-color: #10B981; border: 3px solid #ffffff; box-shadow: 0 4px 12px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>
    </div>
  </div>
`;

const pickupIconHtml = `
  <div style="display: flex; align-items: center; justify-content: center; width: 24px; height: 24px;">
    <div style="width: 20px; height: 20px; border-radius: 50%; background-color: #10B981; border: 2.5px solid #ffffff; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>
  </div>
`;

const dropoffIconHtml = `
  <div style="display: flex; align-items: center; justify-content: center; width: 24px; height: 24px;">
    <div style="width: 20px; height: 20px; border-radius: 50%; background-color: #334155; border: 2.5px solid #ffffff; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>
  </div>
`;

export default function InteractiveMap({
  center,
  zoom = 14,
  markers = [],
  mapType = "standard",
  height = "100%",
}: InteractiveMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: center,
        zoom: zoom,
        scrollWheelZoom: true,
        zoomControl: true,
      });

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Tile layers
    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    const tileUrl =
      mapType === "satellite"
        ? "https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}"
        : "https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}";

    const attribution = "&copy; Google Maps";

    tileLayerRef.current = L.tileLayer(tileUrl, {
      maxZoom: 20,
      subdomains: ["mt0", "mt1", "mt2", "mt3"],
      attribution: attribution,
    }).addTo(map);

  }, [mapType]);

  // Update center and markers dynamically
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    map.panTo(center, { animate: true, duration: 0.8 });

    // Clear existing markers
    markersRef.current.forEach((m) => map.removeLayer(m));
    markersRef.current = [];

    // Add new markers
    markers.forEach((m) => {
      let iconHtml = driverIconHtml;
      let iconSize: [number, number] = [36, 36];
      let iconAnchor: [number, number] = [18, 18];

      if (m.iconType === "pickup") {
        iconHtml = pickupIconHtml;
        iconSize = [24, 24];
        iconAnchor = [12, 12];
      } else if (m.iconType === "dropoff") {
        iconHtml = dropoffIconHtml;
        iconSize = [24, 24];
        iconAnchor = [12, 12];
      }

      const customIcon = L.divIcon({
        html: iconHtml,
        className: "custom-leaflet-marker",
        iconSize: iconSize,
        iconAnchor: iconAnchor,
      });

      const marker = L.marker([m.lat, m.lng], { icon: customIcon }).addTo(map);

      if (m.popupText || m.title) {
        marker.bindPopup(`
          <div style="font-family: inherit; font-size: 12px; font-weight: 700; color: #18181B; padding: 2px;">
            ${m.title ? `<div style="font-size: 13px; color: #10B981; margin-bottom: 2px;">${m.title}</div>` : ""}
            ${m.popupText || ""}
          </div>
        `);
      }

      markersRef.current.push(marker);
    });
  }, [center, markers]);

  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return <div ref={mapContainerRef} style={{ width: "100%", height: height, zIndex: 1 }} />;
}
