import React, { useState, useEffect } from 'react';
import { destinations, getPolishedItinerary, getClothingAndWeatherGuide, COUNTRY_ENGLISH_MAPPING } from '../data/destinations';
import PrintBrochureModal from './PrintBrochureModal';
import appDb from '../db/appDb';

export default function ManualPlanner({ prefilledDestination, onClearPrefilled, lang = 'en' }) {
  const isEn = lang === 'en';
  const [showBrochureModal, setShowBrochureModal] = useState(false);
  const [trips, setTrips] = useState([]);
  const [activeTripId, setActiveTripId] = useState(null);
  
  // Trip creation form
  const [newTitle, setNewTitle] = useState('');
  const [newDuration, setNewDuration] = useState(3);
  const [selectedDestId, setSelectedDestId] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Activity creation form (for the active trip)
  const [actDay, setActDay] = useState(1);
  const [actTime, setActTime] = useState('09:00');
  const [actTitle, setActTitle] = useState('');
  const [actCost, setActCost] = useState(0);
  const [actNotes, setActNotes] = useState('');

  // Active day filter in editor
  const [activeDayView, setActiveDayView] = useState(1);

  // Load trips from AppDB on mount and subscribe
  useEffect(() => {
    const loaded = appDb.trips.getAll();
    setTrips(loaded);
    if (loaded.length > 0) {
      setActiveTripId(prev => prev || loaded[0].id);
    }
    return appDb.subscribe('trips', (updated) => {
      setTrips(updated);
      if (updated.length > 0) {
        setActiveTripId(prev => (updated.some(t => t.id === prev) ? prev : updated[0].id));
      } else {
        setActiveTripId(null);
      }
    });
  }, []);

  // Pre-fill creation form or import trip if routed from ItineraryViewer
  useEffect(() => {
    if (prefilledDestination) {
      const { dest, duration: prefDuration, style: prefStyle } = prefilledDestination;
      
      if (dest && prefDuration && prefStyle) {
        const polished = getPolishedItinerary(dest, prefStyle, prefDuration);
        const prefilledActivities = [];
        
        Object.entries(polished).forEach(([dayNum, acts]) => {
          acts.forEach((act, idx) => {
            prefilledActivities.push({
              id: `act_${Date.now()}_${dayNum}_${idx}`,
              day: Number(dayNum),
              time: act.time,
              title: act.title,
              cost: 0,
              notes: act.desc || ''
            });
          });
        });

        const newTrip = {
          id: `trip_${Date.now()}`,
          title: `나의 ${dest.name} ${prefStyle === 'healing' ? '🌿 힐링' : prefStyle === 'activity' ? '⚡ 액티비티' : prefStyle === 'culture' ? '🏛️ 문화' : '🍕 식도락'} 여행`,
          duration: Number(prefDuration),
          destinationId: dest.id,
          destinationName: dest.name,
          currency: dest.currency,
          currencySymbol: dest.currencySymbol,
          activities: prefilledActivities,
          createdAt: new Date().toISOString()
        };

        appDb.trips.create(newTrip);
        setActiveTripId(newTrip.id);
        setActiveDayView(1);
        setActDay(1);
        setShowCreateForm(false);
        alert(`🎉 ${dest.name} 프리미엄 일정이 셀프 플래너로 성공적으로 이관되었습니다!`);
      } else if (prefilledDestination.name) {
        setNewTitle(`나의 ${prefilledDestination.name} 여행`);
        setSelectedDestId(prefilledDestination.id);
        setShowCreateForm(true);
      }
      onClearPrefilled(); // Clear so it doesn't loop
    }
  }, [prefilledDestination]);

  const saveTripsToStorage = (updatedTrips) => {
    setTrips(updatedTrips);
    appDb._setItem('trips', updatedTrips);
    appDb._notify('trips', updatedTrips);
  };

  const handleCreateTrip = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    // Find destination details if linked
    const dest = destinations.find(d => d.id === selectedDestId);
    const targetCurrency = dest ? dest.currency : 'KRW';
    const targetSymbol = dest ? dest.currencySymbol : '₩';

    const newTrip = {
      id: `trip_${Date.now()}`,
      title: newTitle.trim(),
      duration: Number(newDuration),
      destinationId: selectedDestId || null,
      destinationName: dest ? dest.name : '기타',
      currency: targetCurrency,
      currencySymbol: targetSymbol,
      activities: [], // Array of { id, day, time, title, cost, notes }
      createdAt: new Date().toISOString()
    };

    const updated = [newTrip, ...trips];
    saveTripsToStorage(updated);
    setActiveTripId(newTrip.id);
    
    // Reset form
    setNewTitle('');
    setSelectedDestId('');
    setShowCreateForm(false);
    setActiveDayView(1);
    setActDay(1);
  };

  const handleDeleteTrip = (tripId, e) => {
    e.stopPropagation();
    if (window.confirm('정말 이 여행 계획을 삭제할까요?')) {
      const updated = trips.filter(t => t.id !== tripId);
      saveTripsToStorage(updated);
      if (activeTripId === tripId) {
        setActiveTripId(updated.length > 0 ? updated[0].id : null);
      }
    }
  };

  const handleAddActivity = (e) => {
    e.preventDefault();
    if (!actTitle.trim()) return;

    const activeTripIndex = trips.findIndex(t => t.id === activeTripId);
    if (activeTripIndex === -1) return;

    const activeTrip = trips[activeTripIndex];
    const newActivity = {
      id: `act_${Date.now()}`,
      day: Number(actDay),
      time: actTime,
      title: actTitle.trim(),
      cost: Number(actCost) || 0,
      notes: actNotes.trim()
    };

    // Add activity and sort by day, then by time
    const updatedActivities = [...activeTrip.activities, newActivity].sort((a, b) => {
      if (a.day !== b.day) return a.day - b.day;
      return a.time.localeCompare(b.time);
    });

    const updatedTrips = [...trips];
    updatedTrips[activeTripIndex] = {
      ...activeTrip,
      activities: updatedActivities
    };

    saveTripsToStorage(updatedTrips);

    // Reset activity input
    setActTitle('');
    setActCost(0);
    setActNotes('');
  };

  const handleDeleteActivity = (actId) => {
    const activeTripIndex = trips.findIndex(t => t.id === activeTripId);
    if (activeTripIndex === -1) return;

    const activeTrip = trips[activeTripIndex];
    const updatedActivities = activeTrip.activities.filter(a => a.id !== actId);

    const updatedTrips = [...trips];
    updatedTrips[activeTripIndex] = {
      ...activeTrip,
      activities: updatedActivities
    };

    saveTripsToStorage(updatedTrips);
  };

  const activeTrip = trips.find(t => t.id === activeTripId);

  // Grouped activities for active trip day
  const filteredActivities = activeTrip
    ? activeTrip.activities.filter(a => a.day === activeDayView)
    : [];

  // Calculate sum of cost for active day or entire trip
  const totalCost = activeTrip
    ? activeTrip.activities.reduce((sum, act) => sum + act.cost, 0)
    : 0;

  return (
    <div className="fade-in planner-main-layout">
      
      {/* Column 1: Trips List Sidebar */}
      <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>
          📂 {isEn ? 'Travel Plans List' : '여행 계획 목록'}
        </h3>

        <button 
          onClick={() => setShowCreateForm(true)} 
          className="btn btn-primary"
          style={{ width: '100%', fontSize: '0.85rem', padding: '0.5rem' }}
        >
          ➕ {isEn ? 'Create New Plan' : '새 계획 작성하기'}
        </button>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '450px', overflowY: 'auto' }}>
          {trips.map((trip) => (
            <div
              key={trip.id}
              onClick={() => {
                setActiveTripId(trip.id);
                setActiveDayView(1);
                setActDay(1);
              }}
              style={{
                padding: '0.75rem',
                borderRadius: 'var(--radius-sm)',
                background: activeTripId === trip.id ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255,255,255,0.02)',
                border: activeTripId === trip.id ? '1px solid var(--color-primary)' : '1px solid var(--glass-border)',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div style={{ flex: 1, minWidth: 0, paddingRight: '0.5rem' }}>
                <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {trip.title}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  📍 {trip.destinationName} • {isEn ? `${trip.duration} Days` : `${trip.duration}일간`}
                </div>
              </div>
              <button
                onClick={(e) => handleDeleteTrip(trip.id, e)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.2rem' }}
                title="Delete"
              >
                🗑️
              </button>
            </div>
          ))}

          {trips.length === 0 && (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textAlign: 'center', padding: '1rem' }}>
              {isEn ? 'No travel plans created yet.' : '생성된 계획이 없습니다.'}
            </p>
          )}
        </div>
      </div>

      {/* Editor Main Content Area */}
      {showCreateForm ? (
        /* Create Trip Form */
        <div className="glass-panel" style={{ gridColumn: 'span 2' }}>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', fontWeight: 700 }}>
            🆕 {isEn ? 'Create New Travel Plan' : '새로운 여행 계획 만들기'}
          </h3>
          
          <form onSubmit={handleCreateTrip} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.9rem' }}>
                {isEn ? 'Trip Title' : '여행 제목'}
              </label>
              <input
                type="text"
                required
                placeholder={isEn ? "e.g., Summer Tokyo Gourmet Trip" : "예: 2026 여름 도쿄 식도락 여행"}
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.9rem' }}>
                  {isEn ? 'Trip Duration (Days)' : '여행 기간 (일수)'}
                </label>
                <select
                  value={newDuration}
                  onChange={(e) => setNewDuration(Number(e.target.value))}
                  style={{ width: '100%' }}
                >
                  {[1,2,3,4,5,6,7,8,9,10,14,21].map(d => (
                    <option key={d} value={d}>{isEn ? `${d} Days` : `${d}일`}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.9rem' }}>
                  {isEn ? 'Linked Destination (Optional)' : '연동 여행지 (선택 사항)'}
                </label>
                <select
                  value={selectedDestId}
                  onChange={(e) => setSelectedDestId(e.target.value)}
                  style={{ width: '100%' }}
                >
                  <option value="">{isEn ? 'None (Other)' : '연동 안 함 (기타)'}</option>
                  {destinations.map(d => (
                    <option key={d.id} value={d.id}>{isEn ? (d.englishName || d.name) : d.name} ({isEn ? (COUNTRY_ENGLISH_MAPPING[d.country] || d.country) : d.country})</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
              <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                {isEn ? 'Create' : '생성하기'}
              </button>
              <button 
                type="button" 
                onClick={() => setShowCreateForm(false)} 
                className="btn btn-secondary"
                style={{ flex: 1 }}
              >
                {isEn ? 'Cancel' : '취소'}
              </button>
            </div>
          </form>
        </div>
      ) : activeTrip ? (
        /* Edit Active Trip Schedule */
        <>
          {/* Column 2: Add Activity Form */}
          <div className="glass-panel">
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
              📝 {isEn ? 'Add Activity' : '일정 추가하기'}
            </h3>

            <form onSubmit={handleAddActivity} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    {isEn ? 'Select Day' : '일차 선택'}
                  </label>
                  <select 
                    value={actDay} 
                    onChange={(e) => setActDay(Number(e.target.value))}
                    style={{ width: '100%', padding: '0.5rem' }}
                  >
                    {Array.from({ length: activeTrip.duration }).map((_, i) => (
                      <option key={i+1} value={i+1}>{isEn ? `Day ${i+1}` : `${i+1}일차`}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    {isEn ? 'Set Time' : '시간 설정'}
                  </label>
                  <input
                    type="time"
                    required
                    value={actTime}
                    onChange={(e) => setActTime(e.target.value)}
                    style={{ width: '100%', padding: '0.5rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  {isEn ? 'Activity / Place Name' : '활동명 / 장소'}
                </label>
                <input
                  type="text"
                  required
                  placeholder={isEn ? "e.g., Palace Tour, Lunch" : "예: 경복궁 투어, 점심 식사"}
                  value={actTitle}
                  onChange={(e) => setActTitle(e.target.value)}
                  style={{ width: '100%', padding: '0.5rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  {isEn ? `Estimated Cost (${activeTrip.currencySymbol})` : `예상 경비 (${activeTrip.currencySymbol})`}
                </label>
                <input
                  type="number"
                  placeholder="0"
                  min="0"
                  value={actCost === 0 ? '' : actCost}
                  onChange={(e) => setActCost(Number(e.target.value))}
                  style={{ width: '100%', padding: '0.5rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  {isEn ? 'Notes & Details' : '상세 메모'}
                </label>
                <textarea
                  rows="3"
                  placeholder={isEn ? "Directions, menu, prep checklist..." : "가는 법, 메뉴, 준비물 등 기재..."}
                  value={actNotes}
                  onChange={(e) => setActNotes(e.target.value)}
                  style={{ width: '100%', padding: '0.5rem', resize: 'none' }}
                />
              </div>

              <button type="submit" className="btn btn-accent" style={{ marginTop: '0.5rem' }}>
                ✏️ {isEn ? 'Add to Timeline' : '일정에 반영하기'}
              </button>
            </form>
          </div>

          {/* Column 3: Daily Timeline Editor Viewer */}
          <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>
                  {activeTrip.title}
                </h3>
                <button 
                  onClick={() => setShowBrochureModal(true)}
                  className="btn btn-primary"
                  style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem' }}
                >
                  🖨️ {isEn ? 'Print / Save PDF' : '브로셔 인쇄 / PDF 저장'}
                </button>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.35rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                <span>📍 {isEn ? 'Destination:' : '목적지:'} {activeTrip.destinationName}</span>
                <span>💰 {isEn ? 'Total:' : '총 경비:'} <strong style={{ color: 'var(--color-success)' }}>{activeTrip.currencySymbol}{totalCost.toLocaleString()}</strong></span>
              </div>
            </div>

            {/* Day selector tabs */}
            <div style={{ display: 'flex', gap: '0.35rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
              {Array.from({ length: activeTrip.duration }).map((_, i) => {
                const dayNum = i + 1;
                return (
                  <button
                    key={dayNum}
                    onClick={() => setActiveDayView(dayNum)}
                    style={{
                      padding: '0.4rem 0.8rem',
                      borderRadius: '4px',
                      border: 'none',
                      background: activeDayView === dayNum ? 'var(--color-primary)' : 'rgba(255,255,255,0.03)',
                      color: activeDayView === dayNum ? '#fff' : 'var(--text-secondary)',
                      cursor: 'pointer',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      whiteSpace: 'nowrap'
                    }}
                  >
                    Day {dayNum}
                  </button>
                );
              })}
            </div>

            {/* List of activities for selected day */}
            <h4 style={{ fontSize: '0.95rem', color: 'var(--color-accent)', fontWeight: 700, margin: '0.25rem 0' }}>
              📅 {isEn ? `Day ${activeDayView} Plan (${filteredActivities.length})` : `${activeDayView}일차 계획 (${filteredActivities.length})`}
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', maxHeight: '350px', overflowY: 'auto', paddingRight: '0.25rem' }}>
              {filteredActivities.map((act) => (
                <div 
                  key={act.id} 
                  style={{
                    position: 'relative',
                    background: 'rgba(255,255,255,0.01)',
                    border: '1px solid rgba(255,255,255,0.04)',
                    padding: '0.75rem',
                    borderRadius: 'var(--radius-sm)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.25rem'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-primary)', fontWeight: 700 }}>
                      🕒 {act.time}
                    </span>
                    
                    <button
                      onClick={() => handleDeleteActivity(act.id)}
                      style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.85rem' }}
                      title={isEn ? "Delete Activity" : "활동 삭제"}
                    >
                      ❌
                    </button>
                  </div>

                  <div style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                    {act.title}
                  </div>

                  {act.cost > 0 && (
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-success)', fontWeight: 500 }}>
                      💵 {isEn ? 'Cost:' : '지출:'} {activeTrip.currencySymbol}{act.cost.toLocaleString()}
                    </div>
                  )}

                  {act.notes && (
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', background: 'rgba(0,0,0,0.2)', padding: '0.35rem 0.5rem', borderRadius: '4px', marginTop: '0.25rem' }}>
                      📝 {act.notes}
                    </div>
                  )}
                </div>
              ))}

              {filteredActivities.length === 0 && (
                <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem 1rem', fontSize: '0.85rem' }}>
                  {isEn ? `No activities added for Day ${activeDayView} yet. Add a new activity on the left!` : `${activeDayView}일차에 등록된 활동이 없습니다. 왼쪽 폼에서 일정을 추가하세요!`}
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        /* Empty State */
        <div className="glass-panel" style={{ gridColumn: 'span 2', textAlign: 'center', padding: '3.5rem', color: 'var(--text-secondary)' }}>
          <p style={{ fontSize: '1.2rem', marginBottom: '0.75rem' }}>
            {isEn ? '🗺️ No travel plans created yet.' : '🗺️ 작성된 여행 일정표가 없습니다.'}
          </p>
          <p style={{ fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            {isEn ? 'Create a new trip plan from the left sidebar to design your perfect custom itinerary.' : '왼쪽 사이드바에서 새 계획을 만들어 나만의 완벽한 코스를 설계해보세요.'}
          </p>
          <button onClick={() => setShowCreateForm(true)} className="btn btn-primary">
            🚀 {isEn ? 'Create First Trip' : '첫 일정 시작하기'}
          </button>
        </div>
      )}

      {/* Print Brochure Modal */}
      {showBrochureModal && activeTrip && (
        <PrintBrochureModal
          destination={activeTrip.linkedDestination || {
            name: activeTrip.destinationName || activeTrip.title,
            englishName: activeTrip.destinationName || activeTrip.title,
            country: 'Custom Plan',
            continent: 'Custom',
            tagline: isEn ? 'My Personalized Custom Travel Plan' : '나만의 셀프 여행 일정표',
            description: isEn ? 'Custom planned itinerary created with YEOMYEONG Travel Statement.' : '여명(YEOMYEONG) 여행 명세서를 통해 직접 설계한 나만의 커스텀 여행 일정표입니다.',
            imageUrl: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1000&q=80',
            type: 'domestic',
            currency: activeTrip.currencySymbol || 'KRW',
            currencySymbol: activeTrip.currencySymbol || '₩'
          }}
          duration={activeTrip.duration}
          style={'custom'}
          itineraryData={activeTrip.activities.reduce((acc, act) => {
            const day = act.day || 1;
            if (!acc[day]) acc[day] = [];
            acc[day].push({ time: act.time, title: act.title, desc: act.notes || (act.cost > 0 ? `Cost: ${activeTrip.currencySymbol}${act.cost}` : '') });
            return acc;
          }, {})}
          weatherInfo={getClothingAndWeatherGuide(activeTrip.destinationName || 'Seoul', 'Korea', isEn)}
          checklist={[]}
          onClose={() => setShowBrochureModal(false)}
          lang={lang}
        />
      )}
    </div>
  );
}
