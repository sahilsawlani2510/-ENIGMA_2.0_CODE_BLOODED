import React, { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

interface DigitalTwinMapProps {
  greenCover: number;
  floodActive: boolean;
}

const NAVI_MUMBAI_CENTER: [number, number] = [73.0297, 19.0330];

// Procedurally generate a realistic-looking city grid
const generateCityGrid = () => {
  const features = [];
  const gridSize = 45; // 45x45 grid
  const step = 0.0012; // Roughly city block size
  const startX = NAVI_MUMBAI_CENTER[0] - (gridSize * step) / 2;
  const startY = NAVI_MUMBAI_CENTER[1] - (gridSize * step) / 2;

  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      // Create some organic gaps (parks, roads)
      if (Math.random() > 0.75) continue; 
      
      const x = startX + i * step + (Math.random() * 0.0004);
      const y = startY + j * step + (Math.random() * 0.0004);
      
      // Varying building footprints
      const width = 0.0005 + Math.random() * 0.0004;
      const depth = 0.0005 + Math.random() * 0.0004;
      
      // Downtown area has taller buildings
      const distToCenter = Math.sqrt(Math.pow(i - gridSize/2, 2) + Math.pow(j - gridSize/2, 2));
      const isDowntown = distToCenter < 10;
      
      const baseHeight = isDowntown ? 60 : 15;
      const height = baseHeight + Math.random() * (isDowntown ? 150 : 40);

      features.push({
        type: "Feature",
        properties: {
          height: height,
          baseHeat: Math.floor(Math.random() * 100), // Inherent heat retention of the building
          id: `bld-${i}-${j}`
        },
        geometry: {
          type: "Polygon",
          coordinates: [[[x, y], [x + width, y], [x + width, y + depth], [x, y + depth], [x, y]]]
        }
      });
    }
  }
  return { type: "FeatureCollection", features };
};

export const DigitalTwinMap: React.FC<DigitalTwinMapProps> = ({ greenCover, floodActive }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);

  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    // Initialize MapLibre
    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
      center: NAVI_MUMBAI_CENTER,
      zoom: 15.5,
      pitch: 65,
      bearing: -20,
      antialias: true,
      interactive: true,
    });

    map.current.on('load', () => {
      if (!map.current) return;

      const cityData = generateCityGrid();

      // Add City Data Source
      map.current.addSource('city-buildings', {
        type: 'geojson',
        data: cityData as any
      });

      // Add 3D Extruded Buildings Layer
      map.current.addLayer({
        id: 'city-buildings-extrusion',
        type: 'fill-extrusion',
        source: 'city-buildings',
        paint: {
          'fill-extrusion-height': ['get', 'height'],
          'fill-extrusion-base': 0,
          // Initial color state
          'fill-extrusion-color': '#475569',
          'fill-extrusion-opacity': 0.9,
        }
      });

      // Add Flood Water Layer (A large polygon covering the city)
      map.current.addSource('flood-water', {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [[
              [NAVI_MUMBAI_CENTER[0] - 0.1, NAVI_MUMBAI_CENTER[1] - 0.1],
              [NAVI_MUMBAI_CENTER[0] + 0.1, NAVI_MUMBAI_CENTER[1] - 0.1],
              [NAVI_MUMBAI_CENTER[0] + 0.1, NAVI_MUMBAI_CENTER[1] + 0.1],
              [NAVI_MUMBAI_CENTER[0] - 0.1, NAVI_MUMBAI_CENTER[1] + 0.1],
              [NAVI_MUMBAI_CENTER[0] - 0.1, NAVI_MUMBAI_CENTER[1] - 0.1],
            ]]
          }
        }
      });

      map.current.addLayer({
        id: 'flood-water-layer',
        type: 'fill-extrusion',
        source: 'flood-water',
        paint: {
          'fill-extrusion-color': '#0284c7', // Deep water blue
          'fill-extrusion-height': 15, // Flood water rises 15m
          'fill-extrusion-base': 0,
          'fill-extrusion-opacity': 0.7,
        },
        layout: {
          visibility: 'none' // Hidden by default
        }
      });

      // Slow continuous rotation for that "Digital Twin" display feel
      const rotateCamera = (timestamp: number) => {
        if (!map.current) return;
        map.current.rotateTo((timestamp / 200) % 360, { duration: 0 });
        requestAnimationFrame(rotateCamera);
      };
      requestAnimationFrame(rotateCamera);
    });

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  // Effect to handle state changes (Green Cover & Flood) without re-rendering the whole map
  useEffect(() => {
    if (!map.current || !map.current.isStyleLoaded()) return;

    // Toggle Flood Water Visibility
    map.current.setLayoutProperty(
      'flood-water-layer',
      'visibility',
      floodActive ? 'visible' : 'none'
    );

    // Update Building Colors based on state
    // We use a MapLibre expression to dynamically color each building based on its `baseHeat`
    // and the global `greenCover` slider.
    
    let colorExpression: any;

    if (floodActive) {
      // In flood emergency, buildings turn a bleak, cold blue/grey to indicate crisis
      colorExpression = [
        'interpolate', ['linear'], ['get', 'height'],
        0, '#0c4a6e',
        200, '#38bdf8'
      ];
    } else {
      // Calculate effective heat: Building inherent heat reduced by green cover percentage
      // Green cover is 0-50. Multiply by 2 to map to 0-100 impact scale.
      const effectiveHeat = ['max', 0, ['-', ['get', 'baseHeat'], greenCover * 2]];

      // Color mapping: Cool (Green) -> Moderate (Yellow) -> Hot (Red)
      colorExpression = [
        'interpolate',
        ['linear'],
        effectiveHeat,
        0, '#10b981',    // Emerald (Cool/Sustainable)
        40, '#eab308',   // Yellow (Moderate)
        80, '#f97316',   // Orange (Warm)
        100, '#ef4444'   // Red (Dangerously Hot)
      ];
    }

    try {
      map.current.setPaintProperty('city-buildings-extrusion', 'fill-extrusion-color', colorExpression);
      
      // Slightly reduce opacity when flooded for atmospheric effect
      map.current.setPaintProperty('city-buildings-extrusion', 'fill-extrusion-opacity', floodActive ? 0.8 : 0.95);
    } catch (e) {
      console.warn("Map styles not fully loaded yet", e);
    }

  }, [greenCover, floodActive]);

  return (
    <div 
      ref={mapContainer} 
      className="absolute inset-0 w-full h-full bg-slate-950"
      style={{ outline: 'none' }}
    />
  );
};
