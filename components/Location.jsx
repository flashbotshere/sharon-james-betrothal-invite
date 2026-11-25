'use client';
import { useEffect, useState } from 'react';
import { invite } from '@/lib/config';
import { getPlatform } from '@/lib/device';

export default function Location() {
  const { name, address, lat, lng, mapsUrl } = invite.venue;
  const [isApple, setIsApple] = useState(false);

  useEffect(() => {
    const p = getPlatform();
    setIsApple(p === 'ios' || p === 'mac');
  }, []);

  const query = encodeURIComponent(`Infant Jesus Church, ${address}`);
  const embed = `https://www.google.com/maps?q=${query}&z=16&t=h&output=embed`;
  const google = mapsUrl || `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
  const apple = `https://maps.apple.com/?daddr=${lat},${lng}&q=${encodeURIComponent(name)}`;

  return (
    <div className="location">
      <div className="location-info">
        <span className="eyebrow">Venue</span>
        <h3>{name}</h3>
        <p>{address}</p>
        <div className="location-actions">
          <a className="btn btn-primary" href={google} target="_blank" rel="noopener noreferrer">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
              <path d="M12 21s-6.5-5.8-6.5-11a6.5 6.5 0 0 1 13 0c0 5.2-6.5 11-6.5 11z" />
              <circle cx="12" cy="10" r="2.3" />
            </svg>
            Get Directions
          </a>
          {isApple && (
            <a className="btn btn-outline" href={apple} target="_blank" rel="noopener noreferrer">
              Open in Apple Maps
            </a>
          )}
        </div>
      </div>

      <div className="map-frame">
        <iframe
          title={`Map to ${name}`}
          src={embed}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>
    </div>
  );
}
