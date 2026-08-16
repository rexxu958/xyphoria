import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getActivity } from "@/lib/github/database";

export async function GET(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(request.url);
  const limit = Number(url.searchParams.get("limit") ?? 50);

  const activity = await getActivity();
  return NextResponse.json({ activity: activity.slice(0, limit) });
}
