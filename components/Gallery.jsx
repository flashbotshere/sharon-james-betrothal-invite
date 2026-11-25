'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import Reveal from './Reveal';

const DESKTOP_MAX = 7; // 3 rows: [wide][1] / [1][1][1] / [1][wide]
const MOBILE_MAX = 5;  // 3 rows: [wide] / [1][1] / [1][1]

export default function Gallery({ images }) {
  const [index, setIndex] = useState(null);
  const touchX = useRef(null);
  const n = images.length;

  const close = useCallback(() => setIndex(null), []);
  const prev = useCallback(() => setIndex((i) => (i - 1 + n) % n), [n]);
  const next = useCallback(() => setIndex((i) => (i + 1) % n), [n]);

  useEffect(() => {
    if (index === null) return;
    const onKey = (e) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [index, close, prev, next]);

  return (
    <>
      <div className="gallery">
        {images.slice(0, DESKTOP_MAX).map((img, i) => (
          <Reveal key={img.src} delay={(i % 3) * 90} className={`gallery-cell g-${i}`}>
            <button className="gallery-item" onClick={() => setIndex(i)} aria-label={`View ${img.alt}`}>
              <img src={img.src} alt={img.alt} loading="lazy" />
            </button>
          </Reveal>
        ))}
      </div>

      {n > 0 && (
        <div className="gallery-cta">
          <button type="button" className="btn btn-outline" onClick={() => setIndex(0)}>
            View Gallery
          </button>
        </div>
      )}

      {index !== null && (
        <div
          className="lightbox"
          onClick={close}
          onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
          onTouchEnd={(e) => {
            if (touchX.current == null) return;
            const dx = e.changedTouches[0].clientX - touchX.current;
            if (Math.abs(dx) > 50) (dx > 0 ? prev : next)();
            touchX.current = null;
          }}
        >
          <img key={index} src={images[index].src} alt={images[index].alt} onClick={(e) => e.stopPropagation()} />
          <button className="lb-btn lb-close" onClick={close} aria-label="Close">✕</button>
          <button className="lb-btn lb-prev" onClick={(e) => { e.stopPropagation(); prev(); }} aria-label="Previous">‹</button>
          <button className="lb-btn lb-next" onClick={(e) => { e.stopPropagation(); next(); }} aria-label="Next">›</button>
          <span className="lb-count">{index + 1} / {n}</span>
        </div>
      )}
    </>
  );
}
