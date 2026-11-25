'use client';
import Rsvp from '@/components/Rsvp';
import { useEffect, useRef, useState } from 'react';
import { invite } from '@/lib/config';
import Envelope from './Envelope';
import HeroCard, { CARD_W } from './HeroCard';
import Reveal from './Reveal';
import Countdown from './Countdown';
import AddToCalendar from './AddToCalendar';
import Location from './Location';
import Gallery from './Gallery';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// Reads the date exactly as written in config (no timezone shifting)
function dateParts(iso) {
  const [y, m, d] = iso.slice(0, 10).split('-').map(Number);
  return {
    year: y,
    month: MONTHS[m - 1],
    day: String(d).padStart(2, '0'),
    weekday: DAYS[new Date(Date.UTC(y, m - 1, d)).getUTCDay()],
  };
}

function Heading({ eyebrow, title }) {
  return (
    <Reveal className="heading">
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="title">{title}</h2>
      <span className="rule" />
    </Reveal>
  );
}

function HeroFrame() {
  const ref = useRef(null);
  const [dim, setDim] = useState(null);

  useEffect(() => {
    const el = ref.current;
    const update = () => {
      const w = el.offsetWidth;
      const h = el.offsetHeight;
      if (w && h) setDim({ k: w / CARD_W, dh: (CARD_W * h) / w });
    };
    update();
    if ('ResizeObserver' in window) {
      const ro = new ResizeObserver(update);
      ro.observe(el);
      return () => ro.disconnect();
    }
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  return (
    <div className="hero-frame" data-hero-frame ref={ref}>
      {dim && (
        <div className="hero-holder" style={{ transform: `scale(${dim.k})` }}>
          <HeroCard live height={dim.dh} />
        </div>
      )}
    </div>
  );
}

const Icon = {
  time: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </svg>
  ),
  venue: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">
      <path d="M12 21s-6.5-5.8-6.5-11a6.5 6.5 0 0 1 13 0c0 5.2-6.5 11-6.5 11z" />
      <circle cx="12" cy="10" r="2.3" />
    </svg>
  ),
  dress: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">
      <path d="M12 8a2 2 0 1 1 2-2M12 8v1.5l8.3 6a1 1 0 0 1-.6 1.8H4.3a1 1 0 0 1-.6-1.8l8.3-6" />
    </svg>
  ),
};

export default function Invitation() {
  const [isOpen, setIsOpen] = useState(false);
  const { groom, bride, event, venue, images, message } = invite;
  const d = dateParts(event.start);

  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? '' : 'hidden';
  }, [isOpen]);

  return (
    <>
      <Envelope onOpen={() => setIsOpen(true)} />

      <main className={`site ${isOpen ? 'is-open' : ''}`} aria-hidden={!isOpen}>
        {/* ---------- FIRST PAGE ---------- */}
        <section className="hero">
          <HeroFrame />
        </section>

        {/* ---------- SAVE THE DATE ---------- */}
        <section className="section tint" id="details">
          <div className="container">
            <Heading eyebrow="Save the date" title={event.title} />
            {message && <Reveal><p className="lead">{message}</p></Reveal>}

            <Reveal className="event-card" delay={120}>
              <div className="event-date">
                <span className="ed-month">{d.month}</span>
                <span className="ed-day">{d.day}</span>
                <span className="ed-week">{d.weekday}</span>
                <span className="ed-year">{d.year}</span>
              </div>

              <div className="event-info">
                <div className="ei-row">
                  <span className="ei-icon">{Icon.time}</span>
                  <div>
                    <span className="eyebrow">Time</span>
                    <strong>{event.timeText}</strong>
                  </div>
                </div>
                <div className="ei-row">
                  <span className="ei-icon">{Icon.venue}</span>
                  <div>
                    <span className="eyebrow">Venue</span>
                    <strong>{venue.name}</strong>
                    <small>{venue.address}</small>
                  </div>
                </div>
                {event.dressCode && (
                  <div className="ei-row">
                    <span className="ei-icon">{Icon.dress}</span>
                    <div>
                      <span className="eyebrow">Dress code</span>
                      <strong>{event.dressCode}</strong>
                    </div>
                  </div>
                )}
                <div className="ei-actions">
                  <AddToCalendar />
                  <a href="#rsvp" className="btn btn-outline">Your RSVP</a>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ---------- COUNTDOWN ---------- */}
        <section className="section dark" id="countdown">
          <div className="container narrow">
            <Heading eyebrow="Counting down" title="Until the big day" />
            <Reveal delay={100}><Countdown target={event.start} /></Reveal>
          </div>
        </section>

        {/* ---------- LOCATION ---------- */}
        <section className="section" id="location">
          <div className="container">
            <Heading eyebrow="Location" title="Finding your way" />
            <Reveal><Location /></Reveal>
          </div>
        </section>

        {/* ---------- GALLERY ---------- */}
        <section className="section tint" id="gallery">
          <div className="container wide">
            <div className="gallery-head">
              <Reveal className="gh-left">
                <span className="pill">Our Moments</span>
                <h2 className="gh-title">Photo Gallery</h2>
              </Reveal>
              <Reveal className="gh-right" delay={120}>
                <p>A few favourite moments from our journey together.</p>
              </Reveal>
            </div>
            <Gallery images={images.gallery} />
          </div>
        </section>

        {/* ---------- FOOTER ---------- */}
        {/* RSVP */}
        <Rsvp />

        <footer className="footer">
          <Reveal>
            <p className="eyebrow">We look forward to celebrating with you</p>
            <p className="footer-names">
              {groom.first}<em>&amp;</em>{bride.first}
            </p>
            <p className="footer-date">{event.shortDate}</p>
          </Reveal>
        </footer>
      </main>
    </>
  );
}
