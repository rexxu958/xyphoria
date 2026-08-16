import { NextResponse } from "next/server";
import { destroySession, getSession } from "@/lib/auth/session";
import { appendActivity } from "@/lib/github/database";
import { generateId } from "@/lib/utils";

export async function POST() {
  const session = await getSession();
  await destroySession();

  if (session) {
    await appendActivity({
      id: generateId(),
      timestamp: new Date().toISOString(),
      action: "LOGOUT",
      target: session.username,
      status: "success"
    });
  }

  return NextResponse.json({ success: true });
}
