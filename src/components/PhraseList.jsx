import React, { useEffect, useState } from 'react';
import { speakJapanese } from '../utils/tts';
import { TTS_RATES, FONT_SCALES } from '../hooks/useSettings';

const PhraseList = ({ situation, settings = {}, isFavorite, toggleFavorite }) => {
  const [selectedPhrase, setSelectedPhrase] = useState(null);

  const ttsRate = TTS_RATES[settings.ttsSpeed] ?? 0.85;
  const fontScale = FONT_SCALES[settings.fontSize] ?? 1.0;
  const showRomaji = settings.showRomaji !== false;

  // iOS TTS 잠금 해제
  useEffect(() => {
    let ttsUnlocked = false;
    const unlockTTS = () => {
      if (ttsUnlocked) return;
      if ('speechSynthesis' in window) {
        const u = new SpeechSynthesisUtterance('');
        window.speechSynthesis.speak(u);
      }
      ttsUnlocked = true;
    };
    document.addEventListener('touchstart', unlockTTS, { once: true });
    document.addEventListener('click', unlockTTS, { once: true });
    return () => {
      document.removeEventListener('touchstart', unlockTTS);
      document.removeEventListener('click', unlockTTS);
    };
  }, []);

  // 모달 열릴 때 body 스크롤 방지
  useEffect(() => {
    document.body.style.overflow = selectedPhrase ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [selectedPhrase]);

  if (!situation || !situation.phrases || situation.phrases.length === 0) {
    return <div className="message">회화 데이터가 없습니다.</div>;
  }

  const handleSpeak = (text, e) => {
    if (e) e.stopPropagation();
    if (window.speechSynthesis?.paused) window.speechSynthesis.resume();
    speakJapanese(text, ttsRate);
  };

  const handleCardClick = (phrase) => {
    setSelectedPhrase(phrase);
    speakJapanese(phrase.jp, ttsRate);
  };

  const handleFavClick = (phraseId, e) => {
    e.stopPropagation();
    toggleFavorite?.(phraseId);
  };

  return (
    <div className="screen">
      <div className="phrase-header">
        <span className="phrase-big-emoji">{situation.emoji}</span>
        <div className="phrase-sit-name">{situation.name}</div>
      </div>
      <div className="phrase-list">
        {situation.phrases.map((phrase) => (
          <div
            key={phrase.id}
            className="phrase-card"
            onClick={() => handleCardClick(phrase)}
          >
            <button
              className={`fav-btn ${isFavorite?.(phrase.id) ? 'fav-btn--active' : ''}`}
              onClick={(e) => handleFavClick(phrase.id, e)}
              aria-label="즐겨찾기"
            >
              {isFavorite?.(phrase.id) ? '★' : '☆'}
            </button>
            <div
              className="phrase-kor"
              style={{ fontSize: `${20 * fontScale}px` }}
            >
              {phrase.kor}
            </div>
            <div
              className="phrase-jp"
              style={{ fontSize: `${15 * fontScale}px` }}
            >
              {phrase.jp}
            </div>
            {showRomaji && (
              <div
                className="phrase-roma"
                style={{ fontSize: `${18 * fontScale}px` }}
              >
                {phrase.pronunciation || ''}
              </div>
            )}
            <button
              className="speak-btn"
              onClick={(e) => handleSpeak(phrase.jp, e)}
              aria-label="읽어주기"
            >
              🔊
            </button>
          </div>
        ))}
      </div>

      {selectedPhrase && (
        <div className="modal-overlay" onClick={() => setSelectedPhrase(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close-btn"
              onClick={() => setSelectedPhrase(null)}
              aria-label="닫기"
            >
              ✕
            </button>
            <div
              className="modal-kor"
              style={{ fontSize: `${22 * fontScale}px` }}
            >
              {selectedPhrase.kor}
            </div>
            <div className="modal-divider" />
            <div
              className="modal-jp"
              style={{ fontSize: `clamp(${24 * fontScale}px, 10vw, ${52 * fontScale}px)` }}
            >
              {selectedPhrase.jp}
            </div>
            <div className="modal-divider" />
            {showRomaji && (
              <div
                className="modal-roma"
                style={{ fontSize: `${15 * fontScale}px` }}
              >
                {selectedPhrase.pronunciation || ''}
              </div>
            )}
            <button
              className="modal-speak-btn"
              onClick={(e) => handleSpeak(selectedPhrase.jp, e)}
              aria-label="읽어주기"
            >
              🔊
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhraseList;
