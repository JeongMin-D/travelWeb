import React, { useState, useEffect } from 'react';
import appDb from '../db/appDb';
import { sendTestEmail } from '../services/emailService';

export default function AdminDashboard({ onExitAdmin, lang = 'en' }) {
  const isEn = lang === 'en';
  const [activeSubTab, setActiveSubTab] = useState('overview'); // 'overview' | 'feedbacks' | 'users' | 'destinations' | 'trips' | 'expenses' | 'visited' | 'cloud'
  
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [trips, setTrips] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [visited, setVisited] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [feedbackCategoryFilter, setFeedbackCategoryFilter] = useState('all');
  const [feedbackStatusFilter, setFeedbackStatusFilter] = useState('all');

  // Cloud DB Config state
  const [cloudStatus, setCloudStatus] = useState(() => appDb.cloud.getStatus());
  const [cloudForm, setCloudForm] = useState(() => appDb.cloud.getConfig());
  const [emailForm, setEmailForm] = useState(() => appDb.email.getConfig());
  const [syncMsg, setSyncMsg] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);

  // Email Test state
  const [isTestingEmail, setIsTestingEmail] = useState(false);
  const [testEmailMsg, setTestEmailMsg] = useState('');

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
      setFeedbacks(appDb.admin.getAllFeedbacks());
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

  const handleSaveEmailConfig = (e) => {
    e.preventDefault();
    const ok = appDb.email.saveConfig(emailForm);
    if (ok) {
      alert(isEn ? 'Email notification configuration saved!' : '관리자 이메일 알림 설정이 저장되었습니다!');
    } else {
      alert(isEn ? 'Failed to save email settings.' : '이메일 설정 저장에 실패했습니다.');
    }
  };

  const handleSendTestEmail = async () => {
    if (!emailForm.adminEmail || !emailForm.adminEmail.includes('@')) {
      alert(isEn ? 'Please enter a valid email address first.' : '알림을 수신할 유효한 이메일 주소를 먼저 입력해 주세요.');
      return;
    }
    setIsTestingEmail(true);
    setTestEmailMsg(isEn ? 'Sending test notification email...' : '테스트 알림 메일을 전송하는 중입니다...');
    try {
      appDb.email.saveConfig(emailForm);
      const res = await sendTestEmail(emailForm.adminEmail);
      if (res && res.success) {
        setTestEmailMsg(isEn 
          ? `✅ Test email successfully sent to [${emailForm.adminEmail}]! Please check your inbox & spam folder.` 
          : `✅ [${emailForm.adminEmail}]으로 테스트 메일이 발송되었습니다! 받은편지함(또는 스팸함)을 확인해 주세요.`);
      } else {
        setTestEmailMsg(isEn 
          ? `⚠️ FormSubmit dispatched. If this is your first time, please check your inbox for the 1-time 'Activate Form' confirmation email!` 
          : `⚠️ 테스트 요청이 발송되었습니다! [${emailForm.adminEmail}] 받은편지함(스팸함)에 FormSubmit에서 온 'Activate Form(첫 1회 폼 활성화)' 메일이 있는지 확인하시고 활성화 버튼을 눌러주세요.`);
      }
    } catch (err) {
      setTestEmailMsg(`❌ ${isEn ? 'Test error:' : '테스트 전송 오류:'} ${err.message}`);
    } finally {
      setIsTestingEmail(false);
    }
  };

  const handleSyncToCloud = async () => {
    setIsSyncing(true);
    setSyncMsg(isEn ? 'Uploading local database records to Cloud Firestore...' : '로컬 데이터를 클라우드 Firestore로 일괄 업로드 중...');
    try {
      const res = await appDb.cloud.syncLocalToCloud();
      setSyncMsg(isEn 
        ? `✅ Success! Uploaded ${res.users} users, ${res.trips} trips, ${res.expenses} expenses, ${res.visited} visited, ${res.feedback || 0} feedbacks to Cloud DB.` 
        : `✅ 업로드 완료! 회원 ${res.users}명, 일정 ${res.trips}개, 지출 ${res.expenses}건, 방문기록 ${res.visited}개, 피드백 ${res.feedback || 0}건이 클라우드 DB에 동기화되었습니다.`);
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
      tags: '',
      lat: 37.5665,
      lng: 126.9780
    });
    setShowDestModal(true);
  };

  const handleEditDest = (dest) => {
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

  const handleSaveDest = (e) => {
    e.preventDefault();
    if (!destForm.name || !destForm.country) {
      alert(isEn ? 'Name and country are required.' : '여행지 이름과 국가는 필수입니다.');
      return;
    }

    const payload = {
      name: destForm.name.trim(),
      country: destForm.country.trim(),
      continent: destForm.continent,
      currency: destForm.currency.trim().toUpperCase(),
      currencySymbol: destForm.currencySymbol.trim(),
      tagline: destForm.tagline.trim(),
      tags: destForm.tags.split(',').map(t => t.trim()).filter(Boolean),
      coordinates: {
        lat: Number(destForm.lat),
        lng: Number(destForm.lng)
      },
      type: destForm.country === '대한민국' || destForm.country === '한국' ? 'domestic' : 'international'
    };

    if (editingDest) {
      appDb.admin.updateDestination(editingDest.id, payload);
    } else {
      appDb.admin.createDestination(payload);
    }

    setShowDestModal(false);
    loadData();
  };

  const handleDeleteDest = (dest) => {
    if (window.confirm(isEn ? `Delete custom destination [${dest.name}]?` : `[${dest.name}] 커스텀 여행지를 삭제하시겠습니까?`)) {
      appDb.admin.deleteDestination(dest.id);
      loadData();
    }
  };

  // Feedback Actions
  const handleUpdateFeedbackStatus = (id, newStatus) => {
    appDb.admin.updateFeedbackStatus(id, newStatus);
    loadData();
  };

  const handleDeleteFeedback = (id) => {
    if (window.confirm(isEn ? 'Delete this feedback item?' : '이 피드백 항목을 삭제하시겠습니까?')) {
      appDb.admin.deleteFeedback(id);
      loadData();
    }
  };

  // Filtering
  const filteredFeedbacks = feedbacks.filter(f => {
    const matchCategory = feedbackCategoryFilter === 'all' || f.type === feedbackCategoryFilter;
    const matchStatus = feedbackStatusFilter === 'all' || f.status === feedbackStatusFilter;
    const matchSearch = !searchTerm || 
      (f.title && f.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (f.content && f.content.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (f.userName && f.userName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (f.userEmail && f.userEmail.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchCategory && matchStatus && matchSearch;
  });

  const filteredUsers = users.filter(u => 
    u.username.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (u.name && u.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (u.email && u.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredDestinations = destinations.filter(d => 
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    d.country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredTrips = trips.filter(t => 
    t.destinationName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (t.title && t.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (t.ownerName && t.ownerName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredExpenses = expenses.filter(e => 
    e.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (e.category && e.category.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (e.ownerName && e.ownerName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredVisited = visited.filter(v => 
    v.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (v.ownerName && v.ownerName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const hasUnconfiguredEmail = !emailForm.adminEmail || emailForm.adminEmail === 'admin@voyage.travel';

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
          { key: 'feedbacks', icon: '💬', nameKo: `피드백/버그 (${feedbacks.length})`, nameEn: `Feedbacks (${feedbacks.length})`, badge: feedbacks.filter(f => f.status === 'new').length },
          { key: 'cloud', icon: '☁️', nameKo: '클라우드 DB & 알림', nameEn: 'Cloud & Email' },
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
              borderRadius: '8px',
              position: 'relative'
            }}
          >
            {tab.icon} {isEn ? tab.nameEn : tab.nameKo}
            {tab.badge > 0 && (
              <span style={{ marginLeft: '6px', background: '#ef4444', color: '#fff', fontSize: '0.7rem', padding: '1px 6px', borderRadius: '10px', fontWeight: 800 }}>
                {tab.badge}
              </span>
            )}
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
            <div className="glass-panel" style={{ padding: '1.25rem', borderRadius: '12px', borderLeft: '4px solid #ef4444' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>💬 {isEn ? 'User Feedbacks & Bugs' : '피드백 / 버그 제보'}</div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', marginTop: '0.4rem', color: '#ef4444' }}>
                {stats.totalFeedbacks || 0}
                {stats.newFeedbacks > 0 && <span style={{ fontSize: '0.9rem', marginLeft: '0.5rem', color: '#f59e0b' }}>({stats.newFeedbacks} 신규)</span>}
              </div>
            </div>

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
              <div style={{ fontSize: '2rem', fontWeight: 'bold', marginTop: '0.4rem' }}>{stats.totalDestinations || (911 + destinations.length)}</div>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '12px' }}>
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem' }}>⚡ {isEn ? 'Quick Admin Actions' : '관리자 빠른 바로가기'}</h3>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button onClick={() => setActiveSubTab('feedbacks')} className="btn btn-primary" style={{ padding: '0.75rem 1.25rem', background: '#ef4444' }}>
                💬 {isEn ? 'View User Feedbacks' : '피드백/버그 제보 확인'}
              </button>
              <button onClick={() => setActiveSubTab('cloud')} className="btn btn-primary" style={{ padding: '0.75rem 1.25rem', background: '#2563eb' }}>
                ☁️ {isEn ? 'Cloud Database & Email' : '클라우드 DB & 이메일 설정'}
              </button>
              <button onClick={() => setActiveSubTab('users')} className="btn btn-secondary" style={{ padding: '0.75rem 1.25rem' }}>
                👥 {isEn ? 'Manage Users' : '회원 목록 관리'}
              </button>
              <button onClick={handleOpenNewDestModal} className="btn btn-secondary" style={{ padding: '0.75rem 1.25rem' }}>
                🌍 {isEn ? 'Add New City' : '새로운 도시 추가'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. FEEDBACKS & BUG REPORTS TAB */}
      {activeSubTab === 'feedbacks' && (
        <div>
          {/* Email Unconfigured Warning Banner */}
          {hasUnconfiguredEmail && (
            <div style={{ background: 'rgba(239, 68, 68, 0.12)', border: '1px solid #ef4444', color: '#ef4444', padding: '1rem 1.25rem', borderRadius: '10px', marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div>
                <strong style={{ fontSize: '0.95rem' }}>⚠️ 관리자 알림 이메일이 아직 설정되지 않았습니다!</strong>
                <div style={{ fontSize: '0.85rem', marginTop: '0.25rem', color: 'var(--text-secondary)' }}>
                  사용자가 피드백/버그를 등록했을 때 실시간 메일 알림을 받으시려면 본인의 실제 이메일을 등록해 주세요.
                </div>
              </div>
              <button onClick={() => setActiveSubTab('cloud')} className="btn btn-primary" style={{ fontSize: '0.85rem', padding: '0.45rem 1rem', background: '#ef4444' }}>
                ⚙️ 이메일 설정 바로가기
              </button>
            </div>
          )}

          {/* Filter Bar */}
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>유형:</span>
              {['all', 'bug', 'feature', 'inquiry', 'other'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setFeedbackCategoryFilter(cat)}
                  className={`btn ${feedbackCategoryFilter === cat ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
                >
                  {cat === 'all' ? '전체' : cat === 'bug' ? '🐛 버그/오류' : cat === 'feature' ? '💡 기능 개선' : cat === 'inquiry' ? '❓ 문의' : '📝 기타'}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>상태:</span>
              {['all', 'new', 'in_review', 'resolved'].map(st => (
                <button
                  key={st}
                  onClick={() => setFeedbackStatusFilter(st)}
                  className={`btn ${feedbackStatusFilter === st ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
                >
                  {st === 'all' ? '전체' : st === 'new' ? '🟡 접수 대기' : st === 'in_review' ? '🔵 검토 중' : '🟢 처리 완료'}
                </button>
              ))}
            </div>
          </div>

          {filteredFeedbacks.length === 0 ? (
            <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>📭</div>
              <p>{isEn ? 'No feedback messages found.' : '도착한 피드백 또는 버그 제보가 없습니다.'}</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {filteredFeedbacks.map((item) => {
                const typeInfo = {
                  bug: { label: '🐛 버그/오류', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)' },
                  feature: { label: '💡 기능 개선', color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)' },
                  inquiry: { label: '❓ 일반 문의', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' },
                  other: { label: '📝 기타 의견', color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.1)' }
                }[item.type] || { label: '💬 피드백', color: '#6b7280', bg: 'rgba(107, 114, 128, 0.1)' };

                return (
                  <div key={item.id} className="glass-panel" style={{ padding: '1.25rem', borderRadius: '12px', borderLeft: `5px solid ${typeInfo.color}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.75rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                        <span style={{ background: typeInfo.bg, color: typeInfo.color, padding: '0.2rem 0.6rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 800 }}>
                          {typeInfo.label}
                        </span>
                        <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>{item.title}</h4>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {/* Status dropdown */}
                        <select
                          value={item.status || 'new'}
                          onChange={(e) => handleUpdateFeedbackStatus(item.id, e.target.value)}
                          style={{
                            padding: '0.35rem 0.65rem',
                            borderRadius: '6px',
                            fontSize: '0.8rem',
                            fontWeight: 700,
                            background: item.status === 'resolved' ? '#10b981' : item.status === 'in_review' ? '#3b82f6' : '#f59e0b',
                            color: '#ffffff',
                            border: 'none',
                            cursor: 'pointer'
                          }}
                        >
                          <option value="new">🟡 접수 대기</option>
                          <option value="in_review">🔵 검토 중</option>
                          <option value="resolved">🟢 처리 완료</option>
                        </select>

                        {/* Direct Email Reply */}
                        {item.userEmail && (
                          <a
                            href={`mailto:${item.userEmail}?subject=${encodeURIComponent(`[Voyage 답변] ${item.title}`)}&body=${encodeURIComponent(`안녕하세요, ${item.userName}님!\n보내주신 [${item.title}] 건에 대한 답변입니다.\n\n---\n작성자 문의 내용:\n${item.content}\n\n---\n답변 내용:\n`)}`}
                            className="btn btn-secondary"
                            style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                          >
                            ✉️ {isEn ? 'Reply Email' : '답장 메일 보내기'}
                          </a>
                        )}

                        <button
                          onClick={() => handleDeleteFeedback(item.id)}
                          className="btn btn-secondary"
                          style={{ padding: '0.35rem 0.6rem', fontSize: '0.8rem', color: '#ef4444' }}
                          title="삭제"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>

                    {/* Content text */}
                    <div style={{ background: 'var(--bg-secondary)', padding: '0.85rem 1rem', borderRadius: '8px', fontSize: '0.9rem', lineHeight: 1.6, whiteSpace: 'pre-wrap', marginBottom: '0.75rem' }}>
                      {item.content}
                    </div>

                    {/* Footer info */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <div>
                        👤 <strong>{item.userName}</strong> {item.userEmail ? `(${item.userEmail})` : '(이메일 미기재)'} • 🕒 {item.createdAt ? new Date(item.createdAt).toLocaleString('ko-KR') : ''}
                      </div>
                      {item.browserInfo && (
                        <div style={{ maxWidth: '400px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={item.browserInfo}>
                          🖥️ {item.browserInfo}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 3. CLOUD DB & EMAIL SETTINGS TAB */}
      {activeSubTab === 'cloud' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Status & Sync Action Card */}
          <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '12px', borderLeft: '6px solid #10b981' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h2 style={{ margin: 0, fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  🔥 {isEn ? 'Google Firebase Firestore Cloud Database' : 'Google Firebase Firestore 클라우드 데이터베이스'}
                  <span style={{ fontSize: '0.8rem', padding: '0.2rem 0.5rem', borderRadius: '6px', background: '#10b981', color: '#fff' }}>
                    🟢 {isEn ? 'Firebase Connected' : 'Firebase 실시간 연동 완료'}
                  </span>
                </h2>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.4rem', lineHeight: 1.5 }}>
                  {isEn 
                    ? '✨ Successfully connected to your official Google Firebase project [my-travel-web-a1cb7]!' 
                    : '✨ 사용자님의 공식 Google Firebase 프로젝트 [my-travel-web-a1cb7]에 성공적으로 연동되었습니다!'}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  disabled={isSyncing}
                  onClick={handleSyncToCloud}
                  className="btn btn-primary"
                  style={{ padding: '0.6rem 1.1rem', fontSize: '0.85rem' }}
                >
                  📤 {isEn ? 'Upload Local to Firestore' : '로컬 ➔ Firestore 일괄 업로드'}
                </button>
                <button
                  disabled={isSyncing}
                  onClick={handleSyncFromCloud}
                  className="btn btn-secondary"
                  style={{ padding: '0.6rem 1.1rem', fontSize: '0.85rem' }}
                >
                  📥 {isEn ? 'Download Firestore to Local' : 'Firestore ➔ 로컬 가져오기'}
                </button>
              </div>
            </div>

            {syncMsg && (
              <div style={{ marginTop: '1rem', padding: '0.75rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', fontSize: '0.85rem', fontWeight: 600 }}>
                {syncMsg}
              </div>
            )}
          </div>

          {/* Email Notification Settings Card */}
          <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '12px', borderLeft: '6px solid #ef4444' }}>
            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              📧 {isEn ? 'Admin Email Notification Dispatch Settings' : '관리자 이메일 실시간 알림 수신 설정'}
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0 0 1.25rem 0', lineHeight: 1.5 }}>
              {isEn 
                ? 'Register your actual email address to receive immediate email notifications whenever a user submits a bug report or suggestion.' 
                : '사용자가 피드백이나 버그를 접수했을 때 실시간 알림을 수신할 본인의 실제 이메일 주소(Gmail, Naver 등)를 등록해 주세요.'}
            </p>

            <form onSubmit={handleSaveEmailConfig} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.35rem', fontWeight: 700 }}>
                  {isEn ? 'Admin Notification Email' : '알림 수신 이메일 주소'} <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="email"
                  required
                  value={emailForm.adminEmail}
                  onChange={(e) => setEmailForm({ ...emailForm, adminEmail: e.target.value })}
                  placeholder="예: your-email@naver.com 또는 your-email@gmail.com"
                  style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '2px solid var(--color-primary)', background: 'var(--bg-secondary)', color: 'inherit', fontSize: '0.9rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.35rem', fontWeight: 700 }}>
                  {isEn ? 'Dispatch Method' : '메일 전송 엔진'}
                </label>
                <select
                  value={emailForm.serviceType}
                  onChange={(e) => setEmailForm({ ...emailForm, serviceType: e.target.value })}
                  style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'var(--bg-secondary)', color: 'inherit', fontSize: '0.9rem' }}
                >
                  <option value="formsubmit">FormSubmit (무료 다이렉트 전송, 첫 1회 확인 필요)</option>
                  <option value="web3forms">Web3Forms (Access Key 연동)</option>
                  <option value="formspree">Formspree (Formspree ID 연동)</option>
                  <option value="webhook">Custom Webhook (Slack / Discord 웹훅)</option>
                </select>
              </div>

              {emailForm.serviceType === 'web3forms' && (
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.35rem', fontWeight: 600 }}>
                    Web3Forms Access Key
                  </label>
                  <input
                    type="text"
                    value={emailForm.web3formsKey || ''}
                    onChange={(e) => setEmailForm({ ...emailForm, web3formsKey: e.target.value })}
                    placeholder="예: 00000000-0000-0000-0000-000000000000"
                    style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid var(--glass-border)', background: 'var(--bg-secondary)', color: 'inherit' }}
                  />
                </div>
              )}

              {emailForm.serviceType === 'formspree' && (
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.35rem', fontWeight: 600 }}>
                    Formspree Form ID
                  </label>
                  <input
                    type="text"
                    value={emailForm.formspreeId || ''}
                    onChange={(e) => setEmailForm({ ...emailForm, formspreeId: e.target.value })}
                    placeholder="예: xpzgvqwa"
                    style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid var(--glass-border)', background: 'var(--bg-secondary)', color: 'inherit' }}
                  />
                </div>
              )}

              {emailForm.serviceType === 'webhook' && (
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.35rem', fontWeight: 600 }}>
                    Webhook URL
                  </label>
                  <input
                    type="url"
                    value={emailForm.webhookUrl || ''}
                    onChange={(e) => setEmailForm({ ...emailForm, webhookUrl: e.target.value })}
                    placeholder="https://hooks.slack.com/... 또는 커스텀 엔드포인트"
                    style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid var(--glass-border)', background: 'var(--bg-secondary)', color: 'inherit' }}
                  />
                </div>
              )}

              <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '0.25rem' }}>
                <button type="submit" className="btn btn-primary" style={{ padding: '0.65rem 1.5rem', fontWeight: 700 }}>
                  💾 {isEn ? 'Save Email Settings' : '이메일 수신 설정 저장하기'}
                </button>
                <button 
                  type="button" 
                  onClick={handleSendTestEmail}
                  disabled={isTestingEmail}
                  className="btn btn-secondary" 
                  style={{ padding: '0.65rem 1.25rem', fontWeight: 700, borderColor: '#ef4444', color: '#ef4444' }}
                >
                  {isTestingEmail ? '전송 중...' : '🔔 테스트 메일 발송해보기'}
                </button>
              </div>

              {testEmailMsg && (
                <div style={{ gridColumn: '1 / -1', marginTop: '0.5rem', padding: '0.85rem 1rem', borderRadius: '8px', background: 'rgba(255,255,255,0.06)', fontSize: '0.85rem', lineHeight: 1.5, borderLeft: '4px solid #f59e0b' }}>
                  {testEmailMsg}
                </div>
              )}

              <div style={{ gridColumn: '1 / -1', background: 'rgba(0,0,0,0.2)', padding: '0.85rem 1rem', borderRadius: '8px', fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                💡 <strong>FormSubmit 첫 1회 이메일 활성화 안내</strong>:<br />
                새로운 이메일 주소를 처음 등록하신 후 테스트 메일을 보내면, FormSubmit에서 스팸 방지를 위해 <code>[Action Required: Activate Form]</code> 메일을 1회 발송합니다. 해당 메일의 <strong>"Activate Form"</strong> 버튼을 한 번만 클릭해 주시면 이후 모든 사용자 피드백이 실시간으로 자동 수신됩니다!
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. USERS TAB */}
      {activeSubTab === 'users' && (
        <div className="glass-panel" style={{ padding: '1rem', borderRadius: '12px', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--glass-border)', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '0.75rem' }}>사용자</th>
                <th style={{ padding: '0.75rem' }}>아이디</th>
                <th style={{ padding: '0.75rem' }}>권한</th>
                <th style={{ padding: '0.75rem' }}>가입 일시</th>
                <th style={{ padding: '0.75rem', textAlign: 'right' }}>관리 액션</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                  <td style={{ padding: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '1.25rem' }}>{user.avatar || '👤'}</span>
                    <strong>{user.name || user.username}</strong>
                  </td>
                  <td style={{ padding: '0.75rem', color: 'var(--text-secondary)' }}>{user.username}</td>
                  <td style={{ padding: '0.75rem' }}>
                    <span style={{
                      padding: '0.2rem 0.5rem',
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      fontWeight: 'bold',
                      background: user.role === 'admin' ? '#ef4444' : '#3b82f6',
                      color: '#ffffff'
                    }}>
                      {user.role === 'admin' ? '🛡️ 관리자' : '👤 일반 회원'}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}
                  </td>
                  <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                    <button
                      onClick={() => handleToggleUserRole(user)}
                      className="btn btn-secondary"
                      style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem', marginRight: '0.5rem' }}
                    >
                      {user.role === 'admin' ? '일반회원으로 전환' : '관리자 권한 부여'}
                    </button>
                    {user.username !== 'admin' && (
                      <button
                        onClick={() => handleDeleteUser(user)}
                        className="btn btn-secondary"
                        style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem', color: '#ef4444', borderColor: '#ef4444' }}
                      >
                        삭제
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 5. DESTINATIONS TAB */}
      {activeSubTab === 'destinations' && (
        <div className="glass-panel" style={{ padding: '1rem', borderRadius: '12px', overflowX: 'auto' }}>
          {filteredDestinations.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem 0' }}>
              {isEn ? 'No custom destinations created yet.' : '등록된 커스텀 여행지가 없습니다. 상단 버튼으로 추가해 보세요!'}
            </p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--glass-border)', color: 'var(--text-secondary)' }}>
                  <th style={{ padding: '0.75rem' }}>도시명</th>
                  <th style={{ padding: '0.75rem' }}>국가 / 대륙</th>
                  <th style={{ padding: '0.75rem' }}>통화</th>
                  <th style={{ padding: '0.75rem' }}>한줄 테마</th>
                  <th style={{ padding: '0.75rem', textAlign: 'right' }}>관리</th>
                </tr>
              </thead>
              <tbody>
                {filteredDestinations.map(d => (
                  <tr key={d.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                    <td style={{ padding: '0.75rem', fontWeight: 'bold' }}>{d.name}</td>
                    <td style={{ padding: '0.75rem' }}>{d.country} ({d.continent})</td>
                    <td style={{ padding: '0.75rem' }}>{d.currency} ({d.currencySymbol})</td>
                    <td style={{ padding: '0.75rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{d.tagline}</td>
                    <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                      <button
                        onClick={() => handleEditDest(d)}
                        className="btn btn-secondary"
                        style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem', marginRight: '0.5rem' }}
                      >
                        수정
                      </button>
                      <button
                        onClick={() => handleDeleteDest(d)}
                        className="btn btn-secondary"
                        style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem', color: '#ef4444' }}
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

      {/* 6. TRIPS TAB */}
      {activeSubTab === 'trips' && (
        <div className="glass-panel" style={{ padding: '1rem', borderRadius: '12px', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--glass-border)', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '0.75rem' }}>소유 회원</th>
                <th style={{ padding: '0.75rem' }}>여행지</th>
                <th style={{ padding: '0.75rem' }}>일정 제목</th>
                <th style={{ padding: '0.75rem' }}>기간</th>
                <th style={{ padding: '0.75rem', textAlign: 'right' }}>삭제</th>
              </tr>
            </thead>
            <tbody>
              {filteredTrips.map(t => (
                <tr key={t.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                  <td style={{ padding: '0.75rem', fontWeight: 600 }}>{t.ownerName}</td>
                  <td style={{ padding: '0.75rem' }}>{t.destinationName}</td>
                  <td style={{ padding: '0.75rem' }}>{t.title || '여행 플랜'}</td>
                  <td style={{ padding: '0.75rem', color: 'var(--text-secondary)' }}>{t.days ? `${t.days.length}일 코스` : '-'}</td>
                  <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                    <button
                      onClick={() => {
                        if (window.confirm('이 여행 플랜을 삭제하시겠습니까?')) {
                          appDb.admin.deleteTrip(t.id);
                          loadData();
                        }
                      }}
                      className="btn btn-secondary"
                      style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem', color: '#ef4444' }}
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

      {/* 7. EXPENSES TAB */}
      {activeSubTab === 'expenses' && (
        <div className="glass-panel" style={{ padding: '1rem', borderRadius: '12px', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--glass-border)', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '0.75rem' }}>회원</th>
                <th style={{ padding: '0.75rem' }}>지출 항목</th>
                <th style={{ padding: '0.75rem' }}>카테고리</th>
                <th style={{ padding: '0.75rem' }}>금액 (원화 환산)</th>
                <th style={{ padding: '0.75rem', textAlign: 'right' }}>삭제</th>
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.map(e => (
                <tr key={e.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                  <td style={{ padding: '0.75rem', fontWeight: 600 }}>{e.ownerName}</td>
                  <td style={{ padding: '0.75rem' }}>{e.title}</td>
                  <td style={{ padding: '0.75rem' }}>{e.category}</td>
                  <td style={{ padding: '0.75rem', fontWeight: 'bold' }}>
                    ₩{(e.amountInKRW || e.amount || 0).toLocaleString()}
                  </td>
                  <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                    <button
                      onClick={() => {
                        if (window.confirm('이 지출 기록을 삭제하시겠습니까?')) {
                          appDb.admin.deleteExpense(e.id);
                          loadData();
                        }
                      }}
                      className="btn btn-secondary"
                      style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem', color: '#ef4444' }}
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

      {/* 8. VISITED TAB */}
      {activeSubTab === 'visited' && (
        <div className="glass-panel" style={{ padding: '1rem', borderRadius: '12px', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--glass-border)', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '0.75rem' }}>회원</th>
                <th style={{ padding: '0.75rem' }}>다녀온 도시</th>
                <th style={{ padding: '0.75rem' }}>별점</th>
                <th style={{ padding: '0.75rem' }}>방문 메모</th>
                <th style={{ padding: '0.75rem', textAlign: 'right' }}>삭제</th>
              </tr>
            </thead>
            <tbody>
              {filteredVisited.map(v => (
                <tr key={v.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                  <td style={{ padding: '0.75rem', fontWeight: 600 }}>{v.ownerName}</td>
                  <td style={{ padding: '0.75rem', fontWeight: 'bold' }}>{v.name} ({v.country})</td>
                  <td style={{ padding: '0.75rem' }}>{'⭐'.repeat(v.rating || 5)}</td>
                  <td style={{ padding: '0.75rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{v.memo || '-'}</td>
                  <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                    <button
                      onClick={() => {
                        if (window.confirm('이 방문 기록을 삭제하시겠습니까?')) {
                          appDb.admin.deleteVisited(v.id);
                          loadData();
                        }
                      }}
                      className="btn btn-secondary"
                      style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem', color: '#ef4444' }}
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

      {/* Destination Modal */}
      {showDestModal && (
        <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setShowDestModal(false); }}>
          <div className="modal-content" style={{ maxWidth: '540px', width: '92%', borderRadius: '16px', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800 }}>
                {editingDest ? '🌍 커스텀 여행지 정보 수정' : '🌍 신규 커스텀 여행지 등록'}
              </h3>
              <button onClick={() => setShowDestModal(false)} style={{ background: 'none', border: 'none', fontSize: '1.3rem', cursor: 'pointer', color: 'inherit' }}>✕</button>
            </div>

            <form onSubmit={handleSaveDest} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem', fontWeight: 600 }}>도시명</label>
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
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem', fontWeight: 600 }}>국가명</label>
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
