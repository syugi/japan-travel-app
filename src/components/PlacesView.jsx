import { useState, useEffect } from 'react';

function JapaneseModal({ place, onClose }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="jp-show-modal" onClick={(e) => e.stopPropagation()}>
        <div className="jp-show-label">일본인에게 보여주세요</div>
        <div className="jp-show-name">{place.name.ja}</div>
        <div className="jp-show-divider" />
        <div className="jp-show-address">{place.address.ja}</div>
        <button className="jp-show-close" onClick={onClose}>닫기</button>
      </div>
    </div>
  );
}

function PlaceCard({ place }) {
  const [showJp, setShowJp] = useState(false);

  const osmBbox = [
    (place.lng - 0.006).toFixed(6),
    (place.lat - 0.005).toFixed(6),
    (place.lng + 0.006).toFixed(6),
    (place.lat + 0.005).toFixed(6),
  ].join(',');

  const osmSrc =
    `https://www.openstreetmap.org/export/embed.html` +
    `?bbox=${osmBbox}&layer=mapnik&marker=${place.lat},${place.lng}`;

  const directionsUrl =
    `https://maps.google.com/maps/dir/?api=1&destination=${place.lat},${place.lng}`;

  return (
    <>
      <div className="place-card">
        <div className="place-card-header">
          <span className="place-type-badge">
            {place.typeEmoji} {place.typeLabel}
          </span>
        </div>

        <div className="place-name-ko">{place.name.ko}</div>
        <div className="place-name-sub">
          <span>{place.name.en}</span>
          <span className="place-name-sep">·</span>
          <span>{place.name.ja.replace(/\n/g, ' ')}</span>
        </div>

        <div className="place-map-wrap">
          <iframe
            title={place.name.ko}
            src={osmSrc}
            className="place-map-iframe"
            loading="lazy"
            referrerPolicy="no-referrer"
          />
        </div>

        <div className="place-address">
          <span className="place-address-icon">📍</span>
          <span>{place.address.ko}</span>
        </div>
        <div className="place-address place-address--en">
          <span className="place-address-icon" style={{ opacity: 0 }}>📍</span>
          <span>{place.address.en}</span>
        </div>

        <div className="place-actions">
          <button
            className="place-btn place-btn--jp"
            onClick={() => setShowJp(true)}
          >
            🇯🇵 일본어 보여주기
          </button>
          <div className="place-map-btns">
            <a
              className="place-btn place-btn--nav"
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              🗺️ 구글 길찾기
            </a>
            {place.naverUrl && (
              <a
                className="place-btn place-btn--naver"
                href={place.naverUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                📋 상세 정보
              </a>
            )}
          </div>
        </div>
      </div>

      {showJp && (
        <JapaneseModal place={place} onClose={() => setShowJp(false)} />
      )}
    </>
  );
}

export default function PlacesView() {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/data/places.json')
      .then((res) => {
        if (!res.ok) throw new Error('장소 데이터를 불러오는데 실패했습니다.');
        return res.json();
      })
      .then((json) => {
        setPlaces(json);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="message">불러오는 중...</div>;
  if (error) return <div className="message">에러: {error}</div>;

  return (
    <div className="places-list screen">
      {places.map((place) => (
        <PlaceCard key={place.id} place={place} />
      ))}
      <p className="places-add-hint">
        장소 추가 → <code>public/data/places.json</code> 에 항목 추가
      </p>
    </div>
  );
}
