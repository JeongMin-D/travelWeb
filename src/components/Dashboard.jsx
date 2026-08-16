import React, { useState, useEffect } from 'react';
import { BANNED_COUNTRIES, generateCustomDestination, COUNTRY_REGISTRY, getClothingAndWeatherGuide, getTranslatedDestination, COUNTRY_ENGLISH_MAPPING, CONTINENT_ENGLISH_MAPPING } from '../data/destinations';

export default function Dashboard({ destinations, onSelectDestination, onRegisterCustomDest, lang = 'en' }) {
  const isEn = lang === 'en';
  const [filterType, setFilterType] = useState('all'); // all, domestic, international
  const [searchQuery, setSearchQuery] = useState('');
  const [duration, setDuration] = useState(3); // 3, 5
  const [style, setStyle] = useState('healing'); // healing, activity, culture, food

  const [visibleCount, setVisibleCount] = useState(24);

  useEffect(() => {
    setVisibleCount(24);
  }, [filterType, searchQuery]);


  // Custom city generator form state
  const [showAddCity, setShowAddCity] = useState(false);
  const [cityName, setCityName] = useState('');
  const [countryName, setCountryName] = useState('');
  const [continent, setContinent] = useState('Asia');
  const [currency, setCurrency] = useState('USD');
  const [currencySymbol, setCurrencySymbol] = useState('$');
  const [formError, setFormError] = useState('');

  const handleCountryChange = (val) => {
    setCountryName(val);
    const cleanVal = val.trim();
    const registryKey = Object.keys(COUNTRY_REGISTRY).find(
      key => key.toLowerCase() === cleanVal.toLowerCase()
    );
    if (registryKey) {
      const reg = COUNTRY_REGISTRY[registryKey];
      setContinent(reg.continent);
      setCurrency(reg.currency);
      setCurrencySymbol(reg.symbol);
    }
  };

  // Filter logic based on the passed destinations prop
  const filtered = (destinations || []).filter((dest) => {
    // 1. Domestic/International
    if (filterType !== 'all' && dest.type !== filterType) return false;

    // 2. Search query (matches name, englishName, country, continent, or tagline)
    const query = searchQuery.toLowerCase().trim();
    if (query) {
      const haystack = `${dest.name} ${dest.englishName || ''} ${dest.country} ${dest.continent} ${dest.tagline}`.toLowerCase();
      if (!haystack.includes(query)) return false;
    }
    return true;
  });

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setFormError('');

    if (!cityName.trim() || !countryName.trim()) {
      setFormError('도시명과 국가명을 모두 입력해주세요.');
      return;
    }

    // Check if the country is travel-banned (Ministry of Foreign Affairs, S.Korea)
    const normalizedCountry = countryName.trim().toLowerCase();
    const isBanned = BANNED_COUNTRIES.some(banned => 
      normalizedCountry.includes(banned.toLowerCase())
    );

    if (isBanned) {
      setFormError(
        `🚨 [안전 경고] 입력하신 국가는 외교부 지정 여행경보 4단계(여행금지) 국가 및 지역입니다. 외교 통상 및 안전 상의 사유로 본 웹사이트에서는 해당 국가의 여행 일정표 생성과 계획 작성을 차단하고 있습니다. 안전한 국가를 입력해주시기 바랍니다.`
      );
      return;
    }

    // Set correct currency defaults if domestic
    let finalCurrency = currency;
    let finalSymbol = currencySymbol;
    if (normalizedCountry === '대한민국' || normalizedCountry === 'korea') {
      finalCurrency = 'KRW';
      finalSymbol = '₩';
    }

    // Procedurally generate destination object
    const customDest = generateCustomDestination(
      cityName.trim(),
      countryName.trim(),
      continent,
      finalCurrency,
      finalSymbol
    );

    onRegisterCustomDest(customDest);
    
    // Reset Form
    setCityName('');
    setCountryName('');
    setFormError('');
    setShowAddCity(false);
  };

  const STYLE_NAMES = {
    healing: isEn ? '🌿 Healing & Rest' : '🌿 힐링 & 휴식',
    activity: isEn ? '⚡ Activity & Adventure' : '⚡ 액티비티 & 체험',
    culture: isEn ? '🏛️ History & Culture' : '🏛️ 역사 & 문화',
    food: isEn ? '🍕 Food & Culinary' : '🍕 식도락 여행'
  };
  const getStyleKoreanName = (styleKey) => STYLE_NAMES[styleKey] || styleKey;

  const handleCardClick = (dest) => {
    let selectedStyle = style || 'healing';
    if (dest?.itineraries && typeof dest.itineraries === 'object') {
      if (!dest.itineraries[selectedStyle]) {
        selectedStyle = Object.keys(dest.itineraries)[0] || 'healing';
      }
    }
    onSelectDestination(dest, duration || 3, selectedStyle);
  };

  return (
    <div className="fade-in">
      {/* Sleek Page Header */}
      <div style={{ marginBottom: '1.75rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '0.4rem' }}>
          ✈️ {isEn ? 'Explore Global Destinations' : '글로벌 추천 여행지 탐색'}
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          {isEn 
            ? 'Browse 906 cities worldwide, view custom itineraries, and plan your dream trip.' 
            : '전 세계 906개 도시의 맞춤형 추천 일정과 여행 정보를 자유롭게 탐색해보세요.'}
        </p>
      </div>

      {/* Filter and Control Panel */}
      <div className="glass-panel" style={{ marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          
          {/* Filter Buttons (Unified Button Design System) */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button 
              className={`btn ${filterType === 'all' ? 'btn-primary' : 'btn-secondary'}`} 
              onClick={() => setFilterType('all')}
              style={{ fontSize: '0.85rem', padding: '0.45rem 1rem' }}
            >
              🗺️ {isEn ? 'All Cities' : '전체'}
            </button>
            <button 
              className={`btn ${filterType === 'domestic' ? 'btn-primary' : 'btn-secondary'}`} 
              onClick={() => setFilterType('domestic')}
              style={{ fontSize: '0.85rem', padding: '0.45rem 1rem' }}
            >
              🇰🇷 {isEn ? 'Domestic' : '국내'}
            </button>
            <button 
              className={`btn ${filterType === 'international' ? 'btn-primary' : 'btn-secondary'}`} 
              onClick={() => setFilterType('international')}
              style={{ fontSize: '0.85rem', padding: '0.45rem 1rem' }}
            >
              ✈️ {isEn ? 'International' : '해외'}
            </button>
          </div>

          {/* Search Box */}
          <div style={{ position: 'relative', flex: 1, minWidth: '260px' }}>
            <input
              type="text"
              placeholder={isEn ? "Search city, country, continent..." : "도시, 국가, 대륙명 검색..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: '100%', paddingLeft: '2.5rem' }}
            />
            <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }}>
              🔍
            </span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', borderTop: '1px solid var(--colors-frame-ink)', paddingTop: '1rem' }}>
          
          {/* Duration Selector */}
          <div>
            <label style={{ display: 'block', marginBottom: '0.35rem', fontSize: '0.85rem', fontWeight: 600 }}>
              📅 {isEn ? 'Trip Duration' : '여행 기간'}
            </label>
            <select
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              style={{ width: '100%', padding: '0.45rem' }}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 14].map((d) => (
                <option key={d} value={d}>{isEn ? `${d} Days` : `${d}일 일정`}</option>
              ))}
            </select>
          </div>

          {/* Style Selector */}
          <div>
            <label style={{ display: 'block', marginBottom: '0.35rem', fontSize: '0.85rem', fontWeight: 600 }}>
              🏕️ {isEn ? 'Travel Style' : '여행 스타일'}
            </label>
            <select 
              value={style} 
              onChange={(e) => setStyle(e.target.value)}
              style={{ width: '100%' }}
            >
              <option value="healing">🌿 {isEn ? 'Healing & Rest' : '힐링 & 휴식'}</option>
              <option value="activity">⚡ {isEn ? 'Activity & Adventure' : '액티비티 & 체험'}</option>
              <option value="culture">🏛️ {isEn ? 'History & Culture' : '역사 & 문화'}</option>
              <option value="food">🍕 {isEn ? 'Food & Gourmet' : '식도락 여행'}</option>
            </select>
          </div>

        </div>
      </div>

      {/* Dynamic Destination Registrator Panel */}
      {showAddCity && (
        <div className="glass-panel fade-in" style={{ marginBottom: '2.5rem', border: '2px solid var(--colors-primary)' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '0.5rem' }}>
            🌐 {isEn ? 'Register New City & AI Itinerary Design' : '새 도시 등록 및 인공지능 일정 설계'}
          </h3>
          <p style={{ fontSize: '13px', marginBottom: '1rem' }}>
            {isEn ? 'Register any custom city worldwide. Travel-banned countries are automatically blocked in real-time.' : '데이터베이스에 없는 전 세계 모든 도시를 등록해 보세요. 외교부 지정 여행금지 국가는 실시간 자동 차단됩니다.'}
          </p>

          <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '0.25rem' }}>{isEn ? 'City Name' : '도시명'}</label>
                <input
                  type="text"
                  required
                  placeholder={isEn ? "e.g., Vancouver, Bangkok, Jeju" : "예: 밴쿠버, 방콕, 제주도"}
                  value={cityName}
                  onChange={(e) => setCityName(e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '0.25rem' }}>{isEn ? 'Country Name' : '국가명'}</label>
                <input
                  type="text"
                  required
                  placeholder={isEn ? "e.g., Canada, Thailand, Korea" : "예: 캐나다, 태국, 대한민국"}
                  value={countryName}
                  onChange={(e) => handleCountryChange(e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '0.25rem' }}>{isEn ? 'Continent' : '대륙'}</label>
                <select
                  value={continent}
                  onChange={(e) => setContinent(e.target.value)}
                  style={{ width: '100%' }}
                >
                  <option value="Asia">Asia ({isEn ? 'Asia' : '아시아'})</option>
                  <option value="Europe">Europe ({isEn ? 'Europe' : '유럽'})</option>
                  <option value="Americas">Americas ({isEn ? 'Americas' : '아메리카'})</option>
                  <option value="Oceania">Oceania ({isEn ? 'Oceania' : '오세아니아'})</option>
                  <option value="Africa">Africa ({isEn ? 'Africa' : '아프리카'})</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '0.25rem' }}>{isEn ? 'Currency Code' : '결제 통화 코드'}</label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  style={{ width: '100%' }}
                >
                  <option value="USD">USD ($)</option>
                  <option value="JPY">JPY (¥)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="AUD">AUD (A$)</option>
                  <option value="THB">THB (฿)</option>
                  <option value="IDR">IDR (Rp)</option>
                  <option value="KRW">KRW (₩)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '0.25rem' }}>{isEn ? 'Currency Symbol' : '통화 기호'}</label>
                <input
                  type="text"
                  placeholder={isEn ? "e.g., $, ¥, €, ₩" : "예: $, ¥, €, ₩"}
                  value={currencySymbol}
                  onChange={(e) => setCurrencySymbol(e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>
            </div>

            {formError && (
              <div style={{ 
                color: 'var(--colors-primary)', 
                background: 'rgba(233, 29, 42, 0.08)', 
                padding: '0.75rem', 
                fontSize: '13px',
                border: '1px solid var(--colors-primary)' 
              }}>
                {formError}
              </div>
            )}

            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
              <button type="submit" className="btn btn-accent" style={{ flex: 1 }}>
                🚀 {isEn ? 'Register & Generate Plan' : '도시 등록 및 일정 설계'}
              </button>
              <button 
                type="button" 
                onClick={() => { setShowAddCity(false); setFormError(''); }} 
                className="btn btn-secondary"
                style={{ flex: 1 }}
              >
                {isEn ? 'Cancel' : '취소'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Destinations Header with Add Button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h3 style={{ fontSize: '1.5rem', fontWeight: 700 }}>
          {isEn ? `Recommended Destinations (${filtered.length})` : `추천 여행지 (${filtered.length})`}
        </h3>
        
        <button 
          className="btn btn-accent" 
          onClick={() => { setShowAddCity(!showAddCity); setFormError(''); }}
          style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
        >
          {showAddCity 
            ? (isEn ? '✕ Close Window' : '✕ 등록 창 닫기') 
            : (isEn ? '🌐 Register Custom City' : '🌐 목록에 없는 도시 등록하기')}
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>
            {isEn ? '🔍 No destinations matching your search.' : '🔍 검색 결과에 맞는 여행지가 없습니다.'}
          </p>
          <p style={{ fontSize: '0.9rem' }}>
            {isEn ? 'Try different keywords or filters, or register a new city above.' : '다른 키워드나 필터를 적용하거나 우측 상단 버튼을 통해 새로운 도시를 등록해보세요.'}
          </p>
        </div>
      ) : (
        <>
          <div className="grid-2">
            {filtered.slice(0, visibleCount).map((dest, index) => {
              const tints = ['sage', 'salmon', 'peach', 'lime', 'sky', 'steel', 'periwinkle', 'olive'];
              const tint = tints[index % tints.length];
              const weather = getClothingAndWeatherGuide(dest.name, dest.country, isEn);
              const td = getTranslatedDestination(dest, isEn);
              const displayCountry = isEn ? (COUNTRY_ENGLISH_MAPPING[dest.country] || td.country || dest.country) : dest.country;
              const displayContinent = isEn ? (CONTINENT_ENGLISH_MAPPING[dest.continent] || dest.continent) : dest.continent;
              
              return (
                <div 
                  key={dest.id} 
                  className="destination-card"
                  onClick={() => handleCardClick(dest)}
                  style={{ cursor: 'pointer' }}
                >
                  {/* New Burst sticker for custom registered cities */}
                  {(dest.id.startsWith('custom_') || index < 4) && (
                    <div className="new-burst-sticker">NEW!</div>
                  )}

                  {/* Title bar */}
                  <div className="destination-card-title">
                    <span>✈️ {isEn ? (dest.englishName || dest.name) : dest.name}</span>
                    <span style={{ fontSize: '10px' }}>{displayContinent} / {displayCountry}</span>
                  </div>

                  {/* Tinted Body */}
                  <div className={`destination-card-body ribbon-${tint}`}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                        <span className={`badge ${dest.type === 'domestic' ? 'badge-indigo' : 'badge-cyan'}`}>
                          {dest.type === 'domestic' ? (isEn ? 'DOMESTIC' : '국내') : (isEn ? 'INTERNATIONAL' : '해외')}
                        </span>
                        <span className="badge badge-amber">
                          {dest.currency} ({dest.currencySymbol})
                        </span>
                        <span className="badge badge-emerald">
                          {weather.icon} {weather.tempC}°C
                        </span>
                      </div>
                      <p style={{ fontWeight: 700, fontSize: '13px', margin: '4px 0', fontFamily: 'var(--font-heading)' }}>
                        "{td.tagline}"
                      </p>
                      <p style={{ fontSize: '13px', color: 'var(--colors-ink)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: '3', WebkitBoxOrient: 'vertical' }}>
                        {td.description}
                      </p>
                    </div>

                    {/* Photo Notch */}
                    <div className="destination-card-photo-container">
                      <img 
                        src={dest.imageUrl} 
                        alt={dest.name} 
                        className="destination-card-photo" 
                        loading="lazy"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {filtered.length > visibleCount && (
            <div style={{ textAlign: 'center', marginTop: '2.5rem', marginBottom: '1.5rem' }}>
              <button 
                onClick={() => setVisibleCount(prev => prev + 24)} 
                className="btn btn-primary"
                style={{ 
                  padding: '10px 30px', 
                  fontSize: '12px'
                }}
              >
                ✨ {isEn ? `View More Cities (${filtered.length - visibleCount} left)` : `더 많은 여행지 보기 (${filtered.length - visibleCount}개 남음)`}
              </button>
            </div>
          )}
        </>
      )}

    </div>
  );
}
