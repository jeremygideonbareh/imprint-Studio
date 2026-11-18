import { useRef } from 'react';
import { gsap, ScrollTrigger, useGSAP, scrollToY, scrollVelocity } from '../lib/motion';
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

      // The section overlaps the hero pin's last screen (-mt-[100svh]); stay transparent while it slides
      // underneath, then appear exactly when it locks — on top of the matching hero frame.
      // Opacity rather than visibility, so the chapter links stay in the tab order.
      const handoff = q('[data-handoff]')[0] as HTMLElement;
      const alignHandoff = () => {
        gsap.set(handoff.querySelector('img'), { left: -handoff.offsetLeft, top: -handoff.offsetTop, transformOrigin: `${handoff.offsetLeft + handoff.offsetWidth / 2}px ${handoff.offsetTop + handoff.offsetHeight / 2}px` });
      };
      alignHandoff();
      ScrollTrigger.addEventListener('refreshInit', alignHandoff);

      const setShown = (shown: boolean) => gsap.set(root.current, { opacity: shown ? 1 : 0, pointerEvents: shown ? 'auto' : 'none' });
      setShown(false);

      // The reel holds still for the opening headline, then rolls
      const pause = () => innerHeight * 0.6;
      const pinned = ScrollTrigger.create({
        trigger: root.current,
        start: 'top top',
        end: () => `+=${pause() + distance()}`,
        pin: true,
        invalidateOnRefresh: true,
        // visibility rides the pin itself so it flips on the exact frame the reel locks
        onEnter: () => setShown(true),
        onLeaveBack: () => setShown(false),
        onRefresh: (self) => setShown(self.progress > 0),
      });

      // absolute positions: measured from the trigger, these would land after the pin's own spacing
      const rolling = {
        trigger: root.current,
        start: () => pinned.start + pause(),
        end: () => pinned.start + pause() + distance(),
        scrub: true,
        invalidateOnRefresh: true,
      };
      const reel = gsap.to(track, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          ...rolling,
          id: 'reel',
          onUpdate: (self) => gsap.set(q('[data-progress]'), { scaleX: self.progress }),
        },
      });

      // sprocket strips run against the reel for extra parallax
      gsap.fromTo(q('[data-sprockets]'), { xPercent: 0 }, { xPercent: -30, ease: 'none', scrollTrigger: rolling });

      // the hand-off frame gains its mat while the headline sets, so the hero's print idea carries on
      const matShadow = (alpha: number) => `0 0 0 1.4svh rgba(244, 239, 230, ${alpha}), 0 4.6svh 0 1.4svh rgba(244, 239, 230, ${alpha})`;
      gsap
        .timeline({ scrollTrigger: { trigger: root.current, start: 'top top', end: () => `+=${pause()}`, scrub: true } })
        .fromTo(q('[data-intro] [data-char]'), { yPercent: 150, rotate: 6 }, { yPercent: 0, rotate: 0, stagger: 0.012, ease: 'power3.out', duration: 0.6, immediateRender: true }, 0)
        .fromTo(q('[data-intro-copy], [data-sprockets-wrap], [data-chrome]'), { autoAlpha: 0 }, { autoAlpha: 1, ease: 'none', duration: 0.4, immediateRender: true }, 0.2)
        .fromTo(handoff, { boxShadow: matShadow(0) }, { boxShadow: matShadow(1), ease: 'none', duration: 0.35, immediateRender: true }, 0.05)
        .fromTo(q('[data-handoff] img'), { scale: 1 }, { scale: 1.06, ease: 'none', duration: 1, immediateRender: true }, 0);

      // keyboard users: bring a focused chapter link into the reel's view
      const onFocus = (e: FocusEvent) => {
        const link = e.target as HTMLElement;
        const chapter = link.closest<HTMLElement>('[data-chapter]');
        const range = reel.scrollTrigger;
        if (!chapter || !range || !link.matches(':focus-visible')) return;
        root.current!.scrollLeft = 0;
        scrollToY(range.start + Math.min(chapter.offsetLeft, distance()), true);
      };
      root.current!.addEventListener('focusin', onFocus);

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
        root.current?.removeEventListener('focusin', onFocus);
      };
    },
    { scope: root },
  );

  return (
    <section ref={root} id="stories" className="relative z-10 -mt-[100svh] h-[100svh] overflow-hidden bg-ink text-ivory">
      <div data-sprockets-wrap>
        <Sprockets className="absolute left-0 top-3" />
        <Sprockets className="absolute bottom-3 left-0" />
      </div>

      <div data-chrome className="absolute inset-x-6 top-20 z-10 flex items-center justify-between text-xs uppercase tracking-[0.2em] sm:inset-x-10">
        <span>(02) — Stories</span>
        <span className="hidden sm:inline">Scroll to roll the film</span>
      </div>
      <div data-chrome className="absolute inset-x-6 bottom-10 z-10 h-px bg-ivory/15 sm:inset-x-10">
        <div data-progress className="h-full origin-left scale-x-0 bg-brass" />
      </div>

      <div data-track className="flex h-full w-max items-center will-change-transform">
        <div data-intro className="relative flex h-full w-[100vw] shrink-0 flex-col justify-start px-6 pt-[15svh] sm:justify-center sm:px-0 sm:pl-[65vw] sm:pr-10 sm:pt-0">
          <p className="relative z-10 text-[13vw] leading-[0.92] tracking-tight sm:text-[5.4vw]">
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
          <p data-intro-copy className="relative z-10 mt-5 max-w-sm text-sm leading-relaxed text-ivory/70 sm:mt-8">
            Seven albums from the studio and the teams it shoots with, in their own words.
          </p>
          <div data-handoff className="absolute left-[14vw] top-[45svh] h-[38svh] w-[72vw] overflow-hidden sm:left-[24vw] sm:top-[17svh] sm:h-[62svh] sm:w-[36vw]">
            {/* viewport-sized and offset so its crop matches the hero's full-screen frame exactly */}
            <img src={img(HERO_IMAGE)} alt="A couple embracing at dusk outside a lamplit cottage" className="hero-photo absolute" />
          </div>
          <p data-intro-copy className="absolute left-[14vw] top-[83svh] flex h-[6svh] w-[72vw] items-center justify-center text-[1.25svh] uppercase tracking-[0.3em] text-ink sm:left-[24vw] sm:top-[79svh] sm:w-[36vw]">
            Imprint Studio
          </p>
        </div>

        {CHAPTERS.map((ch, i) => (
          <article
            key={ch.title}
            data-chapter
            className="relative grid h-full w-[100vw] shrink-0 grid-cols-12 content-center items-center gap-4 px-6 pt-20 sm:content-normal sm:px-10 sm:pt-0"
            style={{ perspective: '1200px' }}
          >
            <div className="relative col-span-12 row-start-1 h-[48svh] sm:col-span-5 sm:col-start-2 sm:h-[68svh]">
              <div data-depth="0.2" className="absolute inset-0">
                {/* Each photo is set the way Imprint sets its albums: on an ivory or oxblood mat */}
                <div data-reveal className={`flex h-full w-full flex-col p-[1.4svh] pb-0 ${i % 2 ? 'bg-oxblood text-ivory' : 'bg-ivory text-ink'}`}>
                  <div className="min-h-0 flex-1 overflow-hidden">
                    <img data-inner src={img(ch.images[0])} alt={ch.title} loading="lazy" decoding="async" className="h-full w-full object-cover" />
                  </div>
                  <p className="flex h-[4.6svh] shrink-0 items-center justify-center text-[1.25svh] uppercase tracking-[0.3em]">Imprint Studio</p>
                </div>
              </div>
            </div>

            <div className="pointer-events-none absolute left-[44vw] top-[14svh] hidden h-[24svh] w-[13vw] sm:block">
              <div data-depth="0.5" className="absolute inset-0">
                <div data-reveal className="h-full w-full overflow-hidden">
                  <img data-inner src={thumb(ch.images[1])} alt="" loading="lazy" className="h-full w-full object-cover" decoding="async" />
                </div>
              </div>
            </div>
            <div className="pointer-events-none absolute bottom-[8svh] right-[5vw] hidden h-[22svh] w-[13vw] sm:block">
              <div data-depth="1.6" className="absolute inset-0">
                <div data-reveal className="h-full w-full overflow-hidden">
                  <img data-inner src={thumb(ch.images[2])} alt="" loading="lazy" className="h-full w-full object-cover" decoding="async" />
                </div>
              </div>
            </div>

            <div className="relative z-10 col-span-12 row-start-2 self-start sm:col-span-4 sm:col-start-8 sm:row-start-1 sm:-translate-y-[4svh] sm:self-center">
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
