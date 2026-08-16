import { NextResponse } from "next/server";
import { getToolBySlug, registerDownload } from "@/lib/services/tools";
import { rateLimit, clientKeyFromRequest } from "@/lib/rate-limit";

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  const limit = rateLimit(clientKeyFromRequest(request, `download:${params.slug}`));
  if (!limit.allowed) {
    return NextResponse.json({ error: "Too many download requests. Slow down." }, { status: 429 });
  }

  const tool = await getToolBySlug(params.slug);
  if (!tool || tool.status !== "PUBLIC") {
    return NextResponse.json({ error: "Tool not available" }, { status: 404 });
  }

  const target = tool.primaryFile ?? tool.files[0];
  if (!target) {
    return NextResponse.json({ error: "No downloadable file for this tool" }, { status: 404 });
  }

  await registerDownload(params.slug);

  return NextResponse.redirect(target.rawUrl, { status: 302 });
}
