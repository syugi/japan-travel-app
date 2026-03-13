import React, { useEffect } from 'react';
import { speakJapanese } from '../utils/tts';

const PhraseList = ({ situation }) => {
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

  const handleSpeak = (text) => {
    // iOS 빈 음성 방지
    if (window.speechSynthesis && window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }
    speakJapanese(text);
  };

  return (
    <div className="screen">
      <div className="phrase-header">
        <span className="phrase-big-emoji">{situation.emoji}</span>
        <div className="phrase-sit-name">{situation.name}</div>
      </div>
      <div className="phrase-list">
        {situation.phrases.map((phrase) => (
          <div key={phrase.id} className="phrase-card">
            <div className="phrase-kor">{phrase.kor}</div>
            <div className="phrase-jp">{phrase.jp}</div>
            <div className="phrase-roma">{phrase.pronunciation || ''}</div>
            <button 
              className="speak-btn"
              onClick={() => handleSpeak(phrase.jp)}
              aria-label="읽어주기"
            >
              🔊
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PhraseList;
