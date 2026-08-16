import React from 'react';

const TAB_DESCRIPTIONS = {
  manual: {
    icon: '📅',
    titleKo: '나만의 맞춤 여행 일정을 작성하고 보관하세요',
    titleEn: 'Create & Manage Your Personal Travel Plans',
    descKo: '일자별 세부 시간표, 장소 메모, 예상 경비를 한곳에서 자유롭게 계획할 수 있습니다. 개인화된 일정 관리를 위해 로그인이 필요합니다.',
    descEn: 'Plan day-by-day schedules, spot notes, and estimated costs. Please log in to securely save and manage your personal itineraries.'
  },
  budget: {
    icon: '💰',
    titleKo: '스마트 예산 관리 & 실시간 환율 지출 장부',
    titleEn: 'Smart Budgeting & Real-Time Currency Expenses',
    descKo: '여행 총 예산 한도를 설정하고 카테고리별 지출을 원화 환산 금액으로 스마트하게 기록하세요. 안전한 장부 관리를 위해 로그인이 필요합니다.',
    descEn: 'Set overall trip budgets and log categorized expenses with real-time currency conversions. Please log in to manage your private ledger.'
  },
  visited: {
    icon: '🗺️',
    titleKo: '내가 다녀온 전 세계 도시 발자국 지도',
    titleEn: 'Your Personal World Footprint & Visited Map',
    descKo: '지금까지 다녀온 여행지를 지도에 핀으로 남기고 나만의 별점과 생생한 여행 메모를 기록하세요. 개인 기록 보관을 위해 로그인이 필요합니다.',
    descEn: 'Pin every destination you visited on interactive maps with personal ratings and memory notes. Please log in to track your footprints.'
  }
};

export default function AuthRequiredGuard({ tab = 'manual', onOpenAuth, lang = 'en' }) {
  const isEn = lang === 'en';
  const info = TAB_DESCRIPTIONS[tab] || TAB_DESCRIPTIONS.manual;

  return (
    <div className="fade-in" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', padding: '2rem 1rem' }}>
      <div 
        className="glass-panel" 
        style={{ 
          maxWidth: '560px', 
          width: '100%', 
          textAlign: 'center', 
          padding: '2.5rem 2rem', 
          borderRadius: '20px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.08)'
        }}
      >
        <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>
          {info.icon} 🔒
        </div>

        <h2 style={{ fontSize: '1.4rem', fontWeight: 'bold', marginBottom: '0.75rem', lineHeight: 1.4 }}>
          {isEn ? info.titleEn : info.titleKo}
        </h2>

        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '2rem' }}>
          {isEn ? info.descEn : info.descKo}
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button 
            onClick={() => onOpenAuth('login')} 
            className="btn btn-primary"
            style={{ padding: '0.8rem 1.8rem', fontSize: '1rem', fontWeight: 600 }}
          >
            🔑 {isEn ? 'Log In' : '로그인하기'}
          </button>
          
          <button 
            onClick={() => onOpenAuth('signup')} 
            className="btn btn-secondary"
            style={{ padding: '0.8rem 1.8rem', fontSize: '1rem', fontWeight: 600 }}
          >
            📝 {isEn ? 'Sign Up (Free)' : '무료 회원가입'}
          </button>
        </div>
      </div>
    </div>
  );
}
