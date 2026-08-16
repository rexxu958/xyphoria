import { z } from "zod";

export const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const toolStatusSchema = z.enum(["PUBLIC", "HIDDEN", "MAINTENANCE"]);

export const toolInputSchema = z.object({
  name: z.string().min(2).max(120),
  slug: z.string().regex(slugPattern).max(120),
  description: z.string().min(1).max(4000),
  category: z.string().regex(slugPattern),
  version: z.string().min(1).max(40),
  author: z.string().min(1).max(120),
  tags: z.array(z.string().max(40)).max(20).default([]),
  thumbnail: z.string().url().nullable().optional(),
  icon: z.string().max(60).nullable().optional(),
  status: toolStatusSchema.default("PUBLIC"),
  featured: z.boolean().default(false)
});

export const toolUpdateSchema = toolInputSchema.partial();

export const categoryInputSchema = z.object({
  name: z.string().min(1).max(80),
  slug: z.string().regex(slugPattern).max(80),
  description: z.string().max(1000).default(""),
  icon: z.string().max(60).default("folder"),
  gradientFrom: z.string().max(20).default("#6C5CE7"),
  gradientTo: z.string().max(20).default("#00D9C6"),
  active: z.boolean().default(true)
});

export const categoryUpdateSchema = categoryInputSchema.partial();

export const categoryReorderSchema = z.object({
  order: z.array(z.string().regex(slugPattern)).min(1)
});

export const loginSchema = z.object({
  username: z.string().min(1).max(80),
  password: z.string().min(1).max(200)
});

export const passwordChangeSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8).max(200)
});

export const settingsUpdateSchema = z.object({
  siteName: z.string().min(1).max(80).optional(),
  description: z.string().max(300).optional(),
  logo: z.string().url().nullable().optional(),
  favicon: z.string().url().nullable().optional(),
  footerText: z.string().max(200).optional(),
  socialLinks: z.array(z.object({ label: z.string().max(40), url: z.string().url() })).max(10).optional(),
  githubRepository: z.string().max(200).optional(),
  maintenance: z.boolean().optional(),
  maintenanceTitle: z.string().max(120).optional(),
  maintenanceMessage: z.string().max(1000).optional(),
  maintenanceEta: z.string().nullable().optional()
});

export const searchQuerySchema = z.object({
  q: z.string().min(1).max(200)
});

export const ALLOWED_UPLOAD_EXTENSIONS = new Set([
  "zip",
  "rar",
  "7z",
  "js",
  "ts",
  "tsx",
  "jsx",
  "html",
  "css",
  "json",
  "py",
  "java",
  "apk",
  "exe",
  "dll",
  "txt",
  "md",
  "png",
  "jpg",
  "jpeg",
  "gif",
  "webp",
  "svg",
  "mp4",
  "mp3",
  "wav",
  "pdf",
  "yml",
  "yaml",
  "env",
  "sh",
  "go",
  "rs",
  "c",
  "cpp",
  "php"
]);

export const MAX_UPLOAD_SIZE_BYTES = 25 * 1024 * 1024;

export function isPathTraversal(filename: string): boolean {
  return filename.includes("..") || filename.includes("/") || filename.includes("\\");
}
