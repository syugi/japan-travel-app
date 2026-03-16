import React from 'react';
import { speakJapanese } from '../utils/tts';
import { TTS_RATES } from '../hooks/useSettings';

const SettingsView = ({ settings, updateSetting }) => {
  const { ttsSpeed, fontSize, showRomaji } = settings;

  const handleTTSTest = () => {
    speakJapanese('ありがとうございます', TTS_RATES[ttsSpeed]);
  };

  return (
    <div className="screen">
      <div className="settings-list">

        {/* TTS 속도 */}
        <div className="settings-section">
          <div className="settings-section-title">음성 속도</div>
          <div className="settings-row">
            <div className="settings-row-info">
              <div className="settings-row-label">TTS 읽기 속도</div>
              <div className="settings-row-sub">일본어 음성의 재생 속도</div>
            </div>
            <div className="three-way">
              {[
                { value: 'slow',   label: '느리게' },
                { value: 'normal', label: '보통'   },
                { value: 'fast',   label: '빠르게' },
              ].map((opt) => (
                <button
                  key={opt.value}
                  className={`three-way-btn ${ttsSpeed === opt.value ? 'three-way-btn--active' : ''}`}
                  onClick={() => updateSetting('ttsSpeed', opt.value)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
          <button className="tts-test-btn" onClick={handleTTSTest}>
            🔊 테스트 재생
          </button>
        </div>

        {/* 글자 크기 */}
        <div className="settings-section">
          <div className="settings-section-title">글자 크기</div>
          <div className="settings-row">
            <div className="settings-row-info">
              <div className="settings-row-label">문구 글자 크기</div>
              <div className="settings-row-sub">회화 카드와 모달의 텍스트 크기</div>
            </div>
            <div className="three-way">
              {[
                { value: 'small',  label: '작게' },
                { value: 'normal', label: '보통' },
                { value: 'large',  label: '크게' },
              ].map((opt) => (
                <button
                  key={opt.value}
                  className={`three-way-btn ${fontSize === opt.value ? 'three-way-btn--active' : ''}`}
                  onClick={() => updateSetting('fontSize', opt.value)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
          <div className="font-preview">
            <span style={{ fontSize: fontSize === 'small' ? '14px' : fontSize === 'large' ? '20px' : '17px' }}>
              미리보기: ありがとうございます
            </span>
          </div>
        </div>

        {/* 로마자 표기 */}
        <div className="settings-section">
          <div className="settings-section-title">표시 설정</div>
          <div className="settings-row settings-row--toggle">
            <div className="settings-row-info">
              <div className="settings-row-label">로마자 표기 표시</div>
              <div className="settings-row-sub">발음 로마자 표기를 카드에 표시합니다</div>
            </div>
            <button
              className={`toggle-switch ${showRomaji ? 'toggle-switch--on' : ''}`}
              onClick={() => updateSetting('showRomaji', !showRomaji)}
              aria-label="로마자 표기 토글"
              role="switch"
              aria-checked={showRomaji}
            >
              <span className="toggle-thumb" />
            </button>
          </div>
        </div>

        <div className="settings-version">
          <div>🇯🇵 일본여행 회화</div>
          <div style={{ marginTop: 4, fontSize: 12, opacity: 0.5 }}>설정은 자동으로 저장됩니다</div>
        </div>

      </div>
    </div>
  );
};

export default SettingsView;
