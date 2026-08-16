import Link from "next/link";
import { Sparkles, Github } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-surface-border">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row">
          <div>
            <div className="flex items-center gap-2 font-display text-lg font-bold">
              <Sparkles size={18} className="text-primary" />
              <span className="text-gradient">XYPHORIA</span>
            </div>
            <p className="mt-2 max-w-xs text-sm text-text-muted">Tools, code and innovation.</p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-muted">
                Platform
              </p>
              <div className="flex flex-col gap-2 text-sm text-text-muted">
                <Link href="/" className="transition hover:text-text">
                  Home
                </Link>
                <Link href="/tools" className="transition hover:text-text">
                  Tools
                </Link>
                <Link href="/categories" className="transition hover:text-text">
                  Categories
                </Link>
              </div>
            </div>
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-muted">
                Resources
              </p>
              <div className="flex flex-col gap-2 text-sm text-text-muted">
                <Link href="/about" className="transition hover:text-text">
                  About
                </Link>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 transition hover:text-text"
                >
                  <Github size={14} />
                  GitHub
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-surface-border pt-6 text-xs text-text-muted">
          © {new Date().getFullYear()} XYPHORIA. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
