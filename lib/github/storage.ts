import "server-only";
import { deleteFile, encodeBase64, getFile, getRawUrl, getRepoUrl, putFile } from "./client";
import type { ToolFile } from "../types";

function sanitizeSegment(segment: string): string {
  return segment
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function buildToolPath(category: string, slug: string, filename: string): string {
  const safeCategory = sanitizeSegment(category);
  const safeSlug = sanitizeSegment(slug);
  const safeFilename = sanitizeSegment(filename);

  if (safeCategory.includes("..") || safeSlug.includes("..") || safeFilename.includes("..")) {
    throw new Error("Invalid path segment");
  }

  return `tools/${safeCategory}/${safeSlug}/${safeFilename}`;
}

export async function uploadToolFile(params: {
  category: string;
  slug: string;
  filename: string;
  buffer: Buffer;
}): Promise<ToolFile> {
  const path = buildToolPath(params.category, params.slug, params.filename);
  const result = await putFile({
    path,
    content: params.buffer.toString("base64"),
    message: `feat: upload ${params.filename} to ${params.slug}`
  });

  const format = params.filename.includes(".")
    ? params.filename.split(".").pop()!.toUpperCase()
    : "FILE";

  return {
    path,
    rawUrl: result.rawUrl,
    githubUrl: result.githubUrl,
    size: params.buffer.byteLength,
    format
  };
}

export async function deleteToolFile(path: string): Promise<void> {
  const existing = await getFile(path);
  if (!existing) return;
  await deleteFile({ path, message: `chore: remove ${path}`, sha: existing.sha });
}

export async function uploadAsset(params: { filename: string; buffer: Buffer }): Promise<{
  rawUrl: string;
  githubUrl: string;
}> {
  const path = `assets/${sanitizeSegment(params.filename)}`;
  const result = await putFile({
    path,
    content: params.buffer.toString("base64"),
    message: `chore: upload asset ${params.filename}`
  });
  return { rawUrl: result.rawUrl, githubUrl: result.githubUrl };
}

export { getRawUrl, getRepoUrl };
