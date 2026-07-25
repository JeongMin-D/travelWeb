import React, { useState, useEffect } from 'react';
import { NEIGHBOR_MAPPING, COUNTRY_REGISTRY, getPolishedItinerary, getCityCoordinates, getClothingAndWeatherGuide } from '../data/destinations';
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
  destination, 
  initialDuration, 
  initialStyle, 
  onBack, 
  onStartPlanning, 
  onStartBudgeting,
  lang = 'en'
}) {
  const isEn = lang === 'en';
  const [duration, setDuration] = useState(initialDuration);
  const [style, setStyle] = useState(initialStyle);
  const [checklist, setChecklist] = useState([]);
  const [newItemText, setNewItemText] = useState('');

  // Styles list supported by this destination
  const availableStyles = Object.keys(destination.itineraries);

  // If initialStyle is not supported by the destination, pick the first one
  useEffect(() => {
    if (!availableStyles.includes(style)) {
      setStyle(availableStyles[0] || 'healing');
    }
  }, [destination]);

  // Load or construct checklist
  useEffect(() => {
    const storageKey = `checklist_${destination.id}`;
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      setChecklist(JSON.parse(stored));
    } else {
      // Build default list
      const defaults = [
        ...destination.essentials.map(item => ({ text: item, checked: false, category: 'essential' })),
        { text: '휴대폰 충전기', checked: false, category: 'electronics' },
        { text: '개인 세면도구', checked: false, category: 'toiletries' },
        { text: '편한 여벌 옷', checked: false, category: 'clothing' },
        { text: '상비약 (종합감기약, 대역전)', checked: false, category: 'other' }
      ];
      // If international, add international items
      if (destination.type === 'international') {
        defaults.unshift(
          { text: '여권 및 여권 복사본', checked: false, category: 'essential' },
          { text: '해외 매직 플러그 (어댑터)', checked: false, category: 'electronics' },
          { text: '해외 결제 카드 / 현금 환전', checked: false, category: 'essential' }
        );
      }
      setChecklist(defaults);
    }
  }, [destination]);

  // Save checklist to localStorage whenever it changes
  const saveChecklist = (list) => {
    setChecklist(list);
    localStorage.setItem(`checklist_${destination.id}`, JSON.stringify(list));
  };

  const handleToggleCheck = (index) => {
    const updated = [...checklist];
    updated[index].checked = !updated[index].checked;
    saveChecklist(updated);
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
      localStorage.removeItem(`checklist_${destination.id}`);
      // Re-trigger the checklist construction effect by reloading destination
      const defaults = [
        ...destination.essentials.map(item => ({ text: item, checked: false, category: 'essential' })),
        { text: '휴대폰 충전기', checked: false, category: 'electronics' },
        { text: '개인 세면도구', checked: false, category: 'toiletries' },
        { text: '편한 여벌 옷', checked: false, category: 'clothing' },
        { text: '상비약 (종합감기약, 대역전)', checked: false, category: 'other' }
      ];
      if (destination.type === 'international') {
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

  const activeItineraryData = getPolishedItinerary(destination, style, duration);
  const neighbors = NEIGHBOR_MAPPING[destination.name] || [];

  const [isVisited, setIsVisited] = useState(false);

  useEffect(() => {
    const visitedList = JSON.parse(localStorage.getItem('visited_cities') || '[]');
    const exists = visitedList.some(v => v.id === destination.id);
    setIsVisited(exists);
  }, [destination]);

  const handleToggleVisited = () => {
    const visitedList = JSON.parse(localStorage.getItem('visited_cities') || '[]');
    let updated;
    if (isVisited) {
      updated = visitedList.filter(v => v.id !== destination.id);
      setIsVisited(false);
      alert(`🗑️ [${destination.name}] 다녀온 도시 목록에서 해제되었습니다.`);
    } else {
      const visitObj = {
        id: destination.id,
        name: destination.name,
        country: destination.country,
        continent: destination.continent,
        imageUrl: destination.imageUrl,
        tagline: destination.tagline,
        visitedAt: new Date().toISOString().split('T')[0],
        notes: ''
      };
      updated = [...visitedList, visitObj];
      setIsVisited(true);
      alert(`🎉 [${destination.name}] 다녀온 도시 목록에 등록되었습니다! "다녀온 도시" 탭에서 확인해 보세요.`);
    }
    localStorage.setItem('visited_cities', JSON.stringify(updated));
  };


  const [mapInstance, setMapInstance] = useState(null);

  // Initialize Map
  useEffect(() => {
    const [cityLat, cityLng] = getCityCoordinates(destination.name, destination.country);
    const map = L.map('itinerary-map', {
      zoomControl: true,
      scrollWheelZoom: false
    }).setView([cityLat, cityLng], 12);

    L.tileLayer('https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}&hl=ko', {
      attribution: '&copy; Google Maps',
      maxZoom: 20
    }).addTo(map);

    setMapInstance(map);

    return () => {
      map.remove();
    };
  }, [destination]);

  // Update Markers & Routes
  useEffect(() => {
    if (!mapInstance) return;

    mapInstance.eachLayer((layer) => {
      if (layer instanceof L.Marker || layer instanceof L.Polyline) {
        mapInstance.removeLayer(layer);
      }
    });

    const [cityLat, cityLng] = getCityCoordinates(destination.name, destination.country);
    
    const dayColors = {
      1: '#6366f1',
      2: '#06b6d4',
      3: '#10b981',
      4: '#f59e0b',
      5: '#ec4899'
    };

    const allCoords = [];

    for (let dayNum = 1; dayNum <= duration; dayNum++) {
      const dayActivities = activeItineraryData[dayNum] || [];
      const dayColor = dayColors[dayNum] || '#6366f1';
      const dayPathCoords = [];

      dayActivities.forEach((act, actIndex) => {
        const angle = (dayNum * 72 + actIndex * 45) * (Math.PI / 180);
        const radius = 0.008 + actIndex * 0.003;
        const offsetLat = Math.sin(angle) * radius;
        const offsetLng = Math.cos(angle) * radius;
        const actCoords = [cityLat + offsetLat, cityLng + offsetLng];
        
        dayPathCoords.push(actCoords);
        allCoords.push(actCoords);

        const divIcon = L.divIcon({
          className: 'custom-map-marker',
          html: `<div class="marker-dot" style="background-color: ${dayColor}; box-shadow: 0 0 10px ${dayColor};">${dayNum}-${actIndex + 1}</div>`,
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        });

        L.marker(actCoords, { icon: divIcon })
          .addTo(mapInstance)
          .bindPopup(`
            <div style="color: #0b0f19; font-family: sans-serif; font-size: 0.85rem; padding: 2px;">
              <strong style="color: ${dayColor}; display: block; margin-bottom: 2px;">☀️ DAY ${dayNum} - 🕒 ${act.time}</strong>
              <strong style="font-size: 0.9rem; display: block; margin-bottom: 4px;">${act.title}</strong>
              <span style="color: #555; display: block; font-size: 0.75rem; line-height: 1.3;">${act.desc}</span>
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
  }, [mapInstance, activeItineraryData, duration]);



  const getStyleKoreanName = (styleKey) => {
    switch (styleKey) {
      case 'healing': return isEn ? '🌿 Healing & Rest' : '🌿 힐링 & 휴식';
      case 'activity': return isEn ? '⚡ Activity & Adventure' : '⚡ 액티비티 & 체험';
      case 'culture': return isEn ? '🏛️ History & Culture' : '🏛️ 역사 & 문화';
      case 'food': return isEn ? '🍕 Food & Culinary' : '🍕 식도락 여행';
      default: return styleKey;
    }
  };

  const weatherInfo = getClothingAndWeatherGuide(destination.name, destination.country, isEn);

  return (
    <div className="fade-in">
      {/* Top Action Bar with Print/PDF Export Button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <button onClick={onBack} className="btn btn-secondary">
          {isEn ? '⬅️ Back to Destinations' : '⬅️ 목록으로 돌아가기'}
        </button>

        <button 
          onClick={() => window.print()} 
          className="btn btn-primary"
          style={{ background: '#000000', color: '#ffffff', border: '1px solid #000000' }}
        >
          🖨️ {isEn ? 'Print Brochure / Export PDF' : '카탈로그 브로셔 인쇄 / PDF 저장'}
        </button>
      </div>

      {/* Print Only Header Seal */}
      <div className="print-catalog-header" style={{ display: 'none' }}>
        <h1>VOYAGE GLOBAL SMART TRAVEL BROCHURE</h1>
        <p style={{ margin: '4px 0 0 0', fontSize: '11pt' }}>
          Destination: {destination.name} ({destination.englishName}), {destination.country} | Duration: {duration} Days
        </p>
      </div>

      {/* Destination Hero Panel */}
      <div 
        className="glass-panel" 
        style={{ 
          position: 'relative', 
          overflow: 'hidden', 
          borderRadius: 'var(--radius-lg)', 
          padding: '2.5rem', 
          marginBottom: '2rem',
          backgroundImage: `linear-gradient(to right, rgba(11, 15, 25, 0.9) 30%, rgba(11, 15, 25, 0.4) 100%), url(${destination.imageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: '260px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          border: '1px solid rgba(255, 255, 255, 0.12)'
        }}
      >
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
            <span className={`badge ${destination.type === 'domestic' ? 'badge-indigo' : 'badge-cyan'}`}>
              {destination.type === 'domestic' ? '국내 여행지' : '해외 여행지'}
            </span>
            <span className="badge badge-emerald">{destination.continent}</span>
            <span className="badge badge-amber">🪙 통화: {destination.currency} ({destination.currencySymbol})</span>
            {neighbors && neighbors.length > 0 && (
              <span className="badge badge-violet" style={{ textShadow: 'none', background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)', color: '#ffffff' }}>
                📍 인접 도시 연계: {neighbors.join(', ')}
              </span>
            )}
          </div>


          <h1 style={{ fontSize: '3rem', fontWeight: 800, margin: '0.5rem 0', textShadow: '0 4px 12px rgba(0,0,0,0.5)' }}>
            {destination.name}
            <span style={{ fontSize: '1.25rem', marginLeft: '0.75rem', fontWeight: 400, color: 'var(--text-secondary)' }}>
              {destination.englishName}, {destination.country}
            </span>
          </h1>

          <p style={{ color: 'var(--color-accent)', fontSize: '1.1rem', fontWeight: 600, maxWidth: '700px', marginBottom: '0.75rem' }}>
            "{destination.tagline}"
          </p>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '700px' }}>
            {destination.description}
          </p>
        </div>
      </div>

      {/* Weather & Clothing Recommendation Guide Panel */}
      <div className="glass-panel" style={{ marginBottom: '2rem', background: 'rgba(15, 23, 42, 0.4)', borderLeft: '4px solid var(--color-accent)' }}>
        <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ fontSize: '3rem', lineHeight: 1 }}>{weatherInfo.icon}</div>
          <div style={{ flex: 1, minWidth: '240px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
              <span className="badge badge-amber" style={{ fontSize: '11px', fontWeight: 800 }}>
                🌡️ {weatherInfo.tempC}°C
              </span>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {weatherInfo.summary} (Lat: {weatherInfo.lat}°)
              </span>
            </div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 800, margin: '0.25rem 0', color: 'var(--color-accent)' }}>
              👕 {isEn ? 'Recommended Outfit & Packing Guide:' : '추천 여행 복장 & 코디 가이드:'}
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
              {weatherInfo.outfit}
            </p>
          </div>
        </div>
      </div>

      {/* Control filters for the active recommendation */}
      <div className="glass-panel" style={{ marginBottom: '2rem', display: 'flex', gap: '1.5rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
          
          {/* Duration Selector */}
          <div>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>여행 기간 설정</span>
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
                  {d}일 일정
                </option>
              ))}
            </select>
          </div>

          {/* Style Selector */}
          <div>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>여행 테마</span>
            <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
              {availableStyles.map((s) => (
                <button
                  key={s}
                  onClick={() => setStyle(s)}
                  className={`btn ${style === s ? 'btn-accent' : 'btn-secondary'}`}
                  style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}
                >
                  {getStyleKoreanName(s)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Action triggers */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button 
            onClick={() => onStartPlanning(destination, duration, style)} 
            className="btn btn-primary"
            style={{ fontSize: '0.9rem' }}
          >
            ✈️ 셀프 플래너로 가져오기 (편집)
          </button>
          <button 
            onClick={() => onStartBudgeting(destination)} 
            className="btn btn-accent"
            style={{ fontSize: '0.9rem' }}
          >
            💰 예산 수립하기
          </button>
          <button 
            onClick={handleToggleVisited} 
            className="btn"
            style={{ 
              fontSize: '0.9rem', 
              background: isVisited ? 'var(--color-success)' : 'rgba(255,255,255,0.05)', 
              color: '#ffffff',
              border: '1px solid var(--glass-border)'
            }}
          >
            {isVisited ? '💚 다녀온 도시!' : '🤍 가본 도시 등록'}
          </button>
        </div>
      </div>

      {/* Map Section */}
      <div className="glass-panel" style={{ padding: '1.25rem', marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          🗺️ {destination.name} 여행 경로 지도
        </h3>
        <div 
          id="itinerary-map" 
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
          💡 지도 상의 번호는 각 일차(Day)와 해당 활동 순서를 뜻합니다 (예: 1-2 = 1일차 2번째 활동). 점선은 일차별 이동 동선입니다.
        </p>
      </div>


      {/* Two Column Layout: Itinerary & Packing Checklist */}
      <div className="grid-2" style={{ alignItems: 'flex-start' }}>
        
        {/* Left Side: Daily Timeline */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 700, borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>📅 {duration}일 추천 일정 </span>
            <span style={{ fontSize: '0.9rem', color: 'var(--color-accent)', fontWeight: 500 }}>
              {getStyleKoreanName(style)}
            </span>
          </h3>

          {/* Generate Days */}
          {Array.from({ length: duration }).map((_, i) => {
            const dayNum = i + 1;
            const dayActivities = activeItineraryData[dayNum] || [];

            return (
              <div key={dayNum} style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ color: 'var(--text-primary)', fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', background: 'rgba(255,255,255,0.03)', padding: '0.4rem 0.8rem', borderRadius: '4px', borderLeft: '3px solid var(--color-primary)' }}>
                  ☀️ DAY {dayNum}
                </h4>

                {dayActivities.length === 0 ? (
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', paddingLeft: '1rem' }}>
                    이 날은 자유 일정 및 개별 힐링 시간입니다.
                  </p>
                ) : (
                  <div className="timeline">
                    {dayActivities.map((act, actIndex) => (
                      <div key={actIndex} className="timeline-item">
                        <div className="timeline-time">{act.time}</div>
                        <div className="timeline-title">{act.title}</div>
                        <div className="timeline-desc">{act.desc}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Right Side: Checklist */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 700, borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>🎒 여행 준비물 체크리스트</span>
            <button 
              onClick={handleResetChecklist}
              className="btn" 
              style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--color-danger)', border: '1px solid rgba(239, 68, 68, 0.2)' }}
            >
              🔄 초기화
            </button>
          </h3>

          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '-0.75rem' }}>
            기본적인 준비물과 {destination.name} 맞춤 아이템 목록입니다. 체크하며 가방을 싸보세요.
          </p>

          {/* Add custom item form */}
          <form onSubmit={handleAddCustomItem} style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type="text"
              placeholder="직접 준비물 추가하기..."
              value={newItemText}
              onChange={(e) => setNewItemText(e.target.value)}
              style={{ flex: 1, padding: '0.5rem 0.8rem', fontSize: '0.85rem' }}
            />
            <button type="submit" className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
              추가
            </button>
          </form>

          {/* Checklist render grouped */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', maxHeight: '420px', overflowY: 'auto', paddingRight: '0.5rem' }}>
            {checklist.map((item, index) => (
              <div 
                key={index} 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  background: 'rgba(255,255,255,0.01)',
                  padding: '0.5rem 0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid rgba(255,255,255,0.03)'
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
                    {item.text}
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
                    {item.category === 'essential' ? '필수' : item.category === 'electronics' ? '전자' : item.category === 'toiletries' ? '세면' : item.category === 'clothing' ? '의류' : '기타'}
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
                준비물 목록이 비어 있습니다.
              </p>
            )}
          </div>

          {/* Progress overview */}
          {checklist.length > 0 && (
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--glass-border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                <span>준비 완료 진척도</span>
                <span>
                  {checklist.filter(c => c.checked).length} / {checklist.length}개 ({Math.round((checklist.filter(c => c.checked).length / checklist.length) * 100)}%)
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
    </div>
  );
}
