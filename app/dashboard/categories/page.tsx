"use client";

import { useEffect, useState } from "react";
import { GripVertical, Pencil, Trash2, Plus } from "lucide-react";
import toast from "react-hot-toast";
import type { Category } from "@/lib/types";

const emptyForm = {
  name: "",
  slug: "",
  description: "",
  icon: "folder",
  gradientFrom: "#6C5CE7",
  gradientTo: "#00D9C6",
  active: true
};

export default function DashboardCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  async function load() {
    const res = await fetch("/api/admin/categories");
    const data = await res.json();
    setCategories((data.categories ?? []).sort((a: Category, b: Category) => a.order - b.order));
  }

  useEffect(() => {
    load();
  }, []);

  function updateField<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const endpoint = editingSlug ? `/api/admin/categories/${editingSlug}` : "/api/admin/categories";
    const method = editingSlug ? "PATCH" : "POST";

    const res = await fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    if (res.ok) {
      toast.success(editingSlug ? "Kategori berhasil diperbarui" : "Kategori berhasil dibuat");
      setForm(emptyForm);
      setEditingSlug(null);
      load();
    } else {
      const data = await res.json();
      toast.error(data.error?.formErrors?.[0] ?? data.error ?? "Failed to save category");
    }
  }

  async function handleDelete(slug: string) {
    const res = await fetch(`/api/admin/categories/${slug}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Kategori berhasil dihapus");
      load();
    } else {
      toast.error("Failed to delete category");
    }
  }

  function startEdit(category: Category) {
    setEditingSlug(category.slug);
    setForm({
      name: category.name,
      slug: category.slug,
      description: category.description,
      icon: category.icon,
      gradientFrom: category.gradientFrom,
      gradientTo: category.gradientTo,
      active: category.active
    });
  }

  async function persistOrder(next: Category[]) {
    setCategories(next);
    await fetch("/api/admin/categories/reorder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order: next.map((category) => category.slug) })
    });
  }

  function handleDragStart(index: number) {
    setDragIndex(index);
  }

  function handleDragOver(index: number) {
    if (dragIndex === null || dragIndex === index) return;
    const next = [...categories];
    const [moved] = next.splice(dragIndex, 1);
    if (!moved) return;
    next.splice(index, 0, moved);
    setDragIndex(index);
    setCategories(next);
  }

  function handleDragEnd() {
    if (dragIndex !== null) persistOrder(categories);
    setDragIndex(null);
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-bold">Categories</h1>
      <p className="mt-1 text-sm text-text-muted">Create and organize your platform categories.</p>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_380px]">
        <div className="glass rounded-2xl p-2">
          {categories.map((category, index) => (
            <div
              key={category.id}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(event) => {
                event.preventDefault();
                handleDragOver(index);
              }}
              onDragEnd={handleDragEnd}
              className="flex items-center justify-between gap-3 rounded-xl px-3 py-3 transition hover:bg-surface-hover"
            >
              <div className="flex items-center gap-3">
                <GripVertical size={16} className="cursor-grab text-text-muted" />
                <div
                  className="h-8 w-8 rounded-lg"
                  style={{ background: `linear-gradient(135deg, ${category.gradientFrom}, ${category.gradientTo})` }}
                />
                <div>
                  <p className="text-sm font-medium">{category.name}</p>
                  <p className="text-xs text-text-muted">/{category.slug}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`rounded-full px-2 py-1 text-xs ${
                    category.active ? "bg-success/10 text-success" : "bg-surface text-text-muted"
                  }`}
                >
                  {category.active ? "Active" : "Inactive"}
                </span>
                <button onClick={() => startEdit(category)} className="rounded-lg p-1.5 hover:bg-surface-hover">
                  <Pencil size={14} />
                </button>
                <button
                  onClick={() => handleDelete(category.slug)}
                  className="rounded-lg p-1.5 text-danger hover:bg-danger/10"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
          {categories.length === 0 && (
            <p className="py-10 text-center text-sm text-text-muted">No categories yet.</p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="glass h-fit rounded-2xl p-6">
          <p className="mb-4 flex items-center gap-1.5 font-display font-semibold">
            <Plus size={16} />
            {editingSlug ? "Edit Category" : "New Category"}
          </p>

          <div className="space-y-3">
            <div>
              <label className="text-xs text-text-muted">Name</label>
              <input
                required
                value={form.name}
                onChange={(event) => updateField("name", event.target.value)}
                className="mt-1 w-full rounded-lg border border-surface-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary/50"
              />
            </div>
            <div>
              <label className="text-xs text-text-muted">Slug</label>
              <input
                required
                disabled={Boolean(editingSlug)}
                value={form.slug}
                onChange={(event) => updateField("slug", event.target.value)}
                className="mt-1 w-full rounded-lg border border-surface-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary/50 disabled:opacity-60"
              />
            </div>
            <div>
              <label className="text-xs text-text-muted">Description</label>
              <textarea
                value={form.description}
                onChange={(event) => updateField("description", event.target.value)}
                rows={3}
                className="mt-1 w-full rounded-lg border border-surface-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary/50"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-text-muted">Gradient From</label>
                <input
                  type="color"
                  value={form.gradientFrom}
                  onChange={(event) => updateField("gradientFrom", event.target.value)}
                  className="mt-1 h-9 w-full rounded-lg border border-surface-border bg-surface"
                />
              </div>
              <div>
                <label className="text-xs text-text-muted">Gradient To</label>
                <input
                  type="color"
                  value={form.gradientTo}
                  onChange={(event) => updateField("gradientTo", event.target.value)}
                  className="mt-1 h-9 w-full rounded-lg border border-surface-border bg-surface"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.active}
                onChange={(event) => updateField("active", event.target.checked)}
                id="active"
              />
              <label htmlFor="active" className="text-sm">
                Active
              </label>
            </div>
          </div>

          <div className="mt-5 flex gap-2">
            <button
              type="submit"
              className="flex-1 rounded-lg bg-primary py-2.5 text-sm font-semibold text-white transition hover:bg-primary-dark"
            >
              {editingSlug ? "Save Changes" : "Create Category"}
            </button>
            {editingSlug && (
              <button
                type="button"
                onClick={() => {
                  setEditingSlug(null);
                  setForm(emptyForm);
                }}
                className="rounded-lg border border-surface-border px-4 text-sm"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
