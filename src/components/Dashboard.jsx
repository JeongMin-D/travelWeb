import React, { useState, useEffect } from 'react';
import { BANNED_COUNTRIES, COUNTRY_REGISTRY, getClothingAndWeatherGuide, getTranslatedDestination, COUNTRY_ENGLISH_MAPPING, CONTINENT_ENGLISH_MAPPING } from '../data/destinations';
import appDb from '../db/appDb';

export default function Dashboard({ destinations, onSelectDestination, lang = 'en' }) {
  const isEn = lang === 'en';
  const [filterType, setFilterType] = useState('all'); // all, domestic, international
  const [searchQuery, setSearchQuery] = useState('');
  const [duration, setDuration] = useState(3); // 3, 5
  const [style, setStyle] = useState('healing'); // healing, activity, culture, food

  const [visibleCount, setVisibleCount] = useState(24);

  useEffect(() => {
    setVisibleCount(24);
  }, [filterType, searchQuery]);

  // Request new city modal/form state
  const [showAddCity, setShowAddCity] = useState(false);
  const [cityName, setCityName] = useState('');
  const [countryName, setCountryName] = useState('');
  const [continent, setContinent] = useState('Asia');
  const [requestNotes, setRequestNotes] = useState('');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [isSubmittingRequest, setIsSubmittingRequest] = useState(false);
  const [requestSuccessMsg, setRequestSuccessMsg] = useState('');
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

  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setRequestSuccessMsg('');

    if (!cityName.trim() || !countryName.trim()) {
      setFormError(isEn ? 'City name and country are required.' : '도시명과 국가명을 모두 입력해주세요.');
      return;
    }

    // Check if the country is travel-banned (Ministry of Foreign Affairs, S.Korea)
    const normalizedCountry = countryName.trim().toLowerCase();
    const isBanned = BANNED_COUNTRIES.some(banned => 
      normalizedCountry.includes(banned.toLowerCase())
    );

    if (isBanned) {
      setFormError(
        isEn 
          ? '🚨 [Travel Warning] The requested country is under a Level 4 (Do Not Travel) government restriction. For safety compliance, this destination cannot be requested.'
          : '🚨 [안전 경고] 입력하신 국가는 외교부 지정 여행경보 4단계(여행금지) 국가입니다. 안전 상의 사유로 본 서비스에서는 해당 지역의 일정 추가 요청이 제한됩니다.'
      );
      return;
    }

    setIsSubmittingRequest(true);

    try {
      const currentUser = appDb.auth.getCurrentUser();
      const finalUserName = userName.trim() || (currentUser?.name || currentUser?.username) || (isEn ? 'Traveler' : '여행자');
      const finalEmail = userEmail.trim() || currentUser?.email || '';

      await appDb.feedback.create({
        type: 'city_request',
        title: `[신규 도시 추가 요청] ${cityName.trim()} (${countryName.trim()})`,
        content: `• 요청 도시: ${cityName.trim()}\n• 국가: ${countryName.trim()} (${continent})\n• 추천 명소 / 요청 사유: ${requestNotes.trim() || '상세 사유 없음'}\n• 신청자: ${finalUserName} (${finalEmail || '이메일 미기재'})`,
        userName: finalUserName,
        userEmail: finalEmail,
        browserInfo: `${navigator.userAgent} | Screen: ${window.innerWidth}x${window.innerHeight}`
      });

      setIsSubmittingRequest(false);
      setRequestSuccessMsg(
        isEn 
          ? `✅ Your request for [${cityName.trim()}] has been submitted to the admin! It will be verified and added to the official catalog.` 
          : `✅ [${cityName.trim()}] 도시 추가 요청이 관리자에게 안전하게 전달되었습니다! 데이터 검증 및 코스 생성 후 정식 등록됩니다.`
      );
      setCityName('');
      setCountryName('');
      setRequestNotes('');

      setTimeout(() => {
        setShowAddCity(false);
        setRequestSuccessMsg('');
      }, 3500);
    } catch (err) {
      setIsSubmittingRequest(false);
      setFormError(isEn ? `Failed to submit request: ${err.message}` : `요청 전송 중 오류가 발생했습니다: ${err.message}`);
    }
  };

  const handleOpenRequestWithSearch = () => {
    if (searchQuery.trim()) {
      setCityName(searchQuery.trim());
    }
    setShowAddCity(true);
    setFormError('');
  };

  const STYLE_NAMES = {
    healing: isEn ? '🌿 Healing & Rest' : '🌿 힐링 & 휴식',
    activity: isEn ? '⚡ Activity & Adventure' : '⚡ 액티비티 & 체험',
    culture: isEn ? '🏛️ History & Culture' : '🏛️ 역사 & 문화',
    food: isEn ? '🍕 Food & Culinary' : '🍕 식도락 여행'
  };

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
            ? `Browse ${destinations.length || 911} cities worldwide, view custom travel statements, and plan your dream trip.` 
            : `전 세계 ${destinations.length || 911}개 도시의 맞춤형 여행 명세서와 상세 여행 코스를 자유롭게 탐색해보세요.`}
        </p>
      </div>

      {/* Filter and Control Panel */}
      <div className="glass-panel" style={{ marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          
          {/* Filter Buttons */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button 
              className={`filter-button ${filterType === 'all' ? 'active' : ''}`}
              onClick={() => setFilterType('all')}
            >
              🌐 {isEn ? 'All' : '전체'} ({destinations.length})
            </button>
            <button 
              className={`filter-button ${filterType === 'domestic' ? 'active' : ''}`}
              onClick={() => setFilterType('domestic')}
            >
              🇰🇷 {isEn ? 'Domestic (Korea)' : '국내 여행'}
            </button>
            <button 
              className={`filter-button ${filterType === 'international' ? 'active' : ''}`}
              onClick={() => setFilterType('international')}
            >
              ✈️ {isEn ? 'International' : '해외 여행'}
            </button>
          </div>

          {/* Search Input Bar */}
          <div style={{ flex: 1, minWidth: '240px', maxWidth: '400px' }}>
            <input 
              type="text" 
              placeholder={isEn ? "Search by city, country, or keyword..." : "도시, 국가, 테마 키워드 검색..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: '100%' }}
            />
          </div>
        </div>

        {/* Style & Duration Selectors */}
        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', borderTop: '1px solid var(--colors-ink)', paddingTop: '0.75rem' }}>
          {/* Duration Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>⏱️ {isEn ? 'Duration' : '일정 기간'}:</span>
            <div style={{ display: 'flex', gap: '0.25rem' }}>
              {[1, 2, 3, 4, 5, 7, 10, 14].map((d) => (
                <button
                  key={d}
                  onClick={() => setDuration(d)}
                  className={`btn ${duration === d ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ padding: '0.2rem 0.5rem', fontSize: '0.8rem' }}
                >
                  {d}{isEn ? 'D' : '일'}
                </button>
              ))}
            </div>
          </div>

          {/* Travel Style Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>🎨 {isEn ? 'Theme Style' : '여행 테마'}:</span>
            <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
              {['healing', 'activity', 'culture', 'food'].map((sKey) => (
                <button
                  key={sKey}
                  onClick={() => setStyle(sKey)}
                  className={`btn ${style === sKey ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ padding: '0.2rem 0.6rem', fontSize: '0.8rem' }}
                >
                  {STYLE_NAMES[sKey]}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* New City Request Form Box */}
      {showAddCity && (
        <div className="glass-panel" style={{ marginBottom: '2rem', borderLeft: '6px solid #f59e0b', padding: '1.5rem', borderRadius: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <h3 style={{ margin: 0, fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              📮 {isEn ? 'Request New City Addition (Admin Verification)' : '신규 도시 추가 요청 (관리자 검수 후 정식 등록)'}
            </h3>
            <button 
              onClick={() => { setShowAddCity(false); setFormError(''); setRequestSuccessMsg(''); }}
              style={{ background: 'none', border: 'none', fontSize: '1.3rem', cursor: 'pointer', color: 'inherit' }}
            >
              ✕
            </button>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', lineHeight: 1.5 }}>
            {isEn 
              ? 'Looking for a city not in our catalog? Submit a request and our administrator will verify the data and create complete curated itineraries for everyone.' 
              : '원하시는 도시가 목록에 없으신가요? 도시명과 국가를 요청해 주시면 관리자가 여행 명소, 환율, 좌표 데이터 검증 후 정식 여행 명세서로 등록해 드립니다.'}
          </p>

          {requestSuccessMsg ? (
            <div style={{ padding: '1.5rem', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid #10b981', color: '#10b981', borderRadius: '8px', fontWeight: 700, fontSize: '0.95rem' }}>
              {requestSuccessMsg}
            </div>
          ) : (
            <form onSubmit={handleRequestSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.35rem', fontWeight: 600 }}>
                    {isEn ? 'City Name' : '도시명'} <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={isEn ? "e.g., Salzburg, Chiang Mai, Malaga" : "예: 잘츠부르크, 치앙마이, 말라가"}
                    value={cityName}
                    onChange={(e) => setCityName(e.target.value)}
                    style={{ width: '100%', padding: '0.65rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.35rem', fontWeight: 600 }}>
                    {isEn ? 'Country Name' : '국가명'} <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={isEn ? "e.g., Austria, Thailand, Spain" : "예: 오스트리아, 태국, 스페인"}
                    value={countryName}
                    onChange={(e) => handleCountryChange(e.target.value)}
                    style={{ width: '100%', padding: '0.65rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.35rem', fontWeight: 600 }}>
                    {isEn ? 'Continent' : '대륙'}
                  </label>
                  <select
                    value={continent}
                    onChange={(e) => setContinent(e.target.value)}
                    style={{ width: '100%', padding: '0.65rem' }}
                  >
                    <option value="Asia">Asia (아시아)</option>
                    <option value="Europe">Europe (유럽)</option>
                    <option value="North America">North America (북아메리카)</option>
                    <option value="South America">South America (남아메리카)</option>
                    <option value="Oceania">Oceania (오세아니아)</option>
                    <option value="Africa">Africa (아프리카)</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.35rem', fontWeight: 600 }}>
                  {isEn ? 'Recommended Spots / Reason for Request (Optional)' : '추천 명소 / 요청 사유 (선택)'}
                </label>
                <input
                  type="text"
                  placeholder={isEn ? "e.g., Must-visit old town cafes, Mozart birthplace, etc." : "예: 미라벨 정원 산책 코스, 모차르트 생가 투어 등 꼭 포함되었으면 하는 명소"}
                  value={requestNotes}
                  onChange={(e) => setRequestNotes(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.35rem', fontWeight: 600 }}>
                    {isEn ? 'Your Name' : '신청자 이름'}
                  </label>
                  <input
                    type="text"
                    placeholder={isEn ? "Nickname" : "이름 또는 닉네임"}
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    style={{ width: '100%', padding: '0.65rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.35rem', fontWeight: 600 }}>
                    {isEn ? 'Notification Email' : '등록 알림 수신 이메일 (선택)'}
                  </label>
                  <input
                    type="email"
                    placeholder="your-email@example.com"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    style={{ width: '100%', padding: '0.65rem' }}
                  />
                </div>
              </div>

              {formError && (
                <div style={{ color: 'var(--colors-primary)', background: 'rgba(239, 68, 68, 0.1)', padding: '0.75rem', fontSize: '0.85rem', border: '1px solid var(--colors-primary)', borderRadius: '6px' }}>
                  {formError}
                </div>
              )}

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button 
                  type="submit" 
                  disabled={isSubmittingRequest}
                  className="btn btn-primary" 
                  style={{ flex: 2, padding: '0.7rem', fontWeight: 700, background: '#f59e0b' }}
                >
                  {isSubmittingRequest ? (isEn ? 'Submitting Request...' : '요청 전송 중...') : (isEn ? '📮 Submit City Addition Request' : '📮 관리자에게 도시 추가 요청하기')}
                </button>
                <button 
                  type="button" 
                  onClick={() => { setShowAddCity(false); setFormError(''); }} 
                  className="btn btn-secondary"
                  style={{ flex: 1, padding: '0.7rem' }}
                >
                  {isEn ? 'Cancel' : '취소'}
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Destinations Header with Add Button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h3 style={{ fontSize: '1.5rem', fontWeight: 700 }}>
          {isEn ? `Recommended Destinations (${filtered.length})` : `추천 여행지 (${filtered.length})`}
        </h3>
        
        <button 
          className="btn btn-secondary" 
          onClick={() => { setShowAddCity(!showAddCity); setFormError(''); setRequestSuccessMsg(''); }}
          style={{ fontSize: '0.85rem', padding: '0.5rem 1rem', borderColor: '#f59e0b', color: 'inherit' }}
        >
          {showAddCity 
            ? (isEn ? '✕ Close Request Window' : '✕ 요청 창 닫기') 
            : (isEn ? '📮 Request Missing City' : '📮 목록에 없는 도시 추가 요청하기')}
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '3.5rem 1.5rem', borderRadius: '12px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🗺️</div>
          <p style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.5rem' }}>
            {isEn ? `No destinations found for "${searchQuery}".` : `"${searchQuery}" 검색 결과에 맞는 여행지가 없습니다.`}
          </p>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            {isEn 
              ? 'Would you like to request this city to be added? Our administrator will verify and register it.' 
              : '찾으시는 도시가 없으신가요? 관리자에게 추가 요청을 남겨주시면 검수 후 정식 여행 명세서로 등록해 드립니다!'}
          </p>
          <button 
            onClick={handleOpenRequestWithSearch}
            className="btn btn-primary"
            style={{ padding: '0.7rem 1.5rem', fontWeight: 700, background: '#f59e0b' }}
          >
            📮 {isEn ? `Request "${searchQuery}" Addition` : `"${searchQuery}" 도시 추가 요청하기`}
          </button>
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
