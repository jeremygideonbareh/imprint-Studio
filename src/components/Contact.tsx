import { useRef } from 'react';
import { curtain, gsap, useGSAP, getLenis, motionOff, setMotion } from '../lib/motion';
import { BOOTH, HERO_IMAGE, IG, IG_DM, PHONE, PHONE_LABEL, YOUTUBE, img } from '../data/content';
import SplitChars from './SplitChars';

const LINE_1 = "Let's keep";
const LINE_2 = 'your day.';


/** The closing credits: the sign-off rises letter by letter over a slow-drifting last frame. */
export default function Contact() {
  const root = useRef<HTMLElement>(null);

  const { contextSafe } = useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      curtain(root.current, 'top 25%');
      gsap
        .timeline({ scrollTrigger: { trigger: root.current, start: 'top 70%', end: 'top 10%', scrub: 1 } })
        .fromTo(q('[data-cc]'), { yPercent: 150, rotate: 12 }, { yPercent: 0, rotate: 0, stagger: 0.03, ease: 'power3.out' })
        .fromTo(q('[data-bgimg]'), { scale: 1.4, autoAlpha: 0 }, { scale: 1.1, autoAlpha: 0.35, ease: 'none' }, 0);

      gsap.fromTo(q('[data-bgimg]'), { yPercent: -10 }, { yPercent: 10, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom bottom', scrub: true } });
      gsap.from(q('[data-foot] > *'), { y: 30, autoAlpha: 0, stagger: 0.08, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: q('[data-foot]')[0], start: 'top 95%' } });
    },
    { scope: root },
  );

  // magnetic call-to-action
  const onMagnet = contextSafe((e: React.PointerEvent<HTMLAnchorElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    gsap.to(e.currentTarget, { x: (e.clientX - r.left - r.width / 2) * 0.35, y: (e.clientY - r.top - r.height / 2) * 0.35, duration: 0.6, ease: 'power3.out' });
  });
  const onMagnetLeave = contextSafe((e: React.PointerEvent<HTMLAnchorElement>) => {
    gsap.to(e.currentTarget, { x: 0, y: 0, duration: 1, ease: 'elastic.out(1, 0.35)' });
  });

  return (
    <section ref={root} id="contact" className="relative flex min-h-[100dvh] flex-col justify-between overflow-hidden bg-ink px-6 pb-8 pt-44 text-ivory sm:px-10">
      <img data-bgimg src={img(HERO_IMAGE)} alt="" className="pointer-events-none absolute inset-0 h-full w-full object-cover object-[50%_58%] opacity-0" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-ink/90" />

      <div className="relative">
        <p className="text-xs uppercase tracking-[0.2em]">(08) — Contact</p>
        <h2 className="mt-10 text-[17vw] leading-[0.95] tracking-tight sm:text-[12vw]">
          <span className="block">
            <SplitChars text={LINE_1} attr="data-cc" />
          </span>
          <span className="block font-poem italic text-brass">
            <SplitChars text={LINE_2} attr="data-cc" />
          </span>
        </h2>

        <div className="mt-14 flex flex-wrap items-center gap-10">
          <a
            href={PHONE}
            onPointerMove={onMagnet}
            onPointerLeave={onMagnetLeave}
            className="group relative inline-flex h-40 w-40 items-center justify-center rounded-full border border-ivory/40 text-center text-sm uppercase tracking-[0.18em] sm:h-48 sm:w-48"
          >
            <span className="absolute inset-0 scale-0 rounded-full bg-brass transition-transform duration-500 ease-out group-hover:scale-100" />
            <span className="relative transition-colors duration-500 group-hover:text-ink">
              Call
              <br />
              Imprint ↗
            </span>
          </a>
          <p className="max-w-sm text-sm leading-relaxed text-ivory/70">
            Weddings, engagements, receptions, films and photobooth, in Shillong. Call or message the studio with your date.
          </p>
        </div>
      </div>

      <footer data-foot className="relative mt-24 grid gap-8 border-t border-ivory/15 pt-8 text-sm sm:grid-cols-4">
        <div>
          <p className="text-ivory/50">Studio</p>
          <p className="mt-2">Imprint Studio, Shillong</p>
          <a href={PHONE} className="block hover:text-brass">
            {PHONE_LABEL}
          </a>
        </div>
        <div>
          <p className="text-ivory/50">Follow</p>
          <a href={IG} target="_blank" rel="noreferrer" className="mt-2 block hover:text-brass">
            Instagram ↗
          </a>
          <a href={IG_DM} target="_blank" rel="noreferrer" className="block hover:text-brass">
            Send a message ↗
          </a>
        </div>
        <div>
          <p className="text-ivory/50">More</p>
          <a href={BOOTH} target="_blank" rel="noreferrer" className="mt-2 block hover:text-brass">
            Imprint Booth ↗
          </a>
          <a href={YOUTUBE} target="_blank" rel="noreferrer" className="block hover:text-brass">
            YouTube ↗
          </a>
        </div>
        <div className="flex items-end justify-between sm:flex-col sm:items-end">
          <button type="button" onClick={() => {
              const lenis = getLenis();
              if (lenis) lenis.scrollTo(0, { duration: 2.4 });
              else window.scrollTo({ top: 0, behavior: 'smooth' });
            }} className="hover:text-brass" data-cursor="Top">
            Back to the beginning ↑
          </button>
          <button type="button" onClick={() => setMotion(motionOff())} className="text-ivory/50 hover:text-brass">
            Motion: {motionOff() ? 'Off' : 'On'}
          </button>
        </div>
        <p className="text-xs leading-relaxed text-ivory/45 sm:col-span-4">
          Design concept for Imprint Studio, not yet the official site. Photographs and captions from @imprint_studio_shillong and collaborating albums by @lifetouch_photography_shillong, used for preview only.
        </p>
      </footer>
    </section>
  );
}
