"use client";

import { useEffect, useState } from "react";
import { Box, FolderTree, Files, Download, Star, Activity as ActivityIcon } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import StatCard from "@/components/stat-card";
import { formatDate } from "@/lib/utils";
import type { ActivityEntry } from "@/lib/types";

interface Overview {
  totalTools: number;
  activeTools: number;
  maintenanceTools: number;
  totalCategories: number;
  featuredTools: number;
  totalFiles: number;
  totalDownloads: number;
}

interface ToolsPerCategory {
  category: string;
  count: number;
}

export default function DashboardOverviewPage() {
  const [overview, setOverview] = useState<Overview | null>(null);
  const [toolsPerCategory, setToolsPerCategory] = useState<ToolsPerCategory[]>([]);
  const [activity, setActivity] = useState<ActivityEntry[]>([]);

  useEffect(() => {
    fetch("/api/admin/analytics")
      .then((res) => res.json())
      .then((data) => {
        setOverview(data.overview);
        setToolsPerCategory(data.toolsPerCategory ?? []);
      });

    fetch("/api/admin/activity?limit=8")
      .then((res) => res.json())
      .then((data) => setActivity(data.activity ?? []));
  }, []);

  return (
    <div>
      <h1 className="font-display text-2xl font-bold">Overview</h1>
      <p className="mt-1 text-sm text-text-muted">Snapshot of your XYPHORIA platform.</p>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        <StatCard label="Total Tools" value={overview?.totalTools ?? "—"} icon={Box} accent="primary" />
        <StatCard label="Categories" value={overview?.totalCategories ?? "—"} icon={FolderTree} accent="secondary" />
        <StatCard label="Total Files" value={overview?.totalFiles ?? "—"} icon={Files} accent="primary" />
        <StatCard label="Total Downloads" value={overview?.totalDownloads ?? "—"} icon={Download} accent="success" />
        <StatCard label="Featured" value={overview?.featuredTools ?? "—"} icon={Star} accent="warning" />
        <StatCard label="Active Tools" value={overview?.activeTools ?? "—"} icon={ActivityIcon} accent="success" />
        <StatCard label="Maintenance" value={overview?.maintenanceTools ?? "—"} icon={ActivityIcon} accent="warning" />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="glass rounded-2xl p-5">
          <p className="mb-4 font-display font-semibold">Tools per Category</p>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={toolsPerCategory}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E1E2E" />
              <XAxis dataKey="category" stroke="#8A8A9E" fontSize={12} />
              <YAxis stroke="#8A8A9E" fontSize={12} allowDecimals={false} />
              <Tooltip contentStyle={{ background: "#0F0F1A", border: "1px solid #1E1E2E" }} />
              <Bar dataKey="count" fill="#6C5CE7" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="glass rounded-2xl p-5">
          <p className="mb-4 font-display font-semibold">Recent Activity</p>
          <div className="space-y-3">
            {activity.map((entry) => (
              <div key={entry.id} className="flex items-center justify-between text-sm">
                <div>
                  <p>{entry.action.replaceAll("_", " ")}</p>
                  <p className="text-xs text-text-muted">{entry.target}</p>
                </div>
                <span className="text-xs text-text-muted">{formatDate(entry.timestamp)}</span>
              </div>
            ))}
            {activity.length === 0 && <p className="text-sm text-text-muted">No activity yet.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
