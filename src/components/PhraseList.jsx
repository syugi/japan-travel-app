import React, { useEffect, useState } from 'react';
import { speakJapanese } from '../utils/tts';

const PhraseList = ({ situation }) => {
  const [selectedPhrase, setSelectedPhrase] = useState(null);

  if (!situation || !situation.phrases || situation.phrases.length === 0) {
    return <div className="message">회화 데이터가 없습니다.</div>;
  }

  // iOS 백그라운드 TTS 이슈 해소를 위한 터치 이벤트 락 해제
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
    if (selectedPhrase) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [selectedPhrase]);

  const handleSpeak = (text, e) => {
    if (e) e.stopPropagation();
    if (window.speechSynthesis && window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }
    speakJapanese(text);
  };

  const handleCardClick = (phrase) => {
    setSelectedPhrase(phrase);
    speakJapanese(phrase.jp);
  };

  const handleCloseModal = () => {
    setSelectedPhrase(null);
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
            <div className="phrase-kor">{phrase.kor}</div>
            <div className="phrase-jp">{phrase.jp}</div>
            <div className="phrase-roma">{phrase.pronunciation || ''}</div>
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
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={handleCloseModal} aria-label="닫기">✕</button>
            {/* <span className="modal-label">일본인에게 보여주세요</span> */}
            <div className="modal-kor">{selectedPhrase.kor}</div>
            <div className="modal-divider" />
            <div className="modal-jp">{selectedPhrase.jp}</div>
            <div className="modal-divider" />
            <div className="modal-roma">{selectedPhrase.pronunciation || ''}</div>
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
