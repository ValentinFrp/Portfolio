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
        <section id="capabilities" className="mx-auto max-w-6xl px-6 py-28">
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

const STATIONS = [
  { label: "Start", href: "#top" },
  { label: "Capabilities", href: "#capabilities" },
  { label: "Project 01", href: "#project-1" },
  { label: "Project 02", href: "#project-2" },
  { label: "Project 03", href: "#project-3" },
  { label: "Contact", href: "#contact" },
];

function stationIndex(time: number) {
  if (time < 1.6) return 0;
  if (time < 4.2) return 1;
  if (time < 5.85) return 2;
  if (time < 7.6) return 3;
  if (time < 9.0) return 4;
  return 5;
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
          const p3Panel = root.querySelector("[data-panel='p3']");
          const contactPanel = root.querySelector("[data-panel='contact']");
          if (!spacer || !capsPanel || !contactPanel) return;

          const cards = gsap.utils.toArray<HTMLElement>("[data-card]", capsPanel);
          gsap.set(cards, { transformPerspective: 900 });
          gsap.set([capsPanel, p1Panel, p2Panel, p3Panel, contactPanel], {
            autoAlpha: 0,
          });

          const capsHeading = capsPanel.querySelector("[data-heading]");
          const capsSplit = capsHeading
            ? SplitText.create(capsHeading, { type: "chars", mask: "chars" })
            : null;
          const contactHeading = contactPanel.querySelector("[data-heading]");
          const contactSplit = contactHeading
            ? SplitText.create(contactHeading, { type: "chars", mask: "chars" })
            : null;

          const navLinks = root.querySelectorAll("[data-station-link]");

          const tl = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: spacer,
              start: "top top",
              end: "bottom bottom",
              scrub: 1,
              onUpdate: (self) => {
                const active = stationIndex(self.progress * 10);
                navLinks.forEach((link, index) =>
                  link.classList.toggle("is-active", index === active)
                );
              },
            },
          });

          tl.to({}, { duration: 10 }, 0);

          tl.to(
            heroPanel,
            { autoAlpha: 0, y: -110, scale: 0.92, duration: 0.9, ease: "power1.in" },
            0.2
          );

          tl.fromTo(capsPanel, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 }, 2.1);
          if (capsSplit) {
            tl.from(
              capsSplit.chars,
              { yPercent: 115, stagger: 0.02, duration: 0.35 },
              2.15
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
                duration: 0.6,
                ease: "power2.out",
              },
              2.25 + index * 0.4
            );
            tl.from(
              card.querySelectorAll("[data-chip]"),
              {
                autoAlpha: 0,
                y: 14,
                scale: 0.85,
                stagger: 0.04,
                duration: 0.2,
                ease: "back.out(1.7)",
              },
              2.55 + index * 0.4
            );
          });
          tl.to(
            capsPanel,
            { autoAlpha: 0, scale: 0.9, y: -70, duration: 0.45, ease: "power1.in" },
            3.65
          );

          const stations = [
            { panel: p1Panel, at: 4.45, out: 5.45, from: 1 },
            { panel: p2Panel, at: 6.1, out: 7.1, from: -1 },
            { panel: p3Panel, at: 7.85, out: 8.75, from: 1 },
          ];
          stations.forEach(({ panel, at, out, from }) => {
            tl.fromTo(
              panel,
              {
                autoAlpha: 0,
                x: 160 * from,
                rotationY: -16 * from,
                transformPerspective: 900,
              },
              { autoAlpha: 1, x: 0, rotationY: 0, duration: 0.5, ease: "power2.out" },
              at
            );
            tl.to(
              panel,
              { autoAlpha: 0, x: -140 * from, duration: 0.4, ease: "power1.in" },
              out
            );
          });

          tl.fromTo(
            contactPanel,
            { autoAlpha: 0 },
            { autoAlpha: 1, duration: 0.35 },
            9.25
          );
          if (contactSplit) {
            tl.from(
              contactSplit.chars,
              { yPercent: 115, stagger: 0.03, duration: 0.35 },
              9.3
            );
          }
          tl.from(
            contactPanel.querySelectorAll("[data-item]"),
            { autoAlpha: 0, y: 40, stagger: 0.08, duration: 0.3 },
            9.4
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
          data-panel="p3"
          className="absolute inset-0 flex items-center justify-end px-[8vw]"
        >
          <div className="pointer-events-auto">
            <ProjectCard project={projects[2]} eyebrow="sector 02 · project 03" />
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
      <nav
        data-hero
        aria-label="Journey stations"
        className="fixed top-1/2 right-5 z-40 -translate-y-1/2 opacity-0 sm:right-8"
      >
        <div className="relative flex flex-col gap-6">
          <span className="absolute top-1 right-[3.5px] bottom-1 w-px bg-line" aria-hidden />
          {STATIONS.map((station, index) => (
            <a
              key={station.href}
              href={station.href}
              data-station-link
              className={`group relative flex items-center justify-end gap-3${index === 0 ? " is-active" : ""}`}
            >
              <span
                data-station-label
                className="font-mono text-[10px] tracking-widest text-slate uppercase opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              >
                {station.label}
              </span>
              <span
                data-station-dot
                className="h-2 w-2 rounded-full border border-slate/60 bg-ink transition-all duration-300"
              />
            </a>
          ))}
        </div>
      </nav>
      <div data-spacer className="relative h-[900vh]">
        <div id="top" className="absolute top-0" />
        <div id="capabilities" className="absolute top-[27%]" />
        <div id="work" className="absolute top-[44%]" />
        <div id="project-1" className="absolute top-[44%]" />
        <div id="project-2" className="absolute top-[59%]" />
        <div id="project-3" className="absolute top-[74%]" />
        <div id="contact" className="absolute top-[90%]" />
      </div>
    </div>
  );
}
