const NAV = [
  { label: "Capabilities", href: "#capabilities" },
  { label: "Projects", href: "#work" },
  { label: "Contact", href: "#contact" },
];

export default function Header() {
  return (
    <header
      data-hero
      className="fixed top-0 right-0 left-0 z-40 opacity-0"
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-ink/90 to-transparent"
        aria-hidden
      />
      <div className="relative flex items-center justify-between px-5 py-4 sm:px-8">
        <a href="#top" className="flex items-center gap-2.5">
          <svg width="22" height="22" viewBox="0 0 64 64" aria-hidden>
            <defs>
              <radialGradient id="header-planet" cx="0.35" cy="0.3" r="1">
                <stop offset="0%" stopColor="#b98aff" />
                <stop offset="55%" stopColor="#a16bff" />
                <stop offset="100%" stopColor="#5b2fae" />
              </radialGradient>
            </defs>
            <circle cx="32" cy="32" r="14" fill="url(#header-planet)" />
            <ellipse
              cx="32"
              cy="32"
              rx="26"
              ry="8"
              fill="none"
              stroke="#e24fd8"
              strokeWidth="3"
              transform="rotate(-18 32 32)"
            />
          </svg>
          <span className="font-mono text-xs tracking-widest text-fog">
            Valentin<span className="text-signal">.</span>Frappart
          </span>
        </a>
        <nav className="flex items-center gap-1 rounded-full border border-line bg-raise/50 p-1 backdrop-blur-md">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-full px-3.5 py-1.5 font-mono text-xs tracking-widest text-slate transition-colors hover:bg-signal/10 hover:text-fog sm:px-4"
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
