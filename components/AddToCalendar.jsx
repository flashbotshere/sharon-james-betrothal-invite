'use client';
import { useEffect, useState } from 'react';
import { googleCalendarUrl, outlookCalendarUrl } from '@/lib/calendar';
import { getPlatform } from '@/lib/device';

const ICS_URL = '/invite.ics';

export default function AddToCalendar() {
  const [open, setOpen] = useState(false);
  const [platform, setPlatform] = useState('other');

  useEffect(() => setPlatform(getPlatform()), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  const options = {
    apple: { label: 'Apple Calendar', hint: 'iPhone, iPad & Mac', href: ICS_URL },
    google: { label: 'Google Calendar', hint: 'Android & web', href: googleCalendarUrl(), external: true },
    outlook: { label: 'Outlook.com', hint: 'Outlook on the web', href: outlookCalendarUrl(), external: true },
    ics: { label: 'Download .ics', hint: 'Outlook, Windows & other apps', href: ICS_URL, download: true },
  };

  const order =
    platform === 'ios' || platform === 'mac'
      ? ['apple', 'google', 'outlook']
      : platform === 'android'
      ? ['google', 'ics', 'outlook']
      : platform === 'windows'
      ? ['ics', 'google', 'outlook']
      : ['google', 'ics', 'outlook', 'apple'];

  return (
    <div className={`cal ${open ? 'open' : ''}`}>
      <button className="btn btn-primary" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
          <rect x="3.5" y="5" width="17" height="15.5" rx="1.5" />
          <path d="M3.5 9.5h17M8 3v4M16 3v4M12 12.5v5M9.5 15h5" />
        </svg>
        Add to Calendar
      </button>

      <div className="cal-backdrop" onClick={() => setOpen(false)} />

      <div className="cal-menu" role="menu">
        <p className="cal-title">Add to your calendar</p>
        {order.map((key, i) => {
          const o = options[key];
          return (
            <a
              key={key}
              role="menuitem"
              className="cal-item"
              href={o.href}
              target={o.external ? '_blank' : undefined}
              rel={o.external ? 'noopener noreferrer' : undefined}
              download={o.download ? 'betrothal-invite.ics' : undefined}
              onClick={() => setOpen(false)}
            >
              <span>
                <strong>{o.label}</strong>
                <small>{o.hint}</small>
              </span>
              {i === 0 && <span className="cal-tag">Recommended</span>}
            </a>
          );
        })}
      </div>
    </div>
  );
}
