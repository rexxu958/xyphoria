import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { updateTool, deleteTool } from "@/lib/services/tools";
import { toolUpdateSchema } from "@/lib/validation";

export async function PATCH(request: Request, { params }: { params: { slug: string } }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => null);
  const parsed = toolUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const tool = await updateTool(params.slug, parsed.data);
    return NextResponse.json({ tool });
  } catch (error) {
    if (error instanceof Error && error.message === "NOT_FOUND") {
      return NextResponse.json({ error: "Tool not found" }, { status: 404 });
    }
    return NextResponse.json({ error: "Failed to update tool" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: { slug: string } }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await deleteTool(params.slug);
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message === "NOT_FOUND") {
      return NextResponse.json({ error: "Tool not found" }, { status: 404 });
    }
    return NextResponse.json({ error: "Failed to delete tool" }, { status: 500 });
  }
}
