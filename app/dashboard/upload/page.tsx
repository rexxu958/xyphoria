"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import UploadZone from "@/components/upload-zone";
import type { Category } from "@/lib/types";

export default function DashboardUploadPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    category: "",
    version: "1.0.0",
    author: "",
    tags: "",
    status: "PUBLIC",
    featured: false
  });

  useEffect(() => {
    fetch("/api/admin/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data.categories ?? []));
  }, []);

  function updateField<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!form.category) {
      toast.error("Select a category");
      return;
    }

    setSubmitting(true);
    try {
      const createRes = await fetch("/api/admin/tools", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          tags: form.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean)
        })
      });

      const createData = await createRes.json();
      if (!createRes.ok) {
        toast.error(createData.error?.formErrors?.[0] ?? createData.error ?? "Failed to create tool");
        return;
      }

      if (files.length > 0) {
        const formData = new FormData();
        formData.set("slug", form.slug);
        files.forEach((file) => formData.append("files", file));

        const uploadRes = await fetch("/api/admin/upload", { method: "POST", body: formData });
        if (!uploadRes.ok) {
          const uploadData = await uploadRes.json();
          toast.error(uploadData.error ?? "Tool created, but file upload failed");
        }
      }

      toast.success("Tool berhasil diupload");
      router.push("/dashboard/tools");
    } catch {
      toast.error("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-bold">Upload Tool</h1>
      <p className="mt-1 text-sm text-text-muted">Publish a new tool to XYPHORIA.</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        <div className="glass rounded-2xl p-6">
          <p className="mb-4 font-display font-semibold">Files</p>
          <UploadZone files={files} onChange={setFiles} />
        </div>

        <div className="glass grid grid-cols-1 gap-4 rounded-2xl p-6 sm:grid-cols-2">
          <div>
            <label className="text-xs text-text-muted">Tool Name</label>
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
              value={form.slug}
              onChange={(event) => updateField("slug", event.target.value)}
              placeholder="my-awesome-tool"
              className="mt-1 w-full rounded-lg border border-surface-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary/50"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="text-xs text-text-muted">Description</label>
            <textarea
              required
              value={form.description}
              onChange={(event) => updateField("description", event.target.value)}
              rows={4}
              className="mt-1 w-full rounded-lg border border-surface-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary/50"
            />
          </div>
          <div>
            <label className="text-xs text-text-muted">Category</label>
            <select
              required
              value={form.category}
              onChange={(event) => updateField("category", event.target.value)}
              className="mt-1 w-full rounded-lg border border-surface-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary/50"
            >
              <option value="">Select category</option>
              {categories.map((category) => (
                <option key={category.slug} value={category.slug}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-text-muted">Version</label>
            <input
              required
              value={form.version}
              onChange={(event) => updateField("version", event.target.value)}
              className="mt-1 w-full rounded-lg border border-surface-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary/50"
            />
          </div>
          <div>
            <label className="text-xs text-text-muted">Author</label>
            <input
              required
              value={form.author}
              onChange={(event) => updateField("author", event.target.value)}
              className="mt-1 w-full rounded-lg border border-surface-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary/50"
            />
          </div>
          <div>
            <label className="text-xs text-text-muted">Tags (comma separated)</label>
            <input
              value={form.tags}
              onChange={(event) => updateField("tags", event.target.value)}
              className="mt-1 w-full rounded-lg border border-surface-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary/50"
            />
          </div>
          <div>
            <label className="text-xs text-text-muted">Status</label>
            <select
              value={form.status}
              onChange={(event) => updateField("status", event.target.value)}
              className="mt-1 w-full rounded-lg border border-surface-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary/50"
            >
              <option value="PUBLIC">Public</option>
              <option value="HIDDEN">Hidden</option>
              <option value="MAINTENANCE">Maintenance</option>
            </select>
          </div>
          <div className="flex items-center gap-2 pt-6">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(event) => updateField("featured", event.target.checked)}
              id="featured"
            />
            <label htmlFor="featured" className="text-sm">
              Featured tool
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow-glow transition hover:bg-primary-dark disabled:opacity-60"
        >
          {submitting ? "Publishing..." : "Publish Tool"}
        </button>
      </form>
    </div>
  );
}
