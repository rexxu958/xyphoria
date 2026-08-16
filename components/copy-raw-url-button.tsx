"use client";

import { useState } from "react";
import { Link2, Check } from "lucide-react";
import toast from "react-hot-toast";

export default function CopyRawUrlButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success("Raw URL copied");
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <button
      onClick={handleCopy}
      className="flex items-center justify-center gap-1.5 rounded-lg border border-surface-border px-4 py-2.5 text-sm transition hover:border-primary/50 hover:text-primary"
    >
      {copied ? <Check size={14} /> : <Link2 size={14} />}
      Copy Raw URL
    </button>
  );
}
