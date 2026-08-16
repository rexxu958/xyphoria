"use client";

import { motion } from "framer-motion";
import { Sparkles, Rocket, Code2, Users } from "lucide-react";

const points = [
  {
    icon: Rocket,
    title: "Built to publish",
    body: "XYPHORIA exists to give every tool, bot, and script a proper home — versioned, documented, and ready to ship."
  },
  {
    icon: Code2,
    title: "Source-backed",
    body: "Every file lives in GitHub, so nothing is ever a black box. What you download is exactly what's in the repository."
  },
  {
    icon: Users,
    title: "For builders",
    body: "Whether it's a website template or a full application, XYPHORIA is a professional catalog for people who make things."
  }
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-20">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-2 text-sm text-primary"
      >
        <Sparkles size={16} />
        About XYPHORIA
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mt-3 font-display text-4xl font-bold"
      >
        A platform for tools, code, and everything you build.
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-4 text-text-muted"
      >
        XYPHORIA is a publication hub for tools, source code, projects, and digital resources
        created and released by its owner. Every upload is organized, versioned, and served
        directly from GitHub, so the platform stays fast, transparent, and honest about what it
        delivers.
      </motion.p>

      <div className="mt-12 space-y-6">
        {points.map((point, index) => (
          <motion.div
            key={point.title}
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="glass flex gap-4 rounded-2xl p-6"
          >
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <point.icon size={18} />
            </div>
            <div>
              <p className="font-display font-semibold">{point.title}</p>
              <p className="mt-1 text-sm text-text-muted">{point.body}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
