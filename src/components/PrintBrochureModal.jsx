import React from 'react';

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

  if (!destination) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="brochure-modal-overlay">
      {/* Modal Toolbar (hidden during print) */}
      <div className="brochure-modal-toolbar no-print">
        <div style={{ fontWeight: 800, fontSize: '1rem', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>📖 {isEn ? 'Vintage Travel Brochure Preview' : '레트로 여행 브로셔 미리보기'}</span>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button 
            onClick={handlePrint}
            className="btn btn-primary"
            style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem', background: 'var(--colors-primary)', color: '#fff', border: 'none' }}
          >
            🖨️ {isEn ? 'Print / Export PDF' : '브로셔 인쇄 / PDF 저장'}
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

      {/* High-Aesthetic Catalog Magazine Brochure Layout Container */}
      <div className="brochure-paper-container">
        
        {/* Top Catalog Issue Header Stamp */}
        <div className="brochure-catalog-stamp-header">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #000', paddingBottom: '8px' }}>
            <span style={{ fontFamily: 'Arial Black', fontSize: '13px', letterSpacing: '0.1em' }}>
              ★ VOYAGE GLOBAL TRAVEL CATALOGUE • ISSUE #568
            </span>
            <span style={{ fontSize: '11px', fontWeight: 700 }}>
              {isEn ? 'SPECIAL CUSTOM ITINERARY EDITION' : '스페셜 맞춤 여행 가이드북'}
            </span>
          </div>
        </div>

        {/* Hero Banner Spread */}
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

        {/* Climate & Clothing Recommendation Bar */}
        {weatherInfo && (
          <div className="brochure-weather-bar">
            <div style={{ fontSize: '2.5rem' }}>{weatherInfo.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '4px' }}>
                <strong style={{ fontSize: '14px', color: '#000' }}>
                  {isEn ? 'Climate & Outfit Guide' : '현지 기후 및 복장 가이드'}
                </strong>
                <span className="badge badge-amber" style={{ fontSize: '10px' }}>
                  🌡️ {weatherInfo.tempC}°C ({weatherInfo.summary})
                </span>
              </div>
              <p style={{ fontSize: '11px', margin: 0, color: '#334155', lineHeight: 1.4 }}>
                👕 <strong>{isEn ? 'Outfit Tip:' : '추천 옷차림:'}</strong> {weatherInfo.outfit}
              </p>
            </div>
          </div>
        )}

        {/* Day-by-Day Full Unrolled Itinerary Grid (No Scrolling, Full Data Extract) */}
        <div className="brochure-section-title">
          📅 {isEn ? `COMPLETE ${duration}-DAY CUSTOM ITINERARY` : `전체 ${duration}일간의 맞춤 추천 일정표`}
        </div>

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

        {/* Packing Checklist & Currency Footer Box */}
        <div className="brochure-footer-grid">
          <div className="brochure-footer-box">
            <h4 style={{ margin: '0 0 6px 0', fontSize: '12px', fontWeight: 800 }}>
              🎒 {isEn ? 'TRAVEL ESSENTIALS CHECKLIST' : '여행 필 수 준 비 물'}
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px', fontSize: '10px' }}>
              {checklist.length > 0 ? (
                checklist.map((item, i) => (
                  <div key={i}>[ {item.checked ? '✔' : '  '} ] {item.text}</div>
                ))
              ) : (
                <>
                  <div>[   ] 여권 / 비자 / 신분증</div>
                  <div>[   ] 돼지코 / 멀티어댑터</div>
                  <div>[   ] 환전 현금 / 트래블카드</div>
                  <div>[   ] 비상약 / 상처 연고</div>
                </>
              )}
            </div>
          </div>

          <div className="brochure-footer-box" style={{ background: '#f8fafc' }}>
            <h4 style={{ margin: '0 0 6px 0', fontSize: '12px', fontWeight: 800 }}>
              🪙 {isEn ? 'CURRENCY & INFORMATION' : '현지 통화 및 개요'}
            </h4>
            <div style={{ fontSize: '11px', lineHeight: 1.5 }}>
              <div>• {isEn ? 'Currency:' : '결제 통화:'} <strong>{destination.currency} ({destination.currencySymbol})</strong></div>
              <div>• {isEn ? 'Total Days:' : '총 일수:'} <strong>{duration} Days</strong></div>
              <div>• {isEn ? 'Style:' : '여행 테마:'} <strong>{style.toUpperCase()}</strong></div>
            </div>
          </div>
        </div>

        {/* Bottom Vintage Seal */}
        <div style={{ marginTop: '20px', borderTop: '1px solid #000', paddingTop: '8px', textAlign: 'center', fontSize: '9px', fontWeight: 700 }}>
          VOYAGE GLOBAL SMART TRAVEL SYSTEMS • PRINTED & GENERATED FOR CUSTOM TRAVELERS
        </div>

      </div>
    </div>
  );
}
