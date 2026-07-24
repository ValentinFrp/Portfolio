"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { site } from "@/content/site";
import {
  prefersReducedMotion,
  revealEyebrow,
  revealHeading,
} from "@/lib/scrollFx";

gsap.registerPlugin(useGSAP);

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP((_, contextSafe) => {
    const section = sectionRef.current;
    if (!section || prefersReducedMotion() || !contextSafe) return;

    document.fonts.ready.then(
      contextSafe(() => {
        revealEyebrow(section.querySelector("[data-eyebrow]"));
        revealHeading(section.querySelector("[data-heading]"));

        gsap.from(section.querySelectorAll("[data-item]"), {
          autoAlpha: 0,
          y: 40,
          stagger: 0.15,
          ease: "none",
          scrollTrigger: {
            trigger: section.querySelector("[data-heading]"),
            start: "top 88%",
            end: "top 40%",
            scrub: 1,
          },
        });
      })
    );
  }, []);

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="mx-auto max-w-5xl px-6 pt-32 pb-16 sm:pt-44"
    >
      <div className="flex flex-col items-center text-center">
        <p
          data-eyebrow
          className="font-mono text-xs tracking-widest text-signal uppercase"
        >
          sector 03 · contact
        </p>
        <h2
          data-heading
          className="mt-4 font-display text-5xl font-medium tracking-tight sm:text-7xl"
        >
          {site.contactTitle}
        </h2>
        <p data-item className="mt-6 max-w-md text-slate">
          {site.contactBlurb}
        </p>
        <a
          data-item
          href={`mailto:${site.email}`}
          className="mt-10 font-display text-xl font-medium tracking-tight text-fog underline decoration-signal/40 underline-offset-8 transition-colors hover:text-signal sm:text-3xl"
        >
          {site.email}
        </a>
        <ul data-item className="mt-12 flex gap-8 font-mono text-xs tracking-widest">
          {site.links.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="text-slate transition-colors hover:text-signal"
              >
                {link.label.toLowerCase()}
              </a>
            </li>
          ))}
        </ul>
      </div>
      <p className="mt-24 text-center font-mono text-xs text-slate/60">
        © {new Date().getFullYear()} {site.name} · {site.location}
      </p>
    </section>
  );
}
