import { useState, useEffect } from 'react';
import CategoryList from './components/CategoryList';
import SituationList from './components/SituationList';
import PhraseList from './components/PhraseList';
import './index.css';

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 3-Depth State
  // 스택으로 관리: ['category', 'situations', 'phrases'] 형식
  const [stack, setStack] = useState(['category']);
  const [currentCat, setCurrentCat] = useState(null);
  const [currentSit, setCurrentSit] = useState(null);

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
      if (newStack.length === 1) { // -> Category
        setCurrentCat(null);
        setCurrentSit(null);
      } else if (newStack.length === 2) { // -> Situation
        setCurrentSit(null);
      }
      return newStack;
    });
    window.scrollTo(0, 0);
  };

  // 현재 화면/Depth 파악
  const currentView = stack[stack.length - 1];

  let headerTitle = "🇯🇵 일본여행 회화";
  let headerSub = "누구나 쉬운 일본여행";

  if (currentView === 'situations' && currentCat) {
    headerTitle = `${currentCat.emoji} ${currentCat.name}`;
    headerSub = '상황을 선택하세요';
  } else if (currentView === 'phrases' && currentSit) {
    headerTitle = currentSit.name;
    headerSub = '🔊 버튼으로 들어보세요';
  }

  return (
    <>
      <div className="header">
        <button 
          className={`header-back ${stack.length > 1 ? 'visible' : ''}`} 
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

      <main style={{ flex: 1, backgroundColor: '#f0eff5' }}>
        {loading && <div className="message">데이터를 불러오는 중...</div>}
        {error && <div className="message">에러: {error}</div>}
        
        {!loading && !error && currentView === 'category' && (
          <CategoryList 
            categories={data} 
            onSelect={handleCategorySelect} 
          />
        )}

        {!loading && !error && currentView === 'situations' && currentCat && (
          <SituationList 
            situations={currentCat.situations} 
            onSelect={handleSituationSelect} 
          />
        )}

        {!loading && !error && currentView === 'phrases' && currentSit && (
          <PhraseList 
            situation={currentSit} 
          />
        )}
      </main>
    </>
  );
}

export default App;
