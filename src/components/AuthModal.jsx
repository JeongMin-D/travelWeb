import React, { useState } from 'react';
import appDb from '../db/appDb';

const AVATAR_OPTIONS = ['✈️', '🎒', '🧭', '🌴', '⛺', '🏖️', '🚂', '🦁', '🗺️', '☕'];

export default function AuthModal({ isOpen, onClose, initialMode = 'login', onAuthSuccess, lang = 'en' }) {
  const isEn = lang === 'en';
  const [mode, setMode] = useState(initialMode); // 'login' | 'signup'
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('✈️');
  const [email, setEmail] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (mode === 'login') {
      const res = appDb.auth.login(username, password);
      if (res.success) {
        if (onAuthSuccess) onAuthSuccess(res.user);
        onClose();
      } else {
        setErrorMsg(res.error || (isEn ? 'Invalid username or password.' : '아이디 또는 비밀번호가 잘못되었습니다.'));
      }
    } else {
      const res = appDb.auth.signup({ username, password, name, avatar, email });
      if (res.success) {
        if (onAuthSuccess) onAuthSuccess(res.user);
        onClose();
      } else {
        setErrorMsg(res.error || (isEn ? 'Sign up failed.' : '회원가입에 실패했습니다.'));
      }
    }
  };

  const handleDemoUserLogin = () => {
    const res = appDb.auth.demoLogin();
    if (res.success) {
      if (onAuthSuccess) onAuthSuccess(res.user);
      onClose();
    }
  };

  const handleDemoAdminLogin = () => {
    const res = appDb.auth.login('admin', 'admin1234');
    if (res.success) {
      if (onAuthSuccess) onAuthSuccess(res.user);
      onClose();
    } else {
      setErrorMsg(res.error);
    }
  };

  return (
    <div 
      className="modal-overlay" 
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="modal-content" style={{ maxWidth: '440px', width: '92%', borderRadius: '16px', padding: '2rem' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={() => { setMode('login'); setErrorMsg(''); }}
              style={{
                background: 'none',
                border: 'none',
                borderBottom: mode === 'login' ? '2px solid #000' : '2px solid transparent',
                fontWeight: mode === 'login' ? 'bold' : 'normal',
                fontSize: '1.1rem',
                cursor: 'pointer',
                padding: '0.25rem 0.5rem',
                color: 'inherit'
              }}
            >
              🔑 {isEn ? 'Log In' : '로그인'}
            </button>
            <button
              type="button"
              onClick={() => { setMode('signup'); setErrorMsg(''); }}
              style={{
                background: 'none',
                border: 'none',
                borderBottom: mode === 'signup' ? '2px solid #000' : '2px solid transparent',
                fontWeight: mode === 'signup' ? 'bold' : 'normal',
                fontSize: '1.1rem',
                cursor: 'pointer',
                padding: '0.25rem 0.5rem',
                color: 'inherit'
              }}
            >
              📝 {isEn ? 'Sign Up' : '무료 회원가입'}
            </button>
          </div>

          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '1.4rem', cursor: 'pointer', color: 'inherit' }}>
            ✕
          </button>
        </div>

        {/* Quick Demo Logins Banner */}
        <div style={{ marginBottom: '1.25rem', padding: '0.85rem', background: 'var(--bg-secondary)', borderRadius: '10px' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
            ⚡ {isEn ? 'Quick Instant Logins' : '1초 빠른 로그인 체험'}
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button 
              type="button" 
              onClick={handleDemoUserLogin}
              className="btn btn-secondary"
              style={{ flex: 1, fontSize: '0.75rem', padding: '0.45rem', whiteSpace: 'nowrap' }}
              title="Demo Traveler (demo / 1234)"
            >
              ✈️ {isEn ? 'Traveler Demo' : '일반 여행자 체험'}
            </button>
            <button 
              type="button" 
              onClick={handleDemoAdminLogin}
              className="btn btn-secondary"
              style={{ flex: 1, fontSize: '0.75rem', padding: '0.45rem', whiteSpace: 'nowrap' }}
              title="Admin Manager (admin / admin1234)"
            >
              🛡️ {isEn ? 'Admin Demo' : '관리자 체험'}
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem', fontWeight: 600 }}>
              {isEn ? 'Username' : '아이디'}
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={isEn ? 'Enter username (e.g. demo / admin)' : '아이디 (예: demo, admin)'}
              style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'var(--bg-secondary)', color: 'inherit' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem', fontWeight: 600 }}>
              {isEn ? 'Password' : '비밀번호'}
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={isEn ? 'Enter password (demo: 1234)' : '비밀번호 (데모: 1234)'}
              style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'var(--bg-secondary)', color: 'inherit' }}
            />
          </div>

          {mode === 'signup' && (
            <>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem', fontWeight: 600 }}>
                  {isEn ? 'Your Name / Nickname' : '이름 / 닉네임'}
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={isEn ? 'e.g. Travel Explorer' : '예: 김정민, 세계여행자'}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'var(--bg-secondary)', color: 'inherit' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem', fontWeight: 600 }}>
                  {isEn ? 'Select Traveler Avatar' : '여행자 아바타 선택'}
                </label>
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                  {AVATAR_OPTIONS.map(av => (
                    <button
                      key={av}
                      type="button"
                      onClick={() => setAvatar(av)}
                      style={{
                        fontSize: '1.25rem',
                        padding: '0.4rem 0.6rem',
                        borderRadius: '8px',
                        border: avatar === av ? '2px solid #000' : '1px solid var(--glass-border)',
                        background: avatar === av ? '#f3f4f6' : 'transparent',
                        cursor: 'pointer'
                      }}
                    >
                      {av}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {errorMsg && (
            <div style={{ color: '#dc2626', fontSize: '0.85rem', background: '#fee2e2', padding: '0.6rem', borderRadius: '6px', textAlign: 'center' }}>
              {errorMsg}
            </div>
          )}

          <button 
            type="submit" 
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.75rem', marginTop: '0.5rem', fontWeight: 'bold' }}
          >
            {mode === 'login' ? (isEn ? 'Log In' : '로그인하기') : (isEn ? 'Create Account' : '가입하고 시작하기')}
          </button>
        </form>
      </div>
    </div>
  );
}
