import { notFound } from "next/navigation";
import { getCategoryBySlug } from "@/lib/services/categories";
import { listTools } from "@/lib/services/tools";
import ToolCard from "@/components/tool-card";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props) {
  const category = await getCategoryBySlug(params.slug);
  if (!category) return { title: "Category not found" };
  return { title: category.name, description: category.description };
}

export default async function CategoryDetailPage({ params }: Props) {
  const category = await getCategoryBySlug(params.slug);
  if (!category || !category.active) notFound();

  const tools = await listTools();
  const categoryTools = tools.filter((tool) => tool.category === category.slug && tool.status === "PUBLIC");

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <div
        className="glass rounded-2xl p-8"
        style={{
          background: `linear-gradient(135deg, ${category.gradientFrom}1a, ${category.gradientTo}1a)`
        }}
      >
        <p className="text-xs uppercase tracking-wide text-secondary">XYPHORIA</p>
        <h1 className="mt-1 font-display text-3xl font-bold">{category.name}</h1>
        <p className="mt-2 max-w-2xl text-sm text-text-muted">{category.description}</p>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {categoryTools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>

      {categoryTools.length === 0 && (
        <p className="mt-16 text-center text-text-muted">No tools published in this category yet.</p>
      )}
    </div>
  );
}
