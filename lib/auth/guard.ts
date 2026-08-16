import "server-only";
import { NextResponse } from "next/server";
import { getSession, type SessionPayload } from "./session";

export async function withOwner<T>(
  handler: (session: SessionPayload) => Promise<T>
): Promise<T | NextResponse> {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return handler(session);
}
