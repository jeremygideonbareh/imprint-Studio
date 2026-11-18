import { useRef } from 'react';
import Hero from './Hero';
import { gsap, useGSAP } from '../lib/motion';
import { MANIFESTO } from '../data/content';

/**
 * Pins the hero and turns it into the opening shot: the photo window of the matted print opens
 * until the picture fills the screen, the manifesto develops word by word over it, and finally
 * the image shrinks into the exact rectangle of the Stories reel's first frame (which overlaps
 * this pin's last screen), so the hand-off has no visible cut.
 */
export default function HeroFlow() {
  const root = useRef<HTMLDivElement>(null);
  const words = MANIFESTO.split(' ');

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);

      // Where the Stories hand-off frame sits once its section reaches the top of the viewport
      const target = () => {
        // layout offsets, not rects: the reel track may already be translated when ScrollTrigger refreshes
        const frame = document.querySelector<HTMLElement>('#stories [data-handoff]');
        if (!frame) return 'inset(0px 0px 0px 0px)';
        const { offsetTop: top, offsetLeft: left, offsetWidth: w, offsetHeight: h } = frame;
        const box = root.current!;
        return `inset(${top}px ${box.offsetWidth - left - w}px ${box.offsetHeight - top - h}px ${left}px)`;
      };

      // The print's photo window, in the same layout terms as the hand-off target
      const slot = () => {
        const print = q('[data-hero-print]')[0] as HTMLElement;
        const el = q('[data-hero-slot]')[0] as HTMLElement;
        const box = root.current!;
        const top = print.offsetTop + el.offsetTop;
        const left = print.offsetLeft + el.offsetLeft;
        return `inset(${top}px ${box.offsetWidth - left - el.offsetWidth}px ${box.offsetHeight - top - el.offsetHeight}px ${left}px)`;
      };

      // The full-screen photo starts scaled down just enough to still cover the window, so the
      // print shows the whole couple rather than a slice of the wide crop
      const slotFit = () => {
        const el = q('[data-hero-slot]')[0] as HTMLElement;
        const box = root.current!;
        return Math.max(el.offsetWidth / box.offsetWidth, el.offsetHeight / box.offsetHeight) * 1.05;
      };

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: '+=260%',
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      tl.to(q('[data-hero-fade]'), { autoAlpha: 0, y: -30, duration: 0.1 }, 0)
        .to(q('[data-hero-marquee]'), { yPercent: -18, autoAlpha: 0, duration: 0.16 }, 0)
        .to(q('[data-hero-outline]'), { yPercent: -18, autoAlpha: 0, duration: 0.07 }, 0)
        // the mat lifts away toward the viewer while its window opens into the full picture
        .to(q('[data-hero-print], [data-hero-seal]'), { scale: 1.07, autoAlpha: 0, duration: 0.09, ease: 'power2.in' }, 0.05)
        .fromTo(q('[data-hero-frame]'), { clipPath: slot }, { clipPath: 'inset(0px 0px 0px 0px)', duration: 0.22, ease: 'power2.inOut' }, 0.05)
        .fromTo(q('[data-hero-frame-img]'), { scale: slotFit }, { scale: 1, duration: 0.22, ease: 'power2.inOut' }, 0.05)
        .to(q('[data-shade]'), { autoAlpha: 0.55, duration: 0.12 }, 0.3)
        .fromTo(q('[data-manifesto]'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.01 }, 0.33)
        .fromTo(q('[data-kicker]'), { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.06 }, 0.34)
        .fromTo(
          q('[data-word]'),
          { autoAlpha: 0.08, yPercent: 40, rotateX: -70 },
          { autoAlpha: 1, yPercent: 0, rotateX: 0, stagger: 0.011, duration: 0.08, ease: 'power2.out' },
          0.36,
        )
        // hand-off: text lifts away, the ground turns ink and the frame shrinks into the reel's first frame
        .to(q('[data-manifesto]'), { yPercent: -12, autoAlpha: 0, duration: 0.08 }, 0.78)
        .to(q('[data-shade]'), { autoAlpha: 0, duration: 0.08 }, 0.8)
        .fromTo(q('[data-backdrop]'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.02 }, 0.8)
        .to(q('[data-hero-frame]'), { clipPath: target, duration: 0.14, ease: 'power3.inOut' }, 0.82)
        .to(q('[data-hero-frame-img]'), { scale: 1, duration: 0.14 }, 0.82)
        .to({}, { duration: 0.04 }); // hold the matched frame before the reel takes over
    },
    { scope: root },
  );

  return (
    <div ref={root} id="top" className="relative isolate h-[100dvh] w-full overflow-hidden bg-ink">
      <Hero />

      <div data-backdrop className="pointer-events-none invisible absolute inset-0 z-[14] bg-ink" />
      <div data-shade className="pointer-events-none invisible absolute inset-0 z-[35] bg-ink opacity-0" />

      <div
        data-manifesto
        className="pointer-events-none invisible absolute inset-0 z-[36] flex flex-col justify-center px-6 text-ivory sm:px-10"
        style={{ perspective: '900px' }}
      >
        <p data-kicker className="invisible mb-6 text-xs uppercase tracking-[0.25em] text-brass sm:mb-10 sm:text-sm">
          (01) — The studio
        </p>
        <p className="max-w-[18ch] text-[9vw] leading-[1.02] tracking-tight sm:max-w-[22ch] sm:text-[5.6vw]">
          {words.map((w, i) => (
            <span key={i} className="mask">
              <span data-word className="inline-block origin-bottom will-change-transform">
                {w}&nbsp;
              </span>
            </span>
          ))}
        </p>
      </div>
    </div>
  );
}
