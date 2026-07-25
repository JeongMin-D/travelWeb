import React, { useState, useEffect, useRef } from 'react';
import { getCityCoordinates, COUNTRY_ENGLISH_MAPPING, CONTINENT_ENGLISH_MAPPING } from '../data/destinations';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default marker icon issue in Leaflet + Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function WorldMap({ destinations, onSelectDestination, lang = 'en' }) {
  const isEn = lang === 'en';
  const [searchQuery, setSearchQuery] = useState('');
  const [mapInstance, setMapInstance] = useState(null);
  const mapContainerRef = useRef(null);
  const markersRef = useRef({}); // Store L.circleMarker instances mapped by city id

  // Filter destinations based on search query
  const filtered = (destinations || []).filter(dest => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      dest.name.toLowerCase().includes(q) ||
      dest.englishName.toLowerCase().includes(q) ||
      dest.country.toLowerCase().includes(q) ||
      dest.continent.toLowerCase().includes(q)
    );
  });

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // 1. Initialize Leaflet map centered globally
    const map = L.map(mapContainerRef.current, {
      zoomControl: true,
      minZoom: 2,
      maxZoom: 15,
      scrollWheelZoom: true
    }).setView([20, 10], 3); // Centered to view Europe, Asia, Americas

    // 2. CartoDB Dark Matter tile layer
    L.tileLayer('https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}&hl=ko', {
      attribution: '&copy; Google Maps',
      maxZoom: 20
    }).addTo(map);

    setMapInstance(map);

    return () => {
      map.remove();
    };
  }, []);

  // Plot all cities as glowing markers when map is ready
  useEffect(() => {
    if (!mapInstance || !destinations) return;

    // Clear any existing markers stored in ref
    Object.values(markersRef.current).forEach(marker => {
      mapInstance.removeLayer(marker);
    });
    markersRef.current = {};

    destinations.forEach(dest => {
      const [lat, lng] = getCityCoordinates(dest.name, dest.country);

      // Glowing circle marker
      const marker = L.circleMarker([lat, lng], {
        radius: 6,
        fillColor: '#06b6d4', // Cyan neon color
        color: '#ffffff',
        weight: 1.5,
        opacity: 0.9,
        fillOpacity: 0.8
      }).addTo(mapInstance);

      const cityNameToShow = isEn ? (dest.englishName || dest.name) : dest.name;
      const countryNameToShow = isEn ? (COUNTRY_ENGLISH_MAPPING[dest.country] || dest.country) : dest.country;
      const continentNameToShow = isEn ? (CONTINENT_ENGLISH_MAPPING[dest.continent] || dest.continent) : dest.continent;

      // Bind simple tooltip on hover
      marker.bindTooltip(`
        <div style="font-family: sans-serif; font-size: 0.8rem; font-weight: 600;">
          📍 ${cityNameToShow} (${countryNameToShow})
        </div>
      `, { direction: 'top', offset: [0, -5] });

      // Build popup content with "Travel to this City" button hook
      const popupDiv = document.createElement('div');
      popupDiv.style.color = '#0b0f19';
      popupDiv.style.fontFamily = 'sans-serif';
      popupDiv.style.width = '200px';
      popupDiv.innerHTML = `
        <div style="margin-bottom: 8px;">
          <img src="${dest.imageUrl}" style="width: 100%; height: 90px; object-fit: cover; border-radius: 4px; margin-bottom: 6px;" alt="${cityNameToShow}" />
          <h4 style="margin: 0; font-size: 1rem; font-weight: 800;">${cityNameToShow}</h4>
          <p style="margin: 2px 0 0 0; font-size: 0.75rem; color: #666;">${countryNameToShow} • ${continentNameToShow}</p>
          <p style="margin: 4px 0 0 0; font-size: 0.75rem; font-style: italic; color: #555;">"${dest.tagline}"</p>
        </div>
      `;

      // Create travel button programmatically to bind React event handlers
      const btn = document.createElement('button');
      btn.innerText = isEn ? '✈️ Travel to this City' : '✈️ 이 도시 여행하기';
      btn.className = 'btn btn-primary';
      btn.style.width = '100%';
      btn.style.padding = '0.4rem 0.5rem';
      btn.style.fontSize = '0.75rem';
      btn.style.cursor = 'pointer';
      btn.onclick = () => {
        mapInstance.closePopup();
        onSelectDestination(dest, 3, 'healing');
      };
      popupDiv.appendChild(btn);

      marker.bindPopup(popupDiv);

      // Save marker in ref
      markersRef.current[dest.id] = marker;
    });
  }, [mapInstance, destinations]);

  // Handle clicking a city from the sidebar list
  const handleCityClick = (dest) => {
    if (!mapInstance) return;

    const [lat, lng] = getCityCoordinates(dest.name, dest.country);

    // Zoom and pan smoothly to the city location
    mapInstance.flyTo([lat, lng], 8, {
      animate: true,
      duration: 1.5
    });

    // Open popup after flyTo completes
    setTimeout(() => {
      const marker = markersRef.current[dest.id];
      if (marker) {
        marker.openPopup();
      }
    }, 1500);
  };

  return (
    <div className="fade-in world-map-layout">
      
      {/* Sidebar - Search & List */}
      <div className="glass-panel world-map-sidebar">
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            🗺️ {isEn ? 'Global Travel Map' : '세계 여행지도'}
          </h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            {isEn ? `Search and explore ${destinations.length} cities worldwide.` : `전 세계 ${destinations.length}개의 도시를 검색하고 위치와 일정을 확인하세요.`}
          </p>
        </div>

        {/* Search Input */}
        <div>
          <input 
            type="text" 
            placeholder={isEn ? "Search city, country, continent..." : "도시, 국가, 대륙 검색..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '100%', padding: '0.6rem 0.8rem', fontSize: '0.85rem' }}
          />
        </div>

        {/* Scrollable list */}
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem', paddingRight: '0.25rem' }}>
          {filtered.map(dest => (
            <div 
              key={dest.id}
              onClick={() => handleCityClick(dest)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.5rem 0.75rem',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(255,255,255,0.01)',
                border: '1px solid rgba(255,255,255,0.03)',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.01)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.03)';
              }}
            >
              <img 
                src={dest.imageUrl} 
                alt={dest.name} 
                style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} 
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {isEn ? (dest.englishName || dest.name) : dest.name}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  {isEn ? (COUNTRY_ENGLISH_MAPPING[dest.country] || dest.country) : dest.country} • {isEn ? (CONTINENT_ENGLISH_MAPPING[dest.continent] || dest.continent) : dest.continent}
                </div>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem', padding: '2rem 0' }}>
              검색된 도시가 없습니다.
            </div>
          )}
        </div>
      </div>

      {/* Leaflet Map Area */}
      <div className="glass-panel world-map-canvas">
        <div 
          ref={mapContainerRef} 
          style={{ 
            width: '100%', 
            height: '100%', 
            borderRadius: 'calc(var(--radius-md) - 0.25rem)',
            zIndex: 1
          }}
        ></div>
      </div>

    </div>
  );
}
