'use client';
import { useEffect, useState } from 'react';

function diff(target) {
  const ms = Math.max(0, new Date(target).getTime() - Date.now());
  return {
    ms,
    days: Math.floor(ms / 86400000),
    hours: Math.floor(ms / 3600000) % 24,
    minutes: Math.floor(ms / 60000) % 60,
    seconds: Math.floor(ms / 1000) % 60,
  };
}

export default function Countdown({ target }) {
  const [t, setT] = useState(null);

  useEffect(() => {
    setT(diff(target));
    const id = setInterval(() => setT(diff(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  if (t && t.ms === 0) {
    return <p className="countdown-done">The celebration has begun ✨</p>;
  }

  const units = [
    ['Days', t?.days],
    ['Hours', t?.hours],
    ['Minutes', t?.minutes],
    ['Seconds', t?.seconds],
  ];

  return (
    <div className="countdown">
      {units.map(([label, v]) => (
        <div className="count-box" key={label}>
          <span className="count-num">{v == null ? '--' : String(v).padStart(2, '0')}</span>
          <span className="count-label">{label}</span>
        </div>
      ))}
    </div>
  );
}
