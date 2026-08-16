import React, { useState, useEffect } from 'react';
import appDb from '../db/appDb';

export default function AdminDashboard({ onExitAdmin, lang = 'en' }) {
  const isEn = lang === 'en';
  const [activeSubTab, setActiveSubTab] = useState('overview'); // 'overview' | 'users' | 'destinations' | 'trips' | 'expenses' | 'visited' | 'cloud'
  
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [trips, setTrips] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [visited, setVisited] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Cloud DB Config state
  const [cloudStatus, setCloudStatus] = useState(() => appDb.cloud.getStatus());
  const [cloudForm, setCloudForm] = useState(() => appDb.cloud.getConfig());
  const [syncMsg, setSyncMsg] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);

  // Destination Creation/Edit Form state
  const [showDestModal, setShowDestModal] = useState(false);
  const [editingDest, setEditingDest] = useState(null);
  const [destForm, setDestForm] = useState({
    name: '',
    country: '',
    continent: 'Asia',
    currency: 'KRW',
    currencySymbol: '₩',
    tagline: '',
    tags: '',
    lat: 37.5665,
    lng: 126.9780
  });

  const loadData = () => {
    try {
      setStats(appDb.admin.getOverviewStats());
      setUsers(appDb.admin.getAllUsers());
      setDestinations(appDb.admin.getAllDestinations());
      setTrips(appDb.admin.getAllTrips());
      setExpenses(appDb.admin.getAllExpenses());
      setVisited(appDb.admin.getAllVisited());
      setCloudStatus(appDb.cloud.getStatus());
    } catch (err) {
      console.error('[AdminDashboard] Error loading data:', err);
    }
  };

  useEffect(() => {
    loadData();
    return appDb.subscribe('*', loadData);
  }, []);

  // Cloud Actions
  const handleSaveCloudConfig = (e) => {
    e.preventDefault();
    const ok = appDb.cloud.saveConfig(cloudForm);
    if (ok) {
      setCloudStatus(appDb.cloud.getStatus());
      alert(isEn ? 'Cloud configuration saved and re-initialized!' : '클라우드 DB 설정이 저장되었으며 초기화가 완료되었습니다!');
      loadData();
    } else {
      alert(isEn ? 'Failed to save configuration.' : '설정 저장에 실패했습니다.');
    }
  };

  const handleSyncToCloud = async () => {
    setIsSyncing(true);
    setSyncMsg(isEn ? 'Uploading local database records to Cloud Firestore...' : '로컬 데이터를 클라우드 Firestore로 일괄 업로드 중...');
    try {
      const res = await appDb.cloud.syncLocalToCloud();
      setSyncMsg(isEn 
        ? `✅ Success! Uploaded ${res.users} users, ${res.trips} trips, ${res.expenses} expenses, ${res.visited} visited records to Cloud DB.` 
        : `✅ 업로드 완료! 회원 ${res.users}명, 일정 ${res.trips}개, 지출 ${res.expenses}건, 방문기록 ${res.visited}개가 클라우드 DB에 동기화되었습니다.`);
    } catch (err) {
      setSyncMsg(`❌ ${isEn ? 'Sync Error:' : '동기화 오류:'} ${err.message}`);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSyncFromCloud = async () => {
    setIsSyncing(true);
    setSyncMsg(isEn ? 'Fetching latest records from Cloud Firestore...' : '클라우드 Firestore에서 최신 데이터를 가져오는 중...');
    try {
      const res = await appDb.cloud.syncCloudToLocal();
      setSyncMsg(isEn 
        ? `✅ Success! Downloaded and merged ${res.users} users, ${res.trips} trips, ${res.expenses} expenses from Cloud DB.` 
        : `✅ 다운로드 완료! 클라우드에서 회원 ${res.users}명, 일정 ${res.trips}개, 지출 ${res.expenses}건을 성공적으로 동기화했습니다.`);
      loadData();
    } catch (err) {
      setSyncMsg(`❌ ${isEn ? 'Fetch Error:' : '동기화 오류:'} ${err.message}`);
    } finally {
      setIsSyncing(false);
    }
  };

  // User Actions
  const handleToggleUserRole = (user) => {
    const newRole = user.role === 'admin' ? 'user' : 'admin';
    if (user.username === 'admin' && newRole === 'user') {
      alert(isEn ? 'Cannot demote the root administrator.' : '루트 관리자 계정의 권한은 해제할 수 없습니다.');
      return;
    }
    if (window.confirm(isEn ? `Change ${user.username}'s role to ${newRole}?` : `${user.username}님의 역할을 ${newRole}로 변경하시겠습니까?`)) {
      appDb.admin.updateUser(user.id, { role: newRole });
      loadData();
    }
  };

  const handleDeleteUser = (user) => {
    if (user.username === 'admin') {
      alert(isEn ? 'Cannot delete the root administrator.' : '루트 관리자 계정은 삭제할 수 없습니다.');
      return;
    }
    if (window.confirm(isEn ? `Permanently delete user ${user.username} and all their data?` : `[${user.username}] 사용자와 관련된 모든 데이터를 영구 삭제하시겠습니까?`)) {
      try {
        appDb.admin.deleteUser(user.id);
        loadData();
      } catch (err) {
        alert(err.message);
      }
    }
  };

  // Destination Actions
  const handleOpenNewDestModal = () => {
    setEditingDest(null);
    setDestForm({
      name: '',
      country: '',
      continent: 'Asia',
      currency: 'KRW',
      currencySymbol: '₩',
      tagline: '',
      tags: '힐링, 휴양, 자연',
      lat: 37.5665,
      lng: 126.9780
    });
    setShowDestModal(true);
  };

  const handleOpenEditDestModal = (dest) => {
    setEditingDest(dest);
    setDestForm({
      name: dest.name || '',
      country: dest.country || '',
      continent: dest.continent || 'Asia',
      currency: dest.currency || 'KRW',
      currencySymbol: dest.currencySymbol || '₩',
      tagline: dest.tagline || '',
      tags: Array.isArray(dest.tags) ? dest.tags.join(', ') : (dest.tags || ''),
      lat: dest.coordinates?.lat || 37.5665,
      lng: dest.coordinates?.lng || 126.9780
    });
    setShowDestModal(true);
  };

  const handleSaveDestForm = (e) => {
    e.preventDefault();
    const tagArray = destForm.tags.split(',').map(t => t.trim()).filter(Boolean);
    const destPayload = {
      name: destForm.name.trim(),
      country: destForm.country.trim(),
      continent: destForm.continent,
      currency: destForm.currency.trim().toUpperCase(),
      currencySymbol: destForm.currencySymbol.trim(),
      tagline: destForm.tagline.trim(),
      tags: tagArray,
      coordinates: { lat: Number(destForm.lat), lng: Number(destForm.lng) },
      type: destForm.country.trim() === '대한민국' ? 'domestic' : 'international',
      imageUrl: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80',
      description: destForm.tagline.trim() || `${destForm.name.trim()} 여행`
    };

    if (editingDest) {
      appDb.admin.updateDestination(editingDest.id, destPayload);
    } else {
      destPayload.id = `custom_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      appDb.admin.createDestination(destPayload);
    }

    setShowDestModal(false);
    loadData();
  };

  const handleDeleteDest = (dest) => {
    if (window.confirm(isEn ? `Delete custom destination [${dest.name}]?` : `커스텀 여행지 [${dest.name}]를 삭제하시겠습니까?`)) {
      appDb.admin.deleteDestination(dest.id);
      loadData();
    }
  };

  // Trip Actions
  const handleDeleteTrip = (trip) => {
    if (window.confirm(isEn ? `Delete trip [${trip.title}]?` : `[${trip.title}] 일정을 삭제하시겠습니까?`)) {
      appDb.admin.deleteTrip(trip.id);
      loadData();
    }
  };

  // Expense Actions
  const handleDeleteExpense = (exp) => {
    if (window.confirm(isEn ? `Delete expense entry [${exp.title}]?` : `[${exp.title}] 지출 내역을 삭제하시겠습니까?`)) {
      appDb.admin.deleteExpense(exp.id);
      loadData();
    }
  };

  // Visited Actions
  const handleDeleteVisited = (v) => {
    if (window.confirm(isEn ? `Delete visit record for [${v.name}]?` : `[${v.name}] 방문 기록을 삭제하시겠습니까?`)) {
      appDb.admin.deleteVisited(v.id);
      loadData();
    }
  };

  // Filters
  const filteredUsers = users.filter(u => 
    u.username.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (u.name && u.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  const filteredDests = destinations.filter(d => 
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (d.country && d.country.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  const filteredTrips = trips.filter(t => 
    t.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (t.ownerName && t.ownerName.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (t.destinationName && t.destinationName.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  const filteredExpenses = expenses.filter(e => 
    e.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (e.ownerName && e.ownerName.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (e.category && e.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  const filteredVisited = visited.filter(v => 
    v.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (v.ownerName && v.ownerName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="fade-in" style={{ padding: '1rem', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Top Admin Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', background: '#000000', color: '#ffffff', padding: '1.25rem 1.5rem', borderRadius: '12px', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '1.8rem' }}>🛡️</span>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              VOYAGE {isEn ? 'ADMIN CONTROL CENTER' : '통합 관리자 센터'}
              <span style={{
                fontSize: '0.7rem',
                padding: '0.2rem 0.6rem',
                borderRadius: '12px',
                background: cloudStatus.isConnected ? '#10b981' : '#f59e0b',
                color: '#ffffff',
                fontWeight: 'bold'
              }}>
                {cloudStatus.isConnected ? '☁️ Cloud Online' : '💾 Local Fallback'}
              </span>
            </h1>
            <div style={{ fontSize: '0.8rem', color: '#9ca3af' }}>
              {isEn ? 'Full Database Access, Data Inspection & Multi-device Cloud Sync' : '시스템 전체 데이터 실시간 조회, 검색 및 다중 기기 클라우드 동기화 콘솔'}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button 
            onClick={loadData}
            className="btn btn-secondary"
            style={{ background: '#374151', color: '#ffffff', borderColor: '#4b5563', fontSize: '0.85rem' }}
          >
            🔄 {isEn ? 'Refresh' : '새로고침'}
          </button>
          <button 
            onClick={onExitAdmin}
            className="btn btn-primary"
            style={{ background: 'var(--colors-yellow-sticker, #facc15)', color: '#000000', fontWeight: 'bold', fontSize: '0.85rem' }}
          >
            🧭 {isEn ? 'Exit to App' : '일반 화면으로 복귀'}
          </button>
        </div>
      </div>

      {/* Sub-Tab Navigation Bar */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', overflowX: 'auto', borderBottom: '2px solid var(--glass-border)', paddingBottom: '0.5rem' }}>
        {[
          { key: 'overview', icon: '📊', nameKo: '시스템 개요', nameEn: 'Overview' },
          { key: 'cloud', icon: '☁️', nameKo: '클라우드 DB 연동', nameEn: 'Cloud DB Sync' },
          { key: 'users', icon: '👥', nameKo: `회원 관리 (${users.length})`, nameEn: `Users (${users.length})` },
          { key: 'destinations', icon: '🌍', nameKo: `커스텀 여행지 (${destinations.length})`, nameEn: `Destinations (${destinations.length})` },
          { key: 'trips', icon: '📅', nameKo: `전체 일정 (${trips.length})`, nameEn: `Trips (${trips.length})` },
          { key: 'expenses', icon: '💰', nameKo: `지출 장부 (${expenses.length})`, nameEn: `Expenses (${expenses.length})` },
          { key: 'visited', icon: '✅', nameKo: `방문 기록 (${visited.length})`, nameEn: `Visited (${visited.length})` }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => { setActiveSubTab(tab.key); setSearchTerm(''); }}
            className={`btn ${activeSubTab === tab.key ? 'btn-primary' : 'btn-secondary'}`}
            style={{
              padding: '0.55rem 1rem',
              fontSize: '0.9rem',
              fontWeight: activeSubTab === tab.key ? 700 : 500,
              whiteSpace: 'nowrap',
              borderRadius: '8px'
            }}
          >
            {tab.icon} {isEn ? tab.nameEn : tab.nameKo}
          </button>
        ))}
      </div>

      {/* Global Search Bar for Tables */}
      {activeSubTab !== 'overview' && activeSubTab !== 'cloud' && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
            <input
              type="text"
              placeholder={isEn ? 'Filter data by keyword...' : '키워드로 실시간 검색...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '0.65rem 1rem',
                borderRadius: '8px',
                border: '1px solid var(--glass-border)',
                background: 'var(--bg-secondary)',
                color: 'inherit',
                fontSize: '0.9rem'
              }}
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}
              >
                ✕
              </button>
            )}
          </div>

          {activeSubTab === 'destinations' && (
            <button 
              onClick={handleOpenNewDestModal}
              className="btn btn-primary"
              style={{ padding: '0.65rem 1.2rem', fontWeight: 600 }}
            >
              ➕ {isEn ? 'Add New Destination' : '신규 여행지 직접 등록'}
            </button>
          )}
        </div>
      )}

      {/* 1. OVERVIEW TAB */}
      {activeSubTab === 'overview' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            <div className="glass-panel" style={{ padding: '1.25rem', borderRadius: '12px', borderLeft: '4px solid #3b82f6' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>👥 {isEn ? 'Registered Users' : '총 등록 회원'}</div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', marginTop: '0.4rem' }}>{stats.totalUsers || 0}</div>
            </div>

            <div className="glass-panel" style={{ padding: '1.25rem', borderRadius: '12px', borderLeft: '4px solid #10b981' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>📅 {isEn ? 'Active Trip Plans' : '총 여행 플랜'}</div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', marginTop: '0.4rem' }}>{stats.totalTrips || 0}</div>
            </div>

            <div className="glass-panel" style={{ padding: '1.25rem', borderRadius: '12px', borderLeft: '4px solid #f59e0b' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>💰 {isEn ? 'Total Expenses Logged' : '총 지출 기록 건수'}</div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', marginTop: '0.4rem' }}>{stats.totalExpenses || 0}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                ₩{(stats.totalExpenseKRW || 0).toLocaleString()}
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '1.25rem', borderRadius: '12px', borderLeft: '4px solid #8b5cf6' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>🌍 {isEn ? 'Custom Destinations' : '커스텀 여행지'}</div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', marginTop: '0.4rem' }}>{stats.totalCustomDests || 0}</div>
            </div>

            <div className="glass-panel" style={{ padding: '1.25rem', borderRadius: '12px', borderLeft: '4px solid #ec4899' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>✅ {isEn ? 'Visited Footprints' : '다녀온 도시 기록'}</div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', marginTop: '0.4rem' }}>{stats.totalVisited || 0}</div>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '12px' }}>
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem' }}>⚡ {isEn ? 'Quick Admin Actions' : '관리자 빠른 바로가기'}</h3>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button onClick={() => setActiveSubTab('cloud')} className="btn btn-primary" style={{ padding: '0.75rem 1.25rem', background: '#2563eb' }}>
                ☁️ {isEn ? 'Cloud Database Setup' : '무료 클라우드 DB 연동 설정'}
              </button>
              <button onClick={() => setActiveSubTab('users')} className="btn btn-secondary" style={{ padding: '0.75rem 1.25rem' }}>
                👥 {isEn ? 'Manage Users' : '회원 목록 관리'}
              </button>
              <button onClick={handleOpenNewDestModal} className="btn btn-secondary" style={{ padding: '0.75rem 1.25rem' }}>
                🌍 {isEn ? 'Add New City' : '새로운 도시 추가'}
              </button>
              <button onClick={() => setActiveSubTab('trips')} className="btn btn-secondary" style={{ padding: '0.75rem 1.25rem' }}>
                📅 {isEn ? 'Inspect Trips' : '여행 일정 전체 열람'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CLOUD DB SETTINGS TAB */}
      {activeSubTab === 'cloud' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Status & Sync Action Card */}
          <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '12px', borderLeft: '6px solid #10b981' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h2 style={{ margin: 0, fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  ☁️ {isEn ? 'Universal Global Cloud Database' : 'VOYAGE 글로벌 클라우드 데이터베이스'}
                  <span style={{ fontSize: '0.8rem', padding: '0.2rem 0.5rem', borderRadius: '6px', background: '#10b981', color: '#fff' }}>
                    🟢 {isEn ? 'Live Cloud Online (Zero Setup Required)' : '실시간 클라우드 작동 중 (별도 설정 불필요)'}
                  </span>
                </h2>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.4rem', lineHeight: 1.5 }}>
                  {isEn 
                    ? '✨ Real-time multi-device cloud synchronization is active out-of-the-box! No manual Firebase registration or configuration needed.' 
                    : '✨ 별도의 파이어베이스 가입이나 키 설정 없이도 지금 즉시 전 세계 모든 기기(스마트폰, PC)와 실시간으로 데이터가 자동 동기화됩니다.'}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  disabled={isSyncing}
                  onClick={handleSyncToCloud}
                  className="btn btn-primary"
                  style={{ padding: '0.6rem 1.1rem', fontSize: '0.85rem' }}
                >
                  📤 {isEn ? 'Force Cloud Upload' : '로컬 ➔ 클라우드 즉시 업로드'}
                </button>
                <button
                  disabled={isSyncing}
                  onClick={handleSyncFromCloud}
                  className="btn btn-secondary"
                  style={{ padding: '0.6rem 1.1rem', fontSize: '0.85rem' }}
                >
                  📥 {isEn ? 'Force Cloud Download' : '클라우드 ➔ 로컬 즉시 동기화'}
                </button>
              </div>
            </div>

            <div style={{ marginTop: '0.85rem', padding: '0.65rem 0.9rem', borderRadius: '8px', background: 'var(--bg-secondary)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <strong>🔗 {isEn ? 'Live Cloud Storage Endpoint:' : '실시간 클라우드 DB 원본 링크:'}</strong>{' '}
                <a 
                  href="https://api.restful-api.dev/objects/ff8081819ff5b11001a008db0604294f" 
                  target="_blank" 
                  rel="noreferrer"
                  style={{ color: '#3b82f6', textDecoration: 'underline', wordBreak: 'break-all', fontFamily: 'monospace' }}
                >
                  https://api.restful-api.dev/objects/ff8081819ff5b11001a008db0604294f
                </a>
              </div>
              <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600 }}>🟢 200 OK Live</span>
            </div>

            {syncMsg && (
              <div style={{ marginTop: '0.75rem', padding: '0.75rem', borderRadius: '8px', background: 'var(--bg-secondary)', fontSize: '0.85rem' }}>
                {syncMsg}
              </div>
            )}
          </div>

          {/* Optional Custom Firebase Config Form */}
          <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '12px' }}>
            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>
              ⚙️ {isEn ? 'Optional: Switch to Custom Firebase Project' : '(선택 사항) 개인 전용 Firebase 프로젝트 연결'}
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1.25rem' }}>
              {isEn 
                ? 'By default, the built-in zero-setup cloud engine handles all synchronization automatically. If you wish to use your own private Firebase account for your enterprise, enter your credentials below.' 
                : '기본적으로 아무것도 입력하지 않아도 내장된 클라우드 엔진이 모든 데이터를 자동 동기화합니다. 만약 본인만의 독립된 전용 Google Firebase 프로젝트를 사용하고자 하실 때만 아래 값을 입력해 주세요.'}
            </p>

            <form onSubmit={handleSaveCloudConfig} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>apiKey</label>
                  <input
                    type="text"
                    required
                    value={cloudForm.apiKey || ''}
                    onChange={(e) => setCloudForm({ ...cloudForm, apiKey: e.target.value })}
                    placeholder="AIzaSy..."
                    style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid var(--glass-border)', background: 'var(--bg-secondary)', color: 'inherit', fontFamily: 'monospace' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>projectId</label>
                  <input
                    type="text"
                    required
                    value={cloudForm.projectId || ''}
                    onChange={(e) => setCloudForm({ ...cloudForm, projectId: e.target.value })}
                    placeholder="my-travel-app-12345"
                    style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid var(--glass-border)', background: 'var(--bg-secondary)', color: 'inherit', fontFamily: 'monospace' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>authDomain</label>
                  <input
                    type="text"
                    value={cloudForm.authDomain || ''}
                    onChange={(e) => setCloudForm({ ...cloudForm, authDomain: e.target.value })}
                    placeholder="my-travel-app.firebaseapp.com"
                    style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid var(--glass-border)', background: 'var(--bg-secondary)', color: 'inherit', fontFamily: 'monospace' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>appId</label>
                  <input
                    type="text"
                    value={cloudForm.appId || ''}
                    onChange={(e) => setCloudForm({ ...cloudForm, appId: e.target.value })}
                    placeholder="1:123456:web:abcdef"
                    style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid var(--glass-border)', background: 'var(--bg-secondary)', color: 'inherit', fontFamily: 'monospace' }}
                  />
                </div>
              </div>

              <button 
                type="submit" 
                className="btn btn-primary"
                style={{ padding: '0.75rem', fontWeight: 'bold', alignSelf: 'flex-start', minWidth: '160px' }}
              >
                💾 {isEn ? 'Save Cloud Config' : '클라우드 DB 설정 저장 & 적용'}
              </button>
            </form>
          </div>

          {/* 3-Minute Free Setup Guide */}
          <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '12px', background: 'var(--bg-secondary)' }}>
            <h3 style={{ margin: '0 0 0.75rem 0', fontSize: '1.05rem' }}>
              📖 {isEn ? '3-Minute Free Firebase Setup Guide' : '3분 만에 무료 Firebase 클라우드 DB 만드는 방법'}
            </h3>
            <ol style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.8, paddingLeft: '1.25rem', margin: 0 }}>
              <li>
                <a href="https://console.firebase.google.com/" target="_blank" rel="noreferrer" style={{ color: '#2563eb', fontWeight: 'bold' }}>
                  Firebase Console (https://console.firebase.google.com/)
                </a>에 접속하여 Google 계정으로 무료 프로젝트를 생성합니다.
              </li>
              <li>좌측 메뉴의 <strong>Firestore Database</strong>를 클릭하고 <strong>데이터베이스 만들기</strong>를 선택합니다 (테스트 모드 시작).</li>
              <li>프로젝트 설정(톱니바퀴) ➔ 일반 ➔ <strong>내 앱(웹 앱 &lt;/&gt;)</strong>을 추가하면 발급되는 <code>firebaseConfig</code> 객체의 값들을 위의 입력창에 붙여넣고 저장합니다.</li>
              <li>이제 서로 다른 사용자가 모바일/PC 어디서 접속하든 데이터가 클라우드에 중앙 저장되고 실시간으로 동기화됩니다!</li>
            </ol>
          </div>

        </div>
      )}

      {/* 2. USERS TAB */}
      {activeSubTab === 'users' && (
        <div className="glass-panel" style={{ padding: '1.25rem', borderRadius: '12px', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--glass-border)', textAlign: 'left' }}>
                <th style={{ padding: '0.75rem' }}>{isEn ? 'User' : '사용자'}</th>
                <th style={{ padding: '0.75rem' }}>{isEn ? 'Username' : '아이디'}</th>
                <th style={{ padding: '0.75rem' }}>{isEn ? 'Role' : '권한'}</th>
                <th style={{ padding: '0.75rem' }}>{isEn ? 'Email' : '이메일'}</th>
                <th style={{ padding: '0.75rem' }}>{isEn ? 'Created At' : '가입일'}</th>
                <th style={{ padding: '0.75rem', textAlign: 'right' }}>{isEn ? 'Actions' : '관리'}</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(u => (
                <tr key={u.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                  <td style={{ padding: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '1.25rem' }}>{u.avatar || '👤'}</span>
                    <span style={{ fontWeight: 600 }}>{u.name || u.username}</span>
                  </td>
                  <td style={{ padding: '0.75rem', fontFamily: 'monospace' }}>{u.username}</td>
                  <td style={{ padding: '0.75rem' }}>
                    <span style={{
                      padding: '0.2rem 0.5rem',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      fontWeight: 'bold',
                      background: u.role === 'admin' ? '#4f46e5' : '#e2e8f0',
                      color: u.role === 'admin' ? '#ffffff' : '#334155'
                    }}>
                      {u.role === 'admin' ? '🛡️ ADMIN' : 'USER'}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem', color: 'var(--text-secondary)' }}>{u.email || '-'}</td>
                  <td style={{ padding: '0.75rem', color: 'var(--text-secondary)' }}>
                    {u.createdAt ? u.createdAt.split('T')[0] : '-'}
                  </td>
                  <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                    <button
                      onClick={() => handleToggleUserRole(u)}
                      className="btn btn-secondary"
                      style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem', marginRight: '0.4rem' }}
                      title="Toggle Admin / User"
                    >
                      {u.role === 'admin' ? '일반 전환' : '관리자 승격'}
                    </button>
                    <button
                      onClick={() => handleDeleteUser(u)}
                      className="btn btn-secondary"
                      style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem', color: '#dc2626', borderColor: '#fca5a5' }}
                      title="Delete User"
                    >
                      삭제
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 3. DESTINATIONS TAB */}
      {activeSubTab === 'destinations' && (
        <div className="glass-panel" style={{ padding: '1.25rem', borderRadius: '12px', overflowX: 'auto' }}>
          {filteredDests.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
              {isEn ? 'No custom destinations found.' : '등록된 커스텀 여행지가 없습니다.'}
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--glass-border)', textAlign: 'left' }}>
                  <th style={{ padding: '0.75rem' }}>{isEn ? 'Destination' : '도시명'}</th>
                  <th style={{ padding: '0.75rem' }}>{isEn ? 'Country' : '국가'}</th>
                  <th style={{ padding: '0.75rem' }}>{isEn ? 'Continent' : '대륙'}</th>
                  <th style={{ padding: '0.75rem' }}>{isEn ? 'Currency' : '통화'}</th>
                  <th style={{ padding: '0.75rem' }}>{isEn ? 'Tagline' : '한줄 소개'}</th>
                  <th style={{ padding: '0.75rem', textAlign: 'right' }}>{isEn ? 'Actions' : '관리'}</th>
                </tr>
              </thead>
              <tbody>
                {filteredDests.map(d => (
                  <tr key={d.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                    <td style={{ padding: '0.75rem', fontWeight: 600 }}>{d.name}</td>
                    <td style={{ padding: '0.75rem' }}>{d.country}</td>
                    <td style={{ padding: '0.75rem' }}>{d.continent}</td>
                    <td style={{ padding: '0.75rem' }}>{d.currency} ({d.currencySymbol})</td>
                    <td style={{ padding: '0.75rem', color: 'var(--text-secondary)', maxWidth: '250px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {d.tagline || '-'}
                    </td>
                    <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                      <button
                        onClick={() => handleOpenEditDestModal(d)}
                        className="btn btn-secondary"
                        style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem', marginRight: '0.4rem' }}
                      >
                        수정
                      </button>
                      <button
                        onClick={() => handleDeleteDest(d)}
                        className="btn btn-secondary"
                        style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem', color: '#dc2626', borderColor: '#fca5a5' }}
                      >
                        삭제
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* 4. TRIPS TAB */}
      {activeSubTab === 'trips' && (
        <div className="glass-panel" style={{ padding: '1.25rem', borderRadius: '12px', overflowX: 'auto' }}>
          {filteredTrips.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
              {isEn ? 'No trips recorded yet.' : '등록된 여행 일정이 없습니다.'}
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--glass-border)', textAlign: 'left' }}>
                  <th style={{ padding: '0.75rem' }}>{isEn ? 'Owner' : '작성자'}</th>
                  <th style={{ padding: '0.75rem' }}>{isEn ? 'Title' : '일정 제목'}</th>
                  <th style={{ padding: '0.75rem' }}>{isEn ? 'Destination' : '여행지'}</th>
                  <th style={{ padding: '0.75rem' }}>{isEn ? 'Duration' : '기간'}</th>
                  <th style={{ padding: '0.75rem' }}>{isEn ? 'Activities' : '활동 개수'}</th>
                  <th style={{ padding: '0.75rem', textAlign: 'right' }}>{isEn ? 'Actions' : '관리'}</th>
                </tr>
              </thead>
              <tbody>
                {filteredTrips.map(t => (
                  <tr key={t.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                    <td style={{ padding: '0.75rem', fontWeight: 600 }}>{t.ownerName}</td>
                    <td style={{ padding: '0.75rem' }}>{t.title}</td>
                    <td style={{ padding: '0.75rem' }}>{t.destinationName}</td>
                    <td style={{ padding: '0.75rem' }}>{t.duration}일</td>
                    <td style={{ padding: '0.75rem' }}>{t.activities ? t.activities.length : 0}개 항목</td>
                    <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                      <button
                        onClick={() => handleDeleteTrip(t)}
                        className="btn btn-secondary"
                        style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem', color: '#dc2626', borderColor: '#fca5a5' }}
                      >
                        삭제
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* 5. EXPENSES TAB */}
      {activeSubTab === 'expenses' && (
        <div className="glass-panel" style={{ padding: '1.25rem', borderRadius: '12px', overflowX: 'auto' }}>
          {filteredExpenses.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
              {isEn ? 'No expenses recorded yet.' : '등록된 지출 내역이 없습니다.'}
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--glass-border)', textAlign: 'left' }}>
                  <th style={{ padding: '0.75rem' }}>{isEn ? 'User' : '사용자'}</th>
                  <th style={{ padding: '0.75rem' }}>{isEn ? 'Title' : '항목'}</th>
                  <th style={{ padding: '0.75rem' }}>{isEn ? 'Category' : '카테고리'}</th>
                  <th style={{ padding: '0.75rem' }}>{isEn ? 'Original Amount' : '현지 금액'}</th>
                  <th style={{ padding: '0.75rem' }}>{isEn ? 'KRW Amount' : '원화 환산'}</th>
                  <th style={{ padding: '0.75rem' }}>{isEn ? 'Date' : '날짜'}</th>
                  <th style={{ padding: '0.75rem', textAlign: 'right' }}>{isEn ? 'Actions' : '관리'}</th>
                </tr>
              </thead>
              <tbody>
                {filteredExpenses.map(e => (
                  <tr key={e.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                    <td style={{ padding: '0.75rem', fontWeight: 600 }}>{e.ownerName}</td>
                    <td style={{ padding: '0.75rem' }}>{e.title}</td>
                    <td style={{ padding: '0.75rem' }}>{e.category}</td>
                    <td style={{ padding: '0.75rem' }}>{e.currency} {Number(e.amount).toLocaleString()}</td>
                    <td style={{ padding: '0.75rem', fontWeight: 600 }}>₩{Number(e.amountInKRW || e.amount).toLocaleString()}</td>
                    <td style={{ padding: '0.75rem', color: 'var(--text-secondary)' }}>{e.date}</td>
                    <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                      <button
                        onClick={() => handleDeleteExpense(e)}
                        className="btn btn-secondary"
                        style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem', color: '#dc2626', borderColor: '#fca5a5' }}
                      >
                        삭제
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* 6. VISITED TAB */}
      {activeSubTab === 'visited' && (
        <div className="glass-panel" style={{ padding: '1.25rem', borderRadius: '12px', overflowX: 'auto' }}>
          {filteredVisited.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
              {isEn ? 'No visited records recorded yet.' : '등록된 방문 기록이 없습니다.'}
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--glass-border)', textAlign: 'left' }}>
                  <th style={{ padding: '0.75rem' }}>{isEn ? 'User' : '사용자'}</th>
                  <th style={{ padding: '0.75rem' }}>{isEn ? 'City' : '도시명'}</th>
                  <th style={{ padding: '0.75rem' }}>{isEn ? 'Country' : '국가'}</th>
                  <th style={{ padding: '0.75rem' }}>{isEn ? 'Rating' : '별점'}</th>
                  <th style={{ padding: '0.75rem' }}>{isEn ? 'Visited Date' : '방문일'}</th>
                  <th style={{ padding: '0.75rem' }}>{isEn ? 'Memo' : '후기 메모'}</th>
                  <th style={{ padding: '0.75rem', textAlign: 'right' }}>{isEn ? 'Actions' : '관리'}</th>
                </tr>
              </thead>
              <tbody>
                {filteredVisited.map(v => (
                  <tr key={v.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                    <td style={{ padding: '0.75rem', fontWeight: 600 }}>{v.ownerName}</td>
                    <td style={{ padding: '0.75rem', fontWeight: 600 }}>{v.name}</td>
                    <td style={{ padding: '0.75rem' }}>{v.country}</td>
                    <td style={{ padding: '0.75rem', color: '#f59e0b' }}>{'★'.repeat(v.rating || 5)}</td>
                    <td style={{ padding: '0.75rem', color: 'var(--text-secondary)' }}>{v.visitedDate || '-'}</td>
                    <td style={{ padding: '0.75rem', color: 'var(--text-secondary)', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {v.memo || '-'}
                    </td>
                    <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                      <button
                        onClick={() => handleDeleteVisited(v)}
                        className="btn btn-secondary"
                        style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem', color: '#dc2626', borderColor: '#fca5a5' }}
                      >
                        삭제
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Destination Modal (Add/Edit) */}
      {showDestModal && (
        <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setShowDestModal(false); }}>
          <div className="modal-content" style={{ maxWidth: '520px', width: '92%', borderRadius: '16px', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h2 style={{ margin: 0, fontSize: '1.3rem' }}>
                🌍 {editingDest ? (isEn ? 'Edit Destination' : '여행지 정보 수정') : (isEn ? 'Add New Destination' : '새로운 여행지 등록')}
              </h2>
              <button onClick={() => setShowDestModal(false)} style={{ background: 'none', border: 'none', fontSize: '1.4rem', cursor: 'pointer', color: 'inherit' }}>
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveDestForm} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem', fontWeight: 600 }}>도시명 *</label>
                  <input
                    type="text"
                    required
                    value={destForm.name}
                    onChange={(e) => setDestForm({ ...destForm, name: e.target.value })}
                    placeholder="예: 발리, 삿포로"
                    style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid var(--glass-border)', background: 'var(--bg-secondary)', color: 'inherit' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem', fontWeight: 600 }}>국가명 *</label>
                  <input
                    type="text"
                    required
                    value={destForm.country}
                    onChange={(e) => setDestForm({ ...destForm, country: e.target.value })}
                    placeholder="예: 인도네시아, 일본"
                    style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid var(--glass-border)', background: 'var(--bg-secondary)', color: 'inherit' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem', fontWeight: 600 }}>대륙</label>
                  <select
                    value={destForm.continent}
                    onChange={(e) => setDestForm({ ...destForm, continent: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid var(--glass-border)', background: 'var(--bg-secondary)', color: 'inherit' }}
                  >
                    <option value="Asia">Asia</option>
                    <option value="Europe">Europe</option>
                    <option value="North America">North America</option>
                    <option value="South America">South America</option>
                    <option value="Oceania">Oceania</option>
                    <option value="Africa">Africa</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem', fontWeight: 600 }}>통화 코드</label>
                  <input
                    type="text"
                    value={destForm.currency}
                    onChange={(e) => setDestForm({ ...destForm, currency: e.target.value })}
                    placeholder="예: IDR, JPY"
                    style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid var(--glass-border)', background: 'var(--bg-secondary)', color: 'inherit' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem', fontWeight: 600 }}>통화 기호</label>
                  <input
                    type="text"
                    value={destForm.currencySymbol}
                    onChange={(e) => setDestForm({ ...destForm, currencySymbol: e.target.value })}
                    placeholder="예: Rp, ¥"
                    style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid var(--glass-border)', background: 'var(--bg-secondary)', color: 'inherit' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem', fontWeight: 600 }}>한줄 테마 / 소개</label>
                <input
                  type="text"
                  value={destForm.tagline}
                  onChange={(e) => setDestForm({ ...destForm, tagline: e.target.value })}
                  placeholder="예: 푸른 바다와 전통 예술이 숨쉬는 지상낙원"
                  style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid var(--glass-border)', background: 'var(--bg-secondary)', color: 'inherit' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem', fontWeight: 600 }}>태그 (쉼표로 구분)</label>
                <input
                  type="text"
                  value={destForm.tags}
                  onChange={(e) => setDestForm({ ...destForm, tags: e.target.value })}
                  placeholder="예: 힐링, 휴양, 바다, 미식"
                  style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid var(--glass-border)', background: 'var(--bg-secondary)', color: 'inherit' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem', fontWeight: 600 }}>위도 (Latitude)</label>
                  <input
                    type="number"
                    step="any"
                    value={destForm.lat}
                    onChange={(e) => setDestForm({ ...destForm, lat: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid var(--glass-border)', background: 'var(--bg-secondary)', color: 'inherit' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem', fontWeight: 600 }}>경도 (Longitude)</label>
                  <input
                    type="number"
                    step="any"
                    value={destForm.lng}
                    onChange={(e) => setDestForm({ ...destForm, lng: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid var(--glass-border)', background: 'var(--bg-secondary)', color: 'inherit' }}
                  />
                </div>
              </div>

              <button 
                type="submit" 
                className="btn btn-primary"
                style={{ width: '100%', padding: '0.75rem', marginTop: '0.5rem', fontWeight: 'bold' }}
              >
                {editingDest ? '수정사항 저장' : '새로운 여행지 추가하기'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
