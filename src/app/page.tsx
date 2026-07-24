import IntroOverlay from "@/components/intro/IntroOverlay";
import ParticleField from "@/components/scene/ParticleField";
import { site } from "@/content/site";

export default function Home() {
  return (
    <>
      <IntroOverlay />
      <ParticleField />
      <main>
        <section className="relative flex min-h-screen flex-col items-center justify-center gap-6 px-6">
          <p data-hero className="font-mono text-sm text-signal opacity-0">
            {site.availability.toLowerCase()}
          </p>
          <h1
            data-hero
            className="font-display text-center text-5xl font-medium tracking-tight opacity-0 sm:text-7xl"
          >
            {site.name}
          </h1>
          <p data-hero className="max-w-md text-center text-slate opacity-0">
            {site.tagline}
          </p>
          <div
            data-hero
            className="absolute bottom-10 flex flex-col items-center gap-3 opacity-0"
          >
            <span className="font-mono text-xs text-slate">scroll to enter</span>
            <span className="h-10 w-px animate-pulse bg-gradient-to-b from-signal to-transparent" />
          </div>
        </section>
        <div className="h-[200vh]" />
      </main>
    </>
  );
}
