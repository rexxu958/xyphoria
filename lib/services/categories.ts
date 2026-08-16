import "server-only";
import { cached, invalidate, CACHE_KEYS } from "../cache";
import { getCategories, saveCategories, appendActivity } from "../github/database";
import { ensureBootstrapOnce } from "./bootstrap";
import type { Category } from "../types";
import { generateId } from "../utils";

export async function listCategories(): Promise<Category[]> {
  await ensureBootstrapOnce();
  const categories = await cached(CACHE_KEYS.categories, getCategories, {
    ttlMs: 30_000,
    staleMs: 180_000
  });
  return [...categories].sort((a, b) => a.order - b.order);
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const categories = await listCategories();
  return categories.find((category) => category.slug === slug) ?? null;
}

export async function createCategory(input: {
  name: string;
  slug: string;
  description: string;
  icon: string;
  gradientFrom: string;
  gradientTo: string;
  active: boolean;
}): Promise<Category> {
  const categories = await getCategories();
  if (categories.some((category) => category.slug === input.slug)) {
    throw new Error("SLUG_TAKEN");
  }

  const now = new Date().toISOString();
  const category: Category = {
    id: generateId(),
    ...input,
    order: categories.length,
    createdAt: now,
    updatedAt: now
  };

  await saveCategories([...categories, category], `feat: create category ${category.slug}`);
  invalidate(CACHE_KEYS.categories);

  await appendActivity({
    id: generateId(),
    timestamp: now,
    action: "CATEGORY_CREATED",
    target: category.slug,
    status: "success"
  });

  return category;
}

export async function updateCategory(slug: string, patch: Partial<Category>): Promise<Category> {
  const categories = await getCategories();
  const index = categories.findIndex((category) => category.slug === slug);
  if (index === -1) throw new Error("NOT_FOUND");

  const updated: Category = { ...categories[index]!, ...patch, updatedAt: new Date().toISOString() };
  categories[index] = updated;

  await saveCategories(categories, `chore: update category ${slug}`);
  invalidate(CACHE_KEYS.categories);

  await appendActivity({
    id: generateId(),
    timestamp: new Date().toISOString(),
    action: "CATEGORY_UPDATED",
    target: slug,
    status: "success"
  });

  return updated;
}

export async function deleteCategory(slug: string): Promise<void> {
  const categories = await getCategories();
  if (!categories.some((category) => category.slug === slug)) throw new Error("NOT_FOUND");

  const remaining = categories
    .filter((category) => category.slug !== slug)
    .sort((a, b) => a.order - b.order)
    .map((category, index) => ({ ...category, order: index }));

  await saveCategories(remaining, `chore: delete category ${slug}`);
  invalidate(CACHE_KEYS.categories);

  await appendActivity({
    id: generateId(),
    timestamp: new Date().toISOString(),
    action: "CATEGORY_DELETED",
    target: slug,
    status: "success"
  });
}

export async function reorderCategories(order: string[]): Promise<Category[]> {
  const categories = await getCategories();
  const bySlug = new Map(categories.map((category) => [category.slug, category]));

  const reordered = order
    .map((slug, index) => {
      const category = bySlug.get(slug);
      if (!category) return null;
      return { ...category, order: index, updatedAt: new Date().toISOString() };
    })
    .filter((category): category is Category => category !== null);

  await saveCategories(reordered, "chore: reorder categories");
  invalidate(CACHE_KEYS.categories);

  return reordered;
}
