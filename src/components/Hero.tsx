import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { BOOTH, HERO_IMAGE, IG, PHONE, YOUTUBE, img } from '../data/content';

const NAV_LINKS = [
  { label: 'Stories', href: '#stories' },
  { label: 'Services', href: '#sessions' },
  { label: 'Call us', href: PHONE },
];
const SOCIAL_LINKS = [
  { label: 'Instagram', href: IG },
  { label: 'Photobooth', href: BOOTH },
  { label: 'YouTube', href: YOUTUBE },
];

const MARQUEE = 'Imprint Studio — Shillong —';

const external = (href: string) =>
  href.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {};

const DRAWER_EASE = 'cubic-bezier(0.76, 0, 0.24, 1)';

const delay = (ms: number) => ({ animationDelay: `${ms}ms` });

function Marquee({ outline = false }: { outline?: boolean }) {
  return (
    <div className="anim-fade-up absolute inset-x-0 top-[13dvh] overflow-hidden py-[2vh] sm:top-[17dvh]" style={delay(500)}>
      <div className={`marquee flex w-max whitespace-nowrap text-[15dvh] leading-[1.1] tracking-tight sm:text-[27dvh] ${outline ? 'hero-outline' : 'text-ivory'}`}>
        <span className="pr-[6vw]">{MARQUEE}&nbsp;</span>
        <span className="pr-[6vw]" aria-hidden="true">
          {MARQUEE}&nbsp;
        </span>
      </div>
    </div>
  );
}

