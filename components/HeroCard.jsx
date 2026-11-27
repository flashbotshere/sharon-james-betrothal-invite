'use client';
import { useId } from 'react';
import { invite } from '@/lib/config';

// Designed at 500px wide and scaled to fit. Height is flexible so the card can
// be a classic 5:7 card on computers and full-width on phones.
export const CARD_W = 500;
export const CARD_H = 700;

function rng(seed) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const LINES = (() => {
  const r = rng(170127);
  const count = 84;
  const out = [];
  for (let i = 0; i < count; i++) {
    const a = r(), b = r(), c = r(), o = r(), e = r(), f = r(), g = r(), h = r(), k = r();
    const x = ((i + 0.5) * 100) / count + (a - 0.5) * 0.35;
    const d = Math.abs(x - 50) / 50;
    const top = 1.5 + 42 * Math.pow(d, 2.8) + b * 7 * (0.25 + d);
    const bottom = 1.5 + 30 * Math.pow(d, 2.2) + c * 7 * (0.2 + d);
    out.push({
      x: +x.toFixed(2),
      top: +top.toFixed(2),
      bottom: +bottom.toFixed(2),
      op: +(0.45 + o * 0.5).toFixed(2),
      extraTop: e < 0.2 ? [+(top + 1.2 + f * 2).toFixed(2), +(1 + g * 4).toFixed(2)] : null,
      extraBottom: h < 0.18 ? [+(bottom + 1.2 + k * 2).toFixed(2), +(1 + f * 3).toFixed(2)] : null,
    });
  }
  return out;
})();

function Fringe() {
  const id = 'rg' + useId().replace(/[^a-zA-Z0-9]/g, '');
  const stroke = `url(#${id})`;
  return (
    <svg className="fringe" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id={id} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="100">
          <stop offset="0" stopColor="#c4a080" />
          <stop offset="0.16" stopColor="#9a6b4a" />
          <stop offset="0.34" stopColor="#c4a080" />
          <stop offset="0.66" stopColor="#c4a080" />
          <stop offset="0.84" stopColor="#9a6b4a" />
          <stop offset="1" stopColor="#c4a080" />
        </linearGradient>
      </defs>
      {LINES.map((l, i) => (
        <g key={i} stroke={stroke} opacity={l.op}>
          <line x1={l.x} y1="0" x2={l.x} y2={l.top} />
          {l.extraTop && <line x1={l.x} y1={l.extraTop[0]} x2={l.x} y2={l.extraTop[0] + l.extraTop[1]} />}
          <line x1={l.x} y1={100 - l.bottom} x2={l.x} y2="100" />
          {l.extraBottom && (
            <line x1={l.x} y1={100 - l.extraBottom[0] - l.extraBottom[1]} x2={l.x} y2={100 - l.extraBottom[0]} />
          )}
        </g>
      ))}
    </svg>
  );
}

export default function HeroCard({ live = false, height = CARD_H }) {
  const { groom, bride, event, venue, images } = invite;
  const Names = live ? 'h1' : 'p';
  return (
    <div className="hero-card" style={{ height }} aria-hidden={live ? undefined : true}>
      <img
        className="hero-photo"
        src={images.hero}
        alt={live ? `${groom.first} & ${bride.first}` : ''}
        draggable={false}
        style={{ objectPosition: images.heroPosition || 'center 35%' }}
      />
      <div className="hero-fade" />
      <Fringe />
      <div className="hero-text">
        <p className="hero-kicker">Betrothal of</p>
        <Names className="hero-names">{groom.first} &amp; {bride.first}</Names>
      </div>
    </div>
  );
}
