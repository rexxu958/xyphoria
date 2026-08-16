import { getSettings } from "@/lib/github/database";
import { Wrench } from "lucide-react";

export default async function MaintenancePage() {
  const settings = await getSettings().catch(() => null);

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center px-6 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-warning/10 text-warning">
        <Wrench size={26} />
      </div>
      <h1 className="mt-5 font-display text-2xl font-bold">
        {settings?.maintenanceTitle ?? "XYPHORIA is under maintenance"}
      </h1>
      <p className="mt-3 text-sm text-text-muted">
        {settings?.maintenanceMessage ??
          "We are performing scheduled maintenance. Please check back soon."}
      </p>
      {settings?.maintenanceEta && (
        <p className="mt-3 text-xs text-text-muted">Estimated restoration: {settings.maintenanceEta}</p>
      )}
    </div>
  );
}
