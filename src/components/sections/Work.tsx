"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { projects } from "@/content/site";
import {
  prefersReducedMotion,
  revealChips,
  revealEyebrow,
  revealHeading,
} from "@/lib/scrollFx";

gsap.registerPlugin(useGSAP);

export default function Work() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP((_, contextSafe) => {
    const section = sectionRef.current;
    if (!section || prefersReducedMotion() || !contextSafe) return;

    document.fonts.ready.then(
      contextSafe(() => {
        revealEyebrow(section.querySelector("[data-eyebrow]"));
        revealHeading(section.querySelector("[data-heading]"));

        const rows = gsap.utils.toArray<HTMLElement>("[data-row]", section);
        rows.forEach((row, index) => {
          gsap.fromTo(
            row,
            {
              autoAlpha: 0,
              y: 120,
              x: index % 2 ? 70 : -70,
              rotationX: -38,
              transformPerspective: 900,
              transformOrigin: "center top",
            },
            {
              autoAlpha: 1,
              y: 0,
              x: 0,
              rotationX: 0,
              ease: "none",
              scrollTrigger: {
                trigger: row,
                start: "top 96%",
                end: "top 55%",
                scrub: 1,
              },
            }
          );
          gsap.from(row.querySelector("[data-arrow]"), {
            scale: 0,
            rotate: -45,
            duration: 0.5,
            ease: "back.out(2)",
            scrollTrigger: { trigger: row, start: "top 60%" },
          });
          revealChips(row, row);
        });
      })
    );
  }, []);

  return (
    <section
      ref={sectionRef}
      id="work"
      className="mx-auto max-w-6xl px-6 py-32 sm:py-44"
    >
      <p
        data-eyebrow
        className="font-mono text-xs tracking-widest text-signal uppercase"
      >
        sector 02 · selected work
      </p>
      <h2
        data-heading
        className="mt-4 font-display text-4xl font-medium tracking-tight sm:text-6xl"
      >
        Projects
      </h2>
      <div className="mt-16 flex flex-col sm:mt-24">
        {projects.map((project) => (
          <a
            key={project.title}
            data-row
            href={project.href}
            className="group grid gap-4 border-t border-line py-10 sm:grid-cols-[200px_1fr_auto] sm:gap-10"
          >
            <p className="font-mono text-xs tracking-widest text-slate">
              {project.year}
            </p>
            <div>
              <h3 className="font-display text-2xl font-medium tracking-tight transition-colors group-hover:text-signal sm:text-4xl">
                {project.title}
              </h3>
              <p className="mt-3 max-w-xl text-slate">{project.description}</p>
              <ul className="mt-5 flex flex-wrap gap-2">
                {project.stack.map((tech) => (
                  <li
                    key={tech}
                    data-chip
                    className="rounded-full border border-line px-3 py-1 font-mono text-xs text-slate"
                  >
                    {tech}
                  </li>
                ))}
              </ul>
            </div>
            <span
              data-arrow
              className="font-mono text-lg text-slate transition-all group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-signal"
            >
              ↗
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}
