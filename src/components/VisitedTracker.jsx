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

export default function VisitedTracker({ destinations, onSelectDestination, lang = 'en' }) {
  const isEn = lang === 'en';
  const [visitedList, setVisitedList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [mapInstance, setMapInstance] = useState(null);
  
  const mapContainerRef = useRef(null);
  const markersRef = useRef({});

  // Load visited cities from LocalStorage on mount and sync with fresh database imageUrls
  useEffect(() => {
    const list = JSON.parse(localStorage.getItem('visited_cities') || '[]');
    if (destinations && destinations.length > 0) {
      const synced = list.map(city => {
        const dbCity = destinations.find(d => d.id === city.id);
        if (dbCity) {
          return {
            ...city,
            imageUrl: dbCity.imageUrl,
            tagline: dbCity.tagline,
            name: dbCity.name,
            country: dbCity.country
          };
        }
        return city;
      });
      setVisitedList(synced);
      localStorage.setItem('visited_cities', JSON.stringify(synced));
    } else {
      setVisitedList(list);
    }
  }, [destinations]);

  // Save to LocalStorage
  const saveList = (newList) => {
    setVisitedList(newList);
    localStorage.setItem('visited_cities', JSON.stringify(newList));
  };

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const map = L.map(mapContainerRef.current, {
      zoomControl: true,
      minZoom: 2,
      maxZoom: 15,
      scrollWheelZoom: true
    }).setView([20, 10], 2);

    L.tileLayer('https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}&hl=ko', {
      attribution: '&copy; Google Maps',
      maxZoom: 20
    }).addTo(map);

    setMapInstance(map);

    return () => {
      map.remove();
    };
  }, []);

  // Plot visited cities on the map
  useEffect(() => {
    if (!mapInstance) return;

    // Clear existing markers
    Object.values(markersRef.current).forEach(marker => {
      mapInstance.removeLayer(marker);
    });
    markersRef.current = {};

    const allCoords = [];

    visitedList.forEach(city => {
      // Find full destination object to get coordinates
      const dest = destinations.find(d => d.id === city.id) || city;
      const [lat, lng] = getCityCoordinates(dest.name, dest.country);
      allCoords.push([lat, lng]);

      // Glowing emerald circle marker
      const marker = L.circleMarker([lat, lng], {
        radius: 8,
        fillColor: '#10b981', // Green neon color
        color: '#ffffff',
        weight: 1.5,
        opacity: 0.9,
        fillOpacity: 0.85
      }).addTo(mapInstance);

      // Tooltip
      marker.bindTooltip(`
        <div style="font-family: sans-serif; font-size: 0.8rem; font-weight: 600;">
          🏆 ${city.name} (${city.country})
        </div>
      `, { direction: 'top', offset: [0, -5] });

      // Popup
      const popupDiv = document.createElement('div');
      popupDiv.style.color = '#0b0f19';
      popupDiv.style.fontFamily = 'sans-serif';
      popupDiv.style.width = '200px';
      
      const noteText = city.notes ? `"${city.notes}"` : '기록된 메모가 없습니다.';
      popupDiv.innerHTML = `
        <div style="margin-bottom: 8px;">
          <img src="${city.imageUrl}" style="width: 100%; height: 90px; object-fit: cover; border-radius: 4px; margin-bottom: 6px;" alt="${city.name}" />
          <h4 style="margin: 0; font-size: 1rem; font-weight: 800;">${city.name}</h4>
          <p style="margin: 2px 0 0 0; font-size: 0.75rem; color: #666;">방문일: ${city.visitedAt || '미정'}</p>
          <p style="margin: 6px 0 0 0; font-size: 0.75rem; font-style: italic; color: #10b981; line-height: 1.3;">${noteText}</p>
        </div>
      `;

      const btn = document.createElement('button');
      btn.innerText = '✈️ 일정 추천 보기';
      btn.className = 'btn btn-primary';
      btn.style.width = '100%';
      btn.style.padding = '0.4rem 0.5rem';
      btn.style.fontSize = '0.75rem';
      btn.style.cursor = 'pointer';
      btn.onclick = () => {
        mapInstance.closePopup();
        const fullDestObj = destinations.find(d => d.id === city.id);
        if (fullDestObj) {
          onSelectDestination(fullDestObj, 3, 'healing');
        }
      };
      popupDiv.appendChild(btn);

      marker.bindPopup(popupDiv);
      markersRef.current[city.id] = marker;
    });

    // Fit map bounds to show all visited cities if list exists
    if (allCoords.length > 0) {
      const bounds = L.latLngBounds(allCoords);
      mapInstance.fitBounds(bounds, { padding: [50, 50], maxZoom: 6 });
    }
  }, [mapInstance, visitedList, destinations]);

  // Edit fields
  const handleUpdateField = (cityId, field, value) => {
    const updated = visitedList.map(city => {
      if (city.id === cityId) {
        return { ...city, [field]: value };
      }
      return city;
    });
    saveList(updated);
  };

  // Remove city
  const handleRemoveCity = (cityId) => {
    if (window.confirm('다녀온 도시 목록에서 제거하시겠습니까?')) {
      const updated = visitedList.filter(city => city.id !== cityId);
      saveList(updated);
    }
  };

  // Add new city from select dropdown
  const handleAddVisited = (e) => {
    const destId = e.target.value;
    if (!destId) return;

    const dest = destinations.find(d => d.id === destId);
    if (!dest) return;

    // Check if already visited
    if (visitedList.some(v => v.id === destId)) {
      alert('이미 등록된 도시입니다.');
      e.target.value = '';
      return;
    }

    const newObj = {
      id: dest.id,
      name: dest.name,
      country: dest.country,
      continent: dest.continent,
      imageUrl: dest.imageUrl,
      tagline: dest.tagline,
      visitedAt: new Date().toISOString().split('T')[0],
      notes: ''
    };

    const updated = [newObj, ...visitedList];
    saveList(updated);
    e.target.value = ''; // Reset select
  };

  // Stats Calculations
  const totalVisited = visitedList.length;
  const uniqueCountries = new Set(visitedList.map(c => c.country)).size;
  
  const continents = ['Asia', 'Europe', 'Americas', 'Oceania', 'Domestic'];
  const continentProgress = continents.reduce((acc, cont) => {
    const totalInCont = destinations.filter(d => d.continent === cont).length;
    const visitedInCont = visitedList.filter(c => c.continent === cont).length;
    acc[cont] = {
      visited: visitedInCont,
      total: totalInCont,
      percentage: totalInCont > 0 ? Math.round((visitedInCont / totalInCont) * 100) : 0
    };
    return acc;
  }, {});

  // Options for Quick Add Select Box
  const availableToAdd = destinations
    .filter(dest => !visitedList.some(v => v.id === dest.id))
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Top Banner Stats */}
      <div className="grid-3">
        <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontSize: '3rem' }}>🏆</span>
          <div>
            <h4 style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
              {isEn ? 'Conquered Cities' : '정복한 도시 수'}
            </h4>
            <p style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-success)' }}>{totalVisited} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>/ 906</span></p>
          </div>
        </div>

        <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontSize: '3rem' }}>🌍</span>
          <div>
            <h4 style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
              {isEn ? 'Visited Countries' : '방문한 국가 수'}
            </h4>
            <p style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-accent)' }}>{uniqueCountries} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>{isEn ? 'Countries' : '개국'}</span></p>
          </div>
        </div>

        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h4 style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
            📌 {isEn ? 'Quick Add Visited City' : '가본 도시 빠른 등록'}
          </h4>
          <select 
            onChange={handleAddVisited}
            defaultValue=""
            style={{ width: '100%', padding: '0.45rem', fontSize: '0.85rem' }}
          >
            <option value="" disabled>{isEn ? 'Select a city...' : '도시 선택...'}</option>
            {availableToAdd.map(dest => (
              <option key={dest.id} value={dest.id}>
                {isEn ? (dest.englishName || dest.name) : dest.name} ({isEn ? (COUNTRY_ENGLISH_MAPPING[dest.country] || dest.country) : dest.country})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Conquest Progress Card */}
      <div className="glass-panel">
        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1rem' }}>
          🗺️ {isEn ? 'Conquest Progress by Continent' : '대륙별 정복 현황'}
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1.5rem' }}>
          {Object.entries(continentProgress).map(([cont, stat]) => (
            <div key={cont} style={{ background: 'rgba(255,255,255,0.02)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255,255,255,0.04)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                <span>{cont === 'Asia' ? (isEn ? 'Asia' : '아시아') : cont === 'Europe' ? (isEn ? 'Europe' : '유럽') : cont === 'Americas' ? (isEn ? 'Americas' : '아메리카') : cont === 'Oceania' ? (isEn ? 'Oceania' : '오세아니아') : (isEn ? 'Domestic' : '국내')}</span>
                <span style={{ color: 'var(--color-success)' }}>{stat.percentage}%</span>
              </div>
              <div className="progress-bar-container" style={{ height: '6px', margin: '0 0 0.25rem 0' }}>
                <div className="progress-bar" style={{ width: `${stat.percentage}%`, background: 'var(--color-success)' }}></div>
              </div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                {stat.visited} / {stat.total} {isEn ? 'Cities' : '개 도시'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Map & Visited List splits */}
      <div className="visited-tracker-split">
        
        {/* Left Side: Map of visited pins */}
        <div className="glass-panel visited-tracker-map-panel">
          <div ref={mapContainerRef} style={{ width: '100%', height: '100%', borderRadius: 'calc(var(--radius-md) - 0.25rem)' }}></div>
        </div>

        {/* Right Side: Scrollable detailed memories log */}
        <div className="glass-panel visited-tracker-list-panel">
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>
            📝 {isEn ? 'My Travel Records & Notes' : '나의 방문 기록 & 메모'}
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
            {visitedList.map(city => (
              <div 
                key={city.id}
                style={{ 
                  background: 'rgba(255,255,255,0.01)', 
                  border: '1px solid rgba(255,255,255,0.06)', 
                  borderRadius: 'var(--radius-sm)', 
                  padding: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem'
                }}
              >
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  <img src={city.imageUrl} alt={city.name} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 800, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {isEn ? (city.englishName || city.name) : city.name}
                    </h4>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      {isEn ? (COUNTRY_ENGLISH_MAPPING[city.country] || city.country) : city.country} • {isEn ? (CONTINENT_ENGLISH_MAPPING[city.continent] || city.continent) : city.continent}
                    </span>
                  </div>
                  <button 
                    onClick={() => handleRemoveVisited(city.id)}
                    className="btn btn-secondary"
                    style={{ padding: '0.35rem 0.5rem', fontSize: '0.75rem', color: '#f87171' }}
                  >
                    {isEn ? 'Remove' : '제거'}
                  </button>
                </div>

                {/* Edit details */}
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', width: '75px' }}>{isEn ? 'Visit Date:' : '방문 날짜:'}</span>
                  <input 
                    type="date" 
                    value={city.visitedAt || ''} 
                    onChange={(e) => handleUpdateVisitedField(city.id, 'visitedAt', e.target.value)}
                    style={{ flex: 1, padding: '0.3rem 0.5rem', fontSize: '0.8rem' }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{isEn ? 'Travel Notes & Tips:' : '방문 메모 / 한 줄 맛평가:'}</span>
                  <textarea 
                    rows="2"
                    placeholder={isEn ? "Record tips, favorite spots, and memories..." : "공항에서 시내 택시 팁, 찐맛집 발견 등의 후기를 기록하세요!"}
                    value={city.notes || ''}
                    onChange={(e) => handleUpdateVisitedField(city.id, 'notes', e.target.value)}
                    style={{ width: '100%', padding: '0.4rem 0.6rem', fontSize: '0.8rem', resize: 'none' }}
                  />
                </div>
              </div>
            ))}

            {visitedList.length === 0 && (
              <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                {isEn ? 'No visited cities logged yet.' : '아직 등록된 다녀온 도시가 없습니다.'}<br />
                {isEn ? 'Add cities from destination details or the quick add bar above!' : '여행지 카드 상세뷰에서 등록하거나 상단에서 추가해보세요!'}
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
