import React, { useState } from 'react';
import appDb from '../db/appDb';

export default function FeedbackModal({ isOpen, onClose, lang = 'en' }) {
  const isEn = lang === 'en';
  const currentUser = appDb.auth.getCurrentUser();

  const [type, setType] = useState('bug'); // 'bug' | 'feature' | 'inquiry' | 'other'
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [userName, setUserName] = useState(currentUser ? (currentUser.name || currentUser.username) : '');
  const [userEmail, setUserEmail] = useState(currentUser ? (currentUser.email || '') : '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert(isEn ? 'Please fill in both title and details.' : '제목과 상세 내용을 모두 작성해 주세요.');
      return;
    }

    setIsSubmitting(true);

    try {
      const browserInfo = `${navigator.userAgent} | Screen: ${window.innerWidth}x${window.innerHeight} | URL: ${window.location.href}`;
      
      await appDb.feedback.create({
        type,
        title: title.trim(),
        content: content.trim(),
        userName: userName.trim() || (isEn ? 'Anonymous User' : '익명 사용자'),
        userEmail: userEmail.trim(),
        browserInfo
      });

      setIsSubmitting(false);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setTitle('');
        setContent('');
        onClose();
      }, 2000);
    } catch (err) {
      setIsSubmitting(false);
      alert(isEn ? `Failed to send feedback: ${err.message}` : `전송 중 오류가 발생했습니다: ${err.message}`);
    }
  };

  const TYPE_OPTIONS = [
    { key: 'bug', icon: '🐛', label: isEn ? 'Bug / System Error' : '버그 / 시스템 오류 신고', desc: isEn ? 'Report UI breaks, calculation errors, or bugs' : '화면 깨짐, 계산 오류, 오작동 제보' },
    { key: 'feature', icon: '💡', label: isEn ? 'Feature / City Request' : '기능 개선 / 여행지 제안', desc: isEn ? 'Suggest new features or missing travel spots' : '새로운 기능 아이디어 및 여행지 추가 요청' },
    { key: 'inquiry', icon: '❓', label: isEn ? 'General Inquiry' : '일반 문의사항', desc: isEn ? 'Questions regarding usage and features' : '서비스 이용 관련 질문 및 안내 문의' },
    { key: 'other', icon: '📝', label: isEn ? 'Other Feedback' : '기타 의견', desc: isEn ? 'General thoughts and comments' : '자유로운 응원 및 피드백' }
  ];

  return (
    <div 
      className="modal-overlay" 
      onClick={(e) => { if (e.target === e.currentTarget && !isSubmitting) onClose(); }}
    >
      <div className="modal-content" style={{ maxWidth: '540px', width: '92%', borderRadius: '16px', padding: '2rem' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span style={{ fontSize: '1.6rem' }}>📬</span>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                {isEn ? 'Send Feedback & Bug Report' : '개선사항 제안 & 버그 신고'}
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '0.15rem 0 0 0' }}>
                {isEn ? 'Your feedback goes directly to the system administrator.' : '작성해주신 소중한 의견은 관리자에게 즉시 전달됩니다.'}
              </p>
            </div>
          </div>

          <button 
            onClick={onClose} 
            disabled={isSubmitting}
            style={{ background: 'none', border: 'none', fontSize: '1.4rem', cursor: 'pointer', color: 'inherit' }}
          >
            ✕
          </button>
        </div>

        {isSuccess ? (
          <div style={{ padding: '2.5rem 1rem', textAlign: 'center' }}>
            <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🎉</div>
            <h4 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#10b981', marginBottom: '0.5rem' }}>
              {isEn ? 'Feedback Sent Successfully!' : '성공적으로 전송되었습니다!'}
            </h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5 }}>
              {isEn 
                ? 'Thank you for helping us improve Voyage Travel Planner. The administrator has been notified.' 
                : '보내주신 피드백이 관리자에게 안전하게 전달되었으며 이메일 알림이 발송되었습니다. 감사합니다!'}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            
            {/* Type Selector */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.4rem', fontWeight: 700 }}>
                {isEn ? 'Feedback Category' : '문의/제보 유형'}
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                {TYPE_OPTIONS.map((opt) => (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => setType(opt.key)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.6rem 0.75rem',
                      borderRadius: '8px',
                      border: type === opt.key ? '2px solid var(--color-primary)' : '1px solid var(--glass-border)',
                      background: type === opt.key ? 'rgba(99, 102, 241, 0.12)' : 'var(--bg-secondary)',
                      color: 'inherit',
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'all 0.15s'
                    }}
                  >
                    <span style={{ fontSize: '1.3rem' }}>{opt.icon}</span>
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>{opt.label}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* User Contact Info */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '0.75rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.35rem', fontWeight: 600 }}>
                  {isEn ? 'Your Name' : '작성자 이름'}
                </label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder={isEn ? 'Name or Nickname' : '이름 또는 닉네임'}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'var(--bg-secondary)', color: 'inherit', fontSize: '0.85rem' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.35rem', fontWeight: 600 }}>
                  {isEn ? 'Reply Email' : '답변받을 이메일'}
                </label>
                <input
                  type="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  placeholder="your-email@example.com"
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'var(--bg-secondary)', color: 'inherit', fontSize: '0.85rem' }}
                />
              </div>
            </div>

            {/* Title */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.35rem', fontWeight: 600 }}>
                {isEn ? 'Title' : '제목'} <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={isEn ? 'Summary of your report or suggestion' : '오류 내용 또는 건의사항의 핵심을 적어주세요'}
                style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'var(--bg-secondary)', color: 'inherit', fontSize: '0.9rem' }}
              />
            </div>

            {/* Content */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.35rem', fontWeight: 600 }}>
                {isEn ? 'Details & Description' : '상세 내용'} <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <textarea
                required
                rows={4}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={isEn 
                  ? 'Please provide detailed steps to reproduce the issue or explain your suggestion in detail.' 
                  : '오류가 발생한 상황(어떤 버튼을 눌렀을 때 발생했는지 등)이나 원하시는 개선 사항을 자유롭게 적어주세요.'}
                style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'var(--bg-secondary)', color: 'inherit', fontSize: '0.85rem', resize: 'vertical' }}
              />
            </div>

            {/* Auto System Info Notice */}
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.4 }}>
              🔒 {isEn 
                ? 'Device/browser info is automatically included to help troubleshoot bugs quickly.' 
                : '원활한 버그 추적 및 오류 수정을 위해 접속 환경 정보(브라우저/화면크기)가 안전하게 함께 전달됩니다.'}
            </p>

            {/* Submit Button */}
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
              <button 
                type="button" 
                onClick={onClose}
                disabled={isSubmitting}
                className="btn btn-secondary"
                style={{ flex: 1, padding: '0.75rem' }}
              >
                {isEn ? 'Cancel' : '취소'}
              </button>
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="btn btn-primary"
                style={{ flex: 2, padding: '0.75rem', fontWeight: 'bold' }}
              >
                {isSubmitting ? (isEn ? 'Sending...' : '전송 중...') : (isEn ? '🚀 Send to Admin' : '🚀 관리자에게 전송하기')}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
