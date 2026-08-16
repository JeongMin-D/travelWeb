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

  return (
    <div 
      className="modal-overlay" 
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="modal-content" style={{ maxWidth: '440px', width: '92%', borderRadius: '16px', padding: '2rem' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={() => { setMode('login'); setErrorMsg(''); }}
              style={{
                background: 'none',
                border: 'none',
                borderBottom: mode === 'login' ? '2px solid var(--colors-ink, #000)' : '2px solid transparent',
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
                borderBottom: mode === 'signup' ? '2px solid var(--colors-ink, #000)' : '2px solid transparent',
                fontWeight: mode === 'signup' ? 'bold' : 'normal',
                fontSize: '1.1rem',
                cursor: 'pointer',
                padding: '0.25rem 0.5rem',
                color: 'inherit'
              }}
            >
              📝 {isEn ? 'Sign Up' : '회원가입'}
            </button>
          </div>

          <button 
            onClick={onClose} 
            style={{ background: 'none', border: 'none', fontSize: '1.4rem', cursor: 'pointer', color: 'inherit' }}
            title={isEn ? 'Close' : '닫기'}
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.35rem', fontWeight: 600 }}>
              {isEn ? 'Username' : '아이디'}
            </label>
            <input
              type="text"
              required
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={isEn ? 'Enter your username' : '아이디를 입력하세요'}
              style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'var(--bg-secondary)', color: 'inherit' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.35rem', fontWeight: 600 }}>
              {isEn ? 'Password' : '비밀번호'}
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={isEn ? 'Enter your password' : '비밀번호를 입력하세요'}
              style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'var(--bg-secondary)', color: 'inherit' }}
            />
          </div>

          {mode === 'signup' && (
            <>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.35rem', fontWeight: 600 }}>
                  {isEn ? 'Your Name / Nickname' : '이름 / 닉네임'}
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={isEn ? 'e.g. Travel Explorer' : '예: 김정민, 세계여행자'}
                  style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'var(--bg-secondary)', color: 'inherit' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.35rem', fontWeight: 600 }}>
                  {isEn ? 'Email (Optional)' : '이메일 (선택)'}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={isEn ? 'traveler@example.com' : 'traveler@example.com'}
                  style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'var(--bg-secondary)', color: 'inherit' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.35rem', fontWeight: 600 }}>
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
                        border: avatar === av ? '2px solid var(--colors-ink, #000)' : '1px solid var(--glass-border)',
                        background: avatar === av ? 'var(--bg-secondary, #f3f4f6)' : 'transparent',
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
            <div style={{ color: '#dc2626', fontSize: '0.85rem', background: '#fee2e2', padding: '0.65rem', borderRadius: '8px', textAlign: 'center' }}>
              {errorMsg}
            </div>
          )}

          <button 
            type="submit" 
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.8rem', marginTop: '0.5rem', fontWeight: 'bold', fontSize: '1rem' }}
          >
            {mode === 'login' ? (isEn ? 'Log In' : '로그인') : (isEn ? 'Create Account' : '회원가입 완료')}
          </button>
        </form>
      </div>
    </div>
  );
}
