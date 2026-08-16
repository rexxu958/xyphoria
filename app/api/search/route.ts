import { NextResponse } from "next/server";
import { listTools, searchTools } from "@/lib/services/tools";
import { searchQuerySchema } from "@/lib/validation";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const parsed = searchQuerySchema.safeParse({ q: url.searchParams.get("q") ?? "" });

  if (!parsed.success) {
    return NextResponse.json({ tools: [] });
  }

  const tools = await listTools();
  const results = searchTools(tools, parsed.data.q).slice(0, 20);

  return NextResponse.json({ tools: results });
}
