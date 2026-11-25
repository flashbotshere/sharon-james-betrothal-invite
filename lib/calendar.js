import { invite, coupleNames } from './config';

const pad = (n) => String(n).padStart(2, '0');
const toUTC = (date) => {
  const d = new Date(date);
  return `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(
    d.getUTCHours()
  )}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`;
};
const qs = (obj) =>
  Object.entries(obj)
    .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
    .join('&');

export function eventInfo() {
  const { groom, bride, event, venue, siteUrl } = invite;
  return {
    title: `${coupleNames} – ${event.title}`,
    description: `You are warmly invited to the ${event.title.toLowerCase()} of ${groom.full} & ${bride.full}.\n\nInvitation: ${siteUrl}`,
    location: `${venue.name}, ${venue.address}`,
    start: event.start,
    end: event.end,
  };
}

// Android, Chromebooks & anyone with a Google account
export function googleCalendarUrl() {
  const e = eventInfo();
  return `https://calendar.google.com/calendar/render?${qs({
    action: 'TEMPLATE',
    text: e.title,
    dates: `${toUTC(e.start)}/${toUTC(e.end)}`,
    details: e.description,
    location: e.location,
    ctz: invite.event.timezone,
  })}`;
}

// Outlook.com / Hotmail (web)
export function outlookCalendarUrl() {
  const e = eventInfo();
  return `https://outlook.live.com/calendar/0/deeplink/compose?${qs({
    path: '/calendar/action/compose',
    rru: 'addevent',
    subject: e.title,
    startdt: new Date(e.start).toISOString(),
    enddt: new Date(e.end).toISOString(),
    body: e.description,
    location: e.location,
  })}`;
}

const esc = (s = '') =>
  String(s).replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;');

// RFC 5545 line folding (max 75 octets per line)
function fold(line) {
  const enc = new TextEncoder();
  let out = '';
  let cur = '';
  let bytes = 0;
  for (const ch of line) {
    const b = enc.encode(ch).length;
    if (bytes + b > 73) {
      out += cur + '\r\n ';
      cur = '';
      bytes = 1;
    }
    cur += ch;
    bytes += b;
  }
  return out + cur;
}

// .ics file — Apple Calendar (iPhone/iPad/Mac), Outlook desktop, Windows Calendar, Samsung, etc.
export function buildICS() {
  const e = eventInfo();
  const { venue, siteUrl } = invite;
  let host = 'invite';
  try { host = new URL(siteUrl).hostname; } catch {}
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Betrothal Invitation//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${toUTC(e.start)}-betrothal@${host}`,
    `DTSTAMP:${toUTC(new Date())}`,
    `DTSTART:${toUTC(e.start)}`,
    `DTEND:${toUTC(e.end)}`,
    `SUMMARY:${esc(e.title)}`,
    `DESCRIPTION:${esc(e.description)}`,
    `LOCATION:${esc(e.location)}`,
    `GEO:${venue.lat};${venue.lng}`,
    `URL:${siteUrl}`,
    'STATUS:CONFIRMED',
    'TRANSP:OPAQUE',
    'BEGIN:VALARM',
    'ACTION:DISPLAY',
    'DESCRIPTION:Reminder',
    'TRIGGER:-P1D',
    'END:VALARM',
    'BEGIN:VALARM',
    'ACTION:DISPLAY',
    'DESCRIPTION:Reminder',
    'TRIGGER:-PT2H',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ];
  return lines.map(fold).join('\r\n') + '\r\n';
}
