"use client";

import { useEffect, useState } from "react";
import { Copy, Check } from "lucide-react";
import toast from "react-hot-toast";

const TEXT_EXTENSIONS = new Set([
  "js", "ts", "tsx", "jsx", "json", "html", "css", "py", "md", "yml", "yaml", "sh", "go", "rs", "java", "php", "c", "cpp", "txt"
]);

export default function CodeViewer({ rawUrl, format }: { rawUrl: string; format: string }) {
  const [code, setCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  const extension = format.toLowerCase();
  const isText = TEXT_EXTENSIONS.has(extension);

  useEffect(() => {
    if (!isText) {
      setLoading(false);
      return;
    }
    fetch(rawUrl)
      .then((res) => (res.ok ? res.text() : Promise.reject()))
      .then((text) => setCode(text.slice(0, 20000)))
      .catch(() => setCode(null))
      .finally(() => setLoading(false));
  }, [rawUrl, isText]);

  async function handleCopy() {
    if (!code) return;
    await navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success("Code copied to clipboard");
    setTimeout(() => setCopied(false), 1500);
  }

  if (!isText) {
    return (
      <div className="glass rounded-2xl p-8 text-center text-sm text-text-muted">
        Preview is not available for .{extension} files. Use Download to get the file.
      </div>
    );
  }

  return (
    <div className="glass overflow-hidden rounded-2xl">
      <div className="flex items-center justify-between border-b border-surface-border px-4 py-2.5">
        <span className="text-xs uppercase tracking-wide text-text-muted">{format}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs text-text-muted transition hover:text-primary"
        >
          {copied ? <Check size={13} /> : <Copy size={13} />}
          Copy Code
        </button>
      </div>
      <div className="max-h-[500px] overflow-auto p-4">
        {loading && <p className="text-sm text-text-muted">Loading preview...</p>}
        {!loading && code && (
          <pre className="text-xs leading-relaxed text-text">
            <code>{code}</code>
          </pre>
        )}
        {!loading && !code && <p className="text-sm text-text-muted">Unable to load preview.</p>}
      </div>
    </div>
  );
}
