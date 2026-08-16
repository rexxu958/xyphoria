import Link from "next/link";
import dynamic from "next/dynamic";
import { ArrowRight, Zap, Shield, Layers } from "lucide-react";
import { listTools } from "@/lib/services/tools";
import { listCategories } from "@/lib/services/categories";
import ToolCard from "@/components/tool-card";
import CategoryCard from "@/components/category-card";

const Hero3D = dynamic(() => import("@/components/hero-3d"), { ssr: false });

export default async function HomePage() {
  const [tools, categories] = await Promise.all([listTools(), listCategories()]);
  const publicTools = tools.filter((tool) => tool.status === "PUBLIC");
  const featured = publicTools.filter((tool) => tool.featured).slice(0, 6);
  const recent = publicTools.slice(0, 6);
  const activeCategories = categories.filter((category) => category.active).slice(0, 6);

  return (
    <div>
      <section className="relative mx-auto flex max-w-6xl flex-col items-center px-6 pb-16 pt-16 text-center md:pt-24">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-grid-fade" />

        <div className="relative h-64 w-64 md:h-80 md:w-80">
          <Hero3D />
        </div>

        <h1 className="mt-6 font-display text-5xl font-bold tracking-tight md:text-7xl">
          <span className="text-gradient">XYPHORIA</span>
        </h1>
        <p className="mt-4 font-display text-lg text-text-muted md:text-xl">
          Tools. Code. Innovation.
        </p>
        <p className="mt-4 max-w-xl text-sm text-text-muted md:text-base">
          A premium hub for professional tools, bots, scripts, and source code — published,
          versioned, and delivered straight from GitHub.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/tools"
            className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow-glow transition hover:bg-primary-dark"
          >
            Browse Tools
            <ArrowRight size={16} />
          </Link>
          <Link
            href="/categories"
            className="flex items-center gap-2 rounded-xl border border-surface-border px-6 py-3 text-sm font-semibold transition hover:border-primary/50 hover:text-primary"
          >
            Explore Categories
          </Link>
        </div>

        <div className="mt-16 grid w-full grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            { icon: Zap, label: "Fast Delivery", desc: "Raw GitHub CDN for instant downloads" },
            { icon: Shield, label: "Secure by Design", desc: "Server-side auth, no exposed secrets" },
            { icon: Layers, label: "Organized", desc: "Dynamic categories, zero hardcoding" }
          ].map((item) => (
            <div key={item.label} className="glass rounded-2xl p-5 text-left">
              <item.icon size={20} className="text-primary" />
              <p className="mt-3 font-display font-semibold">{item.label}</p>
              <p className="mt-1 text-xs text-text-muted">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {featured.length > 0 && (
        <section className="mx-auto max-w-6xl px-6 py-12">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-display text-2xl font-bold">Featured Tools</h2>
            <Link href="/tools?featured=true" className="text-sm text-primary hover:underline">
              View all
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </section>
      )}

      {activeCategories.length > 0 && (
        <section className="mx-auto max-w-6xl px-6 py-12">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-display text-2xl font-bold">Categories</h2>
            <Link href="/categories" className="text-sm text-primary hover:underline">
              View all
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {activeCategories.map((category) => (
              <CategoryCard
                key={category.id}
                slug={category.slug}
                name={category.name}
                description={category.description}
                toolCount={publicTools.filter((tool) => tool.category === category.slug).length}
                gradientFrom={category.gradientFrom}
                gradientTo={category.gradientTo}
              />
            ))}
          </div>
        </section>
      )}

      {recent.length > 0 && (
        <section className="mx-auto max-w-6xl px-6 py-12">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-display text-2xl font-bold">Recently Updated</h2>
            <Link href="/tools" className="text-sm text-primary hover:underline">
              View all
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {recent.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </section>
      )}

      {publicTools.length === 0 && (
        <section className="mx-auto max-w-2xl px-6 py-24 text-center">
          <p className="text-text-muted">
            No tools published yet. Log in to the owner dashboard to publish your first tool.
          </p>
        </section>
      )}
    </div>
  );
}
