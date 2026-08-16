import React, { useState, useEffect, useRef } from 'react';
import appDb from '../db/appDb';

export default function DataBackupModal({ isOpen, onClose, lang = 'en' }) {
  const isEn = lang === 'en';
  const [stats, setStats] = useState(appDb.backup.getStats());
  const [statusMsg, setStatusMsg] = useState('');
  const fileInputRef = useRef(null);

  const refreshStats = () => {
    setStats(appDb.backup.getStats());
  };

  useEffect(() => {
    if (isOpen) {
      refreshStats();
      setStatusMsg('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleExport = () => {
    try {
      const jsonStr = appDb.backup.exportJSON();
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const dateStr = new Date().toISOString().split('T')[0];
      a.href = url;
      a.download = `voyage_database_backup_${dateStr}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setStatusMsg(isEn ? '✅ Backup file downloaded successfully!' : '✅ 백업 파일이 성공적으로 다운로드되었습니다!');
    } catch (err) {
      setStatusMsg(isEn ? '❌ Export failed: ' + err.message : '❌ 내보내기 실패: ' + err.message);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result;
        const res = appDb.backup.importJSON(content);
        if (res.success) {
          refreshStats();
          setStatusMsg(isEn ? '🎉 Database successfully restored from backup!' : '🎉 백업 파일로부터 데이터베이스가 성공적으로 복원되었습니다!');
          setTimeout(() => {
            window.location.reload();
          }, 1200);
        } else {
          setStatusMsg(isEn ? '❌ Import failed: ' + res.error : '❌ 복원 실패: ' + res.error);
        }
      } catch (err) {
        setStatusMsg(isEn ? '❌ Invalid JSON file: ' + err.message : '❌ 유효하지 않은 JSON 파일입니다: ' + err.message);
      }
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    const msg = isEn 
      ? '⚠️ Warning: This will permanently delete all custom trips, expenses, and visited records. Continue?' 
      : '⚠️ 경고: 등록된 모든 커스텀 여행 일정, 지출 내역, 다녀온 도시 기록이 영구히 삭제됩니다. 초기화할까요?';
    if (window.confirm(msg)) {
      appDb.backup.resetAll();
      refreshStats();
      setStatusMsg(isEn ? '🗑️ Database reset completed.' : '🗑️ 데이터베이스 초기화가 완료되었습니다.');
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  return (
    <div 
      className="modal-overlay" 
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="modal-content" style={{ maxWidth: '600px', width: '90%', borderRadius: '16px', padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ margin: 0, fontSize: '1.3rem' }}>
            🛡️ {isEn ? '[Admin] Database Manager & Backup' : '[관리자 전용] 데이터베이스 관리 & 백업'}
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'inherit' }}>
            ✕
          </button>
        </div>

        {/* Database Stats Card */}
        <div className="glass-panel" style={{ padding: '1.25rem', marginBottom: '1.5rem', borderRadius: '12px' }}>
          <h3 style={{ margin: '0 0 0.75rem 0', fontSize: '1rem', color: 'var(--text-secondary)' }}>
            📊 {isEn ? 'Current Storage Statistics' : '현재 저장된 데이터 현황'}
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
            <div style={{ padding: '0.75rem', background: 'var(--bg-secondary)', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{isEn ? 'Custom Trips' : '작성한 여행 일정'}</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{stats.tripsCount} {isEn ? 'trips' : '개'}</div>
            </div>
            <div style={{ padding: '0.75rem', background: 'var(--bg-secondary)', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{isEn ? 'Visited Cities' : '다녀온 도시 기록'}</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{stats.visitedCount} {isEn ? 'cities' : '곳'}</div>
            </div>
            <div style={{ padding: '0.75rem', background: 'var(--bg-secondary)', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{isEn ? 'Logged Expenses' : '지출 내역 건수'}</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{stats.expensesCount} {isEn ? 'items' : '건'}</div>
            </div>
            <div style={{ padding: '0.75rem', background: 'var(--bg-secondary)', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{isEn ? 'Custom Destinations' : '추가한 여행지'}</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{stats.customDestinationsCount} {isEn ? 'cities' : '개'}</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <button 
            onClick={handleExport} 
            className="btn btn-primary"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.85rem' }}
          >
            📥 {isEn ? 'Export JSON Backup (Download)' : '데이터베이스 전체 백업 다운로드 (JSON)'}
          </button>

          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept=".json" 
            style={{ display: 'none' }} 
          />

          <button 
            onClick={() => fileInputRef.current?.click()} 
            className="btn btn-secondary"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.85rem' }}
          >
            📤 {isEn ? 'Import JSON Backup (Restore)' : '백업 파일로 데이터베이스 복원하기 (JSON)'}
          </button>

          <button 
            onClick={handleReset} 
            className="btn"
            style={{ background: '#fee2e2', color: '#dc2626', border: '1px solid #fca5a5', padding: '0.85rem' }}
          >
            🗑️ {isEn ? 'Reset All Data' : '데이터베이스 전체 초기화'}
          </button>
        </div>

        {statusMsg && (
          <div style={{ marginTop: '1rem', padding: '0.75rem', borderRadius: '8px', background: 'var(--bg-secondary)', textAlign: 'center', fontWeight: 'bold' }}>
            {statusMsg}
          </div>
        )}
      </div>
    </div>
  );
}
