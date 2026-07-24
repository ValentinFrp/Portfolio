import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

export function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function revealEyebrow(el: Element | null) {
  if (!el) return;
  gsap.from(el, {
    autoAlpha: 0,
    y: 20,
    ease: "none",
    scrollTrigger: { trigger: el, start: "top 94%", end: "top 72%", scrub: 1 },
  });
}

export function revealHeading(heading: Element | null) {
  if (!heading) return;
  const split = SplitText.create(heading, { type: "chars", mask: "chars" });
  gsap.from(split.chars, {
    yPercent: 115,
    stagger: 0.05,
    ease: "none",
    scrollTrigger: {
      trigger: heading,
      start: "top 92%",
      end: "top 55%",
      scrub: 1,
    },
  });
}

export function revealChips(scope: Element, trigger: Element) {
  const chips = scope.querySelectorAll("[data-chip]");
  if (!chips.length) return;
  gsap.from(chips, {
    autoAlpha: 0,
    y: 14,
    scale: 0.9,
    stagger: 0.05,
    duration: 0.45,
    ease: "back.out(1.7)",
    scrollTrigger: { trigger, start: "top 78%" },
  });
}
