import React from 'react';

const CategoryList = ({ categories, onSelect }) => {
  return (
    <div className="screen">
      <div className="cat-grid">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="cat-card"
            onClick={() => onSelect(cat)}
          >
            <span className="cat-emoji">{cat.emoji}</span>
            <div className="cat-name">{cat.name}</div>
            <div className="cat-count">{cat.situations?.length || 0}가지 상황</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryList;
