import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { listTools, updateTool } from "@/lib/services/tools";
import { deleteToolFile } from "@/lib/github/storage";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const tools = await listTools();
  const files = tools.flatMap((tool) =>
    tool.files.map((file) => ({ ...file, toolSlug: tool.slug, toolName: tool.name }))
  );

  return NextResponse.json({ files });
}

export async function DELETE(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(request.url);
  const slug = url.searchParams.get("slug");
  const path = url.searchParams.get("path");

  if (!slug || !path) {
    return NextResponse.json({ error: "Missing slug or path" }, { status: 400 });
  }

  const tools = await listTools();
  const tool = tools.find((item) => item.slug === slug);
  if (!tool) return NextResponse.json({ error: "Tool not found" }, { status: 404 });

  await deleteToolFile(path);
  const files = tool.files.filter((file) => file.path !== path);
  const primaryFile = tool.primaryFile?.path === path ? files[0] ?? null : tool.primaryFile;

  await updateTool(slug, { files, primaryFile });

  return NextResponse.json({ success: true });
}
