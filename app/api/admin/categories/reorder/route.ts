import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { reorderCategories } from "@/lib/services/categories";
import { categoryReorderSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => null);
  const parsed = categoryReorderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const categories = await reorderCategories(parsed.data.order);
  return NextResponse.json({ categories });
}
