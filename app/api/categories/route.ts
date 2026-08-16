import { NextResponse } from "next/server";
import { listCategories } from "@/lib/services/categories";
import { listTools } from "@/lib/services/tools";

export async function GET() {
  const [categories, tools] = await Promise.all([listCategories(), listTools()]);
  const active = categories.filter((category) => category.active);

  const withCounts = active.map((category) => ({
    ...category,
    toolCount: tools.filter((tool) => tool.category === category.slug && tool.status === "PUBLIC").length
  }));

  return NextResponse.json({ categories: withCounts });
}
