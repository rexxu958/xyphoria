import { NextResponse } from "next/server";
import { createSession } from "@/lib/auth/session";
import { verifyPassword } from "@/lib/auth/password";
import { loginSchema } from "@/lib/validation";
import { rateLimit, clientKeyFromRequest } from "@/lib/rate-limit";

export async function POST(request: Request) {
  console.log("=== LOGIN DEBUG START ===");
  console.log("OWNER_USERNAME:", JSON.stringify(process.env.OWNER_USERNAME));
  console.log("OWNER_PASSWORD_HASH:", JSON.stringify(process.env.OWNER_PASSWORD_HASH));
  console.log("SESSION_SECRET length:", process.env.SESSION_SECRET ? process.env.SESSION_SECRET.length : "undefined");

  try {
    const limit = rateLimit(clientKeyFromRequest(request, "login"));
    if (!limit.allowed) {
      return NextResponse.json({ error: "Too many attempts. Try again later." }, { status: 429 });
    }

    const body = await request.json().catch(() => null);
    console.log("Body received:", body);

    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      console.log("Schema validation failed:", parsed.error);
      return NextResponse.json({ error: "Invalid credentials payload" }, { status: 400 });
    }

    const ownerUsername = process.env.OWNER_USERNAME;
    const ownerPasswordHash = process.env.OWNER_PASSWORD_HASH;

    if (!ownerUsername || !ownerPasswordHash) {
      console.log("Missing env vars, returning early");
      return NextResponse.json({ error: "Owner account is not configured" }, { status: 500 });
    }

    const { username, password } = parsed.data;
    const validUsername = username === ownerUsername;
    console.log("Username match:", validUsername);

    const validPassword = await verifyPassword(password, ownerPasswordHash);
    console.log("Password match:", validPassword);

    if (!validUsername || !validPassword) {
      return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });
    }

    await createSession({ username, role: "owner" });
    console.log("Session created successfully");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("=== LOGIN ROUTE CRASHED ===");
    console.error(error);
    return NextResponse.json({ error: "Internal error, check server logs" }, { status: 500 });
  }
}
