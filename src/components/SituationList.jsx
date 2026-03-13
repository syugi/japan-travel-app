import React from 'react';

const SituationList = ({ situations, onSelect }) => {
  if (!situations || situations.length === 0) {
    return <div className="message">상황 데이터가 없습니다.</div>;
  }

  return (
    <div className="screen">
      <div className="sit-list">
        {situations.map((sit) => (
          <div 
            key={sit.id} 
            className="sit-card"
            onClick={() => onSelect(sit)}
          >
            <span className="sit-emoji">{sit.emoji}</span>
            <div className="sit-info">
              <div className="sit-name">{sit.name}</div>
              <div className="sit-preview">{sit.desc || ''}</div>
            </div>
            <span className="sit-arrow">›</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SituationList;
