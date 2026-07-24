import { site } from "@/content/site";

export default function ContactBlock() {
  return (
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
      <p data-item className="mt-20 font-mono text-xs text-slate/60">
        © {new Date().getFullYear()} {site.name} · {site.location}
      </p>
    </div>
  );
}
