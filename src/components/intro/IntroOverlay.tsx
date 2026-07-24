"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { introState } from "@/lib/introState";

gsap.registerPlugin(useGSAP, ScrambleTextPlugin);

const STEPS = [
  "initializing void",
  "seeding entropy",
  "generating terrain",
  "binding physics",
  "spawning entities",
  "calibrating light",
  "world ready",
];

const SCRAMBLE_CHARS = "▓▒░<>/\\|=+*·";

export default function IntroOverlay() {
  const rootRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const [hidden, setHidden] = useState(false);

  const skip = () => {
    timelineRef.current?.timeScale(6);
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter") skip();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useGSAP(() => {
    const root = rootRef.current;
    if (!root) return;

    document.body.style.overflow = "hidden";
    window.scrollTo(0, 0);

    const stepEl = root.querySelector("[data-step]") as HTMLElement;
    const indexEl = root.querySelector("[data-index]") as HTMLElement;
    const textBox = root.querySelector("[data-textbox]") as HTMLElement;
    const glow = root.querySelector("[data-glow]");

    const finish = () => {
      document.body.style.overflow = "";
      introState.finish();
    };

    const revealHero = (instant: boolean) => {
      if (instant) {
        gsap.set("[data-hero]", { autoAlpha: 1 });
        return;
      }
      gsap.fromTo(
        "[data-hero]",
        { autoAlpha: 0, y: 28 },
        { autoAlpha: 1, y: 0, duration: 1, stagger: 0.12, ease: "power3.out" }
      );
    };

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const seen =
      process.env.NODE_ENV === "production" &&
      sessionStorage.getItem("introSeen") === "1";

    if (reduced || seen) {
      finish();
      revealHero(true);
      gsap.to(root, {
        autoAlpha: 0,
        duration: reduced ? 0 : 0.4,
        onComplete: () => setHidden(true),
      });
      return;
    }

    gsap.set(glow, { autoAlpha: 0, scale: 0.8 });

    const tl = gsap.timeline({ defaults: { ease: "none" } });
    timelineRef.current = tl;

    STEPS.forEach((step, index) => {
      const label = `step${index}`;
      tl.addLabel(label);
      tl.add(() => {
        indexEl.textContent = `${String(index + 1).padStart(2, "0")} / ${String(
          STEPS.length
        ).padStart(2, "0")}`;
      }, label);
      tl.to(
        stepEl,
        {
          duration: 0.4,
          scrambleText: { text: step, chars: SCRAMBLE_CHARS, speed: 0.6 },
        },
        label
      );
      tl.to(
        introState,
        {
          progress: (index + 1) / STEPS.length,
          duration: 0.75,
          ease: "power1.inOut",
        },
        label
      );
      tl.to({}, { duration: 0.2 });
    });

    tl.to(glow, { autoAlpha: 0.9, scale: 1.15, duration: 0.5, ease: "power2.out" });
    tl.to(glow, { autoAlpha: 0, scale: 1.7, duration: 0.8, ease: "power2.in" }, ">-0.05");
    tl.to(textBox, { autoAlpha: 0, duration: 0.4 }, "<");
    tl.add(() => {
      sessionStorage.setItem("introSeen", "1");
      finish();
      revealHero(false);
    }, "<+0.2");
    tl.to(root, { autoAlpha: 0, duration: 0.5 });
    tl.add(() => setHidden(true));

    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  if (hidden) return null;

  return (
    <div
      ref={rootRef}
      className="pointer-events-none fixed inset-0 z-50 flex items-end justify-center pb-[12vh]"
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, rgba(10, 6, 18, 0.85) 0%, transparent 35%)",
        }}
      />
      <div
        data-glow
        className="absolute top-1/2 left-1/2 h-[60vmin] w-[60vmin] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(161, 107, 255, 0.35) 0%, rgba(226, 79, 216, 0.12) 45%, transparent 70%)",
        }}
      />
      <div data-textbox className="relative flex flex-col items-center gap-4">
        <p data-index className="font-mono text-xs tracking-widest text-slate">
          00 / 07
        </p>
        <p
          data-step
          className="min-h-[1.5em] font-mono text-base tracking-[0.25em] text-signal uppercase sm:text-lg"
        />
      </div>
      <button
        type="button"
        onClick={skip}
        className="pointer-events-auto absolute bottom-8 left-8 cursor-pointer font-mono text-xs text-slate/60 transition-colors hover:text-slate"
      >
        Skip ↵
      </button>
    </div>
  );
}
