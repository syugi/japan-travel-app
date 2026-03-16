import React, { useState, useMemo, useEffect } from 'react';
import { speakJapanese } from '../utils/tts';
import { TTS_RATES, FONT_SCALES } from '../hooks/useSettings';

const FavoritesView = ({ data, settings = {}, isFavorite, toggleFavorite }) => {
  const [selectedPhrase, setSelectedPhrase] = useState(null);

  const ttsRate = TTS_RATES[settings.ttsSpeed] ?? 0.85;
  const fontScale = FONT_SCALES[settings.fontSize] ?? 1.0;
  const showRomaji = settings.showRomaji !== false;

  const favoritePhrases = useMemo(() => {
    return data.flatMap((cat) =>
      cat.situations.flatMap((sit) =>
        sit.phrases
          .filter((p) => isFavorite?.(p.id))
          .map((phrase) => ({
            ...phrase,
            catName: cat.name,
            catEmoji: cat.emoji,
            sitName: sit.name,
          }))
      )
    );
  }, [data, isFavorite]);

  useEffect(() => {
    document.body.style.overflow = selectedPhrase ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [selectedPhrase]);

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

  if (favoritePhrases.length === 0) {
    return (
      <div className="screen">
        <div className="empty-state">
          <div className="empty-state-icon">⭐</div>
          <div className="empty-state-title">즐겨찾기가 없어요</div>
          <div className="empty-state-sub">
            회화집이나 검색에서 ☆ 버튼을 눌러<br />자주 쓰는 문구를 저장해보세요
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="screen">
      <div className="phrase-list">
        {favoritePhrases.map((phrase) => (
          <div
            key={phrase.id}
            className="phrase-card"
            onClick={() => handleCardClick(phrase)}
          >
            <button
              className="fav-btn fav-btn--active"
              onClick={(e) => handleFavClick(phrase.id, e)}
              aria-label="즐겨찾기 해제"
            >
              ★
            </button>
            <div className="phrase-source">
              {phrase.catEmoji} {phrase.catName} › {phrase.sitName}
            </div>
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

export default FavoritesView;
