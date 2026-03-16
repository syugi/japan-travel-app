import { useState, useEffect } from 'react';

const STORAGE_KEY = 'japan-app-favorites';

export function useFavorites() {
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const isFavorite = (phraseId) => favorites.includes(phraseId);

  const toggleFavorite = (phraseId) => {
    setFavorites((prev) =>
      prev.includes(phraseId)
        ? prev.filter((id) => id !== phraseId)
        : [...prev, phraseId]
    );
  };

  return { favorites, isFavorite, toggleFavorite };
}
