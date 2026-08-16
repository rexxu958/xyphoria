import "server-only";
import { cached, invalidate, CACHE_KEYS } from "../cache";
import { getTools, saveTools, appendActivity, getStatistics, saveStatistics } from "../github/database";
import { deleteToolFile, uploadToolFile } from "../github/storage";
import { ensureBootstrapOnce } from "./bootstrap";
import type { Tool, ToolFile } from "../types";
import { generateId } from "../utils";

export async function listTools(): Promise<Tool[]> {
  await ensureBootstrapOnce();
  return cached(CACHE_KEYS.tools, getTools, { ttlMs: 30_000, staleMs: 180_000 });
}

export async function getToolBySlug(slug: string): Promise<Tool | null> {
  const tools = await listTools();
  return tools.find((tool) => tool.slug === slug) ?? null;
}

export async function createTool(input: {
  name: string;
  slug: string;
  description: string;
  category: string;
  version: string;
  author: string;
  tags: string[];
  thumbnail: string | null;
  icon: string | null;
  status: Tool["status"];
  featured: boolean;
  files: { filename: string; buffer: Buffer }[];
}): Promise<Tool> {
  const tools = await getTools();
  if (tools.some((tool) => tool.slug === input.slug)) {
    throw new Error("SLUG_TAKEN");
  }

  const uploadedFiles: ToolFile[] = [];
  for (const file of input.files) {
    const uploaded = await uploadToolFile({
      category: input.category,
      slug: input.slug,
      filename: file.filename,
      buffer: file.buffer
    });
    uploadedFiles.push(uploaded);
  }

  const now = new Date().toISOString();
  const tool: Tool = {
    id: generateId(),
    slug: input.slug,
    name: input.name,
    description: input.description,
    category: input.category,
    version: input.version,
    author: input.author,
    tags: input.tags,
    thumbnail: input.thumbnail,
    icon: input.icon,
    files: uploadedFiles,
    primaryFile: uploadedFiles[0] ?? null,
    status: input.status,
    featured: input.featured,
    downloads: 0,
    maintenanceTitle: null,
    maintenanceMessage: null,
    maintenanceEta: null,
    createdAt: now,
    updatedAt: now
  };

  await saveTools([tool, ...tools], `feat: publish tool ${tool.slug}`);
  invalidate(CACHE_KEYS.tools);

  await appendActivity({
    id: generateId(),
    timestamp: now,
    action: "UPLOAD",
    target: tool.slug,
    status: "success"
  });

  return tool;
}

export async function updateTool(slug: string, patch: Partial<Tool>): Promise<Tool> {
  const tools = await getTools();
  const index = tools.findIndex((tool) => tool.slug === slug);
  if (index === -1) throw new Error("NOT_FOUND");

  const current = tools[index]!;
  const updated: Tool = { ...current, ...patch, updatedAt: new Date().toISOString() };
  tools[index] = updated;

  await saveTools(tools, `chore: update tool ${slug}`);
  invalidate(CACHE_KEYS.tools);

  await appendActivity({
    id: generateId(),
    timestamp: new Date().toISOString(),
    action: "UPDATE",
    target: slug,
    status: "success"
  });

  return updated;
}

export async function deleteTool(slug: string): Promise<void> {
  const tools = await getTools();
  const target = tools.find((tool) => tool.slug === slug);
  if (!target) throw new Error("NOT_FOUND");

  for (const file of target.files) {
    await deleteToolFile(file.path);
  }

  await saveTools(
    tools.filter((tool) => tool.slug !== slug),
    `chore: delete tool ${slug}`
  );
  invalidate(CACHE_KEYS.tools);

  await appendActivity({
    id: generateId(),
    timestamp: new Date().toISOString(),
    action: "DELETE",
    target: slug,
    status: "success"
  });
}

export async function registerDownload(slug: string): Promise<Tool> {
  const tools = await getTools();
  const index = tools.findIndex((tool) => tool.slug === slug);
  if (index === -1) throw new Error("NOT_FOUND");

  const tool = tools[index]!;
  const updated: Tool = { ...tool, downloads: tool.downloads + 1 };
  tools[index] = updated;
  await saveTools(tools, `chore: increment downloads for ${slug}`);
  invalidate(CACHE_KEYS.tools);

  const stats = await getStatistics();
  const today = new Date().toISOString().slice(0, 10);
  const history = [...stats.downloadHistory];
  const todayEntry = history.find((entry) => entry.slug === slug && entry.date === today);
  if (todayEntry) {
    todayEntry.count += 1;
  } else {
    history.push({ slug, date: today, count: 1 });
  }

  await saveStatistics(
    {
      totalDownloads: stats.totalDownloads + 1,
      downloadsByTool: { ...stats.downloadsByTool, [slug]: (stats.downloadsByTool[slug] ?? 0) + 1 },
      downloadHistory: history.slice(-1000)
    },
    `chore: record download for ${slug}`
  );
  invalidate(CACHE_KEYS.statistics);

  return updated;
}

export function searchTools(tools: Tool[], query: string): Tool[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return [];

  return tools.filter((tool) => {
    if (tool.status !== "PUBLIC") return false;
    const haystack = [tool.name, tool.description, tool.category, tool.author, ...tool.tags]
      .join(" ")
      .toLowerCase();
    return haystack.includes(normalized);
  });
}
