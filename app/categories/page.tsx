import { listCategories } from "@/lib/services/categories";
import { listTools } from "@/lib/services/tools";
import CategoryCard from "@/components/category-card";

export const metadata = { title: "Categories" };

export default async function CategoriesPage() {
  const [categories, tools] = await Promise.all([listCategories(), listTools()]);
  const active = categories.filter((category) => category.active);

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="font-display text-3xl font-bold">Categories</h1>
      <p className="mt-2 text-sm text-text-muted">
        Explore XYPHORIA tools organized by category, managed directly by the owner.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {active.map((category) => (
          <CategoryCard
            key={category.id}
            slug={category.slug}
            name={category.name}
            description={category.description}
            toolCount={tools.filter((tool) => tool.category === category.slug && tool.status === "PUBLIC").length}
            gradientFrom={category.gradientFrom}
            gradientTo={category.gradientTo}
          />
        ))}
      </div>

      {active.length === 0 && (
        <p className="mt-16 text-center text-text-muted">No categories have been created yet.</p>
      )}
    </div>
  );
}
