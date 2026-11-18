// Everything here comes from @imprint_studio_shillong and the albums that credit the team —
// captions, dates and like counts are real. Couples' names are deliberately left out of the demo.
export const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`;
export const img = (id: string) => asset(`img/${id}.webp`);
export const thumb = (id: string) => asset(`img/t/${id}.webp`);

export const IG = 'https://www.instagram.com/imprint_studio_shillong/';
export const IG_DM = 'https://ig.me/m/imprint_studio_shillong';
export const REELS = 'https://www.instagram.com/imprint_studio_shillong/reels/';
export const BOOTH = 'https://www.instagram.com/imprint_booth_shillong/';
export const YOUTUBE = 'https://youtu.be/fqacMl5_JmY';
export const PHONE = 'tel:+916009123062';
export const PHONE_LABEL = '+91 60091 23062';

export const HERO_IMAGE = 'p06_10';

export const LOADER_FRAMES = ['p04_12', 'p07_09', 'p12_10', 'p05_06', 'p00_01', 'p19_18', 'p07_15', 'p06_16', HERO_IMAGE];

export const MANIFESTO =
  'You were made in His image. We are here for the precious moments, to press them into something that stays.';

export type Chapter = {
  title: string;
  date: string;
  likes: string;
  line: string;
  images: [string, string, string];
  href: string;
};

export const CHAPTERS: Chapter[] = [
  {
    title: 'Garden lights',
    date: 'November 2026',
    likes: '893',
    line: 'The Blessed Couples.',
    images: ['p00_01', 'p00_03', 'p00_02'],
    href: 'https://www.instagram.com/imprint_studio_shillong/p/DfUuqwnkxxq/',
  },
  {
    title: 'On the terrace',
    date: 'November 2026',
    likes: '1,755',
    line: 'The beginning of their forever.',
    images: ['p04_05', 'p04_08', 'p04_10'],
    href: 'https://www.instagram.com/lifetouch_photography_shillong/p/DfXBwYwExEQ/',
  },
  {
    title: 'The long aisle',
    date: 'November 2026',
    likes: '696',
    line: 'Where love became the most beautiful frame.',
    images: ['p05_06', 'p05_02', 'p05_01'],
    href: 'https://www.instagram.com/lifetouch_photography_shillong/p/Dfz5oWbk4ud/',
  },
  {
    title: 'Cottage at dusk',
    date: 'November 2026',
    likes: '876',
    line: 'A love to remember.',
    images: ['p06_12', 'p06_04', 'p06_17'],
    href: 'https://www.instagram.com/lifetouch_photography_shillong/p/DfpiZ5Kk8FD/',
  },
  {
    title: 'The veil',
    date: 'October 2026',
    likes: '2,126',
    line: 'The world witnessed their vows, but heaven knows the weight of their promise.',
    images: ['p07_09', 'p07_02', 'p07_06'],
    href: 'https://www.instagram.com/lifetouch_photography_shillong/p/DfEY9CvoFW4/',
  },
  {
    title: 'The red church',
    date: 'October 2026',
    likes: '1,477',
    line: 'Christ at the center — this is their forever.',
    images: ['p12_10', 'p12_09', 'p12_12'],
    href: 'https://www.instagram.com/lifetouch_photography_shillong/p/DeMGySYIBHS/',
  },
  {
    title: 'Into the mist',
    date: 'May 2026',
    likes: '1,684',
    line: 'A perfect wedding vibe filled with love and laughter.',
    images: ['p19_18', 'p19_02', 'p19_08'],
    href: 'https://www.instagram.com/lifetouch_photography_shillong/p/DYeTQOGExO3/',
  },
];

export const TUNNEL = [
  'p04_12', 'p07_15', 'p12_13', 'p06_08', 'p02_07', 'p05_11', 'p12_05', 'p06_13',
  'p04_06', 'p12_14', 'p05_07', 'p06_14', 'p12_07', 'p06_16', 'p06_11', 'p19_16',
];

export const TUNNEL_LINES = ['Every vow', 'every glance', 'every quiet hand', 'pressed to keep'];

export const QUIET = ['p05_05', 'p07_04', 'p04_11', 'p06_06', 'p07_14', 'p05_03', 'p12_15', 'p02_06', 'p04_01'];

// Set on the closing slide of one of the team's albums
export const QUIET_POEM = [
  'The soft glow, the quiet breeze,',
  'and the magical colors of the evening',
  'become the perfect witness',
  'to a love story written to last a lifetime.',
];

export const STATS = [
  { value: 15, suffix: 'K', decimals: 0, label: 'People following the studio' },
  { value: 2.1, suffix: 'K', decimals: 1, label: 'Hearts on a single wedding album' },
];

export const SESSIONS = [
  { name: 'Wedding Day', note: 'Getting ready to the last dance', image: 'p05_11' },
  { name: 'Wedding Films', note: 'Photography and videography, one team', image: 'p06_16' },
  { name: 'Engagements', note: 'The yes, before the aisle', image: 'p07_15' },
  { name: 'Receptions', note: 'Candlelight, family and the dance floor', image: 'p04_12' },
  { name: 'Photobooth', note: 'Prints for every guest, by Imprint Booth', image: 'p03_01' },
];

export const BEYOND_FRAMES = [
  { label: 'Imprint Booth', image: 'p03_01', href: BOOTH },
  { label: 'Wedding reels', image: 'p04_01', href: REELS },
  { label: 'On YouTube', image: 'p12_07', href: YOUTUBE },
];
