import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import Randomizer from './components/Randomizer';
import ItineraryViewer from './components/ItineraryViewer';
import ManualPlanner from './components/ManualPlanner';
import BudgetTracker from './components/BudgetTracker';
import WorldMap from './components/WorldMap';
import VisitedTracker from './components/VisitedTracker';
import AdminDashboard from './components/AdminDashboard';
import AuthModal from './components/AuthModal';
import FeedbackModal from './components/FeedbackModal';
import AuthRequiredGuard from './components/AuthRequiredGuard';
import ErrorBoundary from './components/ErrorBoundary';
import { destinations as defaultDestinations } from './data/destinations';
import appDb from './db/appDb';
import { trackPageView } from './services/analytics';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [allDests, setAllDests] = useState([]);
  
  // Track Page Views in Google Analytics (GA4)
  useEffect(() => {
    trackPageView(activeTab, `VOYAGE - ${activeTab.toUpperCase()}`);
  }, [activeTab]);
  
  // Auth state backed by AppDB
  const [currentUser, setCurrentUser] = useState(() => appDb.auth.getCurrentUser());
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authInitialMode, setAuthInitialMode] = useState('login');

  // Feedback Modal state
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  // Theme & Language state backed by AppDB
  const [theme, setTheme] = useState(() => appDb.preferences.getTheme());
  const [language, setLanguage] = useState(() => appDb.preferences.getLang());

  // Subscribe to auth, theme, and language changes
  useEffect(() => {
    return appDb.subscribe('auth', (user) => {
      setCurrentUser(user);
    });
  }, []);

  useEffect(() => {
    appDb.preferences.setTheme(theme);
  }, [theme]);

  useEffect(() => {
    appDb.preferences.setLang(language);
  }, [language]);

  const [cloudStatus, setCloudStatus] = useState(() => appDb.cloud.getStatus());
  const [isTestingCloud, setIsTestingCloud] = useState(false);

  // Load destinations & subscribe to custom destinations
  useEffect(() => {
    const refreshDests = () => {
      const customs = appDb.customDestinations.getAll();
      setAllDests([...defaultDestinations, ...customs]);
    };
    refreshDests();
    return appDb.subscribe('custom_destinations', refreshDests);
  }, []);

  const handleTestCloudConnection = async () => {
    setIsTestingCloud(true);
    const res = await appDb.cloud.testConnection();
    setIsTestingCloud(false);
    if (res.success) {
      alert(`🔥 Google Firebase Firestore 정상 연결됨!\n\n• 프로젝트: ${res.projectId}\n• 응답 속도: ${res.latencyMs}ms\n• 실시간 클라우드 DB 데이터 현황:\n  - 회원(users): ${res.counts.users}명\n  - 여행 일정(trips): ${res.counts.trips}개\n  - 가계부 지출(expenses): ${res.counts.expenses}건\n  - 방문 기록(visited): ${res.counts.visited}개\n  - 커스텀 여행지: ${res.counts.customs}개`);
    } else {
      alert(`❌ Firebase 연결 점검 오류:\n${res.error}`);
    }
  };
  
  // States for viewing a specific recommendation
  const [selectedDest, setSelectedDest] = useState(null);
  const [selectedDuration, setSelectedDuration] = useState(3);
  const [selectedStyle, setSelectedStyle] = useState('healing');

  // Pre-fill routing helper states
  const [prefilledDest, setPrefilledDest] = useState(null);
  const [prefilledDestForBudget, setPrefilledDestForBudget] = useState(null);

  const handleOpenAuth = (mode = 'login') => {
    setAuthInitialMode(mode);
    setShowAuthModal(true);
  };

  const handleLogout = () => {
    if (window.confirm(isEn ? 'Are you sure you want to log out?' : '정말 로그아웃 하시겠습니까?')) {
      appDb.auth.logout();
      if (activeTab === 'admin') setActiveTab('dashboard');
    }
  };

  const handleRegisterCustomDest = (customDestObj) => {
    appDb.customDestinations.create(customDestObj);
    handleSelectDestination(customDestObj, 3, 'healing');
  };

  const handleSelectDestination = (dest, duration, style) => {
    setSelectedDest(dest);
    setSelectedDuration(duration);
    setSelectedStyle(style);
    setActiveTab('itinerary');
  };

  const handleStartPlanning = (dest, duration, style) => {
    setPrefilledDest({ dest, duration, style });
    if (!currentUser) {
      handleOpenAuth('login');
    } else {
      setActiveTab('manual');
    }
  };

  const handleStartBudgeting = (dest) => {
    setPrefilledDestForBudget(dest);
    if (!currentUser) {
      handleOpenAuth('login');
    } else {
      setActiveTab('budget');
    }
  };

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const toggleLanguage = () => {
    setLanguage(prev => (prev === 'en' ? 'ko' : 'en'));
  };

  const isEn = language === 'en';

  return (
    <div className={`app-container ${theme === 'dark' ? 'theme-dark' : ''}`}>
      {/* Top Banner */}
      <div className="top-banner">
        <div className="top-banner-left">
          <span className="banner-headline" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ fontSize: '1.25rem' }}>🗺️</span>
            {isEn ? 'GALJIDO : GLOBAL SMART TRAVEL PLANNER' : '갈지도 : 전 세계 맞춤 여행 플래너'}
          </span>
          <span className="banner-subline">
            {isEn 
              ? 'Where will you go? 1~14 Day Itineraries, Budgets & Footprint Map' 
              : '어디 갈지도 모를 땐? 실시간 맞춤 코스 추천, 예산 관리 & 세계 여행 지도'}
          </span>
        </div>
        <div className="top-banner-right">
          <span className="phone-callout">
            {isEn ? `${allDests.length || 911} GLOBAL CITIES` : `전 세계 ${allDests.length || 911}개 도시`}
          </span>
          <div className="buy-a-dell-sticker">
            갈지도 <span className="purple-sticker-a">SMART</span> MAP
          </div>

          {/* User Auth Profile / Login Button */}
          {currentUser ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div 
                className="control-badge-btn"
                style={{ background: '#f3f4f6', color: '#111827', fontWeight: 600 }}
                title={`Logged in as ${currentUser.username}`}
              >
                {currentUser.avatar || '👤'} {currentUser.name}
              </div>
              <button 
                onClick={handleLogout} 
                className="control-badge-btn" 
                title="Log Out"
                style={{ background: '#fee2e2', color: '#dc2626', borderColor: '#fca5a5' }}
              >
                🚪 {isEn ? 'Logout' : '로그아웃'}
              </button>
            </div>
          ) : (
            <button 
              onClick={() => handleOpenAuth('login')} 
              className="control-badge-btn"
              style={{ background: '#000000', color: '#ffffff', fontWeight: 'bold' }}
              title="Log In / Sign Up"
            >
              🔑 {isEn ? 'Login / Sign Up' : '로그인 / 회원가입'}
            </button>
          )}

          {/* Cloud Firebase Real-Time Status & Diagnostics - ADMIN ONLY */}
          {currentUser?.role === 'admin' && (
            <button 
              onClick={handleTestCloudConnection}
              className="control-badge-btn"
              style={{ 
                background: 'rgba(16, 185, 129, 0.1)', 
                color: '#10b981', 
                borderColor: '#10b981',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
              title="Click to test live Firebase Firestore connectivity"
              disabled={isTestingCloud}
            >
              <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 6px #10b981' }}></span>
              {isTestingCloud ? (isEn ? 'Pinging...' : '점검중...') : (isEn ? '🔥 Firebase Live' : '🔥 DB 실시간 연동')}
            </button>
          )}

          {/* Admin Dashboard Entry Button - ADMIN ONLY */}
          {currentUser?.role === 'admin' && (
            <button 
              onClick={() => setActiveTab('admin')} 
              className={`control-badge-btn ${activeTab === 'admin' ? 'active' : ''}`}
              style={{ background: '#4f46e5', color: '#ffffff', borderColor: '#4338ca', fontWeight: 'bold' }}
              title="Access Admin Console"
            >
              🛡️ {isEn ? 'Admin Console' : '관리자 센터'}
            </button>
          )}

          {/* Mode Controls: Language & Theme Switches */}
          <button onClick={toggleLanguage} className="control-badge-btn" title="Toggle Language">
            🌐 {isEn ? 'EN | KR' : 'KR | EN'}
          </button>
          <button onClick={toggleTheme} className="control-badge-btn" title="Toggle Light/Dark Theme">
            {theme === 'dark' ? '🌙 DARK' : '☀️ LIGHT'}
          </button>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="main-layout">
        {/* Left Sidebar */}
        <aside className="sidebar-left">
          {/* Navigation Grid */}
          <div className="nav-grid">
            <button 
              className={`nav-grid-button ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              🔍 {isEn ? 'Search' : '여행지 검색'}
            </button>
            <button 
              className={`nav-grid-button ${activeTab === 'randomizer' ? 'active' : ''}`}
              onClick={() => setActiveTab('randomizer')}
            >
              🎲 {isEn ? 'Random' : '랜덤 추천'}
            </button>
            <button 
              className={`nav-grid-button ${activeTab === 'manual' ? 'active' : ''}`}
              onClick={() => setActiveTab('manual')}
            >
              📅 {isEn ? 'Planner' : '셀프 플래너'} {!currentUser && '🔒'}
            </button>
            <button 
              className={`nav-grid-button ${activeTab === 'budget' ? 'active' : ''}`}
              onClick={() => setActiveTab('budget')}
            >
              💰 {isEn ? 'Budget' : '예산 & 환율'} {!currentUser && '🔒'}
            </button>
            <button 
              className={`nav-grid-button ${activeTab === 'worldmap' ? 'active' : ''}`}
              onClick={() => setActiveTab('worldmap')}
            >
              🗺️ {isEn ? 'World Map' : '세계 지도'}
            </button>
            <button 
              className={`nav-grid-button ${activeTab === 'visited' ? 'active' : ''}`}
              onClick={() => setActiveTab('visited')}
            >
              ✅ {isEn ? 'Visited' : '다녀온 도시'} {!currentUser && '🔒'}
            </button>

            {/* Admin Management Tab in Sidebar if Admin */}
            {currentUser?.role === 'admin' && (
              <button 
                className={`nav-grid-button ${activeTab === 'admin' ? 'active' : ''}`}
                onClick={() => setActiveTab('admin')}
                style={{ background: activeTab === 'admin' ? '#4f46e5' : '#312e81', color: '#ffffff', fontWeight: 'bold', gridColumn: 'span 2', marginTop: '0.25rem' }}
              >
                🛡️ {isEn ? 'Admin Center' : '관리자 센터'}
              </button>
            )}
          </div>

          {/* Service Feature Banner */}
          <div className="cta-block-red">
            <h3>{isEn ? 'GALJIDO SERVICE GUIDE' : '갈지도(GALJIDO) 서비스 안내'}</h3>
            {isEn 
              ? `Where will you go? Explore ${allDests.length || 911} cities worldwide, generate custom 1-14 day itineraries, track real-time budgets, and log your travel footprint!`
              : `어디 갈지도 모를 땐? 전 세계 ${allDests.length || 911}개 도시 검색부터 1~14일 맞춤 코스 생성, 실시간 예산/환율 계산기, 다녀온 도시 발도장까지 한곳에서!`}
          </div>

          {/* Service Seal Badge */}
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
            <div className="cert-seal">
              <div>GALJIDO SMART</div>
              <div style={{ fontSize: '6px', margin: '2px 0' }}>★★★★★</div>
              <div>{allDests.length || 911} CITIES GUIDE</div>
            </div>
          </div>
        </aside>

        {/* Right Content Area */}
        <main className="content-right">
          {activeTab === 'dashboard' && (
            <Dashboard 
              destinations={allDests} 
              onSelectDestination={handleSelectDestination} 
              onRegisterCustomDest={handleRegisterCustomDest} 
              lang={language}
            />
          )}
          
          {activeTab === 'randomizer' && (
            <Randomizer 
              destinations={allDests} 
              onSelectDestination={handleSelectDestination} 
              lang={language}
            />
          )}

          {activeTab === 'itinerary' && selectedDest && (
            <ErrorBoundary onReset={() => setActiveTab('dashboard')}>
              <ItineraryViewer 
                destination={selectedDest}
                initialDuration={selectedDuration}
                initialStyle={selectedStyle}
                onBack={() => setActiveTab('dashboard')}
                onStartPlanning={handleStartPlanning}
                onStartBudgeting={handleStartBudgeting}
                lang={language}
              />
            </ErrorBoundary>
          )}

          {activeTab === 'manual' && (
            currentUser ? (
              <ManualPlanner 
                prefilledDestination={prefilledDest}
                onClearPrefilled={() => setPrefilledDest(null)}
                lang={language}
              />
            ) : (
              <AuthRequiredGuard tab="manual" onOpenAuth={handleOpenAuth} lang={language} />
            )
          )}

          {activeTab === 'budget' && (
            currentUser ? (
              <BudgetTracker 
                prefilledDestForBudget={prefilledDestForBudget}
                lang={language}
              />
            ) : (
              <AuthRequiredGuard tab="budget" onOpenAuth={handleOpenAuth} lang={language} />
            )
          )}
          
          {activeTab === 'worldmap' && (
            <WorldMap 
              destinations={allDests}
              onSelectDestination={handleSelectDestination}
              lang={language}
            />
          )}

          {activeTab === 'visited' && (
            currentUser ? (
              <VisitedTracker 
                destinations={allDests}
                onSelectDestination={handleSelectDestination}
                lang={language}
              />
            ) : (
              <AuthRequiredGuard tab="visited" onOpenAuth={handleOpenAuth} lang={language} />
            )
          )}

          {activeTab === 'admin' && (
            currentUser?.role === 'admin' ? (
              <AdminDashboard 
                onExitAdmin={() => setActiveTab('dashboard')}
                lang={language}
              />
            ) : (
              <AuthRequiredGuard tab="manual" onOpenAuth={handleOpenAuth} lang={language} />
            )
          )}
        </main>
      </div>

      {/* Footer Band */}
      <footer className="footer-band">
        <div className="icon-label-nav">
          <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('dashboard'); }} className="nav-icon-pair">
            <span style={{ fontSize: '1.5rem' }}>🔍</span>
            <span>{isEn ? 'FIND' : 'FIND (검색)'}</span>
          </a>
          <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('randomizer'); }} className="nav-icon-pair">
            <span style={{ fontSize: '1.5rem' }}>🎲</span>
            <span>{isEn ? 'RANDOM' : 'RANDOM (추천)'}</span>
          </a>
          <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('manual'); }} className="nav-icon-pair">
            <span style={{ fontSize: '1.5rem' }}>📅</span>
            <span>{isEn ? 'PLANNER' : 'PLANNER (플래너)'}</span>
          </a>
          <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('budget'); }} className="nav-icon-pair">
            <span style={{ fontSize: '1.5rem' }}>💰</span>
            <span>{isEn ? 'BUDGET' : 'BUDGET (예산)'}</span>
          </a>
        </div>
        <div className="copyright-row">
          Copyright © 2026 갈지도 (GALJIDO) Travel Co. All rights reserved. <a href="#">(Terms of Use)</a>
        </div>
        <div className="compatibility-text">
          {isEn 
            ? 'Real-time exchange rate info powered by Open Exchange Rate API. Multi-tenant secure storage powered by AppDB.'
            : '실시간 환율 정보는 Open Exchange Rate API를 연동하여 제공되며, 개인별 여행 데이터는 AppDB 멀티테넌트 인증 엔진으로 안전하게 분리 보존됩니다.'}
        </div>
      </footer>

      {/* Floating Feedback / Bug Report Action Pill */}
      <button
        onClick={() => setShowFeedbackModal(true)}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 999,
          background: '#000000',
          color: '#ffffff',
          border: '2px solid #3b82f6',
          borderRadius: '50px',
          padding: '0.65rem 1.15rem',
          fontSize: '0.85rem',
          fontWeight: 700,
          boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '0.45rem',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-3px)';
          e.currentTarget.style.boxShadow = '0 12px 28px rgba(59, 130, 246, 0.4)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0px)';
          e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.35)';
        }}
        title={isEn ? 'Send suggestions or report bugs' : '개선사항 제안 및 버그 제보'}
      >
        <span style={{ fontSize: '1.1rem' }}>💬</span>
        <span>{isEn ? 'Feedback / Bug' : '의견 제안 & 버그 신고'}</span>
      </button>

      {/* Authentication (Login/Signup) Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
        initialMode={authInitialMode}
        lang={language}
      />

      {/* Feedback & Bug Reporting Modal */}
      <FeedbackModal
        isOpen={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
        lang={language}
      />
    </div>
  );
}

export default App;
