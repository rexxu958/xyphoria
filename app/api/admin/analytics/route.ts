import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { listTools } from "@/lib/services/tools";
import { listCategories } from "@/lib/services/categories";
import { getStatistics } from "@/lib/github/database";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [tools, categories, statistics] = await Promise.all([
    listTools(),
    listCategories(),
    getStatistics()
  ]);

  const toolsPerCategory = categories.map((category) => ({
    category: category.name,
    slug: category.slug,
    count: tools.filter((tool) => tool.category === category.slug).length
  }));

  const overview = {
    totalTools: tools.length,
    activeTools: tools.filter((tool) => tool.status === "PUBLIC").length,
    maintenanceTools: tools.filter((tool) => tool.status === "MAINTENANCE").length,
    hiddenTools: tools.filter((tool) => tool.status === "HIDDEN").length,
    totalCategories: categories.length,
    featuredTools: tools.filter((tool) => tool.featured).length,
    totalFiles: tools.reduce((sum, tool) => sum + tool.files.length, 0),
    totalDownloads: statistics.totalDownloads
  };

  const recentDownloads = statistics.downloadHistory.slice(-30);

  return NextResponse.json({ overview, toolsPerCategory, recentDownloads });
}
