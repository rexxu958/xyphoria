"use client";

import { useCallback, useState } from "react";
import { UploadCloud, File as FileIcon, X } from "lucide-react";
import { formatBytes } from "@/lib/utils";

interface UploadZoneProps {
  files: File[];
  onChange: (files: File[]) => void;
}

export default function UploadZone({ files, onChange }: UploadZoneProps) {
  const [dragging, setDragging] = useState(false);

  const handleDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      setDragging(false);
      const dropped = Array.from(event.dataTransfer.files);
      onChange([...files, ...dropped]);
    },
    [files, onChange]
  );

  return (
    <div>
      <div
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-10 text-center transition ${
          dragging ? "border-primary bg-primary/5" : "border-surface-border"
        }`}
      >
        <UploadCloud size={28} className="text-primary" />
        <p className="mt-3 text-sm">Drag & drop files here</p>
        <p className="mt-1 text-xs text-text-muted">or</p>
        <label className="mt-2 cursor-pointer rounded-lg bg-primary/10 px-4 py-2 text-sm font-medium text-primary transition hover:bg-primary/20">
          Browse Files
          <input
            type="file"
            multiple
            className="hidden"
            onChange={(event) => {
              if (!event.target.files) return;
              onChange([...files, ...Array.from(event.target.files)]);
            }}
          />
        </label>
      </div>

      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          {files.map((file, index) => (
            <div key={`${file.name}-${index}`} className="glass flex items-center justify-between rounded-lg px-4 py-2.5">
              <div className="flex items-center gap-2 text-sm">
                <FileIcon size={15} className="text-text-muted" />
                {file.name}
              </div>
              <div className="flex items-center gap-3 text-xs text-text-muted">
                {formatBytes(file.size)}
                <button onClick={() => onChange(files.filter((_, i) => i !== index))} aria-label="Remove file">
                  <X size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
