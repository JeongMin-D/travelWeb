import React, { useState, useEffect, useRef } from 'react';
import { 
  NEIGHBOR_MAPPING, 
  COUNTRY_REGISTRY, 
  getPolishedItinerary, 
  getCityCoordinates, 
  getLandmarkCoordinates, 
  getClothingAndWeatherGuide, 
  getTranslatedDestination, 
  translateChecklistItem, 
  translateActivityTitle, 
  translateActivityDesc, 
  translateDistText, 
  COUNTRY_ENGLISH_MAPPING, 
  CONTINENT_ENGLISH_MAPPING 
} from '../data/destinations';
import { regenerateSlot } from '../utils/itineraryEngine';
import PrintBrochureModal from './PrintBrochureModal';
import appDb from '../db/appDb';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default marker icon issue in Leaflet + Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function ItineraryViewer({ 
  destination = {}, 
  initialDuration = 3, 
  initialStyle = 'healing', 
  onBack, 
  onStartPlanning, 
  onStartBudgeting,
  lang = 'en'
}) {
  const isEn = lang === 'en';
  const safeDest = destination || {};
  const translatedDest = getTranslatedDestination(safeDest, isEn) || safeDest;
  const displayContinent = isEn 
    ? (CONTINENT_ENGLISH_MAPPING[safeDest.continent] || safeDest.continent || 'Global') 
    : (safeDest.continent || '전세계');

  const [duration, setDuration] = useState(initialDuration || 3);
  const [style, setStyle] = useState(initialStyle || 'healing');
  const [checklist, setChecklist] = useState([]);
  const [newItemText, setNewItemText] = useState('');
  const [showBrochureModal, setShowBrochureModal] = useState(false);

  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [mapInstance, setMapInstance] = useState(null);

  // Styles list supported by this destination
  const availableStyles = safeDest.itineraries && typeof safeDest.itineraries === 'object' && Object.keys(safeDest.itineraries).length > 0
    ? Object.keys(safeDest.itineraries)
    : ['healing', 'activity', 'foodTour', 'culture'];

  // If initialStyle is not supported by the destination, pick the first one
  useEffect(() => {
    if (!availableStyles.includes(style)) {
      setStyle(availableStyles[0] || 'healing');
    }
  }, [safeDest.name]);

  // Load checklist from AppDB
  useEffect(() => {
    const rawEssentials = Array.isArray(safeDest.essentials) ? safeDest.essentials : [];
    const defaults = [
      ...rawEssentials.map(item => ({ text: item, checked: false, category: 'essential' })),
      { text: '휴대폰 충전기', checked: false, category: 'electronics' },
      { text: '개인 세면도구', checked: false, category: 'toiletries' },
      { text: '편한 여벌 옷', checked: false, category: 'clothing' },
      { text: '상비약 (종합감기약, 소화제)', checked: false, category: 'other' }
    ];
    if (safeDest.type === 'international') {
      defaults.unshift(
        { text: '여권 및 여권 복사본', checked: false, category: 'essential' },
        { text: '해외 매직 플러그 (어댑터)', checked: false, category: 'electronics' },
        { text: '해외 결제 카드 / 현금 환전', checked: false, category: 'essential' }
      );
    }
    const destKey = safeDest.id || safeDest.name || 'default_dest';
    const items = appDb.checklists.get(destKey, defaults);
    setChecklist(items);
  }, [safeDest.id, safeDest.name]);

  // Save checklist to AppDB
  const saveChecklist = (list) => {
    setChecklist(list);
    const destKey = safeDest.id || safeDest.name || 'default_dest';
    appDb.checklists.save(destKey, list);
  };

  const handleToggleCheck = (index) => {
    const updated = [...checklist];
    if (updated[index]) {
      updated[index].checked = !updated[index].checked;
      saveChecklist(updated);
    }
  };

  const handleAddCustomItem = (e) => {
    e.preventDefault();
    if (!newItemText.trim()) return;
    const updated = [
      ...checklist,
      { text: newItemText.trim(), checked: false, category: 'other' }
    ];
    saveChecklist(updated);
    setNewItemText('');
  };

  const handleResetChecklist = () => {
    if (window.confirm('체크리스트를 처음 상태로 초기화할까요?')) {
      const destKey = safeDest.id || safeDest.name || 'default_dest';
      appDb.checklists.reset(destKey);
      const rawEssentials = Array.isArray(safeDest.essentials) ? safeDest.essentials : [];
      const defaults = [
        ...rawEssentials.map(item => ({ text: item, checked: false, category: 'essential' })),
        { text: '휴대폰 충전기', checked: false, category: 'electronics' },
        { text: '개인 세면도구', checked: false, category: 'toiletries' },
        { text: '편한 여벌 옷', checked: false, category: 'clothing' },
        { text: '상비약 (종합감기약, 소화제)', checked: false, category: 'other' }
      ];
      if (safeDest.type === 'international') {
        defaults.unshift(
          { text: '여권 및 여권 복사본', checked: false, category: 'essential' },
          { text: '해외 매직 플러그 (어댑터)', checked: false, category: 'electronics' },
          { text: '해외 결제 카드 / 현금 환전', checked: false, category: 'essential' }
        );
      }
      setChecklist(defaults);
    }
  };

  const handleDeleteItem = (index) => {
    const updated = checklist.filter((_, i) => i !== index);
    saveChecklist(updated);
  };

  // Dynamic AI itinerary calculation
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeItineraryData, setActiveItineraryData] = useState({});

  useEffect(() => {
    setIsGenerating(true);
    const timer = setTimeout(() => {
      try {
        const data = getPolishedItinerary(safeDest, style, duration);
        setActiveItineraryData(data || {});
      } catch (err) {
        console.warn('[ItineraryViewer] Itinerary calculation notice:', err);
        setActiveItineraryData({});
      } finally {
        setIsGenerating(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [safeDest.name, style, duration]);

  const handleRegenerateSlot = (dayNum, actIndex, currentCat) => {
    const usedIds = [];
    Object.values(activeItineraryData).forEach(dayArr => {
      if (Array.isArray(dayArr)) {
        dayArr.forEach(act => {
          if (act?.id) usedIds.push(act.id);
        });
      }
    });

    const dayZone = ['center', 'east', 'west', 'north', 'south'][(dayNum - 1) % 5];
    const newSpot = regenerateSlot(safeDest.name, safeDest.country, style, currentCat, dayZone, usedIds);
    
    if (newSpot) {
      setActiveItineraryData(prev => {
        const newData = { ...prev };
        if (newData[dayNum] && newData[dayNum][actIndex]) {
          const newAct = { ...newData[dayNum][actIndex] };
          newAct.id = newSpot.id;
          const parts = (newAct.title || '').split(' ');
          if (parts.length > 1 && /[\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF]/.test(parts[0])) {
            newAct.title = parts[0] + ' ' + newSpot.name;
          } else {
            newAct.title = newSpot.name;
          }
          newAct.desc = newSpot.desc;
          newAct.categoryType = newSpot.category || newAct.categoryType;
          newData[dayNum][actIndex] = newAct;
        }
        return newData;
      });
    } else {
      alert(isEn ? 'No more alternative places available for this category.' : '이 카테고리의 대체 가능한 다른 장소가 더 이상 없습니다.');
    }
  };

  const neighbors = NEIGHBOR_MAPPING[safeDest.name] || [];

  const [isVisited, setIsVisited] = useState(false);

  useEffect(() => {
    const destKey = safeDest.id || safeDest.name;
    setIsVisited(appDb.visited.isVisited(destKey));
    return appDb.subscribe('visited', () => {
      setIsVisited(appDb.visited.isVisited(destKey));
    });
  }, [safeDest.id, safeDest.name]);

  const handleToggleVisited = () => {
    if (!appDb.auth.getCurrentUserId()) {
      alert(isEn ? '🔒 Please log in first to save this city to your personal visited map!' : '🔒 나만의 다녀온 도시 지도로 저장하려면 먼저 로그인해 주세요!');
      return;
    }

    const destKey = safeDest.id || safeDest.name;
    if (isVisited) {
      appDb.visited.remove(destKey);
      setIsVisited(false);
      alert(isEn ? `🗑️ [${safeDest.name}] removed from visited list.` : `🗑️ [${safeDest.name}] 다녀온 도시 목록에서 해제되었습니다.`);
    } else {
      const visitObj = {
        id: destKey,
        name: safeDest.name,
        country: safeDest.country,
        continent: safeDest.continent,
        imageUrl: safeDest.imageUrl,
        tagline: safeDest.tagline,
        visitedDate: new Date().toISOString().split('T')[0],
        rating: 5,
        memo: ''
      };
      appDb.visited.add(visitObj);
      setIsVisited(true);
      alert(isEn ? `🎉 [${safeDest.name}] added to visited cities list!` : `🎉 [${safeDest.name}] 다녀온 도시 목록에 등록되었습니다! "다녀온 도시" 탭에서 확인해 보세요.`);
    }
  };

  // Initialize Map safely with React Ref
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (mapInstanceRef.current) {
      try {
        mapInstanceRef.current.remove();
      } catch (e) {}
      mapInstanceRef.current = null;
    }

    let cityLat = 37.5665;
    let cityLng = 126.9780;

    if (safeDest.coordinates?.lat && safeDest.coordinates?.lng) {
      cityLat = Number(safeDest.coordinates.lat);
      cityLng = Number(safeDest.coordinates.lng);
    } else {
      const coords = getCityCoordinates(safeDest.name || '', safeDest.country || '');
      if (Array.isArray(coords) && Number.isFinite(coords[0]) && Number.isFinite(coords[1])) {
        cityLat = coords[0];
        cityLng = coords[1];
      }
    }

    try {
      const map = L.map(mapContainerRef.current, {
        zoomControl: true,
        scrollWheelZoom: false
      }).setView([cityLat, cityLng], 12);

      L.tileLayer('https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}&hl=ko', {
        attribution: '&copy; Google Maps',
        maxZoom: 20
      }).addTo(map);

      mapInstanceRef.current = map;
      setMapInstance(map);
    } catch (err) {
      console.warn('[ItineraryViewer] Leaflet init error:', err);
    }

    return () => {
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
        } catch (e) {}
        mapInstanceRef.current = null;
      }
    };
  }, [safeDest.name]);

  // Update Markers & Routes safely
  useEffect(() => {
    if (!mapInstance || !activeItineraryData) return;

    try {
      mapInstance.eachLayer((layer) => {
        if (layer instanceof L.Marker || layer instanceof L.Polyline) {
          mapInstance.removeLayer(layer);
        }
      });

      const dayColors = {
        1: '#6366f1',
        2: '#06b6d4',
        3: '#10b981',
        4: '#f59e0b',
        5: '#ec4899'
      };

      const allCoords = [];
      const placedMarkerCoords = [];

      for (let dayNum = 1; dayNum <= duration; dayNum++) {
        const dayActivities = activeItineraryData[dayNum] || [];
        const dayColor = dayColors[dayNum] || '#6366f1';
        const dayPathCoords = [];

        dayActivities.forEach((act, actIndex) => {
          if (!act) return;
          const rawCoords = getLandmarkCoordinates(safeDest.name || '', act.title || '', dayNum, actIndex, safeDest.country || '');
          
          if (!Array.isArray(rawCoords) || !Number.isFinite(rawCoords[0]) || !Number.isFinite(rawCoords[1])) return;

          let finalLat = rawCoords[0];
          let finalLng = rawCoords[1];

          const overlappingCount = placedMarkerCoords.filter(p => {
            const dLat = Math.abs(p[0] - finalLat);
            const dLng = Math.abs(p[1] - finalLng);
            return dLat < 0.002 && dLng < 0.002;
          }).length;

          if (overlappingCount > 0) {
            const angle = (overlappingCount * 75 + dayNum * 45 + actIndex * 30) * (Math.PI / 180);
            const offsetDist = 0.002 + (overlappingCount * 0.0006);
            finalLat += Math.sin(angle) * offsetDist;
            finalLng += Math.cos(angle) * offsetDist;
          }

          const actCoords = [finalLat, finalLng];
          placedMarkerCoords.push(actCoords);
          dayPathCoords.push(actCoords);
          allCoords.push(actCoords);

          const divIcon = L.divIcon({
            className: 'custom-map-marker',
            html: `<div class="marker-dot" style="background-color: ${dayColor}; box-shadow: 0 0 10px ${dayColor};">${dayNum}-${actIndex + 1}</div>`,
            iconSize: [26, 26],
            iconAnchor: [13, 13]
          });

          const zIndexOffset = (dayNum * 100) + (actIndex * 10);

          L.marker(actCoords, { 
            icon: divIcon,
            zIndexOffset: zIndexOffset
          })
            .addTo(mapInstance)
            .bindPopup(`
              <div style="color: #0b0f19; font-family: sans-serif; font-size: 0.85rem; padding: 2px;">
                <strong style="color: ${dayColor}; display: block; margin-bottom: 2px;">☀️ DAY ${dayNum} - 🕒 ${act.time || '10:00'}</strong>
                <strong style="font-size: 0.9rem; display: block; margin-bottom: 4px;">${act.title || ''}</strong>
                <span style="color: #555; display: block; font-size: 0.75rem; line-height: 1.3;">${act.desc || ''}</span>
              </div>
            `);
        });

        if (dayPathCoords.length >= 2) {
          L.polyline(dayPathCoords, {
            color: dayColor,
            weight: 3.5,
            opacity: 0.7,
            dashArray: '7, 7'
          }).addTo(mapInstance);
        }
      }

      if (allCoords.length > 0) {
        const bounds = L.latLngBounds(allCoords);
        mapInstance.fitBounds(bounds, { padding: [40, 40] });
      }
    } catch (err) {
      console.warn('[ItineraryViewer] Map marker update notice:', err);
    }
  }, [mapInstance, activeItineraryData, duration, safeDest.name]);

  const STYLE_NAMES = {
    healing: isEn ? '🌿 Healing & Rest' : '🌿 힐링 & 휴식',
    activity: isEn ? '⚡ Activity & Adventure' : '⚡ 액티비티 & 체험',
    culture: isEn ? '🏛️ History & Culture' : '🏛️ 역사 & 문화',
    foodTour: isEn ? '🍕 Food & Culinary' : '🍕 식도락 여행',
    food: isEn ? '🍕 Food & Culinary' : '🍕 식도락 여행'
  };
  const getStyleKoreanName = (styleKey) => STYLE_NAMES[styleKey] || styleKey;

  const weatherInfo = getClothingAndWeatherGuide(safeDest.name || '', safeDest.country || '', isEn);

  return (
    <div className="fade-in">
      {/* Top Action Bar with Print/PDF Export Button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <button onClick={onBack} className="btn btn-secondary">
          {isEn ? '⬅️ Back to Destinations' : '⬅️ 목록으로 돌아가기'}
        </button>

        <button 
          onClick={() => setShowBrochureModal(true)} 
          className="btn btn-primary"
          style={{ background: '#000000', color: '#ffffff', border: '1px solid #000000' }}
        >
          🖨️ {isEn ? 'Print Brochure / Export PDF' : '카탈로그 브로셔 인쇄 / PDF 저장'}
        </button>
      </div>

      {/* Destination Hero Panel (Clear Crisp Photo & High Legibility) */}
      <div 
        className="glass-panel" 
        style={{ 
          marginBottom: '2rem',
          padding: '1.5rem',
          display: 'flex',
          gap: '2rem',
          alignItems: 'center',
          flexWrap: 'wrap'
        }}
      >
        {/* Left Side: Crisp High-Res Photo Frame */}
        <div 
          style={{ 
            width: '320px', 
            height: '220px', 
            flexShrink: 0, 
            border: '2px solid var(--colors-frame-ink)', 
            padding: '4px',
            background: '#ffffff',
            boxShadow: '4px 4px 0px #000000'
          }}
        >
          <img 
            src={translatedDest.imageUrl || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80'} 
            alt={translatedDest.name || 'Destination'} 
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        </div>

        {/* Right Side: High Legibility Information */}
        <div style={{ flex: 1, minWidth: '280px' }}>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
            <span className={`badge ${translatedDest.type === 'domestic' ? 'badge-indigo' : 'badge-cyan'}`}>
              {translatedDest.type === 'domestic' ? (isEn ? 'DOMESTIC' : '국내 여행지') : (isEn ? 'INTERNATIONAL' : '해외 여행지')}
            </span>
            <span className="badge badge-emerald">{displayContinent}</span>
            <span className="badge badge-amber">💰 {isEn ? 'Currency:' : '통화:'} {translatedDest.currency || 'KRW'} ({translatedDest.currencySymbol || '₩'})</span>
          </div>

          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, margin: '0.35rem 0', color: 'var(--text-primary)' }}>
            {translatedDest.name || '추천 여행지'}
            <span style={{ fontSize: '1.1rem', marginLeft: '0.75rem', fontWeight: 400, color: 'var(--text-secondary)' }}>
              {translatedDest.englishName || ''}{translatedDest.country ? `, ${translatedDest.country}` : ''}
            </span>
          </h1>

          <p style={{ color: 'var(--color-accent)', fontSize: '1.05rem', fontWeight: 600, marginBottom: '0.5rem' }}>
            "{translatedDest.tagline || ''}"
          </p>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', margin: 0, lineHeight: 1.5 }}>
            {translatedDest.description || ''}
          </p>
        </div>
      </div>

      {/* Weather & Clothing Recommendation Guide Panel */}
      <div className="glass-panel" style={{ marginBottom: '2rem', background: 'rgba(15, 23, 42, 0.4)', borderLeft: '4px solid var(--color-accent)' }}>
        <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ fontSize: '3rem', lineHeight: 1 }}>{weatherInfo?.icon || '🌤️'}</div>
          <div style={{ flex: 1, minWidth: '240px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
              <span className="badge badge-amber" style={{ fontSize: '11px', fontWeight: 800 }}>
                🌡️ {weatherInfo?.tempC || 23}°C
              </span>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {weatherInfo?.summary || '쾌적한 날씨'} (Lat: {weatherInfo?.lat || 37.5}°)
              </span>
            </div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 800, margin: '0.25rem 0', color: 'var(--color-accent)' }}>
              👕 {isEn ? 'Recommended Outfit & Packing Guide:' : '추천 여행 복장 & 코디 가이드:'}
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
              {weatherInfo?.outfit || '편안한 일상복과 걷기 편한 신발을 권장합니다.'}
            </p>
          </div>
        </div>
      </div>

      {/* Control filters for the active recommendation */}
      <div className="glass-panel" style={{ marginBottom: '2rem', display: 'flex', gap: '1.5rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
          
          {/* Duration Selector */}
          <div>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>
              {isEn ? 'Trip Duration' : '여행 기간 설정'}
            </span>
            <select
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              style={{ 
                padding: '0.45rem 2rem 0.45rem 0.75rem', 
                fontSize: '0.85rem', 
                background: 'rgba(15, 23, 42, 0.6)', 
                border: '1px solid var(--glass-border)', 
                color: 'var(--text-primary)', 
                borderRadius: 'var(--radius-sm)',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map((d) => (
                <option key={d} value={d} style={{ background: '#131b2e', color: '#fff' }}>
                  {isEn ? `${d} Days Plan` : `${d}일 일정`}
                </option>
              ))}
            </select>
          </div>

          {/* Travel Style Selector */}
          <div>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>
              {isEn ? 'Travel Style' : '여행 테마 선택'}
            </span>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {['healing', 'activity', 'culture', 'foodTour'].map((sKey) => (
                <button
                  key={sKey}
                  onClick={() => setStyle(sKey)}
                  className={`btn ${style === sKey ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ fontSize: '0.85rem', padding: '0.4rem 0.8rem' }}
                >
                  {getStyleKoreanName(sKey)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons: Planner & Budget Hand-off */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button 
            onClick={() => onStartPlanning && onStartPlanning(safeDest, duration, activeItineraryData)}
            className="btn btn-primary"
            style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
          >
            📅 {isEn ? 'Import into Planner' : '이 코스로 일정 편집하기'}
          </button>
          
          <button 
            onClick={() => onStartBudgeting && onStartBudgeting(safeDest, duration)}
            className="btn btn-secondary"
            style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
          >
            💰 {isEn ? 'Calculate Budget' : '예산 장부 쓰기'}
          </button>

          {/* Visited Toggle Button */}
          <button 
            onClick={handleToggleVisited}
            className={`btn ${isVisited ? 'btn-primary' : 'btn-secondary'}`}
            style={{ 
              fontSize: '0.85rem', 
              padding: '0.5rem 1rem',
              borderColor: isVisited ? 'var(--color-primary)' : 'var(--glass-border)'
            }}
          >
            {isVisited ? (isEn ? '💚 Visited City!' : '💚 다녀온 도시!') : (isEn ? '🤍 Mark Visited' : '🤍 가본 도시 등록')}
          </button>
        </div>
      </div>

      {/* Map Section */}
      <div className="glass-panel" style={{ padding: '1.25rem', marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          🗺️ {isEn ? `${translatedDest.name} Recommended Route Map` : `${translatedDest.name} 여행 경로 지도`}
        </h3>
        <div 
          ref={mapContainerRef} 
          style={{ 
            height: '350px', 
            borderRadius: 'var(--radius-md)', 
            border: '1px solid rgba(255, 255, 255, 0.1)',
            overflow: 'hidden',
            position: 'relative',
            zIndex: 10
          }}
        ></div>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem', textAlign: 'right' }}>
          💡 {isEn 
            ? 'Numbers indicate Day & Activity order (e.g. 1-2 = Day 1 Activity #2). Dotted lines represent travel paths.' 
            : '지도 상의 번호는 각 일차(Day)와 해당 활동 순서를 뜻합니다 (예: 1-2 = 1일차 2번째 활동). 점선은 일차별 이동 동선입니다.'}
        </p>
      </div>

      {/* Two Column Layout: Itinerary & Packing Checklist */}
      <div className="grid-2" style={{ alignItems: 'flex-start' }}>
        
        {/* Left Side: Daily Timeline */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 700, borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>📅 {isEn ? `Recommended ${duration}-Day Itinerary` : `${duration}일 추천 일정`} </span>
            <span style={{ fontSize: '0.9rem', color: 'var(--color-accent)', fontWeight: 500 }}>
              {getStyleKoreanName(style)}
            </span>
          </h3>

          {/* Generate Days */}
          {isGenerating ? (
            <div style={{ padding: '3rem 1rem', textAlign: 'center', color: 'var(--color-accent)' }}>
              <style>{`
                @keyframes spin {
                  0% { transform: rotate(0deg); }
                  100% { transform: rotate(360deg); }
                }
              `}</style>
              <div className="spinner" style={{ margin: '0 auto 1rem auto', width: '40px', height: '40px', border: '3px solid rgba(255,255,255,0.1)', borderTopColor: 'var(--color-accent)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
              <h4 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>{isEn ? 'AI is generating the optimal itinerary...' : 'AI가 최적의 일정을 계산 중입니다...'}</h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{isEn ? 'Analyzing thousands of POIs for the best route.' : '해당 도시의 수많은 명소와 테마를 분석하여 동선을 짜고 있습니다.'}</p>
            </div>
          ) : (
          Array.from({ length: duration }).map((_, i) => {
            const dayNum = i + 1;
            const dayActivities = activeItineraryData[dayNum] || [];

            return (
              <div key={dayNum} style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ color: 'var(--text-primary)', fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', background: 'rgba(255,255,255,0.03)', padding: '0.4rem 0.8rem', borderRadius: '4px', borderLeft: '3px solid var(--color-primary)' }}>
                  ☀️ DAY {dayNum}
                </h4>

                {dayActivities.length === 0 ? (
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', paddingLeft: '1rem' }}>
                    {isEn ? 'Free leisure time and personal relaxation day.' : '이 날은 자유 일정 및 개별 힐링 시간입니다.'}
                  </p>
                ) : (
                  <div className="timeline" style={{ position: 'relative', borderLeft: '2px dashed var(--glass-border)', marginLeft: '1rem', paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {dayActivities.map((act, actIndex) => {
                      if (!act) return null;
                      const displayTitle = isEn ? translateActivityTitle(act.title, actIndex, translatedDest.name) : act.title;
                      const displayDesc = isEn ? translateActivityDesc(act.desc, translatedDest.name) : act.desc;

                      // Category badge helper
                      let catBadge = null;
                      if (act.categoryType === 'relaxation') {
                        catBadge = <span className="badge badge-emerald" style={{ fontSize: '10px', padding: '2px 8px', marginRight: '8px', flexShrink: 0 }}>{isEn ? '🌿 Relaxation' : '🌿 힐링/휴식'}</span>;
                      } else if (act.categoryType === 'restaurant') {
                        catBadge = <span className="badge badge-amber" style={{ fontSize: '10px', padding: '2px 8px', marginRight: '8px', flexShrink: 0 }}>{isEn ? '🍽️ Dining' : '🍽️ 식당/다이닝'}</span>;
                      } else if (act.categoryType === 'cafe') {
                        catBadge = <span className="badge badge-indigo" style={{ fontSize: '10px', padding: '2px 8px', marginRight: '8px', flexShrink: 0 }}>{isEn ? '☕ Cafe/Dessert' : '☕ 카페/디저트'}</span>;
                      } else if (act.categoryType === 'activity') {
                        catBadge = <span className="badge badge-cyan" style={{ fontSize: '10px', padding: '2px 8px', marginRight: '8px', flexShrink: 0 }}>{isEn ? '🎡 Activity' : '🎡 액티비티'}</span>;
                      } else if (act.categoryType === 'nightview') {
                        catBadge = <span className="badge badge-purple" style={{ fontSize: '10px', padding: '2px 8px', marginRight: '8px', flexShrink: 0 }}>{isEn ? '🌙 Nightview' : '🌙 야간/야경'}</span>;
                      } else {
                        catBadge = <span className="badge badge-purple" style={{ fontSize: '10px', padding: '2px 8px', marginRight: '8px', flexShrink: 0 }}>{isEn ? '🏛️ Sightseeing' : '🏛️ 명소/관광'}</span>;
                      }

                      return (
                        <React.Fragment key={actIndex}>
                          {act.distText && (
                            <div style={{ position: 'relative', margin: '-0.75rem 0', left: '-2.25rem', display: 'flex', alignItems: 'center' }}>
                              <div style={{ background: 'var(--color-bg)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', color: 'var(--text-muted)', border: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', gap: '0.3rem', zIndex: 2 }}>
                                🚗 <span style={{ fontWeight: 600 }}>{translateDistText(act.distText, isEn)}</span>
                              </div>
                            </div>
                          )}
                          <div 
                            className="timeline-item premium-timeline-item" 
                            style={{ 
                              position: 'relative', 
                              background: 'rgba(255,255,255,0.02)', 
                              padding: '1.25rem', 
                              borderRadius: 'var(--radius-md)', 
                              border: '1px solid rgba(255,255,255,0.05)',
                              transition: 'transform 0.2s, box-shadow 0.2s',
                              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                            }}
                          >
                            <div style={{ 
                              position: 'absolute', 
                              left: '-1.85rem', 
                              top: '1.5rem', 
                              width: '12px', 
                              height: '12px', 
                              borderRadius: '50%', 
                              background: 'var(--color-primary)', 
                              border: '3px solid var(--color-bg)' 
                            }}></div>
                            
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                              <div className="timeline-time" style={{ color: 'var(--color-accent)', fontWeight: 800, fontSize: '1.1rem' }}>
                                {act.time || '10:00'}
                              </div>
                              <button 
                                onClick={() => handleRegenerateSlot(dayNum, actIndex, act.categoryType)}
                                className="btn"
                                style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)', fontSize: '0.75rem', padding: '0.25rem 0.5rem', border: '1px solid var(--glass-border)' }}
                                title={isEn ? "Swap to another place" : "다른 장소로 교체하기"}
                              >
                                🔄 {isEn ? 'Swap' : '교체'}
                              </button>
                            </div>
                            <div className="timeline-title" style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '4px', fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                              {catBadge}
                              <span>{displayTitle}</span>
                            </div>
                            <div className="timeline-desc" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                              {displayDesc}
                            </div>
                          </div>
                        </React.Fragment>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })
          )}
        </div>

        {/* Right Side: Checklist */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 700, borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>🎒 {isEn ? 'Packing Checklist' : '여행 준비물 체크리스트'}</span>
            <button 
              onClick={handleResetChecklist}
              className="btn" 
              style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--color-danger)', border: '1px solid rgba(239, 68, 68, 0.2)' }}
            >
              🔄 {isEn ? 'Reset' : '초기화'}
            </button>
          </h3>

          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '-0.75rem' }}>
            {isEn ? `Essential travel items for ${translatedDest.name}. Check off items as you pack.` : `기본적인 준비물과 ${safeDest.name || '여행지'} 맞춤 아이템 목록입니다. 체크하며 가방을 싸보세요.`}
          </p>

          {/* Add custom item form */}
          <form onSubmit={handleAddCustomItem} style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type="text"
              placeholder={isEn ? "Add custom item..." : "직접 준비물 추가하기..."}
              value={newItemText}
              onChange={(e) => setNewItemText(e.target.value)}
              style={{ flex: 1, padding: '0.5rem 0.8rem', fontSize: '0.85rem' }}
            />
            <button type="submit" className="btn btn-secondary" style={{ padding: '0.5rem 0.8rem', fontSize: '0.85rem' }}>
              ➕ {isEn ? 'Add' : '추가'}
            </button>
          </form>

          {/* Checklist items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '420px', overflowY: 'auto', paddingRight: '0.25rem' }}>
            {checklist.map((item, index) => (
              <div 
                key={index} 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  padding: '0.6rem 0.8rem', 
                  background: item.checked ? 'rgba(255,255,255,0.01)' : 'rgba(255,255,255,0.03)', 
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--glass-border)',
                  opacity: item.checked ? 0.6 : 1,
                  transition: 'all 0.2s'
                }}
              >
                <label className="checkbox-container" style={{ flex: 1 }}>
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={() => handleToggleCheck(index)}
                  />
                  <span className="checkmark"></span>
                  <span style={{ fontSize: '0.9rem', color: item.checked ? 'var(--text-muted)' : 'var(--text-primary)' }}>
                    {translateChecklistItem(item.text, isEn)}
                  </span>
                </label>

                {/* Category tag */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ 
                    fontSize: '0.65rem', 
                    background: item.category === 'essential' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(255,255,255,0.05)',
                    color: item.category === 'essential' ? '#f87171' : 'var(--text-secondary)',
                    padding: '0.15rem 0.35rem',
                    borderRadius: '4px'
                  }}>
                    {item.category === 'essential' ? (isEn ? 'Essential' : '필수') : item.category === 'electronics' ? (isEn ? 'Tech' : '전자') : item.category === 'toiletries' ? (isEn ? 'Hygiene' : '세면') : item.category === 'clothing' ? (isEn ? 'Wear' : '의류') : (isEn ? 'Other' : '기타')}
                  </span>
                  
                  {/* Delete button */}
                  <button 
                    onClick={() => handleDeleteItem(index)}
                    style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.9rem' }}
                    title="삭제"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
            
            {checklist.length === 0 && (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center', padding: '1.5rem' }}>
                {isEn ? 'Packing list is empty.' : '준비물 목록이 비어 있습니다.'}
              </p>
            )}
          </div>

          {/* Progress overview */}
          {checklist.length > 0 && (
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--glass-border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                <span>{isEn ? 'Packing Progress' : '준비 완료 진척도'}</span>
                <span>
                  {checklist.filter(c => c.checked).length} / {checklist.length}{isEn ? ' items' : '개'} ({Math.round((checklist.filter(c => c.checked).length / checklist.length) * 100)}%)
                </span>
              </div>
              <div className="progress-bar-container">
                <div 
                  className="progress-bar" 
                  style={{ width: `${(checklist.filter(c => c.checked).length / checklist.length) * 100}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Print Brochure Modal */}
      {showBrochureModal && (
        <PrintBrochureModal
          destination={translatedDest}
          duration={duration}
          style={style}
          itineraryData={activeItineraryData}
          weatherInfo={weatherInfo}
          checklist={checklist}
          onClose={() => setShowBrochureModal(false)}
          lang={lang}
        />
      )}
    </div>
  );
}
