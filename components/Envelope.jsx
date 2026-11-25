'use client';
import { useEffect, useRef, useState } from 'react';
import { monogram } from '@/lib/config';
import HeroCard, { CARD_W, CARD_H } from './HeroCard';

// closed -> opening -> expanding -> gone
export default function Envelope({ onOpen }) {
  const [stage, setStage] = useState('closed');
  const [geom, setGeom] = useState(null);
  const [sheet, setSheet] = useState(null);
  const letterRef = useRef(null);
  const closedRef = useRef(true);
  const timers = useRef([]);
  const later = (fn, ms) => timers.current.push(setTimeout(fn, ms));

  // Match the mini card inside the envelope to the card on the page
  useEffect(() => {
    const measure = () => {
      if (!closedRef.current || !letterRef.current) return;
      document.documentElement.style.setProperty('--app-h', `${window.innerHeight}px`);
      const frame = document.querySelector('[data-hero-frame]');
      const fw = frame?.offsetWidth || CARD_W;
      const fh = frame?.offsetHeight || CARD_H;
      const dh = (CARD_W * fh) / fw;
      const lw = letterRef.current.offsetWidth;
      const lh = letterRef.current.offsetHeight;
      setGeom({ lw, lh, dh, s: Math.max(lw / CARD_W, lh / dh) });
    };
    measure();
    window.addEventListener('resize', measure);
    return () => {
      window.removeEventListener('resize', measure);
      timers.current.forEach(clearTimeout);
    };
  }, []);

  const open = () => {
    if (stage !== 'closed' || !geom) return;
    closedRef.current = false;
    setStage('opening');

    later(() => {
      const { s, dh } = geom;
      const r = letterRef.current.getBoundingClientRect();
      const target = document.querySelector('[data-hero-frame]');
      const t = target ? target.getBoundingClientRect() : r;
      const k = t.width / CARD_W;

      const side = Math.max(0, (CARD_W - r.width / s) / 2);
      const bottom = Math.max(0, dh - r.height / s);
      setSheet({
        transform: `translate(${r.left + (r.width - CARD_W * s) / 2}px, ${r.top}px) scale(${s})`,
        clip: `inset(0px ${side}px ${bottom}px ${side}px round ${3 / s}px)`,
      });
      setStage('expanding');
      requestAnimationFrame(() =>
        requestAnimationFrame(() =>
          setSheet({
            transform: `translate(${t.left}px, ${t.top}px) scale(${k})`,
            clip: 'inset(0px 0px 0px 0px round 0px)',
          })
        )
      );
    }, 2150);

    later(() => {
      onOpen?.();
      setStage('gone');
    }, 3350);
  };

  if (stage === 'gone') return null;

  return (
    <div className={`env-screen ${stage !== 'closed' ? 'opened' : ''} ${stage}`} role="dialog" aria-label="Invitation envelope">
      <div className="env-stack">
        <p className="eyebrow env-top">You&apos;re Invited</p>

        <div className="env-float">
          <div className="envelope">
            <div className="env-back" />

            <div className="env-letter" ref={letterRef}>
              {geom && (
                <div
                  className="letter-scene"
                  style={{ left: (geom.lw - CARD_W * geom.s) / 2, transform: `scale(${geom.s})` }}
                >
                  <HeroCard height={geom.dh} />
                </div>
              )}
            </div>

            <div className="env-front">
              <div className="env-front-sides" />
              <div className="env-front-bottom" />
            </div>

            <div className="env-flap">
              <div className="env-flap-shape" />
              <div className="env-flap-liner" />
            </div>

            <button className="env-seal" onClick={open} aria-label="Open invitation">
              <span className="seal-mono script">{monogram}</span>
              <span className="seal-text">Open</span>
            </button>
          </div>
        </div>

        <p className="env-hint">Tap the seal to open your invitation</p>
      </div>

      {sheet && geom && (
        <div className="env-sheet" style={{ transform: sheet.transform, clipPath: sheet.clip, WebkitClipPath: sheet.clip }}>
          <HeroCard height={geom.dh} />
        </div>
      )}
    </div>
  );
}
