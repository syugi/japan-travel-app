import React, { useState, useMemo, useEffect } from 'react';
import { speakJapanese } from '../utils/tts';
import { TTS_RATES, FONT_SCALES } from '../hooks/useSettings';

const SearchView = ({ data, query = '', settings = {}, isFavorite, toggleFavorite }) => {
  const [selectedPhrase, setSelectedPhrase] = useState(null);

  const ttsRate = TTS_RATES[settings.ttsSpeed] ?? 0.85;
  const fontScale = FONT_SCALES[settings.fontSize] ?? 1.0;
  const showRomaji = settings.showRomaji !== false;

  // 전체 문구를 카테고리/상황 컨텍스트와 함께 펼침
  const allPhrases = useMemo(() => {
    return data.flatMap((cat) =>
      cat.situations.flatMap((sit) =>
        sit.phrases.map((phrase) => ({
          ...phrase,
          catName: cat.name,
          catEmoji: cat.emoji,
          sitName: sit.name,
        }))
      )
    );
  }, [data]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return allPhrases.filter(
      (p) =>
        p.kor.toLowerCase().includes(q) ||
        p.jp.toLowerCase().includes(q) ||
        (p.pronunciation && p.pronunciation.toLowerCase().includes(q))
    );
  }, [query, allPhrases]);

  // 모달 열릴 때 body 스크롤 방지
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

  return (
    <div className="screen">
      {results.length === 0 && (
        <div className="search-empty">
          <div className="search-empty-icon">😅</div>
          <div className="search-empty-text">검색 결과가 없어요</div>
          <div className="search-empty-sub">다른 키워드로 검색해보세요</div>
        </div>
      )}

      {results.length > 0 && (
        <div className="phrase-list">
          {results.map((phrase) => (
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
      )}

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

export default SearchView;
