"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  { href: "/", label: "Accueil" },
  { href: "/inscription", label: "Inscription" },
  { href: "/programme", label: "Programme" },
  { href: "/resultats", label: "Résultats" },
];

export default function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header style={{ backgroundColor: "#0a0a0a", borderBottom: "2px solid #e8520a" }}>
      <div className="basque-stripe" />
      <nav
        style={{ maxWidth: 1100, margin: "0 auto", padding: "0 1rem" }}
        className="flex items-center justify-between h-16"
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 no-underline">
          <span style={{ color: "#e8520a", fontSize: "1.5rem", fontWeight: 900 }}>
            ✦
          </span>
          <span
            style={{
              color: "white",
              fontWeight: 800,
              fontSize: "1.1rem",
              letterSpacing: "0.04em",
              fontFamily: "Georgia, serif",
            }}
          >
            BARDOS RUGBY 5
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              style={{
                color: pathname === href ? "#e8520a" : "#ccc",
                fontWeight: pathname === href ? 700 : 400,
                textDecoration: "none",
                fontFamily: "Georgia, serif",
                borderBottom:
                  pathname === href ? "2px solid #e8520a" : "2px solid transparent",
                paddingBottom: "2px",
                transition: "all 0.2s",
              }}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden"
          style={{ color: "#e8520a", background: "none", border: "none", fontSize: "1.6rem", cursor: "pointer" }}
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? "✕" : "☰"}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div
          style={{ backgroundColor: "#0a0a0a", borderTop: "1px solid #333" }}
          className="md:hidden"
        >
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              style={{
                display: "block",
                padding: "0.75rem 1.5rem",
                color: pathname === href ? "#e8520a" : "#ccc",
                fontWeight: pathname === href ? 700 : 400,
                textDecoration: "none",
                fontFamily: "Georgia, serif",
                borderLeft:
                  pathname === href ? "3px solid #e8520a" : "3px solid transparent",
              }}
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
