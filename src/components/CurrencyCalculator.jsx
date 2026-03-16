import React, { useState, useEffect } from 'react';

const CACHE_KEY = 'japan-app-exchange-rate';
const API_URL =
  'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/jpy.json';

function formatKRW(value) {
  if (!value && value !== 0) return '';
  return Math.round(value).toLocaleString('ko-KR');
}

function formatJPY(value) {
  if (!value && value !== 0) return '';
  return Math.round(value).toLocaleString('ja-JP');
}

const CurrencyCalculator = () => {
  const [rate, setRate] = useState(null); // 1 JPY = ? KRW
  const [rateDate, setRateDate] = useState(null);
  const [rateStatus, setRateStatus] = useState('loading'); // 'loading' | 'live' | 'cached' | 'error'

  const [jpyInput, setJpyInput] = useState('');
  const [krwInput, setKrwInput] = useState('');
  const [lastEdited, setLastEdited] = useState('jpy');

  // 환율 불러오기
  useEffect(() => {
    const cached = (() => {
      try {
        const s = localStorage.getItem(CACHE_KEY);
        return s ? JSON.parse(s) : null;
      } catch {
        return null;
      }
    })();

    if (cached?.rate) {
      setRate(cached.rate);
      setRateDate(cached.date);
      setRateStatus('cached');
    }

    fetch(API_URL)
      .then((res) => {
        if (!res.ok) throw new Error('fetch failed');
        return res.json();
      })
      .then((json) => {
        const krwRate = json?.jpy?.krw;
        if (!krwRate) throw new Error('no rate');
        setRate(krwRate);
        setRateDate(json.date);
        setRateStatus('live');
        localStorage.setItem(CACHE_KEY, JSON.stringify({ rate: krwRate, date: json.date }));
      })
      .catch(() => {
        if (!cached?.rate) setRateStatus('error');
      });
  }, []);

  // 입력 동기화
  useEffect(() => {
    if (!rate) return;
    if (lastEdited === 'jpy') {
      const num = parseFloat(jpyInput);
      setKrwInput(isNaN(num) || jpyInput === '' ? '' : formatKRW(num * rate));
    } else {
      const num = parseFloat(krwInput.replace(/,/g, ''));
      setJpyInput(isNaN(num) || krwInput === '' ? '' : formatJPY(num / rate));
    }
  }, [jpyInput, krwInput, rate, lastEdited]);

  const handleJpyChange = (e) => {
    setLastEdited('jpy');
    setJpyInput(e.target.value);
  };

  const handleKrwChange = (e) => {
    setLastEdited('krw');
    setKrwInput(e.target.value);
  };

  const quickAmounts = [100, 500, 1000, 3000, 5000, 10000];

  return (
    <div className="screen">
      <div className="currency-card">

        <div className="currency-rate-badge">
          {rateStatus === 'loading' && <span className="rate-loading">환율 불러오는 중...</span>}
          {rateStatus === 'live' && rate && (
            <span className="rate-live">
              ✅ 실시간 환율 · {rateDate}
            </span>
          )}
          {rateStatus === 'cached' && rate && (
            <span className="rate-cached">
              📦 저장된 환율 · {rateDate}
            </span>
          )}
          {rateStatus === 'error' && (
            <span className="rate-error">⚠️ 환율을 불러올 수 없습니다</span>
          )}
        </div>

        {rate && (
          <div className="rate-display">
            <span className="rate-num">1 JPY</span>
            <span className="rate-eq"> = </span>
            <span className="rate-krw">{rate.toFixed(2)} KRW</span>
          </div>
        )}

        <div className="currency-inputs">
          <div className="currency-input-group">
            <label className="currency-label">
              <span className="currency-flag">🇯🇵</span> 일본 엔 (JPY)
            </label>
            <div className="currency-input-wrap">
              <input
                className="currency-input"
                type="number"
                inputMode="numeric"
                placeholder="0"
                value={jpyInput}
                onChange={handleJpyChange}
                disabled={!rate}
              />
              <span className="currency-unit">¥</span>
            </div>
          </div>

          <div className="currency-swap-icon">⇅</div>

          <div className="currency-input-group">
            <label className="currency-label">
              <span className="currency-flag">🇰🇷</span> 한국 원 (KRW)
            </label>
            <div className="currency-input-wrap">
              <input
                className="currency-input"
                type="text"
                inputMode="numeric"
                placeholder="0"
                value={krwInput}
                onChange={handleKrwChange}
                disabled={!rate}
              />
              <span className="currency-unit">₩</span>
            </div>
          </div>
        </div>

        <div className="quick-amounts">
          <div className="quick-amounts-label">빠른 입력 (¥)</div>
          <div className="quick-amounts-grid">
            {quickAmounts.map((amt) => (
              <button
                key={amt}
                className="quick-btn"
                onClick={() => {
                  setLastEdited('jpy');
                  setJpyInput(String(amt));
                }}
                disabled={!rate}
              >
                ¥{amt.toLocaleString()}
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default CurrencyCalculator;
