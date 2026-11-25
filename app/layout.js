import { Cormorant_Garamond, Great_Vibes, Jost } from 'next/font/google';
import './globals.css';
import { invite, coupleNames } from '@/lib/config';

const serif = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-serif',
  display: 'swap',
});
const script = Great_Vibes({ subsets: ['latin'], weight: '400', variable: '--font-script', display: 'swap' });
const sans = Jost({ subsets: ['latin'], weight: ['300', '400', '500'], variable: '--font-sans', display: 'swap' });

const title = `${coupleNames} · Betrothal`;
const description = `You're invited to the betrothal of ${coupleNames} — ${invite.event.dateText}, ${invite.venue.name}.`;

export const metadata = {
  metadataBase: new URL(invite.siteUrl),
  title,
  description,
  openGraph: {
    title,
    description,
    type: 'website',
    images: [{ url: invite.images.share, width: 1200, height: 630 }],
  },
};

export const viewport = { themeColor: '#fbf7f0', width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${serif.variable} ${script.variable} ${sans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
