import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[ErrorBoundary caught error]:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '2.5rem',
          textAlign: 'center',
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '12px',
          border: '1px solid var(--glass-border)',
          margin: '2rem auto',
          maxWidth: '600px'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
            페이지를 불러오는 중 문제가 발생했습니다
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
            여행지 데이터 렌더링 중 일시적인 문제가 감지되었습니다.<br />
            아래 버튼을 눌러 목록으로 안전하게 돌아갈 수 있습니다.
          </p>
          <button
            onClick={() => {
              this.setState({ hasError: false, error: null });
              if (this.props.onReset) this.props.onReset();
            }}
            className="btn btn-primary"
            style={{ padding: '0.65rem 1.5rem', fontSize: '0.95rem', fontWeight: 700 }}
          >
            ⬅️ 목록으로 돌아가기
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
