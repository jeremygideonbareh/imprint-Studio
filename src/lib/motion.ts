import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export { gsap, ScrollTrigger, useGSAP };

ScrollTrigger.config({ ignoreMobileResize: true });

// The demo plays in full by default; the footer switch is the opt-out (html.motion-off is set in index.html)
const MOTION_KEY = 'imprint-motion';
export const motionOff = () => typeof document !== 'undefined' && document.documentElement.classList.contains('motion-off');
export function setMotion(on: boolean) {
  try {
    localStorage.setItem(MOTION_KEY, on ? 'on' : 'off');
  } catch {
    // storage blocked: the choice just lasts until the reload below
  }
  document.documentElement.classList.toggle('motion-off', !on);
  location.reload();
}

let lenis: Lenis | null = null;
export const getLenis = () => lenis;

export function startSmoothScroll() {
  if (lenis || motionOff()) return () => {};

  lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 0.9 });
  lenis.on('scroll', ScrollTrigger.update);
  const tick = (time: number) => lenis?.raf(time * 1000);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);

  return () => {
    gsap.ticker.remove(tick);
    lenis?.destroy();
    lenis = null;
  };
}

/** Scroll velocity in px/frame-ish units, from Lenis when present, otherwise ScrollTrigger. */
export const scrollVelocity = () => (lenis ? lenis.velocity : ScrollTrigger.getAll()[0]?.getVelocity() / 60 || 0);

/**
 * Rounded-corner sheet reveal: the section unrolls over whatever ground its wrapper shows,
 * instead of hard-cutting from the previous section. For pinned sections end at 'top top'.
 */
export function curtain(el: Element | null, end = 'top 15%') {
  if (!el) return;
  gsap.fromTo(
    el,
    { clipPath: 'inset(13% 6% 0% 6% round 48px)' },
    { clipPath: 'inset(0% 0% 0% 0% round 0px)', ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end, scrub: true } },
  );
}
