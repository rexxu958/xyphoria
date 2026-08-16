export type ToolStatus = "PUBLIC" | "HIDDEN" | "MAINTENANCE";

export interface ToolFile {
  path: string;
  rawUrl: string;
  githubUrl: string;
  size: number;
  format: string;
}

export interface Tool {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  version: string;
  author: string;
  tags: string[];
  thumbnail: string | null;
  icon: string | null;
  files: ToolFile[];
  primaryFile: ToolFile | null;
  status: ToolStatus;
  featured: boolean;
  downloads: number;
  maintenanceTitle: string | null;
  maintenanceMessage: string | null;
  maintenanceEta: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
  gradientFrom: string;
  gradientTo: string;
  order: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SiteSettings {
  siteName: string;
  description: string;
  logo: string | null;
  favicon: string | null;
  footerText: string;
  socialLinks: { label: string; url: string }[];
  githubRepository: string;
  maintenance: boolean;
  maintenanceTitle: string;
  maintenanceMessage: string;
  maintenanceEta: string | null;
}

export type ActivityAction =
  | "LOGIN"
  | "LOGOUT"
  | "UPLOAD"
  | "UPDATE"
  | "DELETE"
  | "CATEGORY_CREATED"
  | "CATEGORY_UPDATED"
  | "CATEGORY_DELETED"
  | "FILE_UPLOADED"
  | "FILE_DELETED"
  | "MAINTENANCE_ENABLED"
  | "MAINTENANCE_DISABLED"
  | "SETTINGS_CHANGED";

export interface ActivityEntry {
  id: string;
  timestamp: string;
  action: ActivityAction;
  target: string;
  status: "success" | "error";
  detail?: string;
}

export interface DownloadStat {
  slug: string;
  date: string;
  count: number;
}

export interface Statistics {
  totalDownloads: number;
  downloadsByTool: Record<string, number>;
  downloadHistory: DownloadStat[];
}

export interface Database {
  tools: Tool[];
  categories: Category[];
  settings: SiteSettings;
  statistics: Statistics;
  activity: ActivityEntry[];
}
