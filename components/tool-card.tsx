"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Download, Eye, Star, Box } from "lucide-react";
import type { Tool } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export default function ToolCard({ tool }: { tool: Tool }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="glass group relative flex flex-col overflow-hidden rounded-2xl p-5 transition-shadow hover:shadow-glow"
    >
      {tool.featured && (
        <div className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-primary/15 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-primary">
          <Star size={10} fill="currentColor" />
          Featured
        </div>
      )}

      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Box size={22} />
      </div>

      <h3 className="mt-4 font-display text-lg font-semibold">{tool.name}</h3>
      <p className="mt-1 text-xs uppercase tracking-wide text-secondary">{tool.category}</p>
      <p className="mt-2 line-clamp-2 text-sm text-text-muted">{tool.description}</p>

      <div className="mt-4 flex items-center justify-between text-xs text-text-muted">
        <span>v{tool.version}</span>
        <span className="flex items-center gap-1">
          <Download size={12} />
          {tool.downloads}
        </span>
        <span>{formatDate(tool.updatedAt)}</span>
      </div>

      <div className="mt-5 flex gap-2">
        <Link
          href={`/tools/${tool.slug}`}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-surface-border py-2 text-sm transition hover:border-primary/50 hover:text-primary"
        >
          <Eye size={14} />
          View
        </Link>
        <a
          href={`/api/download/${tool.slug}`}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-primary/15 py-2 text-sm font-medium text-primary transition hover:bg-primary/25"
        >
          <Download size={14} />
          Download
        </a>
      </div>
    </motion.div>
  );
}
