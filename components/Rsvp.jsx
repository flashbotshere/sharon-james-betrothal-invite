'use client';
import { useEffect, useState } from 'react';
import Reveal from '@/components/Reveal';
import { rsvp } from '@/lib/rsvp';
import './rsvp.css';

// Only for static hosting (no server): set NEXT_PUBLIC_RSVP_SCRIPT_URL and the form
// posts straight to Google. Otherwise it goes through /api/rsvp (recommended).
const DIRECT_URL = process.env.NEXT_PUBLIC_RSVP_SCRIPT_URL || '';
const STORE_KEY = 'betrothal-rsvp';
const EMPTY = { name: '', attending: '', guests: 1, contact: '', notes: '', website: '' };

async function sendRsvp(payload) {
  if (DIRECT_URL) {
    // no-cors: the reply can't be read, so only network failures surface as errors.
    await fetch(DIRECT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
    });
    return;
  }
  const res = await fetch('/api/rsvp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.ok) throw new Error(data.error || 'Something went wrong. Please try again.');
}

export default function Rsvp() {
  const [form, setForm] = useState(EMPTY);
  const [status, setStatus] = useState('idle'); // idle | sending | error | done
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(null);
  const [closed, setClosed] = useState(false);

  useEffect(() => {
    if (rsvp.deadline && Date.now() > new Date(rsvp.deadline).getTime()) setClosed(true);
    try {
      const s = JSON.parse(localStorage.getItem(STORE_KEY) || 'null');
      if (s && s.name) { setSaved(s); setStatus('done'); }
    } catch {}
  }, []);

  if (!rsvp.enabled) return null;

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  const step = (d) =>
    setForm((f) => ({ ...f, guests: Math.min(rsvp.maxGuests, Math.max(1, Number(f.guests) + d)) }));
  const fail = (msg) => { setError(msg); setStatus('error'); };

  const submit = async (e) => {
    e.preventDefault();
    if (status === 'sending') return;
    if (!form.name.trim()) return fail('Please enter your name.');
    if (!form.attending) return fail('Please let us know if you can attend.');

    setStatus('sending');
    setError('');
    const payload = {
      ...form,
      name: form.name.trim(),
      guests: form.attending === 'Yes' ? Number(form.guests) : 0,
    };

    try {
      await sendRsvp(payload);
      const s = { name: payload.name, attending: payload.attending, guests: payload.guests };
      try { localStorage.setItem(STORE_KEY, JSON.stringify(s)); } catch {}
      setSaved(s);
      setForm(EMPTY);
      setStatus('done');
    } catch (err) {
      fail(err.message || 'Something went wrong. Please try again.');
    }
  };

  const editResponse = () => {
    try { localStorage.removeItem(STORE_KEY); } catch {}
    setForm({ ...EMPTY, name: saved.name, attending: saved.attending, guests: saved.guests || 1 });
    setSaved(null);
    setStatus('idle');
  };

  let body;
  if (status === 'done' && saved) {
    const first = saved.name.split(' ')[0];
    body = (
      <div className="rsvp-card rsvp-thanks" role="status">
        <span className="script rsvp-thanks-title">Thank you, {first}</span>
        <p>
          {saved.attending === 'Yes'
            ? saved.guests > 1
              ? `We can't wait to celebrate with all ${saved.guests} of you.`
              : "We can't wait to celebrate with you."
            : "You'll be missed. Thank you for letting us know."}
        </p>
        {!closed && (
          <button type="button" className="rsvp-link" onClick={editResponse}>
            Need to change your response?
          </button>
        )}
      </div>
    );
  } else if (closed) {
    body = <p className="rsvp-card rsvp-closed">{rsvp.closedText}</p>;
  } else {
    body = (
      <form className="rsvp-card" onSubmit={submit} noValidate>
        {rsvp.deadlineText && <p className="rsvp-deadline">{rsvp.deadlineText}</p>}

        <label className="rsvp-field">
          <span className="eyebrow">Full Name</span>
          <input
            type="text" name="name" value={form.name} onChange={set('name')}
            autoComplete="name" maxLength={120} placeholder="Your name" required
          />
        </label>

        <fieldset className="rsvp-field">
          <legend className="eyebrow">Will you attend?</legend>
          <div className="rsvp-choices">
            {[['Yes', 'Joyfully Accepts'], ['No', 'Regretfully Declines']].map(([value, label]) => (
              <label key={value} className={`rsvp-choice ${form.attending === value ? 'is-active' : ''}`}>
                <input
                  type="radio" name="attending" value={value}
                  checked={form.attending === value} onChange={set('attending')}
                />
                <span>{label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        {form.attending === 'Yes' && (
          <div className="rsvp-field">
            <span className="eyebrow" id="rsvp-guests-label">Guests (including you)</span>
            <div className="rsvp-stepper" role="group" aria-labelledby="rsvp-guests-label">
              <button type="button" onClick={() => step(-1)} disabled={form.guests <= 1} aria-label="Fewer guests">−</button>
              <span aria-live="polite">{form.guests}</span>
              <button type="button" onClick={() => step(1)} disabled={form.guests >= rsvp.maxGuests} aria-label="More guests">+</button>
            </div>
          </div>
        )}

        {rsvp.askContact && (
          <label className="rsvp-field">
            <span className="eyebrow">Phone or Email</span>
            <input
              type="text" name="contact" value={form.contact} onChange={set('contact')}
              autoComplete="tel" maxLength={150} placeholder="So we can reach you"
            />
          </label>
        )}

        <label className="rsvp-field">
          <span className="eyebrow">Dietary needs or a note</span>
          <textarea
            name="notes" rows={3} value={form.notes} onChange={set('notes')}
            maxLength={500} placeholder="Optional"
          />
        </label>

        {/* Honeypot: hidden from people, bots fill it in */}
        <input
          type="text" name="website" value={form.website} onChange={set('website')}
          className="rsvp-hp" tabIndex={-1} autoComplete="off" aria-hidden="true"
        />

        {status === 'error' && <p className="rsvp-error" role="alert">{error}</p>}

        <button type="submit" className="btn btn-primary rsvp-submit" disabled={status === 'sending'}>
          {status === 'sending' ? 'Sending…' : 'Send RSVP'}
        </button>
      </form>
    );
  }

  return (
    <section className="section" id="rsvp">
      <div className="container narrow">
        <Reveal className="heading">
          <p className="eyebrow">{rsvp.eyebrow}</p>
          <h2 className="title">{rsvp.title}</h2>
          <span className="rule" />
        </Reveal>
        {rsvp.message && <Reveal><p className="lead">{rsvp.message}</p></Reveal>}
        <Reveal delay={120}>{body}</Reveal>
      </div>
    </section>
  );
}
