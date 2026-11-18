import { useRef } from 'react';
import { gsap, ScrollTrigger, useGSAP, scrollVelocity } from '../lib/motion';
import { CHAPTERS, HERO_IMAGE, img, thumb } from '../data/content';
import SplitChars from './SplitChars';

const Sprockets = ({ className = '' }: { className?: string }) => (
  <div data-sprockets className={`flex w-max gap-[18px] ${className}`} aria-hidden="true">
    {Array.from({ length: 240 }).map((_, i) => (
      <span key={i} className="block h-[10px] w-[16px] shrink-0 rounded-[2px] bg-ivory/10" />
    ))}
  </div>
);

/**
 * A horizontal film reel: seven of the studio's albums as chapters, each image living at its own depth.
 * It opens on the exact frame the hero shrinks into (data-handoff), so the cut is invisible.
 */
export default function Stories() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const track = q('[data-track]')[0] as HTMLElement;
      const distance = () => track.scrollWidth - window.innerWidth;

      // The section overlaps the hero pin's last screen (-mt-[100dvh]); stay invisible while it slides
      // underneath, then appear exactly when it locks — on top of the matching hero frame.
      const handoff = q('[data-handoff]')[0] as HTMLElement;
      const alignHandoff = () => {
        gsap.set(handoff.querySelector('img'), { left: -handoff.offsetLeft, top: -handoff.offsetTop, transformOrigin: `${handoff.offsetLeft + handoff.offsetWidth / 2}px ${handoff.offsetTop + handoff.offsetHeight / 2}px` });
      };
      alignHandoff();
      ScrollTrigger.addEventListener('refreshInit', alignHandoff);

      gsap.set(root.current, { autoAlpha: 0 });

      const reel = gsap.to(track, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          // visibility rides the pin itself so it flips on the exact frame the reel locks
          onEnter: () => gsap.set(root.current, { autoAlpha: 1 }),
          onLeaveBack: () => gsap.set(root.current, { autoAlpha: 0 }),
          onRefresh: (self) => gsap.set(root.current, { autoAlpha: self.progress > 0 ? 1 : 0 }),
          onUpdate: (self) => gsap.set(q('[data-progress]'), { scaleX: self.progress }),
        },
      });

      // sprocket strips run against the reel for extra parallax
      gsap.fromTo(
        q('[data-sprockets]'),
        { xPercent: 0 },
        { xPercent: -30, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top top', end: () => `+=${distance()}`, scrub: true, invalidateOnRefresh: true } },
      );

      // intro copy develops right after the hand-off frame lands; for the first stretch the copy is
      // counter-moved against the reel so it holds still while the photo drifts left beneath it
      const hold = () => innerWidth * 0.45;
      gsap
        .timeline({ scrollTrigger: { trigger: root.current, start: 'top top', end: () => `+=${hold()}`, scrub: 1, invalidateOnRefresh: true } })
        .fromTo(q('[data-intro-text]'), { x: 0 }, { x: hold, ease: 'none', duration: 1 }, 0)
        .fromTo(q('[data-intro] [data-char]'), { yPercent: 150, rotate: 6 }, { yPercent: 0, rotate: 0, stagger: 0.012, ease: 'power3.out', duration: 0.6 }, 0)
        .fromTo(q('[data-intro-copy], [data-sprockets], [data-chrome]'), { autoAlpha: 0 }, { autoAlpha: 1, ease: 'none', duration: 0.4 }, 0.2)
        .fromTo(q('[data-handoff] img'), { scale: 1 }, { scale: 1.15, ease: 'none', duration: 1 }, 0)
        .fromTo(q('[data-handoff-dim]'), { opacity: 0 }, { opacity: 1, ease: 'none', duration: 0.5 }, 0.1);

      q('[data-chapter]').forEach((chapter) => {
        const c = gsap.utils.selector(chapter);
        const base = { containerAnimation: reel, trigger: chapter, scrub: true };

        c('[data-depth]').forEach((el) => {
          const depth = Number((el as HTMLElement).dataset.depth);
          gsap.fromTo(el, { xPercent: 25 * depth }, { xPercent: -25 * depth, ease: 'none', scrollTrigger: { ...base, start: 'left right', end: 'right left' } });
        });
        c('[data-inner]').forEach((el) =>
          gsap.fromTo(el, { scale: 1.35, xPercent: -8 }, { scale: 1.05, xPercent: 8, ease: 'none', scrollTrigger: { ...base, start: 'left right', end: 'right left' } }),
        );
        gsap.fromTo(
          c('[data-reveal]'),
          { clipPath: 'inset(0% 100% 0% 0%)' },
          { clipPath: 'inset(0% 0% 0% 0%)', ease: 'power2.out', stagger: 0.1, scrollTrigger: { ...base, start: 'left 85%', end: 'left 25%' } },
        );
        gsap.fromTo(
          c('[data-char]'),
          { yPercent: 150, rotate: 8 },
          { yPercent: 0, rotate: 0, stagger: 0.02, ease: 'power3.out', scrollTrigger: { ...base, start: 'left 75%', end: 'left 30%' } },
        );
        gsap.fromTo(
          c('[data-num], [data-line-copy]'),
          { yPercent: 150, autoAlpha: 0 },
          { yPercent: 0, autoAlpha: 1, stagger: 0.1, ease: 'power3.out', scrollTrigger: { ...base, start: 'left 80%', end: 'left 35%' } },
        );
      });

      // 3D lean: frames swing on their Y axis with scroll speed, then settle
      // (applied to the clip wrappers, since the outer layers already carry the parallax transforms)
      const tilt = q('[data-reveal]');
      let lean = 0;
      const onTick = () => {
        const target = gsap.utils.clamp(-28, 28, scrollVelocity() * -1.4);
        const next = lean + (target - lean) * 0.08;
        if (Math.abs(next - lean) < 0.01 && Math.abs(target) < 0.01) return;
        lean = next;
        gsap.set(tilt, { rotateY: lean, skewX: lean * -0.12, transformPerspective: 1000 });
      };
      gsap.ticker.add(onTick);
      return () => {
        gsap.ticker.remove(onTick);
        ScrollTrigger.removeEventListener('refreshInit', alignHandoff);
      };
    },
    { scope: root },
  );

  return (
    <section ref={root} id="stories" className="relative z-10 -mt-[100dvh] h-[100dvh] overflow-hidden bg-ink text-ivory">
      <Sprockets className="absolute left-0 top-3" />
      <Sprockets className="absolute bottom-3 left-0" />

      <div data-chrome className="absolute inset-x-6 top-20 z-10 flex items-center justify-between text-xs uppercase tracking-[0.2em] sm:inset-x-10">
        <span>(02) — Stories</span>
        <span className="hidden sm:inline">Scroll to roll the film</span>
      </div>
      <div data-chrome className="absolute inset-x-6 bottom-10 z-10 h-px bg-ivory/15 sm:inset-x-10">
        <div data-progress className="h-full origin-left scale-x-0 bg-brass" />
      </div>

      <div data-track className="flex h-full w-max items-center will-change-transform">
        <div data-intro className="relative flex h-full w-[100vw] shrink-0 flex-col justify-start px-6 pt-[16dvh] sm:justify-center sm:px-10 sm:pt-0">
          <div data-intro-text className="relative z-10">
          <p className="relative z-10 max-w-[60vw] text-[15vw] leading-[0.88] tracking-tight sm:text-[9.5vw]">
            <span className="block">
              <SplitChars text="Vows," />
            </span>
            <span className="block font-poem italic text-brass">
              <SplitChars text="kept" />
            </span>
            <span className="block">
              <SplitChars text="frame by frame" />
            </span>
          </p>
          <p data-intro-copy className="relative z-10 mt-8 max-w-sm text-sm leading-relaxed text-ivory/70">
            Seven albums from the studio and the teams it shoots with. Every caption, date and heart below is real.
          </p>
          </div>
          <div data-handoff className="absolute right-6 top-[54dvh] h-[34dvh] w-[58vw] overflow-hidden sm:right-[20vw] sm:top-[19dvh] sm:h-[62dvh] sm:w-[34vw]">
            {/* viewport-sized and offset so its crop matches the hero's full-screen frame exactly */}
            <img src={img(HERO_IMAGE)} alt="A couple embracing at dusk outside a lamplit cottage" className="hero-photo absolute" />
            <div data-handoff-dim className="absolute inset-0 bg-gradient-to-r from-ink/80 via-ink/30 to-transparent opacity-0" />
          </div>
        </div>

        {CHAPTERS.map((ch, i) => (
          <article
            key={ch.title}
            data-chapter
            className="relative grid h-full w-[100vw] shrink-0 grid-cols-12 items-center gap-4 px-6 sm:px-10"
            style={{ perspective: '1200px' }}
          >
            <div className="relative col-span-12 row-start-1 h-[48dvh] sm:col-span-5 sm:col-start-2 sm:h-[68dvh]">
              <div data-depth="0.2" className="absolute inset-0">
                <div data-reveal className="h-full w-full overflow-hidden">
                  <img data-inner src={img(ch.images[0])} alt={ch.title} className="h-full w-full object-cover" />
                </div>
              </div>
            </div>

            <div className="pointer-events-none absolute left-[47vw] top-[9dvh] hidden h-[24dvh] w-[13vw] sm:block">
              <div data-depth="0.9" className="absolute inset-0">
                <div data-reveal className="h-full w-full overflow-hidden">
                  <img data-inner src={thumb(ch.images[1])} alt="" className="h-full w-full object-cover" decoding="async" />
                </div>
              </div>
            </div>
            <div className="pointer-events-none absolute bottom-[8dvh] right-[5vw] hidden h-[22dvh] w-[13vw] sm:block">
              <div data-depth="1.6" className="absolute inset-0">
                <div data-reveal className="h-full w-full overflow-hidden">
                  <img data-inner src={thumb(ch.images[2])} alt="" className="h-full w-full object-cover" decoding="async" />
                </div>
              </div>
            </div>

            <div className="relative z-10 col-span-12 row-start-2 self-start sm:col-span-4 sm:col-start-8 sm:row-start-1 sm:-translate-y-[4dvh] sm:self-center">
              <p className="mask">
                <span data-num className="inline-block font-poem text-2xl italic text-brass sm:text-3xl">
                  Chapter {String(i + 1).padStart(2, '0')}
                </span>
              </p>
              <h3 className="mt-2 text-[11vw] leading-[0.95] tracking-tight sm:text-[4.6vw]">
                <SplitChars text={ch.title} />
              </h3>
              <p className="mt-4 max-w-md font-poem text-xl italic leading-snug text-ivory/85 sm:text-2xl">
                <span data-line-copy className="inline-block">
                  “{ch.line}”
                </span>
              </p>
              <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 whitespace-nowrap text-xs uppercase tracking-[0.18em] text-ivory/60">
                <span>{ch.date}</span>
                <span>♥ {ch.likes}</span>
                <a href={ch.href} target="_blank" rel="noreferrer" data-cursor="View" className="text-ivory underline-offset-4 hover:underline">
                  See the post ↗
                </a>
              </div>
            </div>
          </article>
        ))}

        <div className="flex h-full w-[70vw] shrink-0 items-center justify-center px-10 sm:w-[45vw]">
          <p className="text-center font-poem text-4xl italic text-ivory/80 sm:text-6xl">…and the story keeps going</p>
        </div>
      </div>
    </section>
  );
}
