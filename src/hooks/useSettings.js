import { useState, useEffect } from 'react';

export const TTS_RATES = { slow: 0.6, normal: 0.85, fast: 1.1 };
export const FONT_SCALES = { small: 0.9, normal: 1.0, large: 1.15 };

const DEFAULTS = {
  ttsSpeed: 'normal',
  fontSize: 'normal',
  showRomaji: true,
};

const STORAGE_KEY = 'japan-app-settings';

export function useSettings() {
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? { ...DEFAULTS, ...JSON.parse(saved) } : DEFAULTS;
    } catch {
      return DEFAULTS;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  const updateSetting = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  return { settings, updateSetting };
}
