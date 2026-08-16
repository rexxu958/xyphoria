"use client";

import { useEffect, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, X, Download } from "lucide-react";
import Link from "next/link";
import type { Tool } from "@/lib/types";

export default function SearchModal() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    function handler(event: KeyboardEvent) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((prev) => !prev);
      }
      if (event.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const runSearch = useCallback(async (value: string) => {
    if (!value.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(value)}`);
      const data = await res.json();
      setResults(data.tools ?? []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => runSearch(query), 250);
    return () => clearTimeout(timeout);
  }, [query, runSearch]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-lg border border-surface-border bg-surface/60 px-3 py-1.5 text-sm text-text-muted transition hover:border-primary/50 hover:text-text"
        aria-label="Open search"
      >
        <Search size={16} />
        <span className="hidden sm:inline">Search</span>
        <kbd className="hidden rounded border border-surface-border bg-background px-1.5 py-0.5 text-xs sm:inline">
          Ctrl K
        </kbd>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-start justify-center bg-black/70 px-4 pt-24 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              className="glass w-full max-w-xl rounded-2xl p-4 shadow-glow"
              initial={{ opacity: 0, y: -16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -16, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-center gap-3 border-b border-surface-border pb-3">
                <Search size={18} className="text-text-muted" />
                <input
                  autoFocus
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search tools, categories, tags..."
                  className="w-full bg-transparent text-sm outline-none placeholder:text-text-muted"
                />
                <button onClick={() => setOpen(false)} aria-label="Close search">
                  <X size={18} className="text-text-muted" />
                </button>
              </div>

              <div className="mt-3 max-h-80 overflow-y-auto">
                {loading && <p className="py-6 text-center text-sm text-text-muted">Searching...</p>}
                {!loading && query && results.length === 0 && (
                  <p className="py-6 text-center text-sm text-text-muted">No tools found.</p>
                )}
                {results.map((tool) => (
                  <Link
                    key={tool.id}
                    href={`/tools/${tool.slug}`}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between rounded-lg px-3 py-2.5 transition hover:bg-surface-hover"
                  >
                    <div>
                      <p className="text-sm font-medium">{tool.name}</p>
                      <p className="text-xs text-text-muted">{tool.category}</p>
                    </div>
                    <span className="flex items-center gap-1 text-xs text-text-muted">
                      <Download size={12} />
                      {tool.downloads}
                    </span>
                  </Link>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
