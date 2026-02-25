import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

/**
 * Interactive map using Leaflet
 * Shows current location marker and allows clicking to update location
 */
const MapComponent = ({ lat, lon }) => {
  const mapContainer = useRef(null);
  const mapInstance = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    if (!mapContainer.current || lat === undefined || lon === undefined) return;

    // Initialize map only once
    if (!mapInstance.current) {
      mapInstance.current = L.map(mapContainer.current).setView([lat, lon], 8);

      // Add OSM tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '\u00a9 OpenStreetMap contributors',
        maxZoom: 19
      }).addTo(mapInstance.current);

      // Add marker
      markerRef.current = L.marker([lat, lon])
        .addTo(mapInstance.current)
        .bindPopup('Current location');
    } else {
      // Update marker and view only if already initialized
      if (markerRef.current) {
        markerRef.current.setLatLng([lat, lon]);
      }
      mapInstance.current.setView([lat, lon], 8);
    }

    // Cleanup on unmount
    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [lat, lon]);

  return (
    <div
      ref={mapContainer}
      className="rounded-lg overflow-hidden"
      style={{ height: '340px' }}
    />
  );
};

export default MapComponent;
