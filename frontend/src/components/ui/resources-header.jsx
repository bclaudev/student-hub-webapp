import { Upload } from "lucide-react";
import UploadModal from "../file-upload/upload-modal";
import { useEffect, useState } from "react";

export default function ResourcesHeader({ tags, activeTag, setActiveTag }) {
  return (
    <div className="bg-background text-foreground">
      {/* Primul rând: titlu + buton + border bottom */}
      <div className="px-4 py-2 flex items-center justify-between h-20 border-b border-border">
        <h2 className="text-lg font-semibold">Resources</h2>
        <UploadModal />
      </div>

      {/* Al doilea rând: tag-uri */}
      <div className="px-4 py-2 flex gap-2 border-b border-border">
        {tags.map((tag) => {
          const isActive = activeTag === tag.label;
          return (
            <button
              key={tag.label}
              onClick={() =>
                setActiveTag((prev) => (prev === tag.label ? null : tag.label))
              }
              className={`px-3 py-1 rounded-full text-sm transition-all border ${
                isActive
                  ? "bg-muted text-foreground border-transparent"
                  : "bg-transparent border-border text-muted-foreground"
              }`}
            >
              {tag.label}
              {!isActive && (
                <span className="ml-1 text-xs">({tag.count ?? 0})</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
