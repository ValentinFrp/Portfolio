import { pipeline } from "@/content/site";

const STAIR_OFFSETS = ["lg:mt-0", "lg:mt-10", "lg:mt-20"];

export default function CapabilityCards() {
  return (
    <div>
      <p
        data-eyebrow
        className="font-mono text-xs tracking-widest text-signal uppercase"
      >
        sector 01 · capabilities
      </p>
      <h2
        data-heading
        className="mt-4 font-display text-4xl font-medium tracking-tight sm:text-5xl"
      >
        What I do
      </h2>
      <div
        data-cards
        className="mt-10 grid gap-5 lg:grid-cols-3"
        style={{ perspective: "1200px" }}
      >
        {pipeline.map((stage, index) => (
          <article
            key={stage.title}
            data-card
            className={`rounded-2xl border border-line bg-raise/70 p-7 backdrop-blur-md ${STAIR_OFFSETS[index]}`}
          >
            <p className="font-mono text-xs tracking-widest text-signal">
              {stage.label}
            </p>
            <h3 className="mt-4 font-display text-xl font-medium tracking-tight sm:text-2xl">
              {stage.title}
            </h3>
            <p className="mt-3 text-sm text-slate">{stage.description}</p>
            <ul className="mt-5 flex flex-wrap gap-2">
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
    </div>
  );
}
