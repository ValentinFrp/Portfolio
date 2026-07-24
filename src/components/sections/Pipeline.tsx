"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { pipeline } from "@/content/site";
import {
  prefersReducedMotion,
  revealEyebrow,
  revealHeading,
} from "@/lib/scrollFx";

gsap.registerPlugin(useGSAP);

const STAIR_OFFSETS = ["lg:mt-0", "lg:mt-16", "lg:mt-32"];

export default function Pipeline() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP((_, contextSafe) => {
    const section = sectionRef.current;
    if (!section || prefersReducedMotion() || !contextSafe) return;

    document.fonts.ready.then(
      contextSafe(() => {
        revealEyebrow(section.querySelector("[data-eyebrow]"));
        revealHeading(section.querySelector("[data-heading]"));

        const cards = gsap.utils.toArray<HTMLElement>("[data-card]", section);
        gsap.set(cards, { transformPerspective: 900 });

        const mm = gsap.matchMedia();

        mm.add("(min-width: 1024px)", () => {
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: section.querySelector("[data-cards]"),
              start: "top 20%",
              end: "+=1600",
              scrub: 1,
              pin: section,
              anticipatePin: 1,
            },
          });
          cards.forEach((card, index) => {
            tl.fromTo(
              card,
              {
                autoAlpha: 0,
                y: 320,
                z: -260,
                rotationX: -58,
                rotationY: index % 2 ? 22 : -22,
                scale: 0.85,
              },
              {
                autoAlpha: 1,
                y: 0,
                z: 0,
                rotationX: 0,
                rotationY: 0,
                scale: 1,
                duration: 1,
                ease: "power2.out",
              },
              index * 0.85
            );
            tl.from(
              card.querySelectorAll("[data-chip]"),
              {
                autoAlpha: 0,
                y: 16,
                scale: 0.85,
                stagger: 0.06,
                duration: 0.3,
                ease: "back.out(1.7)",
              },
              index * 0.85 + 0.55
            );
          });
        });

        mm.add("(max-width: 1023px)", () => {
          cards.forEach((card) => {
            gsap.fromTo(
              card,
              { autoAlpha: 0, y: 160, rotationX: -45, scale: 0.9 },
              {
                autoAlpha: 1,
                y: 0,
                rotationX: 0,
                scale: 1,
                ease: "none",
                scrollTrigger: {
                  trigger: card,
                  start: "top 96%",
                  end: "top 55%",
                  scrub: 1,
                },
              }
            );
          });
        });
      })
    );
  }, []);

  return (
    <section ref={sectionRef} className="mx-auto max-w-6xl px-6 py-32 sm:py-44">
      <p
        data-eyebrow
        className="font-mono text-xs tracking-widest text-signal uppercase"
      >
        sector 01 · capabilities
      </p>
      <h2
        data-heading
        className="mt-4 font-display text-4xl font-medium tracking-tight sm:text-6xl"
      >
        What I do
      </h2>
      <div
        data-cards
        className="mt-16 grid gap-6 sm:mt-24 lg:grid-cols-3"
        style={{ perspective: "1200px" }}
      >
        {pipeline.map((stage, index) => (
          <article
            key={stage.title}
            data-card
            className={`rounded-2xl border border-line bg-raise/50 p-8 backdrop-blur-sm ${STAIR_OFFSETS[index]}`}
          >
            <p className="font-mono text-xs tracking-widest text-signal">
              {stage.label}
            </p>
            <h3 className="mt-5 font-display text-2xl font-medium tracking-tight sm:text-3xl">
              {stage.title}
            </h3>
            <p className="mt-4 text-slate">{stage.description}</p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {stage.skills.map((skill) => (
                <li
                  key={skill}
                  data-chip
                  className="rounded-full border border-line px-3 py-1 font-mono text-xs text-slate"
                >
                  {skill}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
