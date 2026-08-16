import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  accent?: "primary" | "secondary" | "success" | "warning";
}

const accentMap = {
  primary: "text-primary bg-primary/10",
  secondary: "text-secondary bg-secondary/10",
  success: "text-success bg-success/10",
  warning: "text-warning bg-warning/10"
};

export default function StatCard({ label, value, icon: Icon, accent = "primary" }: StatCardProps) {
  return (
    <div className="glass rounded-2xl p-5">
      <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg", accentMap[accent])}>
        <Icon size={18} />
      </div>
      <p className="mt-4 text-2xl font-bold font-display">{value}</p>
      <p className="mt-1 text-xs text-text-muted">{label}</p>
    </div>
  );
}
