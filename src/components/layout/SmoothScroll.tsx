"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { introState } from "@/lib/introState";

gsap.registerPlugin(ScrollTrigger);

export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({ autoRaf: false, lerp: 0.1 });
    if (!introState.done) lenis.stop();
    const unsubscribe = introState.subscribe(() => lenis.start());

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    lenis.on("scroll", ScrollTrigger.update);

    const onAnchorClick = (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement).closest<HTMLAnchorElement>(
        'a[href^="#"]'
      );
      if (!anchor) return;
      event.preventDefault();
      lenis.scrollTo(anchor.getAttribute("href") as string, {
        offset: -40,
        duration: 1.4,
      });
    };
    document.addEventListener("click", onAnchorClick);

    return () => {
      unsubscribe();
      document.removeEventListener("click", onAnchorClick);
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);

  return null;
}
