// components/notebook-card/notebook-header.jsx
import { Heart, Ellipsis } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu"; // shadcn/ui

export default function NotebookHeader({
  isPinned,
  onTogglePin,
  onRename,
  onDelete,
  onDownload,
}) {
  return (
    <header className="flex justify-between items-start w-full">
      <button
        onClick={(e) => {
          e.stopPropagation();
          onTogglePin?.(e);
        }}
        className="p-1 text-muted-foreground transition-colors cursor-pointer"
        aria-label="Toggle favorite"
      >
        <Heart
          className="w-4 h-4"
          fill={isPinned ? "currentColor" : "none"}
          stroke="currentColor"
          color={isPinned ? "#a585ff" : "currentColor"}
        />
      </button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            onClick={(e) => e.stopPropagation()}
            className="p-1 text-muted-foreground transition-colors cursor-pointer"
            aria-label="More options"
          >
            <Ellipsis className="w-4 h-4" />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              onRename?.();
            }}
          >
            Rename
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.();
            }}
            className="text-red-500"
          >
            Delete
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              onDownload?.();
            }}
          >
            Download
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
