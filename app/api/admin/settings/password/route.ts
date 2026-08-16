import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { passwordChangeSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => null);
  const parsed = passwordChangeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const currentHash = process.env.OWNER_PASSWORD_HASH ?? "";
  const valid = await verifyPassword(parsed.data.currentPassword, currentHash);
  if (!valid) {
    return NextResponse.json({ error: "Current password is incorrect" }, { status: 401 });
  }

  const newHash = await hashPassword(parsed.data.newPassword);

  return NextResponse.json({
    message: "Password verified. Update OWNER_PASSWORD_HASH in your environment with the value below and redeploy.",
    newPasswordHash: newHash
  });
}
