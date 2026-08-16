import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getSettings, saveSettings, appendActivity } from "@/lib/github/database";
import { settingsUpdateSchema } from "@/lib/validation";
import { generateId } from "@/lib/utils";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const settings = await getSettings();
  return NextResponse.json({ settings });
}

export async function PATCH(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => null);
  const parsed = settingsUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const current = await getSettings();
  const wasMaintenance = current.maintenance;
  const updated = { ...current, ...parsed.data };

  await saveSettings(updated, "chore: update site settings");

  await appendActivity({
    id: generateId(),
    timestamp: new Date().toISOString(),
    action: "SETTINGS_CHANGED",
    target: "settings",
    status: "success"
  });

  if (parsed.data.maintenance !== undefined && parsed.data.maintenance !== wasMaintenance) {
    await appendActivity({
      id: generateId(),
      timestamp: new Date().toISOString(),
      action: parsed.data.maintenance ? "MAINTENANCE_ENABLED" : "MAINTENANCE_DISABLED",
      target: "site",
      status: "success"
    });
  }

  return NextResponse.json({ settings: updated });
}
