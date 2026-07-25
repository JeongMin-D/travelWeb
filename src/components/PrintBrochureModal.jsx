import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getCityCoordinates, getLandmarkCoordinates } from '../data/destinations';

export default function PrintBrochureModal({ 
  destination, 
  duration, 
  style, 
  itineraryData, 
  weatherInfo, 
  checklist = [], 
  onClose,
  lang = 'en'
}) {
  const isEn = lang === 'en';
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (!destination || !mapContainerRef.current) return;

    const [lat, lng] = getCityCoordinates(destination.name, destination.country);

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
    }

    const map = L.map(mapContainerRef.current, {
      center: [lat, lng],
      zoom: 12,
      zoomControl: false,
      attributionControl: false,
      dragging: false,
      scrollWheelZoom: false
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

    const allCoords = [];
    const placedMarkerCoords = [];

    if (itineraryData) {
      Object.keys(itineraryData).forEach((dayNum) => {
        const activities = itineraryData[dayNum] || [];
        activities.forEach((act, actIdx) => {
          const rawCoords = getLandmarkCoordinates(destination.name, act.title, Number(dayNum), actIdx, destination.country);
          
          let finalLat = rawCoords[0];
          let finalLng = rawCoords[1];

          const overlappingCount = placedMarkerCoords.filter(p => {
            const dLat = Math.abs(p[0] - finalLat);
            const dLng = Math.abs(p[1] - finalLng);
            return dLat < 0.002 && dLng < 0.002;
          }).length;

          if (overlappingCount > 0) {
            const angle = (overlappingCount * 75 + Number(dayNum) * 45 + actIdx * 30) * (Math.PI / 180);
            const offsetDist = 0.002 + (overlappingCount * 0.0006);
            finalLat += Math.sin(angle) * offsetDist;
            finalLng += Math.cos(angle) * offsetDist;
          }

          const actCoords = [finalLat, finalLng];
          placedMarkerCoords.push(actCoords);
          allCoords.push(actCoords);

          L.circleMarker(actCoords, {
            radius: 5,
            fillColor: '#e91d2a',
            color: '#000000',
            weight: 1,
            opacity: 1,
            fillOpacity: 0.9
          }).addTo(map);
        });
      });
    }

    if (allCoords.length > 0) {
      const bounds = L.latLngBounds(allCoords);
      map.fitBounds(bounds, { padding: [15, 15] });
    }

    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [destination, itineraryData]);

  if (!destination) return null;

  const handlePrint = () => {
    // Leaflet calculates its canvas size from the visible preview. Refresh it
    // immediately before the browser captures the dedicated print layer.
    mapInstanceRef.current?.invalidateSize(false);
    window.setTimeout(() => window.print(), 150);
  };

  // Rendering into document.body keeps the print document independent from the
  // app layout that sits behind the preview modal.
  return createPortal(
    <div className="brochure-modal-overlay">
      {/* Modal Toolbar */}
      <div className="brochure-modal-toolbar no-print">
        <div style={{ fontWeight: 800, fontSize: '1rem', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>📖 {isEn ? 'Vintage 2-Page Brochure Magazine Preview' : '2페이지 감성 카탈로그 브로셔 미리보기'}</span>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button 
            onClick={handlePrint}
            className="btn btn-primary"
            style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem', background: 'var(--colors-primary)', color: '#fff', border: 'none' }}
          >
            🖨️ {isEn ? 'Print / Save PDF' : '브로셔 인쇄 / PDF 저장'}
          </button>
          <button 
            onClick={onClose}
            className="btn btn-secondary"
            style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
          >
            ✕ {isEn ? 'Close' : '닫기'}
          </button>
        </div>
      </div>

      {/* 2-Page Catalog Magazine Booklet Container */}
      <div className="brochure-booklet-container">
        
        {/* PAGE 1: COVER & OVERVIEW SPREAD */}
        <div className="brochure-page-spread page-1">
          {/* Header Stamp */}
          <div className="brochure-catalog-stamp-header">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #000', paddingBottom: '6px' }}>
              <span style={{ fontFamily: 'Arial Black', fontSize: '12px', letterSpacing: '0.1em' }}>
                ★ VOYAGE GLOBAL TRAVEL MAGAZINE • PAGE 1 (COVER & OVERVIEW)
              </span>
              <span style={{ fontSize: '10px', fontWeight: 800 }}>
                {isEn ? 'ISSUE #568 CATALOG' : '568개 도시 스페셜 에디션'}
              </span>
            </div>
          </div>

          {/* Hero Spread */}
          <div className="brochure-hero-spread">
            <div className="brochure-hero-text">
              <div className="brochure-category-tag">
                {destination.continent} / {destination.country} • {destination.type === 'domestic' ? (isEn ? 'DOMESTIC' : '국내 여행') : (isEn ? 'INTERNATIONAL' : '해외 여행')}
              </div>
              <h1 className="brochure-title">
                {destination.name}
              </h1>
              <h3 className="brochure-subtitle">
                {destination.englishName}, {destination.country}
              </h3>
              <p className="brochure-quote">
                "{destination.tagline}"
              </p>
              <p className="brochure-desc">
                {destination.description}
              </p>
            </div>

            <div className="brochure-hero-photo-frame">
              <img src={destination.imageUrl} alt={destination.name} className="brochure-photo" />
              <div className="brochure-photo-caption">
                📍 {destination.name} OFFICIAL PHOTO CATALOG
              </div>
            </div>
          </div>

          {/* Middle Spread: City Location Map & Climate Guide Side-by-Side */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '1.25rem', marginBottom: '1.5rem' }}>
            
            {/* City Location Map Frame */}
            <div style={{ border: '1px solid #000', padding: '8px', background: '#fff' }}>
              <div style={{ fontSize: '11px', fontWeight: 800, marginBottom: '6px', borderBottom: '1px solid #000', paddingBottom: '3px' }}>
                🗺️ {isEn ? 'DESTINATION LOCATION MAP' : '여행지 위치 지도'}
              </div>
              <div ref={mapContainerRef} style={{ width: '100%', height: '140px', border: '1px solid #cbd5e1' }}></div>
            </div>

            {/* Weather & Climate Box */}
            {weatherInfo && (
              <div style={{ border: '1px solid #000', padding: '10px', background: '#f8fafc' }}>
                <div style={{ fontSize: '11px', fontWeight: 800, marginBottom: '6px', borderBottom: '1px solid #000', paddingBottom: '3px', display: 'flex', justifyContent: 'space-between' }}>
                  <span>🌤️ {isEn ? 'CLIMATE & OUTFIT GUIDE' : '현지 기후 및 복장 가이드'}</span>
                  <span>🌡️ {weatherInfo.tempC}°C</span>
                </div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: '6px' }}>
                  <span style={{ fontSize: '2.2rem' }}>{weatherInfo.icon}</span>
                  <div style={{ fontSize: '11px', lineHeight: 1.4 }}>
                    <div style={{ fontWeight: 700, color: '#000' }}>{weatherInfo.summary}</div>
                    <div style={{ color: '#334155', marginTop: '3px' }}>
                      👕 <strong>{isEn ? 'Outfit:' : '복장:'}</strong> {weatherInfo.outfit}
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Page 1 Summary Box */}
          <div style={{ border: '1px solid #000', padding: '10px 14px', background: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px' }}>
            <div>• {isEn ? 'Currency:' : '결제 통화:'} <strong>{destination.currency} ({destination.currencySymbol})</strong></div>
            <div>• {isEn ? 'Total Duration:' : '여행 기간:'} <strong>{duration} Days</strong></div>
            <div>• {isEn ? 'Travel Style:' : '추천 테마:'} <strong>{style.toUpperCase()}</strong></div>
          </div>
          
          <div className="brochure-page-footer-seal">
            PAGE 1 / 2 • VOYAGE GLOBAL TRAVEL MAGAZINE
          </div>
        </div>

        {/* PAGE 2: ITINERARY & CHECKLIST SPREAD */}
        <div className="brochure-page-spread page-2">
          {/* Header Stamp */}
          <div className="brochure-catalog-stamp-header">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #000', paddingBottom: '6px' }}>
              <span style={{ fontFamily: 'Arial Black', fontSize: '12px', letterSpacing: '0.1em' }}>
                ★ VOYAGE GLOBAL TRAVEL MAGAZINE • PAGE 2 (FULL ITINERARY & CHECKLIST)
              </span>
              <span style={{ fontSize: '10px', fontWeight: 800 }}>
                {destination.name} COMPLETE PLAN
              </span>
            </div>
          </div>

          <div className="brochure-section-title">
            📅 {isEn ? `FULL ${duration}-DAY DETAILED ITINERARY TIMELINE` : `전체 ${duration}일간의 상세 여행 타임라인`}
          </div>

          {/* Unrolled Day Cards Grid (All Days Extracted) */}
          <div className="brochure-days-grid">
            {Array.from({ length: duration }).map((_, idx) => {
              const dayNum = idx + 1;
              const activities = itineraryData[dayNum] || [];

              return (
                <div key={dayNum} className="brochure-day-card">
                  <div className="brochure-day-header">
                    DAY {dayNum} ITINERARY
                  </div>
                  <div className="brochure-day-activities">
                    {activities.map((act, aIdx) => (
                      <div key={aIdx} className="brochure-activity-item">
                        <div className="brochure-act-time">{act.time}</div>
                        <div className="brochure-act-content">
                          <div className="brochure-act-title">{act.title}</div>
                          <div className="brochure-act-desc">{act.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Essentials Checklist Box */}
          <div style={{ border: '1px solid #000', padding: '12px', background: '#fff', marginTop: '1rem' }}>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '12px', fontWeight: 800, borderBottom: '1px solid #000', paddingBottom: '4px' }}>
              🎒 {isEn ? 'TRAVEL PACKING CHECKLIST' : '여행 필수 준비물 체크리스트'}
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', fontSize: '10.5px' }}>
              {checklist.length > 0 ? (
                checklist.map((item, i) => (
                  <div key={i}>[ {item.checked ? '✔' : '  '} ] {item.text}</div>
                ))
              ) : (
                <>
                  <div>[   ] {isEn ? 'Passport / ID' : '여권 / 신분증'}</div>
                  <div>[   ] {isEn ? 'Multi-Adapter' : '돼지코 멀티어댑터'}</div>
                  <div>[   ] {isEn ? 'Travel Credit Card' : '트래블 카카오/신한 카드'}</div>
                  <div>[   ] {isEn ? 'Emergency Medicine' : '비상약 / 연고'}</div>
                  <div>[   ] {isEn ? 'Sunblock & Glasses' : '자외선 차단제 / 선글라스'}</div>
                  <div>[   ] {isEn ? 'Comfortable Shoes' : '편안한 도보 운동화'}</div>
                </>
              )}
            </div>
          </div>

          <div className="brochure-page-footer-seal">
            PAGE 2 / 2 • END OF CATALOGUE • VOYAGE SMART PLANNER
          </div>
        </div>

      </div>
    </div>,
    document.body
  );
}
