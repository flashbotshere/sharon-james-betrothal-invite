import { NextResponse } from 'next/server';
import { rsvp } from '@/lib/rsvp';

export const runtime = 'nodejs';

const clean = (v, max = 500) => String(v ?? '').trim().slice(0, max);
const reply = (ok, error, status = 200) => NextResponse.json(ok ? { ok } : { ok, error }, { status });

export async function POST(req) {
  const url = process.env.RSVP_SCRIPT_URL;
  if (!url) return reply(false, 'RSVP is not set up yet. Please try again later.', 500);

  let body;
  try { body = await req.json(); } catch { return reply(false, 'Invalid request.', 400); }

  // Honeypot: bots fill hidden fields. Pretend success, save nothing.
  if (body.website) return reply(true);

  const name = clean(body.name, 120);
  const attending = body.attending === 'Yes' ? 'Yes' : body.attending === 'No' ? 'No' : '';
  if (!name) return reply(false, 'Please enter your name.', 400);
  if (!attending) return reply(false, 'Please let us know if you can attend.', 400);

  const guests = attending === 'Yes'
    ? Math.min(Math.max(parseInt(body.guests, 10) || 1, 1), rsvp.maxGuests)
    : 0;

  const payload = { name, attending, guests, contact: clean(body.contact, 150), notes: clean(body.notes, 500) };

  try {
    // Apps Script answers with a redirect; fetch follows it to the JSON result.
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      redirect: 'follow',
      cache: 'no-store',
      signal: AbortSignal.timeout(15000),
    });
    const text = await res.text();
    let data = null;
    try { data = JSON.parse(text); } catch {}

    if (!res.ok || !data) {
      console.error('[rsvp] Unexpected response from Apps Script. Is "Who has access" set to "Anyone"?', res.status, text.slice(0, 200));
      return reply(false, "We couldn't save your RSVP. Please try again.", 502);
    }
    if (data.status !== 'success') {
      console.error('[rsvp] Apps Script error:', data.message);
      return reply(false, data.message || "We couldn't save your RSVP. Please try again.", 502);
    }
    return reply(true);
  } catch (err) {
    console.error('[rsvp] Request failed:', err);
    return reply(false, 'Connection problem. Please try again.', 502);
  }
}
