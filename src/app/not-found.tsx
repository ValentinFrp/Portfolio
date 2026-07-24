import Link from "next/link";

const STARS = [
  { top: "12%", left: "18%", size: 2, opacity: 0.5 },
  { top: "22%", left: "78%", size: 3, opacity: 0.7 },
  { top: "35%", left: "8%", size: 2, opacity: 0.4 },
  { top: "15%", left: "55%", size: 2, opacity: 0.6 },
  { top: "68%", left: "85%", size: 2, opacity: 0.5 },
  { top: "78%", left: "25%", size: 3, opacity: 0.6 },
  { top: "85%", left: "60%", size: 2, opacity: 0.4 },
  { top: "45%", left: "92%", size: 2, opacity: 0.5 },
  { top: "58%", left: "12%", size: 2, opacity: 0.6 },
];

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center gap-6 overflow-hidden px-6 text-center">
      {STARS.map((star, index) => (
        <span
          key={index}
          aria-hidden
          className="absolute rounded-full bg-fog"
          style={{
            top: star.top,
            left: star.left,
            width: star.size,
            height: star.size,
            opacity: star.opacity,
          }}
        />
      ))}
      <p className="font-mono text-xs tracking-widest text-signal uppercase">
        error 404 · signal lost
      </p>
      <h1 className="font-display text-5xl font-medium tracking-tight sm:text-8xl">
        Lost in the void
      </h1>
      <p className="max-w-md text-slate">
        This coordinate does not exist in the system. The world you are looking
        for was never generated.
      </p>
      <Link
        href="/"
        className="mt-4 rounded-full border border-signal/40 px-6 py-3 font-mono text-xs tracking-widest text-signal transition-colors hover:bg-signal/10"
      >
        return to the world
      </Link>
    </main>
  );
}
