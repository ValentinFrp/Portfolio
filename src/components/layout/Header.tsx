const NAV = [
  { label: "capabilities", href: "#capabilities" },
  { label: "projects", href: "#work" },
  { label: "contact", href: "#contact" },
];

export default function Header() {
  return (
    <header
      data-hero
      className="fixed top-0 right-0 left-0 z-40 flex items-center justify-between px-6 py-5 font-mono text-xs opacity-0 sm:px-10"
    >
      <span className="tracking-widest text-fog">valentin.frappart</span>
      <nav className="flex gap-5 sm:gap-8">
        {NAV.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="tracking-widest text-slate transition-colors hover:text-signal"
          >
            {item.label}
          </a>
        ))}
      </nav>
    </header>
  );
}
