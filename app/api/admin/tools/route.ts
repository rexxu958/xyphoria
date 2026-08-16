import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { listTools, createTool } from "@/lib/services/tools";
import { toolInputSchema } from "@/lib/validation";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const tools = await listTools();
  return NextResponse.json({ tools });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => null);
  const parsed = toolInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const tool = await createTool({ ...parsed.data, thumbnail: parsed.data.thumbnail ?? null, icon: parsed.data.icon ?? null, files: [] });
    return NextResponse.json({ tool }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "SLUG_TAKEN") {
      return NextResponse.json({ error: "A tool with this slug already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: "Failed to create tool" }, { status: 500 });
  }
}
