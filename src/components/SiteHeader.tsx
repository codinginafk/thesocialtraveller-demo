"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

const links = [
  { href: "/journeys", label: "Journeys" },
  { href: "/map", label: "Map" },
  { href: "/journal", label: "Journal" },
  { href: "/about", label: "About" },
];

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const showBg = scrolled || !isHome;
  const textColor = showBg ? "text-ink" : "text-cream";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        showBg ? "bg-cream/90 shadow-sm backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <div className="container-page flex items-center justify-between py-4">
        <Link href="/" className={`font-serif text-lg font-semibold ${textColor} transition-colors`}>
          TheSocialTraveller
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`text-sm transition-colors ${
                showBg ? "text-ink-soft hover:text-ink" : "text-cream/80 hover:text-cream"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className={`flex h-9 w-9 flex-col items-center justify-center gap-1.5 rounded-md md:hidden ${
            showBg ? "text-ink" : "text-cream"
          }`}
        >
          <span className="block h-px w-5 bg-current transition-all" />
          <span className="block h-px w-5 bg-current transition-all" />
        </button>
      </div>
      {open && (
        <nav className={`container-page flex flex-col gap-3 pb-6 pt-2 md:hidden ${showBg ? "" : "bg-bark/60 backdrop-blur-md"}`}>
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={`text-sm ${
                showBg ? "text-ink-soft hover:text-ink" : "text-cream/80 hover:text-cream"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
