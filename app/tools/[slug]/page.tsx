import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Download, Github, Tag, User, Calendar, HardDrive } from "lucide-react";
import { getToolBySlug } from "@/lib/services/tools";
import { formatBytes, formatDate } from "@/lib/utils";
import CodeViewer from "@/components/code-viewer";
import CopyRawUrlButton from "@/components/copy-raw-url-button";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const tool = await getToolBySlug(params.slug);
  if (!tool) return { title: "Tool not found" };
  return {
    title: tool.name,
    description: tool.description,
    openGraph: { title: tool.name, description: tool.description, images: tool.thumbnail ? [tool.thumbnail] : [] }
  };
}

export default async function ToolDetailPage({ params }: Props) {
  const tool = await getToolBySlug(params.slug);

  if (!tool || tool.status === "HIDDEN") notFound();

  if (tool.status === "MAINTENANCE") {
    return (
      <div className="mx-auto max-w-xl px-6 py-24 text-center">
        <h1 className="font-display text-2xl font-bold">{tool.maintenanceTitle ?? "This tool is temporarily unavailable."}</h1>
        <p className="mt-3 text-sm text-text-muted">
          {tool.maintenanceMessage ?? "We are working on it. Please check back soon."}
        </p>
        {tool.maintenanceEta && (
          <p className="mt-2 text-xs text-text-muted">Estimated restoration: {tool.maintenanceEta}</p>
        )}
      </div>
    );
  }

  const primary = tool.primaryFile ?? tool.files[0] ?? null;
  const totalSize = tool.files.reduce((sum, file) => sum + file.size, 0);

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <div className="glass rounded-2xl p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-secondary">{tool.category}</p>
            <h1 className="mt-1 font-display text-3xl font-bold">{tool.name}</h1>
            <div className="mt-3 flex flex-wrap gap-2">
              {tool.tags.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-1 rounded-full bg-surface px-2.5 py-1 text-xs text-text-muted"
                >
                  <Tag size={10} />
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <a
              href={`/api/download/${tool.slug}`}
              className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-glow transition hover:bg-primary-dark"
            >
              <Download size={15} />
              Download
            </a>
            {primary && (
              <a
                href={primary.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 rounded-xl border border-surface-border px-5 py-2.5 text-sm font-semibold transition hover:border-primary/50"
              >
                <Github size={15} />
                GitHub
              </a>
            )}
          </div>
        </div>

        <p className="mt-6 whitespace-pre-line text-sm leading-relaxed text-text-muted">
          {tool.description}
        </p>

        <div className="mt-8 grid grid-cols-2 gap-4 border-t border-surface-border pt-6 sm:grid-cols-4">
          <div>
            <p className="flex items-center gap-1.5 text-xs text-text-muted">
              <User size={12} /> Author
            </p>
            <p className="mt-1 text-sm">{tool.author}</p>
          </div>
          <div>
            <p className="flex items-center gap-1.5 text-xs text-text-muted">
              <Calendar size={12} /> Updated
            </p>
            <p className="mt-1 text-sm">{formatDate(tool.updatedAt)}</p>
          </div>
          <div>
            <p className="flex items-center gap-1.5 text-xs text-text-muted">
              <HardDrive size={12} /> Size
            </p>
            <p className="mt-1 text-sm">{formatBytes(totalSize)}</p>
          </div>
          <div>
            <p className="flex items-center gap-1.5 text-xs text-text-muted">
              <Download size={12} /> Downloads
            </p>
            <p className="mt-1 text-sm">{tool.downloads}</p>
          </div>
        </div>
      </div>

      {primary && (
        <div className="mt-6 flex flex-wrap gap-3">
          <CopyRawUrlButton url={primary.rawUrl} />
        </div>
      )}

      {primary && (
        <div className="mt-6">
          <h2 className="mb-3 font-display text-lg font-semibold">Source Preview</h2>
          <CodeViewer rawUrl={primary.rawUrl} format={primary.format} />
        </div>
      )}

      {tool.files.length > 1 && (
        <div className="mt-8">
          <h2 className="mb-3 font-display text-lg font-semibold">All Files</h2>
          <div className="glass divide-y divide-surface-border rounded-2xl">
            {tool.files.map((file) => (
              <div key={file.path} className="flex items-center justify-between px-5 py-3 text-sm">
                <span className="truncate">{file.path.split("/").pop()}</span>
                <div className="flex items-center gap-3 text-xs text-text-muted">
                  <span>{formatBytes(file.size)}</span>
                  <a href={file.rawUrl} className="text-primary hover:underline">
                    Raw
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
