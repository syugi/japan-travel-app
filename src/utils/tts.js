/**
 * Web Speech API를 사용하여 텍스트를 읽어주는 함수.
 * 우선적으로 ja-JP (일본어) 음성을 찾아 사용합니다.
 * @param {string} text - 읽어줄 텍스트 (일본어)
 */
export const speakJapanese = (text, rate = 0.85) => {
  if (!('speechSynthesis' in window)) {
    alert('이 브라우저는 음성 읽어주기 기능을 지원하지 않습니다.');
    return;
  }

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'ja-JP';
  utterance.rate = rate;
  utterance.pitch = 1.0;

  // 음성 목록 중 일본어 음성을 명시적으로 선택 시도
  const voices = window.speechSynthesis.getVoices();
  const japaneseVoice = voices.find(voice => voice.lang === 'ja-JP' || voice.lang === 'ja_JP');
  
  if (japaneseVoice) {
    utterance.voice = japaneseVoice;
  }

  window.speechSynthesis.speak(utterance);
};

// 브라우저에 따라 음성 목록이 비동기로 로드될 수 있으므로, 초기화 이벤트 바인딩
if ('speechSynthesis' in window) {
  window.speechSynthesis.onvoiceschanged = () => {
    window.speechSynthesis.getVoices();
  };
}
