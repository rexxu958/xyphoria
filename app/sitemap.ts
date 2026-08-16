import type { MetadataRoute } from "next";
import { listTools } from "@/lib/services/tools";
import { listCategories } from "@/lib/services/categories";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const [tools, categories] = await Promise.all([
    listTools().catch(() => []),
    listCategories().catch(() => [])
  ]);

  const staticRoutes = ["", "/tools", "/categories", "/about"].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date()
  }));

  const toolRoutes = tools
    .filter((tool) => tool.status === "PUBLIC")
    .map((tool) => ({ url: `${baseUrl}/tools/${tool.slug}`, lastModified: new Date(tool.updatedAt) }));

  const categoryRoutes = categories
    .filter((category) => category.active)
    .map((category) => ({ url: `${baseUrl}/categories/${category.slug}`, lastModified: new Date(category.updatedAt) }));

  return [...staticRoutes, ...toolRoutes, ...categoryRoutes];
}
