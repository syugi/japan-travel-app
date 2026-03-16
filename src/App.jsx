import { useState, useEffect } from 'react';
import CategoryList from './components/CategoryList';
import SituationList from './components/SituationList';
import PhraseList from './components/PhraseList';
import SearchView from './components/SearchView';
import FavoritesView from './components/FavoritesView';
import CurrencyCalculator from './components/CurrencyCalculator';
import SettingsView from './components/SettingsView';
import BottomTabBar from './components/BottomTabBar';
import { useSettings } from './hooks/useSettings';
import { useFavorites } from './hooks/useFavorites';
import './index.css';

const TAB_HEADERS = {
  phrasebook: { title: '🇯🇵 일본여행 회화', sub: '누구나 쉬운 일본여행' },
  favorites:  { title: '⭐ 즐겨찾기',        sub: '저장한 문구 모음' },
  currency:   { title: '💴 환율 계산기',      sub: 'JPY ↔ KRW' },
  settings:   { title: '⚙️ 설정',            sub: 'TTS · 글자 · 로마자' },
};

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeTab, setActiveTab] = useState('phrasebook');
  const [searchQuery, setSearchQuery] = useState('');

  // 3-Depth phrasebook stack
  const [stack, setStack] = useState(['category']);
  const [currentCat, setCurrentCat] = useState(null);
  const [currentSit, setCurrentSit] = useState(null);

  const { settings, updateSetting } = useSettings();
  const { isFavorite, toggleFavorite } = useFavorites();

  useEffect(() => {
    fetch('/data/phrases.json')
      .then((res) => {
        if (!res.ok) throw new Error('데이터를 불러오는데 실패했습니다.');
        return res.json();
      })
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleCategorySelect = (category) => {
    setCurrentCat(category);
    setStack(['category', 'situations']);
    setSearchQuery('');
    window.scrollTo(0, 0);
  };

  const handleSituationSelect = (situation) => {
    setCurrentSit(situation);
    setStack(['category', 'situations', 'phrases']);
    window.scrollTo(0, 0);
  };

  const handleBack = () => {
    setStack((prev) => {
      const newStack = [...prev];
      newStack.pop();
      if (newStack.length === 1) {
        setCurrentCat(null);
        setCurrentSit(null);
      } else if (newStack.length === 2) {
        setCurrentSit(null);
      }
      return newStack;
    });
    window.scrollTo(0, 0);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchQuery('');
    window.scrollTo(0, 0);
  };

  const currentView = stack[stack.length - 1];
  const showBackBtn = activeTab === 'phrasebook' && stack.length > 1;
  const showSearchBar = activeTab === 'phrasebook' && currentView === 'category';

  let headerTitle = TAB_HEADERS[activeTab]?.title || '';
  let headerSub   = TAB_HEADERS[activeTab]?.sub   || '';

  if (activeTab === 'phrasebook') {
    if (currentView === 'situations' && currentCat) {
      headerTitle = `${currentCat.emoji} ${currentCat.name}`;
      headerSub = '상황을 선택하세요';
    } else if (currentView === 'phrases' && currentSit) {
      headerTitle = currentSit.name;
      headerSub = '🔊 버튼으로 들어보세요';
    }
  }

  return (
    <>
      <div className="header">
        <button
          className={`header-back ${showBackBtn ? 'visible' : ''}`}
          onClick={handleBack}
          aria-label="뒤로가기"
        >
          ←
        </button>
        <div className="header-titles">
          <div className="header-title">{headerTitle}</div>
          <div className="header-sub">{headerSub}</div>
        </div>
      </div>

      {showSearchBar && (
        <div className="home-search-bar">
          <input
            className="search-input"
            type="search"
            placeholder="문구 검색 (한국어 · 일본어)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoComplete="off"
            autoCorrect="off"
            spellCheck="false"
          />
        </div>
      )}

      <main style={{ flex: 1 }}>
        {loading && <div className="message">데이터를 불러오는 중...</div>}
        {error && <div className="message">에러: {error}</div>}

        {!loading && !error && activeTab === 'phrasebook' && (
          <>
            {currentView === 'category' && searchQuery.trim() !== '' && (
              <SearchView
                data={data}
                query={searchQuery}
                settings={settings}
                isFavorite={isFavorite}
                toggleFavorite={toggleFavorite}
              />
            )}
            {currentView === 'category' && searchQuery.trim() === '' && (
              <CategoryList categories={data} onSelect={handleCategorySelect} />
            )}
            {currentView === 'situations' && currentCat && (
              <SituationList situations={currentCat.situations} onSelect={handleSituationSelect} />
            )}
            {currentView === 'phrases' && currentSit && (
              <PhraseList
                situation={currentSit}
                settings={settings}
                isFavorite={isFavorite}
                toggleFavorite={toggleFavorite}
              />
            )}
          </>
        )}

        {!loading && !error && activeTab === 'favorites' && (
          <FavoritesView
            data={data}
            settings={settings}
            isFavorite={isFavorite}
            toggleFavorite={toggleFavorite}
          />
        )}

        {activeTab === 'currency' && <CurrencyCalculator />}

        {activeTab === 'settings' && (
          <SettingsView settings={settings} updateSetting={updateSetting} />
        )}
      </main>

      <BottomTabBar activeTab={activeTab} onChange={handleTabChange} />
    </>
  );
}

export default App;
