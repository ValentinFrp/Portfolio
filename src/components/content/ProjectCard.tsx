import Image from "next/image";
import type { Project } from "@/content/site";

function CardBody({ project, eyebrow }: { project: Project; eyebrow?: string }) {
  return (
    <>
      {project.image ? (
        <div className="relative -mx-2 -mt-2 mb-2 aspect-video overflow-hidden rounded-xl border border-line">
          <Image
            src={project.image}
            alt={project.title}
            fill
            sizes="(max-width: 640px) 90vw, 448px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      ) : null}
      {eyebrow ? (
        <p className="font-mono text-xs tracking-widest text-signal uppercase">
          {eyebrow}
        </p>
      ) : null}
      <div className="mt-4 flex items-baseline justify-between gap-6">
        <h3 className="font-display text-2xl font-medium tracking-tight transition-colors group-hover:text-signal sm:text-3xl">
          {project.title}
        </h3>
        <span className="font-mono text-xs text-slate">{project.year}</span>
      </div>
      <p className="mt-4 text-sm text-slate">{project.description}</p>
      <ul className="mt-6 flex flex-wrap gap-2">
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
      {project.href ? (
        <span className="mt-6 inline-block font-mono text-sm text-slate transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-signal">
          visit ↗
        </span>
      ) : (
        <span className="mt-6 inline-block font-mono text-xs tracking-widest text-slate/70 uppercase">
          {project.note}
        </span>
      )}
    </>
  );
}

export default function ProjectCard({
  project,
  eyebrow,
}: {
  project: Project;
  eyebrow?: string;
}) {
  const className =
    "group block max-w-md rounded-2xl border border-line bg-raise/70 p-8 backdrop-blur-md transition-colors hover:border-signal/40";

  if (!project.href) {
    return (
      <div className={className}>
        <CardBody project={project} eyebrow={eyebrow} />
      </div>
    );
  }

  return (
    <a
      href={project.href}
      target="_blank"
      rel="noreferrer"
      className={className}
    >
      <CardBody project={project} eyebrow={eyebrow} />
    </a>
  );
}
