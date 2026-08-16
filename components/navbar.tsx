"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Menu, X, LogIn, Sparkles } from "lucide-react";
import SearchModal from "./search-modal";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Home" },
  { href: "/tools", label: "Tools" },
  { href: "/categories", label: "Categories" },
  { href: "/tools?featured=true", label: "Featured" },
  { href: "/about", label: "About" }
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 24);
    }
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50 flex justify-center px-4 pt-4">
      <motion.div
        animate={{
          width: scrolled ? "min(880px, 92vw)" : "min(1200px, 96vw)",
          paddingTop: scrolled ? 8 : 14,
          paddingBottom: scrolled ? 8 : 14
        }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className={cn(
          "glass flex items-center justify-between rounded-2xl px-5 shadow-lg",
          scrolled && "shadow-glow"
        )}
      >
        <Link href="/" className="flex items-center gap-2 font-display text-lg font-bold tracking-tight">
          <Sparkles size={20} className="text-primary" />
          <span className="text-gradient">XYPHORIA</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-text-muted transition hover:text-text"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <SearchModal />
          <Link
            href="/login"
            className="hidden items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary transition hover:bg-primary/20 sm:flex"
          >
            <LogIn size={14} />
            Owner Login
          </Link>
          <button
            className="md:hidden"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </motion.div>

      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass absolute top-20 flex w-[92vw] max-w-sm flex-col gap-1 rounded-2xl p-3 md:hidden"
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="rounded-lg px-3 py-2 text-sm text-text-muted transition hover:bg-surface-hover hover:text-text"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/login"
            onClick={() => setMobileOpen(false)}
            className="rounded-lg bg-primary/10 px-3 py-2 text-sm font-medium text-primary"
          >
            Owner Login
          </Link>
        </motion.div>
      )}
    </header>
  );
}
