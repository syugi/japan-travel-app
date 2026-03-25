import React from 'react';

const TABS = [
  { id: 'phrasebook', emoji: '📖', label: '회화집' },
  { id: 'favorites',  emoji: '⭐', label: '즐겨찾기' },
  { id: 'currency',   emoji: '💴', label: '환율'   },
  { id: 'settings',   emoji: '⚙️', label: '설정'   },
];

const BottomTabBar = ({ activeTab, onChange }) => {
  return (
    <nav className="bottom-tab-bar">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          className={`tab-btn ${activeTab === tab.id ? 'tab-btn--active' : ''}`}
          onClick={() => onChange(tab.id)}
          aria-label={tab.label}
        >
          <span className="tab-icon">{tab.emoji}</span>
          <span className="tab-label">{tab.label}</span>
        </button>
      ))}
    </nav>
  );
};

export default BottomTabBar;
