"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Eye, Pencil, Trash2, ShieldAlert } from "lucide-react";
import toast from "react-hot-toast";
import type { Tool } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export default function DashboardToolsPage() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmSlug, setConfirmSlug] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/tools");
    const data = await res.json();
    setTools(data.tools ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleDelete(slug: string) {
    const res = await fetch(`/api/admin/tools/${slug}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Tool deleted");
      setTools((prev) => prev.filter((tool) => tool.slug !== slug));
    } else {
      toast.error("Failed to delete tool");
    }
    setConfirmSlug(null);
  }

  async function toggleMaintenance(tool: Tool) {
    const nextStatus = tool.status === "MAINTENANCE" ? "PUBLIC" : "MAINTENANCE";
    const res = await fetch(`/api/admin/tools/${tool.slug}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: nextStatus })
    });
    if (res.ok) {
      toast.success(`Status set to ${nextStatus}`);
      load();
    } else {
      toast.error("Failed to update status");
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">Tools</h1>
          <p className="mt-1 text-sm text-text-muted">Manage every published tool.</p>
        </div>
        <Link
          href="/dashboard/upload"
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-dark"
        >
          Upload New
        </Link>
      </div>

      <div className="glass mt-6 overflow-x-auto rounded-2xl">
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr className="border-b border-surface-border text-left text-xs uppercase tracking-wide text-text-muted">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Version</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Downloads</th>
              <th className="px-4 py-3">Updated</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tools.map((tool) => (
              <tr key={tool.id} className="border-b border-surface-border last:border-0">
                <td className="px-4 py-3 font-medium">{tool.name}</td>
                <td className="px-4 py-3 text-text-muted">{tool.category}</td>
                <td className="px-4 py-3 text-text-muted">v{tool.version}</td>
                <td className="px-4 py-3">
                  <span
                    className={
                      tool.status === "PUBLIC"
                        ? "rounded-full bg-success/10 px-2 py-1 text-xs text-success"
                        : tool.status === "MAINTENANCE"
                        ? "rounded-full bg-warning/10 px-2 py-1 text-xs text-warning"
                        : "rounded-full bg-surface px-2 py-1 text-xs text-text-muted"
                    }
                  >
                    {tool.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-text-muted">{tool.downloads}</td>
                <td className="px-4 py-3 text-text-muted">{formatDate(tool.updatedAt)}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <Link href={`/tools/${tool.slug}`} className="rounded-lg p-1.5 hover:bg-surface-hover">
                      <Eye size={15} />
                    </Link>
                    <button
                      onClick={() => toggleMaintenance(tool)}
                      className="rounded-lg p-1.5 hover:bg-surface-hover"
                      title="Toggle maintenance"
                    >
                      <ShieldAlert size={15} />
                    </button>
                    <button
                      onClick={() => setConfirmSlug(tool.slug)}
                      className="rounded-lg p-1.5 text-danger hover:bg-danger/10"
                      title="Delete"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {!loading && tools.length === 0 && (
          <p className="py-10 text-center text-sm text-text-muted">No tools published yet.</p>
        )}
      </div>

      {confirmSlug && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="glass w-full max-w-sm rounded-2xl p-6">
            <p className="font-display font-semibold">Delete this tool?</p>
            <p className="mt-2 text-sm text-text-muted">
              This will permanently remove {confirmSlug} and its files from the repository.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setConfirmSlug(null)}
                className="rounded-lg border border-surface-border px-4 py-2 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(confirmSlug)}
                className="rounded-lg bg-danger px-4 py-2 text-sm font-semibold text-white"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
