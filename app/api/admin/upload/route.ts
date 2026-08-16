import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getToolBySlug, updateTool } from "@/lib/services/tools";
import { uploadToolFile } from "@/lib/github/storage";
import { ALLOWED_UPLOAD_EXTENSIONS, MAX_UPLOAD_SIZE_BYTES, isPathTraversal } from "@/lib/validation";
import { rateLimit, clientKeyFromRequest } from "@/lib/rate-limit";
import type { ToolFile } from "@/lib/types";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const limit = rateLimit(clientKeyFromRequest(request, "upload"));
  if (!limit.allowed) {
    return NextResponse.json({ error: "Too many uploads. Slow down." }, { status: 429 });
  }

  const formData = await request.formData().catch(() => null);
  if (!formData) return NextResponse.json({ error: "Invalid form data" }, { status: 400 });

  const slug = formData.get("slug");
  if (typeof slug !== "string" || !slug) {
    return NextResponse.json({ error: "Missing tool slug" }, { status: 400 });
  }

  const tool = await getToolBySlug(slug);
  if (!tool) return NextResponse.json({ error: "Tool not found" }, { status: 404 });

  const entries = formData.getAll("files");
  if (entries.length === 0) return NextResponse.json({ error: "No files provided" }, { status: 400 });

  const uploaded: ToolFile[] = [];

  for (const entry of entries) {
    if (!(entry instanceof File)) continue;

    if (isPathTraversal(entry.name)) {
      return NextResponse.json({ error: `Invalid filename: ${entry.name}` }, { status: 400 });
    }

    const extension = entry.name.includes(".") ? entry.name.split(".").pop()!.toLowerCase() : "";
    if (!ALLOWED_UPLOAD_EXTENSIONS.has(extension)) {
      return NextResponse.json({ error: `File type .${extension} is not allowed` }, { status: 415 });
    }

    if (entry.size > MAX_UPLOAD_SIZE_BYTES) {
      return NextResponse.json({ error: `File ${entry.name} exceeds the size limit` }, { status: 413 });
    }

    const buffer = Buffer.from(await entry.arrayBuffer());
    const uploadedFile = await uploadToolFile({
      category: tool.category,
      slug: tool.slug,
      filename: entry.name,
      buffer
    });
    uploaded.push(uploadedFile);
  }

  const files = [...tool.files, ...uploaded];
  const updated = await updateTool(slug, { files, primaryFile: tool.primaryFile ?? uploaded[0] ?? null });

  return NextResponse.json({ tool: updated, uploaded });
}
