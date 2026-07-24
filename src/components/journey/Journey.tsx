"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import CapabilityCards from "@/components/content/CapabilityCards";
import ContactBlock from "@/components/content/ContactBlock";
import ProjectCard from "@/components/content/ProjectCard";
import Hero from "@/components/sections/Hero";
import { projects } from "@/content/site";
import { journeyState } from "@/lib/journey";

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

function subscribeStatic(callback: () => void) {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  const mobile = window.matchMedia("(max-width: 1023px)");
  reduced.addEventListener("change", callback);
  mobile.addEventListener("change", callback);
  return () => {
    reduced.removeEventListener("change", callback);
    mobile.removeEventListener("change", callback);
  };
}

function getStatic() {
  return (
    window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
    window.matchMedia("(max-width: 1023px)").matches
  );
}

export default function Journey() {
  const isStatic = useSyncExternalStore(subscribeStatic, getStatic, () => false);

  useEffect(() => {
    journeyState.active = !isStatic;
    return () => {
      journeyState.active = true;
    };
  }, [isStatic]);

  if (isStatic) {
    return (
      <main>
        <Hero />
        <section className="mx-auto max-w-6xl px-6 py-28">
          <CapabilityCards />
        </section>
        <section id="work" className="mx-auto max-w-6xl px-6 py-28">
          <p className="font-mono text-xs tracking-widest text-signal uppercase">
            sector 02 · selected work
          </p>
          <h2 className="mt-4 font-display text-4xl font-medium tracking-tight sm:text-5xl">
            Projects
          </h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-2">
            {projects.map((project) => (
              <ProjectCard key={project.title} project={project} />
            ))}
          </div>
        </section>
        <section id="contact" className="mx-auto max-w-5xl px-6 py-28">
          <ContactBlock />
        </section>
      </main>
    );
  }

  return <JourneyExperience />;
}

function JourneyExperience() {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    (_, contextSafe) => {
      const root = rootRef.current;
      if (!root || !contextSafe) return;

      document.fonts.ready.then(
        contextSafe(() => {
          const spacer = root.querySelector("[data-spacer]");
          const heroPanel = root.querySelector("[data-panel='hero']");
          const capsPanel = root.querySelector("[data-panel='caps']");
          const p1Panel = root.querySelector("[data-panel='p1']");
          const p2Panel = root.querySelector("[data-panel='p2']");
          const contactPanel = root.querySelector("[data-panel='contact']");
          if (!spacer || !capsPanel || !contactPanel) return;

          const cards = gsap.utils.toArray<HTMLElement>("[data-card]", capsPanel);
          gsap.set(cards, { transformPerspective: 900 });
          gsap.set([capsPanel, p1Panel, p2Panel, contactPanel], { autoAlpha: 0 });

          const capsHeading = capsPanel.querySelector("[data-heading]");
          const capsSplit = capsHeading
            ? SplitText.create(capsHeading, { type: "chars", mask: "chars" })
            : null;
          const contactHeading = contactPanel.querySelector("[data-heading]");
          const contactSplit = contactHeading
            ? SplitText.create(contactHeading, { type: "chars", mask: "chars" })
            : null;

          const tl = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: spacer,
              start: "top top",
              end: "bottom bottom",
              scrub: 1,
            },
          });

          tl.to({}, { duration: 10 }, 0);

          tl.to(
            heroPanel,
            { autoAlpha: 0, y: -110, scale: 0.92, duration: 0.9, ease: "power1.in" },
            0.2
          );

          tl.fromTo(capsPanel, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.35 }, 2.0);
          if (capsSplit) {
            tl.from(
              capsSplit.chars,
              { yPercent: 115, stagger: 0.02, duration: 0.4 },
              2.05
            );
          }
          cards.forEach((card, index) => {
            tl.fromTo(
              card,
              {
                autoAlpha: 0,
                y: 260,
                z: -320,
                rotationX: -58,
                rotationY: index % 2 ? 24 : -24,
                scale: 0.82,
              },
              {
                autoAlpha: 1,
                y: 0,
                z: 0,
                rotationX: 0,
                rotationY: 0,
                scale: 1,
                duration: 0.7,
                ease: "power2.out",
              },
              2.15 + index * 0.55
            );
            tl.from(
              card.querySelectorAll("[data-chip]"),
              {
                autoAlpha: 0,
                y: 14,
                scale: 0.85,
                stagger: 0.04,
                duration: 0.25,
                ease: "back.out(1.7)",
              },
              2.5 + index * 0.55
            );
          });
          tl.to(
            capsPanel,
            { autoAlpha: 0, scale: 0.9, y: -70, duration: 0.5, ease: "power1.in" },
            4.4
          );

          tl.fromTo(
            p1Panel,
            { autoAlpha: 0, x: 160, rotationY: -16, transformPerspective: 900 },
            { autoAlpha: 1, x: 0, rotationY: 0, duration: 0.6, ease: "power2.out" },
            5.3
          );
          tl.to(
            p1Panel,
            { autoAlpha: 0, x: -140, duration: 0.5, ease: "power1.in" },
            6.7
          );

          tl.fromTo(
            p2Panel,
            { autoAlpha: 0, x: -160, rotationY: 16, transformPerspective: 900 },
            { autoAlpha: 1, x: 0, rotationY: 0, duration: 0.6, ease: "power2.out" },
            7.4
          );
          tl.to(
            p2Panel,
            { autoAlpha: 0, x: 140, duration: 0.5, ease: "power1.in" },
            8.55
          );

          tl.fromTo(
            contactPanel,
            { autoAlpha: 0 },
            { autoAlpha: 1, duration: 0.4 },
            9.15
          );
          if (contactSplit) {
            tl.from(
              contactSplit.chars,
              { yPercent: 115, stagger: 0.03, duration: 0.4 },
              9.2
            );
          }
          tl.from(
            contactPanel.querySelectorAll("[data-item]"),
            { autoAlpha: 0, y: 40, stagger: 0.08, duration: 0.35 },
            9.35
          );
        })
      );
    },
    []
  );

  return (
    <div ref={rootRef}>
      <div className="pointer-events-none fixed inset-0 z-10">
        <div data-panel="hero" className="absolute inset-0">
          <Hero />
        </div>
        <div
          data-panel="caps"
          className="absolute inset-0 flex items-center justify-center px-6"
        >
          <div className="w-full max-w-6xl">
            <CapabilityCards />
          </div>
        </div>
        <div
          data-panel="p1"
          className="absolute inset-0 flex items-center justify-end px-[8vw]"
        >
          <div className="pointer-events-auto">
            <ProjectCard project={projects[0]} eyebrow="sector 02 · project 01" />
          </div>
        </div>
        <div
          data-panel="p2"
          className="absolute inset-0 flex items-center justify-start px-[8vw]"
        >
          <div className="pointer-events-auto">
            <ProjectCard project={projects[1]} eyebrow="sector 02 · project 02" />
          </div>
        </div>
        <div
          data-panel="contact"
          className="absolute inset-0 flex items-center justify-center px-6"
        >
          <div className="pointer-events-auto">
            <ContactBlock />
          </div>
        </div>
      </div>
      <div data-spacer className="relative h-[800vh]">
        <div id="work" className="absolute top-[52%]" />
        <div id="contact" className="absolute top-[88%]" />
      </div>
    </div>
  );
}
