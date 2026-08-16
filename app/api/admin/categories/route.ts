import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { listCategories, createCategory } from "@/lib/services/categories";
import { categoryInputSchema } from "@/lib/validation";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const categories = await listCategories();
  return NextResponse.json({ categories });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => null);
  const parsed = categoryInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const category = await createCategory(parsed.data);
    return NextResponse.json({ category }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "SLUG_TAKEN") {
      return NextResponse.json({ error: "A category with this slug already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
  }
}
