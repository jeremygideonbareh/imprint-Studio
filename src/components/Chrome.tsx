import { useEffect, useRef, useState } from 'react';
import { gsap, ScrollTrigger, useGSAP } from '../lib/motion';
import { IG_DM } from '../data/content';

const SCENES = [
  { id: 'stories', label: 'Stories' },
  { id: 'gallery', label: 'The archive' },
  { id: 'quiet', label: 'The quiet' },
  { id: 'numbers', label: 'In numbers' },
  { id: 'sessions', label: 'Services' },
  { id: 'beyond', label: 'Beyond' },
  { id: 'contact', label: 'Contact' },
];

/** Fixed layer: film grain, a custom cursor, and a slim bar + timecode that take over once the hero is gone. */
export default function Chrome() {
  const bar = useRef<HTMLDivElement>(null);
  const cursor = useRef<HTMLDivElement>(null);
  const [scene, setScene] = useState('Opening');
  const [label, setLabel] = useState('');
  const [mode, setMode] = useState<'dot' | 'ring' | 'label'>('dot');

  useGSAP(() => {
    gsap.set(bar.current, { yPercent: -120 });
    ScrollTrigger.create({
      trigger: '#stories',
      start: 'top 60%',
      onEnter: () => gsap.to(bar.current, { yPercent: 0, duration: 0.8, ease: 'expo.out' }),
      onLeaveBack: () => gsap.to(bar.current, { yPercent: -120, duration: 0.6, ease: 'expo.in' }),
    });
    const tc = document.querySelector('[data-timecode]');
    // pinned sections move in and out of pin-spacers, so read the scene straight from the layout
    const findScene = () => {
      const mid = innerHeight / 2;
      let current = 'Opening';
      SCENES.forEach((s) => {
        const el = document.getElementById(s.id);
        const box = (el?.closest('.pin-spacer') ?? el)?.getBoundingClientRect();
        if (box && box.top <= mid && box.bottom > mid) current = s.label;
      });
      setScene(current);
    };
    ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => {
        findScene();
        const frames = Math.round(self.scroll() / 4);
        const s = Math.floor(frames / 24);
        const pad = (n: number) => String(n).padStart(2, '0');
        if (tc) tc.textContent = `${pad(Math.floor(s / 60))}:${pad(s % 60)}:${pad(frames % 24)}`;
      },
    });
  });

  useEffect(() => {
    const el = cursor.current;
    if (!el || !window.matchMedia('(pointer: fine)').matches) return;
    gsap.set(el, { xPercent: -50, yPercent: -50, autoAlpha: 0 });
    let shown = false;
    const xTo = gsap.quickTo(el, 'x', { duration: 0.35, ease: 'power3.out' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.35, ease: 'power3.out' });

    const last = { x: -1, y: -1 };
    const probe = (node: Element | null) => {
      const target = node?.closest<HTMLElement>('a, button, [data-cursor]');
      const text = target?.dataset.cursor ?? '';
      setLabel(text);
      // labelled targets get a solid brass disc; plain links/buttons (which carry their own text) get a hollow ring
      setMode(text ? 'label' : target ? 'ring' : 'dot');
      gsap.to(el, { scale: text ? 1 : target ? 0.7 : 0.16, duration: 0.45, ease: 'power3.out', overwrite: 'auto' });
    };
    const onScroll = () => {
      if (last.x >= 0) probe(document.elementFromPoint(last.x, last.y));
    };
    const move = (e: PointerEvent) => {
      last.x = e.clientX;
      last.y = e.clientY;
      if (!shown) {
        // appear where the pointer is, not sliding in from the corner
        shown = true;
        gsap.set(el, { x: e.clientX, y: e.clientY });
        gsap.to(el, { autoAlpha: 1, duration: 0.3 });
      }
      xTo(e.clientX);
      yTo(e.clientY);
      probe(e.target as Element);
    };
    const leave = () => {
      shown = false;
      gsap.to(el, { autoAlpha: 0, duration: 0.3 });
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('scroll', onScroll, { passive: true });
    document.documentElement.addEventListener('pointerleave', leave);
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('scroll', onScroll);
      document.documentElement.removeEventListener('pointerleave', leave);
    };
  }, []);

  return (
    <>
      <div className="grain pointer-events-none fixed inset-0 z-[90]" aria-hidden="true" />

      <div
        ref={cursor}
        className={`pointer-events-none fixed left-0 top-0 z-[95] hidden h-20 w-20 items-center justify-center rounded-full text-[11px] uppercase tracking-[0.15em] text-ink transition-colors duration-300 [@media(pointer:fine)]:flex ${
          mode === 'ring' ? 'border border-brass bg-transparent' : 'border border-brass bg-brass'
        }`}
        aria-hidden="true"
      >
        <span className={label ? 'opacity-100' : 'opacity-0'}>{label}</span>
      </div>

      <div ref={bar} className="fixed inset-x-0 top-0 z-[60] flex items-center justify-between px-6 py-4 text-ivory mix-blend-difference sm:px-10">
        <a href="#top" className="font-poem text-xl italic tracking-wide">
          Imprint
        </a>
        <p className="hidden items-center gap-3 text-xs uppercase tracking-[0.2em] sm:flex">
          <span className="rec-dot inline-block h-1.5 w-1.5 rounded-full bg-brass" />
          <span>{scene}</span>
          <span data-timecode className="tabular-nums text-ivory/60">
            00:00:00
          </span>
        </p>
        <a href={IG_DM} target="_blank" rel="noreferrer" className="text-sm hover:opacity-60">
          Check your date ↗
        </a>
      </div>
    </>
  );
}
