import React, { useState, useEffect } from 'react';

const FALLBACK_RATES = {
  KRW: 1.0,
  USD: 0.00073, // ~1370 KRW
  JPY: 0.116,   // ~8.6 KRW
  EUR: 0.00067, // ~1490 KRW
  GBP: 0.00057, // ~1750 KRW
  AUD: 0.0011,  // ~910 KRW
  THB: 0.026,   // ~38 KRW
  IDR: 11.8     // ~0.085 KRW
};

export default function BudgetTracker({ prefilledDestForBudget, lang = 'en' }) {
  const isEn = lang === 'en';
  const [budgetLimit, setBudgetLimit] = useState(1500000); // 1.5 million KRW default
  const [expenses, setExpenses] = useState([]);
  
  // Exchange rates state
  const [rates, setRates] = useState(FALLBACK_RATES);
  const [ratesLoading, setRatesLoading] = useState(false);
  const [ratesError, setRatesError] = useState(null);
  const [ratesLastUpdated, setRatesLastUpdated] = useState('');

  // Add expense form
  const [expTitle, setExpTitle] = useState('');
  const [expCategory, setExpCategory] = useState('food'); // flight, stay, food, shopping, activity, other
  const [expCurrency, setExpCurrency] = useState('KRW');
  const [expAmount, setExpAmount] = useState(0);

  // Instant Converter widget state
  const [convFromVal, setConvFromVal] = useState(1000);
  const [convFromCurr, setConvFromCurr] = useState('JPY');
  const [convToCurr, setConvToCurr] = useState('KRW');
  const [convResult, setConvResult] = useState(0);

  // Fetch live exchange rates relative to KRW on mount
  useEffect(() => {
    fetchRates();
  }, []);

  const fetchRates = async () => {
    setRatesLoading(true);
    setRatesError(null);
    try {
      // ExchangeRate-API free public endpoint relative to KRW
      const res = await fetch('https://open.er-api.com/v6/latest/KRW');
      if (!res.ok) throw new Error('API response not successful');
      const data = await res.json();
      if (data && data.rates) {
        // We ensure fallback keys exist if they are not in the response
        const mergedRates = { ...FALLBACK_RATES, ...data.rates };
        setRates(mergedRates);
        
        // Save current time or API time
        const dateStr = new Date(data.time_last_update_utc || Date.now()).toLocaleDateString();
        setRatesLastUpdated(dateStr);
      }
    } catch (err) {
      console.warn('API exchange rate fetch failed, using fallback rates.', err);
      setRatesError('실시간 환율 정보를 가져오지 못했습니다. 오프라인 기준 환율로 대체합니다.');
      setRates(FALLBACK_RATES);
      setRatesLastUpdated('오프라인 백업 데이터');
    } finally {
      setRatesLoading(false);
    }
  };

  // Load budgets & expenses from localStorage on mount
  useEffect(() => {
    const storedBudget = localStorage.getItem('budget_limit');
    if (storedBudget) {
      setBudgetLimit(Number(storedBudget));
    }
    const storedExpenses = localStorage.getItem('budget_expenses');
    if (storedExpenses) {
      setExpenses(JSON.parse(storedExpenses));
    }
  }, []);

  // Pre-fill destination currency if routed from ItineraryViewer
  useEffect(() => {
    if (prefilledDestForBudget) {
      setExpCurrency(prefilledDestForBudget.currency);
      // Give a default name
      setExpTitle(`${prefilledDestForBudget.name} 기본 경비`);
    }
  }, [prefilledDestForBudget]);

  const handleSaveBudgetLimit = (limit) => {
    setBudgetLimit(limit);
    localStorage.setItem('budget_limit', limit);
  };

  const handleAddExpense = (e) => {
    e.preventDefault();
    if (!expTitle.trim() || expAmount <= 0) return;

    // Conversion to KRW
    // rate = 1 KRW = X foreign_currency. So KRW = foreign_currency_amount / rate
    const rate = rates[expCurrency] || 1.0;
    const amountInKRW = Math.round(expAmount / rate);

    const newExpense = {
      id: `exp_${Date.now()}`,
      title: expTitle.trim(),
      category: expCategory,
      currency: expCurrency,
      amount: expAmount,
      amountInKRW: amountInKRW,
      rateUsed: rate,
      date: new Date().toLocaleDateString()
    };

    const updated = [newExpense, ...expenses];
    setExpenses(updated);
    localStorage.setItem('budget_expenses', JSON.stringify(updated));

    // Reset inputs
    setExpTitle('');
    setExpAmount(0);
  };

  const handleDeleteExpense = (id) => {
    const updated = expenses.filter(e => e.id !== id);
    setExpenses(updated);
    localStorage.setItem('budget_expenses', JSON.stringify(updated));
  };

  const handleClearAllExpenses = () => {
    if (window.confirm('정말 모든 지출 내역을 삭제할까요?')) {
      setExpenses([]);
      localStorage.removeItem('budget_expenses');
    }
  };

  // Real-time calculator conversion effect
  useEffect(() => {
    const rateFrom = rates[convFromCurr] || 1.0;
    const rateTo = rates[convToCurr] || 1.0;

    // Convert from Currency A to KRW: KRW_val = A_val / rateFrom
    const krwValue = convFromVal / rateFrom;
    // Convert from KRW to Currency B: B_val = krwValue * rateTo
    const finalVal = krwValue * rateTo;

    setConvResult(finalVal);
  }, [convFromVal, convFromCurr, convToCurr, rates]);

  // Expenses totals
  const totalSpentKRW = expenses.reduce((sum, e) => sum + e.amountInKRW, 0);
  const remainingKRW = budgetLimit - totalSpentKRW;
  const spentPercent = Math.min((totalSpentKRW / budgetLimit) * 100, 100);

  const getCategoryEmoji = (cat) => {
    switch (cat) {
      case 'flight': return isEn ? '✈️ Flight' : '✈️ 항공';
      case 'stay': return isEn ? '🏨 Stay' : '🏨 숙박';
      case 'food': return isEn ? '🍕 Food' : '🍕 식비';
      case 'shopping': return isEn ? '🛍️ Shopping' : '🛍️ 쇼핑';
      case 'activity': return isEn ? '🎟️ Leisure' : '🎟️ 관광/레저';
      default: return isEn ? '💼 Other' : '💼 기타';
    }
  };

  const getCurrencySymbol = (curr) => {
    try {
      const parts = new Intl.NumberFormat('en-US', { style: 'currency', currency: curr }).formatToParts(0);
      const symbol = parts.find(p => p.type === 'currency').value;
      return symbol;
    } catch(e) {
      return '';
    }
  };

  return (
    <div className="fade-in grid-2">
      
      {/* Left Column: Budget Settings, Adding Expense & Progress Bar */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        {/* Budget Setting Panel */}
        <div className="glass-panel">
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
            💵 {isEn ? 'Budget Settings' : '예산 설정'}
          </h3>

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '180px' }}>
              <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                {isEn ? 'Total Budget (KRW)' : '총 예산 (KRW)'}
              </label>
              <input
                type="number"
                value={budgetLimit}
                onChange={(e) => handleSaveBudgetLimit(Number(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>
            
            <div style={{ flex: 1, minWidth: '180px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              <div>{isEn ? 'Total Spent:' : '지출 총액:'} <strong style={{ color: 'var(--color-primary)' }}>₩{totalSpentKRW.toLocaleString()}</strong></div>
              <div>{isEn ? 'Remaining:' : '남은 금액:'} <strong style={{ color: remainingKRW >= 0 ? 'var(--color-success)' : 'var(--color-danger)' }}>₩{remainingKRW.toLocaleString()}</strong></div>
            </div>
          </div>

          <div style={{ marginTop: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              <span>{isEn ? 'Budget Utilization' : '예산 대비 지출율'}</span>
              <span>{Math.round((totalSpentKRW / budgetLimit) * 100)}%</span>
            </div>
            <div className="progress-bar-container">
              <div 
                className={`progress-bar ${totalSpentKRW > budgetLimit ? 'danger' : ''}`}
                style={{ width: `${spentPercent}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Add Expense Form */}
        <div className="glass-panel">
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
            ➕ {isEn ? 'Log New Expense' : '지출 기록 등록'}
          </h3>

          <form onSubmit={handleAddExpense} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '0.75rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  {isEn ? 'Item Name' : '지출 항목명'}
                </label>
                <input
                  type="text"
                  required
                  placeholder={isEn ? "e.g., Ramen Lunch, Cruise Ticket" : "예: 라멘 점심, 유람선 입장권"}
                  value={expTitle}
                  onChange={(e) => setExpTitle(e.target.value)}
                  style={{ width: '100%', padding: '0.5rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  {isEn ? 'Category' : '카테고리'}
                </label>
                <select
                  value={expCategory}
                  onChange={(e) => setExpCategory(e.target.value)}
                  style={{ width: '100%', padding: '0.5rem' }}
                >
                  <option value="flight">✈️ {isEn ? 'Flight' : '항공'}</option>
                  <option value="stay">🏨 {isEn ? 'Stay' : '숙박'}</option>
                  <option value="food">🍕 {isEn ? 'Food' : '식비'}</option>
                  <option value="shopping">🛍️ {isEn ? 'Shopping' : '쇼핑'}</option>
                  <option value="activity">🎟️ {isEn ? 'Leisure' : '관광/레저'}</option>
                  <option value="other">💼 {isEn ? 'Other' : '기타'}</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '0.75rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  {isEn ? 'Currency' : '결제 통화'}
                </label>
                <select
                  value={expCurrency}
                  onChange={(e) => setExpCurrency(e.target.value)}
                  style={{ width: '100%', padding: '0.5rem' }}
                >
                  {Object.keys(rates).map(curr => (
                    <option key={curr} value={curr}>{curr} {getCurrencySymbol(curr) ? `(${getCurrencySymbol(curr)})` : ''}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  {isEn ? `Amount (${getCurrencySymbol(expCurrency) || expCurrency})` : `결제 금액 (${getCurrencySymbol(expCurrency) || expCurrency})`}
                </label>
                <input
                  type="number"
                  placeholder="0"
                  min="0.01"
                  step="any"
                  value={expAmount === 0 ? '' : expAmount}
                  onChange={(e) => setExpAmount(Number(e.target.value))}
                  style={{ width: '100%', padding: '0.5rem' }}
                />
              </div>
            </div>

            {expAmount > 0 && expCurrency !== 'KRW' && (
              <div style={{ fontSize: '0.85rem', color: 'var(--color-accent)', padding: '0.25rem 0.5rem', background: 'rgba(6, 182, 212, 0.08)', borderRadius: '4px' }}>
                💡 {isEn ? 'KRW Converted:' : '원화 환산 가격:'} 약 <strong>₩{Math.round(expAmount / (rates[expCurrency] || 1.0)).toLocaleString()}</strong>
              </div>
            )}

            <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>
              ➕ {isEn ? 'Add Expense' : '소비 내역 추가'}
            </button>
          </form>
        </div>

        {/* Currency Rates Widget & Instant Converter */}
        <div className="glass-panel">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>
              💰 {isEn ? 'Live Exchange Calculator' : '실시간 환율 계산기'}
            </h3>
            <button 
              onClick={fetchRates} 
              disabled={ratesLoading}
              className="btn btn-secondary"
              style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
            >
              {ratesLoading ? (isEn ? 'Updating...' : '갱신중...') : (isEn ? '🔄 Refresh Rates' : '🔄 환율 갱신')}
            </button>
          </div>

          {ratesError && (
            <p style={{ color: 'var(--color-danger)', fontSize: '0.75rem', marginBottom: '0.5rem' }}>⚠️ {ratesError}</p>
          )}
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            {isEn ? 'Base Date:' : '기준일자:'} {ratesLastUpdated}
          </p>

          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <input
              type="number"
              value={convFromVal}
              onChange={(e) => setConvFromVal(Number(e.target.value))}
              style={{ width: '100px', padding: '0.4rem 0.6rem', fontSize: '0.9rem' }}
            />
            
            <select
              value={convFromCurr}
              onChange={(e) => setConvFromCurr(e.target.value)}
              style={{ padding: '0.4rem 0.6rem', fontSize: '0.9rem' }}
            >
              {Object.keys(rates).map(curr => (
                <option key={curr} value={curr}>{curr}</option>
              ))}
            </select>

            <span style={{ color: 'var(--text-muted)' }}>➡️</span>

            <select
              value={convToCurr}
              onChange={(e) => setConvToCurr(e.target.value)}
              style={{ padding: '0.4rem 0.6rem', fontSize: '0.9rem' }}
            >
              {Object.keys(rates).map(curr => (
                <option key={curr} value={curr}>{curr}</option>
              ))}
            </select>

            <div style={{ flex: 1, minWidth: '100px', fontWeight: 700, fontSize: '1rem', color: 'var(--color-success)', paddingLeft: '0.5rem' }}>
              = {getCurrencySymbol(convToCurr)}{convResult.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
            </div>
          </div>
        </div>

      </div>

      {/* Right Column: List of logged expenses */}
      <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>
            🧾 {isEn ? `Expense Log (${expenses.length})` : `소비 지출 목록 (${expenses.length})`}
          </h3>
          {expenses.length > 0 && (
            <button 
              onClick={handleClearAllExpenses}
              className="btn btn-secondary" 
              style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--color-danger)', border: '1px solid rgba(239, 68, 68, 0.2)' }}
            >
              ❌ {isEn ? 'Clear All' : '전체 삭제'}
            </button>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', maxHeight: '550px', overflowY: 'auto', paddingRight: '0.25rem' }}>
          {expenses.map((e) => (
            <div
              key={e.id}
              style={{
                background: 'rgba(255, 255, 255, 0.01)',
                border: '1px solid rgba(255, 255, 255, 0.04)',
                borderRadius: 'var(--radius-sm)',
                padding: '0.85rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div>
                <span style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.06)', padding: '0.15rem 0.4rem', borderRadius: '4px', color: 'var(--text-secondary)' }}>
                  {getCategoryEmoji(e.category)}
                </span>
                
                <h4 style={{ fontSize: '0.95rem', fontWeight: 600, margin: '0.35rem 0 0.15rem 0' }}>
                  {e.title}
                </h4>
                
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  ⏱️ {e.date} | {isEn ? 'Amount:' : '현지 결제금액:'} {getCurrencySymbol(e.currency)}{e.amount.toLocaleString()} ({e.currency})
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>
                    ₩{e.amountInKRW.toLocaleString()}
                  </div>
                  {e.currency !== 'KRW' && (
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                      {isEn ? `Rate: 1 ${e.currency} = ${Math.round(1 / e.rateUsed)} KRW` : `환율: 1 ${e.currency} = ${Math.round(1 / e.rateUsed)}원`}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => handleDeleteExpense(e.id)}
                  style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1rem' }}
                  title="Delete"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}

          {expenses.length === 0 && (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '4rem 1rem' }}>
              <p style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>💸 {isEn ? 'No logged expenses yet.' : '기록된 지출 내역이 없습니다.'}</p>
              <p style={{ fontSize: '0.8rem' }}>{isEn ? 'Log local expenses to calculate automatically with live rates.' : '결제 통화와 지출액을 기록하면 실시간 환율을 반영하여 총액을 합산해 줍니다.'}</p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
