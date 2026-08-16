import { NextResponse } from "next/server";
import { getToolBySlug } from "@/lib/services/tools";

export async function GET(_request: Request, { params }: { params: { slug: string } }) {
  const tool = await getToolBySlug(params.slug);
  if (!tool || tool.status === "HIDDEN") {
    return NextResponse.json({ error: "Tool not found" }, { status: 404 });
  }
  return NextResponse.json({ tool });
}
