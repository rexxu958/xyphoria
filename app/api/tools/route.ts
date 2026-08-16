import { NextResponse } from "next/server";
import { listTools } from "@/lib/services/tools";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const category = url.searchParams.get("category");
  const format = url.searchParams.get("format");
  const sort = url.searchParams.get("sort") ?? "newest";
  const featuredOnly = url.searchParams.get("featured") === "true";

  const tools = await listTools();
  let filtered = tools.filter((tool) => tool.status === "PUBLIC");

  if (category) filtered = filtered.filter((tool) => tool.category === category);
  if (format) filtered = filtered.filter((tool) => tool.files.some((file) => file.format === format));
  if (featuredOnly) filtered = filtered.filter((tool) => tool.featured);

  filtered = [...filtered].sort((a, b) => {
    switch (sort) {
      case "oldest":
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case "downloads":
        return b.downloads - a.downloads;
      case "featured":
        return Number(b.featured) - Number(a.featured);
      default:
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    }
  });

  return NextResponse.json({ tools: filtered });
}
