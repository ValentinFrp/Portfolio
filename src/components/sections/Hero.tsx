import { site } from "@/content/site";

export default function Hero() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <p
        data-hero
        className="font-mono text-xs tracking-[0.3em] text-signal uppercase opacity-0"
      >
        {site.role}
      </p>
      <h1
        data-hero
        className="mt-6 font-display text-6xl font-medium tracking-tight opacity-0 sm:text-8xl md:text-9xl"
      >
        {site.name.split(" ")[0]}
        <span className="block text-slate/60">{site.name.split(" ")[1]}</span>
      </h1>
      <p data-hero className="mt-8 max-w-lg text-slate opacity-0">
        {site.tagline}
      </p>
      <div
        data-hero
        className="pointer-events-auto mt-10 flex gap-6 font-mono text-xs opacity-0"
      >
        <a
          href="#work"
          className="rounded-full border border-signal/40 px-5 py-2.5 tracking-widest text-signal transition-colors hover:bg-signal/10"
        >
          See projects
        </a>
      </div>
      <div
        data-hero
        className="absolute bottom-10 flex flex-col items-center gap-3 opacity-0"
      >
        <span className="font-mono text-xs text-slate">Scroll to explore</span>
        <span className="h-10 w-px animate-pulse bg-gradient-to-b from-signal to-transparent" />
      </div>
    </section>
  );
}
