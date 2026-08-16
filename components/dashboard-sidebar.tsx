"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Box,
  Upload,
  FolderTree,
  LogOut,
  Menu,
  X,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

const items = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/tools", label: "Tools", icon: Box },
  { href: "/dashboard/upload", label: "Upload", icon: Upload },
  { href: "/dashboard/categories", label: "Categories", icon: FolderTree },
  { href: "/dashboard/settings", label: "Settings", icon: Sparkles }
];

export default function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    toast.success("Logged out");
    router.push("/");
    router.refresh();
  }

  const content = (
    <div className="flex h-full flex-col">
      <Link href="/" className="mb-8 flex items-center gap-2 font-display text-lg font-bold">
        <Sparkles size={18} className="text-primary" />
        <span className="text-gradient">XYPHORIA</span>
      </Link>

      <nav className="flex flex-1 flex-col gap-1">
        {items.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition",
                active ? "bg-primary/15 text-primary" : "text-text-muted hover:bg-surface-hover hover:text-text"
              )}
            >
              <item.icon size={16} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <button
        onClick={handleLogout}
        className="mt-4 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-danger transition hover:bg-danger/10"
      >
        <LogOut size={16} />
        Logout
      </button>
    </div>
  );

  return (
    <>
      <aside className="glass sticky top-4 hidden h-[calc(100vh-2rem)] w-64 flex-shrink-0 rounded-2xl p-5 md:flex">
        {content}
      </aside>

      <div className="glass sticky top-0 z-40 flex items-center justify-between rounded-b-2xl p-4 md:hidden">
        <Link href="/" className="flex items-center gap-2 font-display text-base font-bold">
          <Sparkles size={16} className="text-primary" />
          <span className="text-gradient">XYPHORIA</span>
        </Link>
        <button onClick={() => setMobileOpen(true)} aria-label="Open menu">
          <Menu size={20} />
        </button>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="glass w-72 p-5">
            <button
              onClick={() => setMobileOpen(false)}
              className="mb-4 ml-auto flex"
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
            {content}
          </div>
          <div className="flex-1 bg-black/60" onClick={() => setMobileOpen(false)} />
        </div>
      )}
    </>
  );
}
