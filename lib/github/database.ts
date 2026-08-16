import "server-only";
import {
  createRepository,
  decodeBase64,
  encodeBase64,
  getFile,
  putFile,
  repositoryExists
} from "./client";
import type { ActivityEntry, Category, Database, SiteSettings, Statistics, Tool } from "../types";

const PATHS = {
  tools: "data/tools.json",
  categories: "data/categories.json",
  settings: "data/settings.json",
  statistics: "data/statistics.json",
  activity: "data/activity.json"
};

const DEFAULT_SETTINGS: SiteSettings = {
  siteName: "XYPHORIA",
  description: "Tools. Code. Innovation.",
  logo: null,
  favicon: null,
  footerText: "Tools, code and innovation.",
  socialLinks: [],
  githubRepository: "",
  maintenance: false,
  maintenanceTitle: "XYPHORIA is under maintenance",
  maintenanceMessage: "We are performing scheduled maintenance. Please check back soon.",
  maintenanceEta: null
};

const DEFAULT_STATISTICS: Statistics = {
  totalDownloads: 0,
  downloadsByTool: {},
  downloadHistory: []
};

async function readJson<T>(path: string, fallback: T): Promise<{ data: T; sha: string | null }> {
  const file = await getFile(path);
  if (!file) return { data: fallback, sha: null };
  const parsed = JSON.parse(decodeBase64(file.content)) as T;
  return { data: parsed, sha: file.sha };
}

async function writeJson(path: string, data: unknown, message: string, sha?: string | null) {
  return putFile({
    path,
    content: encodeBase64(JSON.stringify(data, null, 2)),
    message,
    sha: sha ?? undefined
  });
}

export async function ensureBootstrap(): Promise<void> {
  const exists = await repositoryExists();
  if (!exists) {
    await createRepository();
  }

  const tools = await getFile(PATHS.tools);
  if (!tools) await writeJson(PATHS.tools, { tools: [] }, "chore: bootstrap tools.json");

  const categories = await getFile(PATHS.categories);
  if (!categories) await writeJson(PATHS.categories, { categories: [] }, "chore: bootstrap categories.json");

  const settings = await getFile(PATHS.settings);
  if (!settings) await writeJson(PATHS.settings, DEFAULT_SETTINGS, "chore: bootstrap settings.json");

  const statistics = await getFile(PATHS.statistics);
  if (!statistics)
    await writeJson(PATHS.statistics, DEFAULT_STATISTICS, "chore: bootstrap statistics.json");

  const activity = await getFile(PATHS.activity);
  if (!activity) await writeJson(PATHS.activity, { activity: [] }, "chore: bootstrap activity.json");
}

export async function getTools(): Promise<Tool[]> {
  const { data } = await readJson<{ tools: Tool[] }>(PATHS.tools, { tools: [] });
  return Array.isArray(data?.tools) ? data.tools : Array.isArray(data) ? (data as unknown as Tool[]) : [];
}

export async function saveTools(tools: Tool[], message: string): Promise<void> {
  const { sha } = await readJson<{ tools: Tool[] }>(PATHS.tools, { tools: [] });
  await writeJson(PATHS.tools, { tools }, message, sha);
}

export async function getCategories(): Promise<Category[]> {
  const { data } = await readJson<{ categories: Category[] }>(PATHS.categories, { categories: [] });
  return Array.isArray(data?.categories) ? data.categories : Array.isArray(data) ? (data as unknown as Category[]) : [];
}

export async function saveCategories(categories: Category[], message: string): Promise<void> {
  const { sha } = await readJson<{ categories: Category[] }>(PATHS.categories, { categories: [] });
  await writeJson(PATHS.categories, { categories }, message, sha);
}

export async function getSettings(): Promise<SiteSettings> {
  const { data } = await readJson<SiteSettings>(PATHS.settings, DEFAULT_SETTINGS);
  return data;
}

export async function saveSettings(settings: SiteSettings, message: string): Promise<void> {
  const { sha } = await readJson<SiteSettings>(PATHS.settings, DEFAULT_SETTINGS);
  await writeJson(PATHS.settings, settings, message, sha);
}

export async function getStatistics(): Promise<Statistics> {
  const { data } = await readJson<Statistics>(PATHS.statistics, DEFAULT_STATISTICS);
  return data;
}

export async function saveStatistics(statistics: Statistics, message: string): Promise<void> {
  const { sha } = await readJson<Statistics>(PATHS.statistics, DEFAULT_STATISTICS);
  await writeJson(PATHS.statistics, statistics, message, sha);
}

export async function getActivity(): Promise<ActivityEntry[]> {
  const { data } = await readJson<{ activity: ActivityEntry[] }>(PATHS.activity, { activity: [] });
  return Array.isArray(data?.activity) ? data.activity : Array.isArray(data) ? (data as unknown as ActivityEntry[]) : [];
}

export async function appendActivity(entry: ActivityEntry): Promise<void> {
  const { data, sha } = await readJson<{ activity: ActivityEntry[] }>(PATHS.activity, { activity: [] });
  const currentActivity = Array.isArray(data?.activity)
    ? data.activity
    : Array.isArray(data)
      ? (data as unknown as ActivityEntry[])
      : [];
  const next = [entry, ...currentActivity].slice(0, 500);
  await writeJson(PATHS.activity, { activity: next }, `chore: log ${entry.action}`, sha);
}

export async function getFullDatabase(): Promise<Database> {
  const [tools, categories, settings, statistics, activity] = await Promise.all([
    getTools(),
    getCategories(),
    getSettings(),
    getStatistics(),
    getActivity()
  ]);
  return { tools, categories, settings, statistics, activity };
}
