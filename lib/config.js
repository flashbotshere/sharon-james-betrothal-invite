// ✏️  EDIT EVERYTHING HERE — names, date, venue, images.
export const invite = {
  // Your live URL after deploying (used in calendar invites & link previews)
  siteUrl: 'https://your-domain.com',

  groom: {
    first: 'James',
    full: 'James Antony',
    parents: 'Son of Manithakadi Family, Annikad, Kottayam',
  },
  bride: {
    first: 'Sharon',
    full: 'Sharon Menat',
    parents: 'D/o. Late Baby Varghese & Mrs. Simbi Baby, Payyappilly House, Kallettumkara, Thrissur',
  },

  event: {
    title: 'Betrothal Ceremony',
    subtitle: 'Solemn Engagement Blessing',
    // ISO format with timezone offset (+05:30 = IST)
    start: '2027-01-02T11:30:00+05:30',
    end: '2027-01-02T14:30:00+05:30',
    timezone: 'Asia/Kolkata',
    dateText: 'Friday, 2 January 2027',
    shortDate: '02 · 01 · 2027',
    timeText: '11:30 AM (IST)',
  },

  venue: {
    name: 'Infant Jesus Church Parish Hall',
    address: 'Kallettumkara, Thrissur, Kerala 680683',
    city: 'Kallettumkara · Thrissur',
    lat: 10.3394,
    lng: 76.2944,
    // Google Maps share link for "Directions"
    mapsUrl: 'https://maps.google.com/?q=Infant+Jesus+Church+Kallettumkara+Thrissur',
  },

  message:
    'We joyfully invite you to celebrate the betrothal ceremony of James Antony and Sharon Menat.',

  // 🖼  Images — local files in /public/images/
  images: {
    hero: '/images/hero.jpg',
    heroPosition: 'center 30%',
    share: '/images/share.jpg',
    groom: '/images/groom.jpg',
    bride: '/images/bride.jpg',
    gallery: [
      { src: '/images/gallery/01.jpg', alt: 'Together' },
      { src: '/images/gallery/02.jpg', alt: 'Moment together' },
      { src: '/images/gallery/03.jpg', alt: 'Smiling together' },
      { src: '/images/gallery/04.jpg', alt: 'Evening out' },
      { src: '/images/gallery/05.jpg', alt: 'Night selfie' },
      { src: '/images/gallery/06.jpg', alt: 'Happy smiles' },
      { src: '/images/gallery/07.jpg', alt: 'Celebration' },
      { src: '/images/gallery/08.jpg', alt: 'Street lights' },
      { src: '/images/gallery/10.jpg', alt: 'Rose bouquet' },
      { src: '/images/gallery/11.jpg', alt: 'Joyful laughter' },
    ],
  },
};

export const coupleNames = `${invite.groom.first} & ${invite.bride.first}`;
export const monogram = `${invite.groom.first[0]}&${invite.bride.first[0]}`;
