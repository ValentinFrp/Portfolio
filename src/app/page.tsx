import ParticleField from "@/components/scene/ParticleField";
import { site } from "@/content/site";

export default function Home() {
  return (
    <>
      <ParticleField />
      <main>
        <section className="flex min-h-screen flex-col items-center justify-center gap-6 px-6">
          <p className="font-mono text-sm text-signal">
            {site.availability.toLowerCase()}
          </p>
          <h1 className="font-display text-center text-5xl font-medium tracking-tight sm:text-7xl">
            {site.name}
          </h1>
          <p className="max-w-md text-center text-slate">{site.tagline}</p>
        </section>
        <div className="h-[200vh]" />
      </main>
    </>
  );
}