export default function Hero() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  // Drawer children only wait for the panel when opening; closing resets them at once.
  const drawerItem = (openDelay: number, hiddenOffset: string) => ({
    className: `transition-all duration-500 ${open ? 'translate-y-0 opacity-100' : `${hiddenOffset} opacity-0`}`,
    style: {
      transitionDelay: open ? `${openDelay}ms` : '0ms',
      transitionTimingFunction: DRAWER_EASE,
    },
  });

  return (
    <section className="hero-root relative h-[100dvh] w-full overflow-hidden">
      <div className="hero-bg anim-fade-in absolute inset-0" aria-hidden="true" />

      {/* The name runs behind the print in solid type and across it in outline */}
      <div data-hero-marquee className="pointer-events-none absolute inset-0 z-10">
        <Marquee />
      </div>

      {/* GSAP (HeroFlow) drives the data-hero-* elements on scroll; the CSS entrance stays on this wrapper */}
      <div className="anim-press absolute inset-0 z-[15]" style={delay(250)}>
        <div data-hero-print className="hero-print">
          <div data-hero-slot className="hero-slot" />
          <div className="flex h-[var(--cap)] flex-col items-center justify-center text-ink">
            <p className="text-[1.5dvh] uppercase tracking-[0.34em]">Imprint Studio</p>
            <p className="mt-[0.5dvh] font-poem text-[1.5dvh] italic text-clay">You were made in His image</p>
          </div>
        </div>

        <div data-hero-frame className="hero-frame absolute inset-0 overflow-hidden">
          <img data-hero-frame-img src={img(HERO_IMAGE)} alt="A couple embracing at dusk outside a lamplit cottage" className="hero-photo" />
        </div>

        {/* After the photo so the seal sits over the corner of the print */}
        <div data-hero-seal className="hero-seal" aria-hidden="true">
          <svg className="seal-spin h-full w-full" viewBox="0 0 100 100">
            <defs>
              <path id="seal-ring" d="M50 50m-37 0a37 37 0 1 1 74 0a37 37 0 1 1-74 0" />
            </defs>
            <text fill="#f4efe6" fontSize="9.6" letterSpacing="2.35">
              <textPath href="#seal-ring">IMPRINT STUDIO · SHILLONG ·</textPath>
            </text>
          </svg>
          <span className="absolute inset-0 flex items-center justify-center font-poem text-[2.6em] italic text-brass">i</span>
        </div>
      </div>

      <div data-hero-outline className="pointer-events-none absolute inset-0 z-20" aria-hidden="true">
        <Marquee outline />
      </div>

      <div
        data-hero-fade
        className="anim-line absolute inset-x-6 bottom-[5.5rem] z-10 h-px bg-ivory/50 sm:inset-x-10 sm:bottom-28"
        style={delay(1200)}
      />

      <footer data-hero-fade className="absolute inset-x-0 bottom-0 z-30 flex items-end justify-between px-6 pb-5 text-xs leading-relaxed text-ivory sm:px-10 sm:pb-8 sm:text-sm">
        <div className="anim-fade-up" style={delay(1400)}>
          <p>Wedding photography &amp; films</p>
          <p className="text-ivory/65">Capturing your precious moments</p>
        </div>
        <div className="anim-fade-up text-right" style={delay(1550)}>
          <p>15K on Instagram</p>
          <a href={IG} {...external(IG)} className="text-ivory/65 transition-opacity duration-300 hover:opacity-60">
            @imprint_studio_shillong
          </a>
        </div>
      </footer>

      <header data-hero-fade className="absolute inset-x-0 top-0 z-30 flex items-start justify-between px-6 pt-6 text-ivory sm:px-10 sm:pt-8">
        <a href="#top" className="anim-fade-up font-poem text-2xl italic tracking-wide" style={delay(800)}>
          Imprint
        </a>

        <div className="hidden items-start gap-16 sm:flex lg:gap-24">
          <span className="anim-fade-up text-sm" style={delay(900)}>
            Shillong, Meghalaya
          </span>
          <nav className="flex flex-col gap-0.5 text-sm">
            {NAV_LINKS.map(({ label, href }, i) => (
              <span key={label} className="anim-fade-up" style={delay(1000 + i * 80)}>
                <a href={href} {...external(href)} className="transition-opacity duration-300 hover:opacity-60">
                  {label}
                </a>
              </span>
            ))}
          </nav>
          <div className="flex flex-col gap-0.5 text-sm">
            {SOCIAL_LINKS.map(({ label, href }, i) => (
              <span key={label} className="anim-fade-up" style={delay(1150 + i * 80)}>
                <a href={href} {...external(href)} className="transition-opacity duration-300 hover:opacity-60">
                  {label}
                </a>
              </span>
            ))}
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-500 sm:hidden ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />
      <aside
        className={`fixed inset-y-0 right-0 z-40 w-[80%] max-w-sm bg-ink px-8 py-10 text-ivory transition-transform duration-[600ms] sm:hidden ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ transitionTimingFunction: DRAWER_EASE }}
        aria-hidden={!open}
      >
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Close menu"
          className={`absolute right-6 top-6 flex h-10 w-10 items-center justify-center transition-all duration-500 ${open ? 'rotate-0 opacity-100' : 'rotate-90 opacity-0'}`}
          style={{ transitionDelay: open ? '300ms' : '0ms', transitionTimingFunction: DRAWER_EASE }}
          tabIndex={open ? 0 : -1}
        >
          <X size={26} strokeWidth={1.5} />
        </button>

        <div className="mt-16">
          <p {...drawerItem(250, 'translate-y-4')}>
            <span className="text-xs uppercase tracking-[0.2em] text-ivory/50">Site Index</span>
          </p>
          <nav className="mt-4 flex flex-col gap-2">
            {NAV_LINKS.map(({ label, href }, i) => {
              const item = drawerItem(300 + i * 80, 'translate-y-6');
              return (
                <a key={label} href={href} {...external(href)} onClick={() => setOpen(false)} tabIndex={open ? 0 : -1} className={`text-4xl ${item.className}`} style={item.style}>
                  {label}
                </a>
              );
            })}
          </nav>

          <p className={`mt-12 ${drawerItem(500, 'translate-y-4').className}`} style={drawerItem(500, 'translate-y-4').style}>
            <span className="text-xs uppercase tracking-[0.2em] text-ivory/50">Find Us</span>
          </p>
          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
            {SOCIAL_LINKS.map(({ label, href }, i) => {
              const item = drawerItem(550 + i * 60, 'translate-y-4');
              return (
                <a key={label} href={href} {...external(href)} tabIndex={open ? 0 : -1} className={`text-sm ${item.className}`} style={item.style}>
                  {label}
                </a>
              );
            })}
          </div>
        </div>
      </aside>

      {/* Hamburger sits outside the header so it can stack above the drawer */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        data-hero-fade
        className="anim-fade-up absolute right-6 top-6 z-50 flex h-10 w-10 items-center justify-center sm:hidden"
        style={delay(900)}
      >
        <span className="relative block h-4 w-6">
          <span
            className={`absolute left-0 top-0 h-0.5 w-6 bg-ivory transition-transform duration-500 ${
              open ? 'translate-y-[7px] rotate-45' : ''
            }`}
            style={{ transitionTimingFunction: DRAWER_EASE }}
          />
          <span
            className={`absolute left-0 top-[7px] h-0.5 w-6 bg-ivory transition-opacity duration-300 ${
              open ? 'opacity-0' : 'opacity-100'
            }`}
          />
          <span
            className={`absolute left-0 top-[14px] h-0.5 w-6 bg-ivory transition-transform duration-500 ${
              open ? '-translate-y-[7px] -rotate-45' : ''
            }`}
            style={{ transitionTimingFunction: DRAWER_EASE }}
          />
        </span>
      </button>
    </section>
  );
}
