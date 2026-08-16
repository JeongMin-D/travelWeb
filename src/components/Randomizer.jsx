import React, { useState, useEffect, useRef } from 'react';
import { getCityCoordinates, getTranslatedDestination, COUNTRY_ENGLISH_MAPPING, CONTINENT_ENGLISH_MAPPING } from '../data/destinations';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fixed geographic bounds prevent an outlying destination (or an old bad
// coordinate) from zooming a continent selection back out to the world map.
const CONTINENT_BOUNDS = {
  Asia: [[4, 25], [78, 180]],
  Africa: [[-35, -20], [38, 55]],
  'North America': [[7, -170], [84, -50]],
  'South America': [[-57, -82], [13, -34]],
  Europe: [[34, -25], [72, 45]],
  Oceania: [[-50, 110], [2, 180]]
};

export default function Randomizer({ destinations, onSelectDestination, lang = 'en' }) {
  const isEn = lang === 'en';
  const [scope, setScope] = useState('all'); // all, domestic, international, continent
  const [selectedContinent, setSelectedContinent] = useState('Asia');
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState(null);
  
  const [showDart, setShowDart] = useState(false);
  const [showRipple, setShowRipple] = useState(false);

  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);

  // 6 Full Continents List (Asia, Africa, North America, South America, Europe, Oceania)
  const continentsList = [
    { key: 'Asia', labelKo: '아시아', labelEn: 'Asia' },
    { key: 'Africa', labelKo: '아프리카', labelEn: 'Africa' },
    { key: 'North America', labelKo: '북아메리카', labelEn: 'North America' },
    { key: 'South America', labelKo: '남아메리카', labelEn: 'South America' },
    { key: 'Europe', labelKo: '유럽', labelEn: 'Europe' },
    { key: 'Oceania', labelKo: '오세아니아', labelEn: 'Oceania' }
  ];

  const getFilteredPool = () => {
    const pool = destinations || [];
    if (scope === 'all') return pool;
    if (scope === 'domestic') return pool.filter(d => d.type === 'domestic');
    if (scope === 'international') return pool.filter(d => d.type === 'international');
    if (scope === 'continent') {
      return pool.filter(d => {
        const c = (d.continent || '').toLowerCase();
        const sel = selectedContinent.toLowerCase();

        if (sel === 'north america') {
          return c === 'north america' || (c === 'americas' && ['미국', '캐나다', '멕시코', '쿠바', '포르투리코'].includes(d.country));
        }
        if (sel === 'south america') {
          return c === 'south america' || (c === 'americas' && ['브라질', '아르헨티나', '페루', '칠레'].includes(d.country));
        }
        if (sel === 'africa') {
          return c === 'africa' || ['이집트', '모로코', '남아프리카공화국'].includes(d.country);
        }
        return c === sel;
      });
    }
    return pool;
  };

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize map centered globally
    const map = L.map(mapContainerRef.current, {
      zoomControl: false,
      minZoom: 1,
      maxZoom: 12,
      scrollWheelZoom: false,
      dragging: false,
      doubleClickZoom: false,
      boxZoom: false,
      touchZoom: false
    }).setView([20, 10], 2);

    L.tileLayer('https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}&hl=ko', {
      attribution: '&copy; Google Maps',
      maxZoom: 20
    }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update map bounds when scope or selected pool changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear any existing markers
    if (markerRef.current) {
      map.removeLayer(markerRef.current);
      markerRef.current = null;
    }

    const pool = getFilteredPool();
    if (pool.length === 0) return;

    if (scope === 'continent' && CONTINENT_BOUNDS[selectedContinent]) {
      map.fitBounds(CONTINENT_BOUNDS[selectedContinent], { padding: [20, 20], maxZoom: 4 });
      return;
    }

    // Center map to cover the current pool bounds
    const coords = pool.map(d => getCityCoordinates(d.name, d.country));
    if (coords.length > 0) {
      const bounds = L.latLngBounds(coords);
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 5 });
    }
  }, [scope, selectedContinent, destinations]);


  const handleThrowDart = () => {
    const map = mapInstanceRef.current;
    const pool = getFilteredPool();
    if (!map || pool.length === 0) {
      alert('해당 조건에 맞는 여행지가 없습니다!');
      return;
    }

    setIsSpinning(true);
    setResult(null);
    setShowDart(false);
    setShowRipple(false);

    // Clear existing marker
    if (markerRef.current) {
      map.removeLayer(markerRef.current);
      markerRef.current = null;
    }

    // Pick target destination
    const randomIndex = Math.floor(Math.random() * pool.length);
    const chosen = pool[randomIndex];
    const [lat, lng] = getCityCoordinates(chosen.name, chosen.country);

    // 1. Pan map randomly to simulate dartboard rotation
    let panCount = 0;
    const interval = setInterval(() => {
      if (panCount < 4) {
        const randCity = pool[Math.floor(Math.random() * pool.length)];
        const [rLat, rLng] = getCityCoordinates(randCity.name, randCity.country);
        map.setView([rLat, rLng], 3, { animate: true, duration: 0.3 });
        panCount++;
      } else {
        clearInterval(interval);

        // 2. Center map on target coordinates
        map.setView([lat, lng], 4, { animate: true, duration: 0.7 });

        // 3. Trigger Dart fly overlay after map centers
        setTimeout(() => {
          setShowDart(true);

          // 4. Land dart & Ripple
          setTimeout(() => {
            setShowRipple(true);

            // Add red pin on map
            const customIcon = L.divIcon({
              className: 'custom-dart-marker',
              html: `<span style="font-size: 2.2rem; filter: drop-shadow(0 2px 6px rgba(0,0,0,0.8)); display: block; transform: translate(-10%, -20%);">📌</span>`,
              iconSize: [32, 32],
              iconAnchor: [16, 32]
            });
            
            markerRef.current = L.marker([lat, lng], { icon: customIcon }).addTo(map);

            // Zoom in map to reveal region
            map.setView([lat, lng], 7, { animate: true, duration: 0.8 });

            // 5. Show final result
            setTimeout(() => {
              setIsSpinning(false);
              setResult(chosen);
            }, 900);

          }, 800); // Dart fly animation duration

        }, 700); // Wait for centering to start
      }
    }, 380);
  };

  return (
    <div className="fade-in" style={{ width: '100%' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2.2rem', marginBottom: '0.5rem', fontWeight: 800 }}>
          🎯 {isEn ? 'Dart Destination Recommendation' : '다트 여행지 추천'}
        </h2>
        <p style={{ color: 'var(--text-secondary)' }}>
          {isEn ? 'Throw a random dart and find the travel destination that pins on the world map!' : '랜덤 다트를 던져 세계 지도 위에 꽂히는 여행지를 만나보세요!'}
        </p>
      </div>

      <div className="glass-panel" style={{ marginBottom: '2rem' }}>
        <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: 600, fontSize: '0.95rem' }}>
          🎯 {isEn ? 'Set Random Scope' : '랜덤 범위 설정'}
        </label>
        
        {/* Scope Selector */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '0.5rem', marginBottom: '1.25rem' }}>
          <button 
            type="button"
            className={`btn ${scope === 'all' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => { setScope('all'); setResult(null); }}
            disabled={isSpinning}
            style={{ padding: '0.5rem 1rem' }}
          >
            🗺️ {isEn ? 'All Global' : '전세계'}
          </button>
          <button 
            type="button"
            className={`btn ${scope === 'domestic' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => { setScope('domestic'); setResult(null); }}
            disabled={isSpinning}
            style={{ padding: '0.5rem 1rem' }}
          >
            🇰🇷 {isEn ? 'Domestic Only' : '국내만'}
          </button>
          <button 
            type="button"
            className={`btn ${scope === 'international' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => { setScope('international'); setResult(null); }}
            disabled={isSpinning}
            style={{ padding: '0.5rem 1rem' }}
          >
            ✈️ {isEn ? 'International Only' : '해외만'}
          </button>
          <button 
            type="button"
            className={`btn ${scope === 'continent' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => { setScope('continent'); setResult(null); }}
            disabled={isSpinning}
            style={{ padding: '0.5rem 1rem' }}
          >
            🧭 {isEn ? 'Select Continent' : '대륙 선택'}
          </button>
        </div>

        {/* Continent Picker if scope === continent (All 6 Continents) */}
        {scope === 'continent' && (
          <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.25rem', justifyContent: 'center', flexWrap: 'wrap', animation: 'fadeIn 0.2s' }}>
            {continentsList.map((cont) => (
              <button
                key={cont.key}
                type="button"
                className={`btn ${selectedContinent === cont.key ? 'btn-accent' : 'btn-secondary'}`}
                onClick={() => { setSelectedContinent(cont.key); setResult(null); }}
                disabled={isSpinning}
                style={{ padding: '0.4rem 0.75rem', fontSize: '0.85rem' }}
              >
                {isEn ? cont.labelEn : cont.labelKo}
              </button>
            ))}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '1rem 0 1.5rem 0', gap: '0.35rem' }}>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            🎯 {isEn ? 'Eligible Pool:' : '대상 후보군:'} <span style={{ color: 'var(--color-accent)', fontWeight: 700 }}>{getFilteredPool().length}{isEn ? ' Cities' : '개의 도시'}</span>
          </div>
          <div style={{ color: '#f87171', fontSize: '0.75rem', background: 'rgba(239, 68, 68, 0.08)', padding: '0.25rem 0.6rem', borderRadius: '4px', border: '1px solid rgba(239, 68, 68, 0.15)' }}>
            ⚠️ {isEn ? 'MOFA-designated travel-banned countries are excluded.' : '외교부 지정 여행금지 국가(시리아, 이라크, 예멘 등)는 제외됩니다.'}
          </div>
        </div>

        {/* Map Dartboard Section */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
          <div 
            style={{ 
              position: 'relative', 
              width: '100%', 
              height: 'calc(100vh - 660px)', 
              minHeight: '300px',
              borderRadius: 'var(--radius-md)', 
              overflow: 'hidden', 
              border: '1px solid rgba(255, 255, 255, 0.12)',
              boxShadow: 'var(--glass-shadow)',
              marginBottom: '1.25rem'
            }}
          >
            {/* Leaflet container */}
            <div 
              ref={mapContainerRef} 
              style={{ width: '100%', height: '100%', zIndex: 1 }}
            ></div>

            {/* Target Crosshair */}
            <div 
              style={{ 
                position: 'absolute', 
                inset: 0, 
                border: '2px dashed rgba(255, 255, 255, 0.04)', 
                borderRadius: 'var(--radius-md)', 
                pointerEvents: 'none', 
                zIndex: 5 
              }}
            >
              <div style={{ position: 'absolute', top: '50%', left: '10%', right: '10%', height: '1px', background: 'rgba(255, 255, 255, 0.15)' }}></div>
              <div style={{ position: 'absolute', left: '50%', top: '10%', bottom: '10%', width: '1px', background: 'rgba(255, 255, 255, 0.15)' }}></div>
            </div>

            {/* Throwing Dart Animation Overlay */}
            {showDart && (
              <div className="dart-fly-overlay">
                <span style={{ fontSize: '3rem', filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.5))' }}>
                  🎯
                </span>
              </div>
            )}

            {/* Landing ripple */}
            {showRipple && (
              <div className="dart-ripple"></div>
            )}
          </div>

          <button
            onClick={handleThrowDart}
            className="btn btn-primary"
            disabled={isSpinning}
            style={{ 
              width: '240px', 
              padding: '1rem', 
              fontSize: '1.1rem', 
              borderRadius: '100px', 
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', 
              border: 'none', 
              boxShadow: '0 8px 24px rgba(239, 68, 68, 0.4)',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            {isSpinning 
              ? (isEn ? '🎯 Aiming & Throwing...' : '🎯 조준 및 던지는 중...') 
              : (isEn ? '🎯 Throw Dart!' : '🎯 다트 던지기!')}
          </button>
        </div>
      </div>

      {/* Result Panel with Full i18n Support */}
      {result && (() => {
        const translatedResult = getTranslatedDestination(result, isEn);
        const displayCountry = isEn ? (COUNTRY_ENGLISH_MAPPING[result.country] || result.country) : result.country;
        const displayContinent = isEn ? (CONTINENT_ENGLISH_MAPPING[result.continent] || result.continent) : result.continent;

        return (
          <div className="glass-panel fade-in" style={{ border: '2px solid var(--color-success)', marginTop: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <span className="badge badge-emerald">🎉 {isEn ? 'Lucky Pick Result!' : '당첨 결과!'}</span>
              <span className={`badge ${result.type === 'domestic' ? 'badge-indigo' : 'badge-cyan'}`}>
                {result.type === 'domestic' ? (isEn ? 'DOMESTIC' : '국내 여행지') : (isEn ? 'INTERNATIONAL' : '해외 여행지')}
              </span>
            </div>

            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>
              <img 
                src={result.imageUrl} 
                alt={translatedResult.name}
                style={{ width: '180px', height: '120px', objectFit: 'cover', borderRadius: 'var(--radius-sm)', border: '1px solid var(--glass-border)' }}
              />
              <div style={{ flex: 1, minWidth: '240px' }}>
                <h3 style={{ fontSize: '1.8rem', fontWeight: 800, margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>
                  {translatedResult.name} <span style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', fontWeight: 400 }}>{displayCountry} ({displayContinent})</span>
                </h3>
                <p style={{ color: 'var(--color-accent)', fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                  "{translatedResult.tagline}"
                </p>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem', lineHeight: 1.5 }}>
                  {translatedResult.description}
                </p>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => onSelectDestination(result, 3, (result?.itineraries && Object.keys(result.itineraries)[0]) || 'healing')}
                    className="btn btn-primary"
                    style={{ fontSize: '0.9rem', padding: '0.6rem 1.2rem' }}
                  >
                    📅 {isEn ? 'View Recommended Plan' : '상세 추천 일정보기'}
                  </button>
                  <button
                    onClick={handleThrowDart}
                    className="btn btn-secondary"
                    disabled={isSpinning}
                    style={{ fontSize: '0.9rem', padding: '0.6rem 1.2rem' }}
                  >
                    🎯 {isEn ? 'Throw Dart Again' : '다트 다시 던지기'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
