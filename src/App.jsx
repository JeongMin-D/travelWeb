import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import Randomizer from './components/Randomizer';
import ItineraryViewer from './components/ItineraryViewer';
import ManualPlanner from './components/ManualPlanner';
import BudgetTracker from './components/BudgetTracker';
import WorldMap from './components/WorldMap';
import VisitedTracker from './components/VisitedTracker';
import { destinations as defaultDestinations, generateCustomDestination } from './data/destinations';



function App() {
  const [activeTab, setActiveTab] = useState('dashboard'); // dashboard, randomizer, itinerary, manual, budget
  const [allDests, setAllDests] = useState([]);
  
  // Theme state: 'light' | 'dark'
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('app_theme') || 'light';
  });

  // Language state: 'en' | 'ko' (default 'en' as requested)
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('app_lang') || 'en';
  });

  useEffect(() => {
    localStorage.setItem('app_theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('app_lang', language);
  }, [language]);

  // Load standard + custom destinations on mount
  useEffect(() => {
    const stored = localStorage.getItem('custom_dests');
    if (stored) {
      const parsedCustoms = JSON.parse(stored);
      setAllDests([...defaultDestinations, ...parsedCustoms]);
    } else {
      setAllDests(defaultDestinations);
    }
  }, []);
  
  // States for viewing a specific recommendation
  const [selectedDest, setSelectedDest] = useState(null);
  const [selectedDuration, setSelectedDuration] = useState(3);
  const [selectedStyle, setSelectedStyle] = useState('healing');

  // Pre-fill routing helper states
  const [prefilledDest, setPrefilledDest] = useState(null);
  const [prefilledDestForBudget, setPrefilledDestForBudget] = useState(null);

  const handleRegisterCustomDest = (customDestObj) => {
    const updated = [...allDests, customDestObj];
    setAllDests(updated);

    const stored = localStorage.getItem('custom_dests');
    const existingCustoms = stored ? JSON.parse(stored) : [];
    const newCustoms = [...existingCustoms, customDestObj];
    localStorage.setItem('custom_dests', JSON.stringify(newCustoms));

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
    setActiveTab('manual');
  };

  const handleStartBudgeting = (dest) => {
    setPrefilledDestForBudget(dest);
    setActiveTab('budget');
  };

  const handleClearPrefilled = () => {
    setPrefilledDest(null);
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
            {isEn ? '568 GLOBAL CITIES' : '전 세계 568개 도시'}
          </span>
          <div className="buy-a-dell-sticker">
            VOYAGE <span className="purple-sticker-a">SMART</span> PLANNER
          </div>

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
              📅 {isEn ? 'Planner' : '셀프 플래너'}
            </button>
            <button 
              className={`nav-grid-button ${activeTab === 'budget' ? 'active' : ''}`}
              onClick={() => setActiveTab('budget')}
            >
              🪙 {isEn ? 'Budget' : '예산 & 환율'}
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
              ✅ {isEn ? 'Visited' : '다녀온 도시'}
            </button>
          </div>

          {/* Service Feature Banner */}
          <div className="cta-block-red">
            <h3>{isEn ? 'VOYAGE SERVICE GUIDE' : 'VOYAGE 서비스 안내'}</h3>
            {isEn 
              ? 'Explore 568 cities worldwide, generate custom 1-14 day itineraries, track real-time budgets, and log your travel memories—all in one place!'
              : '전 세계 568개 도시 검색부터 1~14일 맞춤 일정 생성, 실시간 예산/환율 계산기, 다녀온 도시 기록 메모까지 한곳에서 스마트하게 이용해보세요!'}
          </div>

          {/* Service Seal Badge */}
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
            <div className="cert-seal">
              <div>VOYAGE SMART</div>
              <div style={{ fontSize: '6px', margin: '2px 0' }}>★★★★★</div>
              <div>568 CITIES GUIDE</div>
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
            <ManualPlanner 
              prefilledDestination={prefilledDest}
              onClearPrefilled={() => setPrefilledDest(null)}
              lang={language}
            />
          )}

          {activeTab === 'budget' && (
            <BudgetTracker 
              prefilledDestForBudget={prefilledDestForBudget}
              lang={language}
            />
          )}
          
          {activeTab === 'worldmap' && (
            <WorldMap 
              destinations={allDests}
              onSelectDestination={handleSelectDestination}
              lang={language}
            />
          )}

          {activeTab === 'visited' && (
            <VisitedTracker 
              destinations={allDests}
              onSelectDestination={handleSelectDestination}
              lang={language}
            />
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
            <span style={{ fontSize: '1.5rem' }}>🪙</span>
            <span>{isEn ? 'BUDGET' : 'BUDGET (예산)'}</span>
          </a>
        </div>
        <div className="copyright-row">
          Copyright © 2026 VOYAGE Travel Co. All rights reserved. <a href="#">(Terms of Use)</a>
        </div>
        <div className="compatibility-text">
          {isEn 
            ? 'Real-time exchange rate info powered by Open Exchange Rate API.'
            : '실시간 환율 정보는 Open Exchange Rate API를 연동하여 제공되며, 오프라인 시 백업 데이터로 계산됩니다.'}
        </div>
      </footer>
    </div>
  );
}

export default App;
