# Betrothal Invitation — James & Sharon

A Next.js betrothal invitation featuring an animated wax-seal envelope opener, Save the Date details, live countdown, Add to Calendar (Google, Outlook, Apple `.ics`), Google Maps venue view, photo gallery with lightbox, and a Google Sheets-backed RSVP form.

## Tech Stack

- **Framework:** Next.js 16 (App Router) & React 19
- **Styling:** Plain CSS (`app/globals.css`, `components/rsvp.css`) with `next/font/google` (`Cormorant Garamond`, `Great Vibes`, `Jost`)
- **RSVP Backend:** Next.js Route Handler (`app/api/rsvp/route.js`) forwarding submissions to Google Apps Script (`google-apps-script/Code.gs`)

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   Create `.env.local` in the project root with your Google Apps Script Web App URL:
   ```env
   RSVP_SCRIPT_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
   ```
   *(For static-only hosting without `/api/rsvp`, set `NEXT_PUBLIC_RSVP_SCRIPT_URL` instead.)*

3. **Run the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

4. **Production build:**
   ```bash
   npm run build
   npm start
   ```

## Customization

- **Event, Couple & Images:** Edit `lib/config.js` (names, parents, dates, venue coordinates, Google Maps link, and `/public/images/` paths).
- **RSVP Settings:** Edit `lib/rsvp.js` (`enabled`, `eyebrow`, `title`, `message`, `deadline`, `maxGuests`, `askContact`).
- **Google Sheets RSVP Script:** Deploy `google-apps-script/Code.gs` as a Web App in Google Apps Script with **"Who has access"** set to **Anyone**, then paste the `/exec` URL into `.env.local`.

## Project Structure

```text
├── app/
│   ├── api/rsvp/route.js   # Server endpoint forwarding RSVPs to Apps Script
│   ├── invite.ics/route.js # Static .ics calendar file generator
│   ├── globals.css         # Global & section styles
│   ├── layout.js           # Fonts & OpenGraph metadata
│   └── page.js             # Entry page
├── components/
│   ├── Envelope.jsx        # Animated envelope opener
│   ├── HeroCard.jsx        # Invitation hero card
│   ├── Invitation.jsx      # Main page layout & sections
│   ├── Countdown.jsx       # Live countdown timer
│   ├── AddToCalendar.jsx   # Google / Outlook / .ics calendar menu
│   ├── Location.jsx        # Venue details & embedded map
│   ├── Gallery.jsx         # Photo grid & lightbox
│   ├── Rsvp.jsx & rsvp.css # RSVP form & confirmation state
│   └── Reveal.jsx          # Scroll-reveal wrapper
├── google-apps-script/
│   └── Code.gs             # Google Apps Script handler for Google Sheets
├── lib/
│   ├── config.js           # Couple, event, venue & image config
│   ├── rsvp.js             # RSVP form config
│   ├── calendar.js         # Calendar URL & ICS builders
│   └── device.js           # Platform detection for Maps & Calendar
└── public/images/          # Hero, portraits, and gallery/01.jpg–11.jpg
```

