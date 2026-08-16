"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Folder, ArrowRight } from "lucide-react";

interface CategoryCardProps {
  slug: string;
  name: string;
  description: string;
  toolCount: number;
  gradientFrom: string;
  gradientTo: string;
}

export default function CategoryCard({
  slug,
  name,
  description,
  toolCount,
  gradientFrom,
  gradientTo
}: CategoryCardProps) {
  return (
    <Link href={`/categories/${slug}`}>
      <motion.div
        whileHover={{ y: -4 }}
        className="glass group relative overflow-hidden rounded-2xl p-6 transition-shadow hover:shadow-glow"
      >
        <div
          className="absolute -right-8 -top-8 h-32 w-32 rounded-full opacity-20 blur-2xl transition-opacity group-hover:opacity-40"
          style={{ background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})` }}
        />

        <div
          className="flex h-12 w-12 items-center justify-center rounded-xl"
          style={{ background: `linear-gradient(135deg, ${gradientFrom}33, ${gradientTo}33)` }}
        >
          <Folder size={22} style={{ color: gradientFrom }} />
        </div>

        <h3 className="mt-4 font-display text-lg font-semibold">{name}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-text-muted">{description}</p>

        <div className="mt-5 flex items-center justify-between text-xs text-text-muted">
          <span>{toolCount} tools</span>
          <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
        </div>
      </motion.div>
    </Link>
  );
}
