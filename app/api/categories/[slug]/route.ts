import { NextResponse } from "next/server";
import { getCategoryBySlug } from "@/lib/services/categories";
import { listTools } from "@/lib/services/tools";

export async function GET(_request: Request, { params }: { params: { slug: string } }) {
  const category = await getCategoryBySlug(params.slug);
  if (!category || !category.active) {
    return NextResponse.json({ error: "Category not found" }, { status: 404 });
  }

  const tools = await listTools();
  const categoryTools = tools.filter((tool) => tool.category === category.slug && tool.status === "PUBLIC");

  return NextResponse.json({ category, tools: categoryTools });
}
