import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import Randomizer from './components/Randomizer';
import ItineraryViewer from './components/ItineraryViewer';
import ManualPlanner from './components/ManualPlanner';
import BudgetTracker from './components/BudgetTracker';
import WorldMap from './components/WorldMap';
import VisitedTracker from './components/VisitedTracker';
import DataBackupModal from './components/DataBackupModal';
import AuthModal from './components/AuthModal';
import AuthRequiredGuard from './components/AuthRequiredGuard';
import { destinations as defaultDestinations } from './data/destinations';
import appDb from './db/appDb';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [allDests, setAllDests] = useState([]);
  const [showDbModal, setShowDbModal] = useState(false);
  
  // Auth state backed by AppDB
  const [currentUser, setCurrentUser] = useState(() => appDb.auth.getCurrentUser());
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authInitialMode, setAuthInitialMode] = useState('login');

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

  // Load destinations & subscribe to custom destination changes
  useEffect(() => {
    const refreshDests = () => {
      const customs = appDb.customDestinations.getAll();
      setAllDests([...defaultDestinations, ...customs]);
    };
    refreshDests();
    return appDb.subscribe('custom_destinations', refreshDests);
  }, []);
  
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
          <span className="banner-headline">
            {isEn ? 'VOYAGE GLOBAL SMART TRAVEL PLANNER' : 'VOYAGE 전 세계 맞춤 여행 플래너'}
          </span>
          <span className="banner-subline">
            {isEn 
              ? 'Custom 1~14 Day Itineraries, Budget Calculator & Footprint Tracker' 
              : '실시간 1~14일 코스 추천, 예산 관리 및 방문 기록 서비스'}
          </span>
        </div>
        <div className="top-banner-right">
          <span className="phone-callout">
            {isEn ? '906 GLOBAL CITIES' : '전 세계 906개 도시'}
          </span>
          <div className="buy-a-dell-sticker">
            VOYAGE <span className="purple-sticker-a">SMART</span> PLANNER
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

          {/* Database Management / Backup Button - ADMIN ONLY */}
          {currentUser?.role === 'admin' && (
            <button 
              onClick={() => setShowDbModal(true)} 
              className="control-badge-btn" 
              style={{ background: '#4f46e5', color: '#ffffff', borderColor: '#4338ca', fontWeight: 'bold' }}
              title="Administrator Database Management & Backup"
            >
              🛡️ {isEn ? '[Admin] DB Backup' : '[관리자] DB 백업'}
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
          </div>

          {/* Service Feature Banner */}
          <div className="cta-block-red">
            <h3>{isEn ? 'VOYAGE SERVICE GUIDE' : 'VOYAGE 서비스 안내'}</h3>
            {isEn 
              ? 'Explore 906 cities worldwide, generate custom 1-14 day itineraries, track real-time budgets, and log your travel memories—all in one place!'
              : '전 세계 906개 도시 검색부터 1~14일 맞춤 일정 생성, 실시간 예산/환율 계산기, 다녀온 도시 기록 메모까지 한곳에서 스마트하게 이용해보세요!'}
          </div>

          {/* Service Seal Badge */}
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
            <div className="cert-seal">
              <div>VOYAGE SMART</div>
              <div style={{ fontSize: '6px', margin: '2px 0' }}>★★★★★</div>
              <div>906 CITIES GUIDE</div>
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
            <ItineraryViewer 
              destination={selectedDest}
              initialDuration={selectedDuration}
              initialStyle={selectedStyle}
              onBack={() => setActiveTab('dashboard')}
              onStartPlanning={handleStartPlanning}
              onStartBudgeting={handleStartBudgeting}
              lang={language}
            />
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
          Copyright © 2026 VOYAGE Travel Co. All rights reserved. <a href="#">(Terms of Use)</a>
        </div>
        <div className="compatibility-text">
          {isEn 
            ? 'Real-time exchange rate info powered by Open Exchange Rate API. Multi-tenant secure storage powered by AppDB.'
            : '실시간 환율 정보는 Open Exchange Rate API를 연동하여 제공되며, 개인별 여행 데이터는 AppDB 멀티테넌트 인증 엔진으로 안전하게 분리 보존됩니다.'}
        </div>
      </footer>

      {/* Database Management & Backup Modal */}
      <DataBackupModal 
        isOpen={showDbModal} 
        onClose={() => setShowDbModal(false)} 
        lang={language} 
      />

      {/* Authentication (Login/Signup) Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
        initialMode={authInitialMode}
        lang={language}
      />
    </div>
  );
}

export default App;
