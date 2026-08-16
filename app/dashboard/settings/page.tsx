"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import type { SiteSettings } from "@/lib/types";

export default function DashboardSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [saving, setSaving] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [generatedHash, setGeneratedHash] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((res) => res.json())
      .then((data) => setSettings(data.settings));
  }, []);

  function updateField<K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) {
    setSettings((prev) => (prev ? { ...prev, [key]: value } : prev));
  }

  async function handleSave(event: React.FormEvent) {
    event.preventDefault();
    if (!settings) return;
    setSaving(true);
    const res = await fetch("/api/admin/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings)
    });
    setSaving(false);
    if (res.ok) {
      toast.success("Settings saved");
    } else {
      toast.error("Failed to save settings");
    }
  }

  async function handlePasswordChange(event: React.FormEvent) {
    event.preventDefault();
    const res = await fetch("/api/admin/settings/password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword, newPassword })
    });
    const data = await res.json();
    if (!res.ok) {
      toast.error(data.error ?? "Failed to change password");
      return;
    }
    setGeneratedHash(data.newPasswordHash);
    toast.success("New password hash generated");
  }

  if (!settings) {
    return <p className="text-sm text-text-muted">Loading settings...</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Settings</h1>
        <p className="mt-1 text-sm text-text-muted">Manage site information and maintenance mode.</p>
      </div>

      <form onSubmit={handleSave} className="glass space-y-4 rounded-2xl p-6">
        <p className="font-display font-semibold">Site Information</p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs text-text-muted">Site Name</label>
            <input
              value={settings.siteName}
              onChange={(event) => updateField("siteName", event.target.value)}
              className="mt-1 w-full rounded-lg border border-surface-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary/50"
            />
          </div>
          <div>
            <label className="text-xs text-text-muted">GitHub Repository</label>
            <input
              value={settings.githubRepository}
              onChange={(event) => updateField("githubRepository", event.target.value)}
              placeholder="owner/repository"
              className="mt-1 w-full rounded-lg border border-surface-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary/50"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="text-xs text-text-muted">Description</label>
            <textarea
              value={settings.description}
              onChange={(event) => updateField("description", event.target.value)}
              rows={2}
              className="mt-1 w-full rounded-lg border border-surface-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary/50"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="text-xs text-text-muted">Footer Text</label>
            <input
              value={settings.footerText}
              onChange={(event) => updateField("footerText", event.target.value)}
              className="mt-1 w-full rounded-lg border border-surface-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary/50"
            />
          </div>
        </div>

        <div className="border-t border-surface-border pt-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={settings.maintenance}
              onChange={(event) => updateField("maintenance", event.target.checked)}
              id="site-maintenance"
            />
            <label htmlFor="site-maintenance" className="text-sm font-medium">
              Enable site-wide maintenance mode
            </label>
          </div>

          {settings.maintenance && (
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs text-text-muted">Maintenance Title</label>
                <input
                  value={settings.maintenanceTitle}
                  onChange={(event) => updateField("maintenanceTitle", event.target.value)}
                  className="mt-1 w-full rounded-lg border border-surface-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary/50"
                />
              </div>
              <div>
                <label className="text-xs text-text-muted">Estimated Restoration</label>
                <input
                  value={settings.maintenanceEta ?? ""}
                  onChange={(event) => updateField("maintenanceEta", event.target.value)}
                  className="mt-1 w-full rounded-lg border border-surface-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary/50"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs text-text-muted">Maintenance Message</label>
                <textarea
                  value={settings.maintenanceMessage}
                  onChange={(event) => updateField("maintenanceMessage", event.target.value)}
                  rows={2}
                  className="mt-1 w-full rounded-lg border border-surface-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary/50"
                />
              </div>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-dark disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </form>

      <form onSubmit={handlePasswordChange} className="glass space-y-4 rounded-2xl p-6">
        <p className="font-display font-semibold">Change Password</p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs text-text-muted">Current Password</label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
              className="mt-1 w-full rounded-lg border border-surface-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary/50"
            />
          </div>
          <div>
            <label className="text-xs text-text-muted">New Password</label>
            <input
              type="password"
              required
              minLength={8}
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              className="mt-1 w-full rounded-lg border border-surface-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary/50"
            />
          </div>
        </div>
        <button
          type="submit"
          className="rounded-lg border border-surface-border px-6 py-2.5 text-sm font-semibold transition hover:border-primary/50"
        >
          Generate New Password Hash
        </button>

        {generatedHash && (
          <div className="rounded-lg border border-warning/30 bg-warning/5 p-4 text-xs">
            <p className="text-warning">
              Copy this value into your <code>OWNER_PASSWORD_HASH</code> environment variable and
              redeploy. This app cannot write to environment variables directly.
            </p>
            <code className="mt-2 block break-all text-text-muted">{generatedHash}</code>
          </div>
        )}
      </form>
    </div>
  );
}
