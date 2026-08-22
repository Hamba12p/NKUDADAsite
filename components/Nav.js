"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Nav({ nav, meta }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const logoSrc = pathname === "/schools" ? "/Logo2.png" : "/Logo.jpeg";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <nav className={`site-nav${scrolled ? " scrolled" : ""}`}>
      <Link href="/" className="nav-logo">
        <div className="nav-logo-mark">
          <Image src={logoSrc} alt={`${meta.siteName} logo`} width={40} height={40} priority />
        </div>
        <div className="nav-logo-text">
          {meta.siteName}
          <span>{meta.tagline}</span>
        </div>
      </Link>
      <div className={`nav-links${open ? " open" : ""}`} id="navLinks">
        {nav.links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={pathname === link.href ? "active" : ""}
          >
            {link.label}
          </Link>
        ))}
        <Link href={nav.cta.href} className="nav-cta">
          {nav.cta.label}
        </Link>
      </div>
      <button
        className="hamburger"
        aria-label="Menu"
        onClick={() => setOpen((v) => !v)}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
    </nav>
  );
}
