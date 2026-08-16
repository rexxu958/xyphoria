"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import ToolCard from "@/components/tool-card";
import type { Tool, Category } from "@/lib/types";
import { SlidersHorizontal } from "lucide-react";

export default function ToolsPage() {
  return (
    <Suspense fallback={null}>
      <ToolsPageContent />
    </Suspense>
  );
}

function ToolsPageContent() {
  const searchParams = useSearchParams();
  const [tools, setTools] = useState<Tool[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("newest");
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (searchParams.get("featured") === "true") setSort("featured");
  }, [searchParams]);

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data.categories ?? []));
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (sort) params.set("sort", sort);

    fetch(`/api/tools?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => setTools(data.tools ?? []))
      .finally(() => setLoading(false));
  }, [category, sort]);

  const filtered = useMemo(() => {
    if (!query.trim()) return tools;
    const normalized = query.toLowerCase();
    return tools.filter(
      (tool) =>
        tool.name.toLowerCase().includes(normalized) ||
        tool.description.toLowerCase().includes(normalized)
    );
  }, [tools, query]);

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="font-display text-3xl font-bold">All Tools</h1>
      <p className="mt-2 text-sm text-text-muted">
        Browse the full XYPHORIA catalog of tools, scripts, and source code.
      </p>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Filter by keyword..."
          className="glass rounded-lg px-4 py-2 text-sm outline-none placeholder:text-text-muted"
        />
        <select
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          className="glass rounded-lg px-3 py-2 text-sm outline-none"
        >
          <option value="">All Categories</option>
          {categories.map((item) => (
            <option key={item.slug} value={item.slug}>
              {item.name}
            </option>
          ))}
        </select>
        <select
          value={sort}
          onChange={(event) => setSort(event.target.value)}
          className="glass flex items-center rounded-lg px-3 py-2 text-sm outline-none"
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="downloads">Most Downloaded</option>
          <option value="featured">Featured</option>
        </select>
        <span className="flex items-center gap-1.5 text-xs text-text-muted">
          <SlidersHorizontal size={13} />
          {filtered.length} results
        </span>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {loading &&
          Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="glass h-64 animate-pulse rounded-2xl" />
          ))}
        {!loading && filtered.map((tool) => <ToolCard key={tool.id} tool={tool} />)}
      </div>

      {!loading && filtered.length === 0 && (
        <p className="mt-16 text-center text-text-muted">No tools match your filters.</p>
      )}
    </div>
  );
}
