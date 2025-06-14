import { Heart, Ellipsis } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"; // din shadcn

export default function FileHeader({
  isPinned,
  onTogglePin,
  fileId,
  onRename,
  onDelete,
}) {
  return (
    <header className="flex justify-between items-start w-full">
      {/* Heart button */}
      <button
        onClick={(e) => {
          e.stopPropagation(); // ⛔️ oprește clickul să ajungă la card
          onTogglePin();
        }}
        className="p-1 text-muted-foreground transition-colors cursor-pointer"
        aria-label="Toggle favorite"
      >
        <Heart
          className="w-4 h-4"
          fill={isPinned ? "currentColor" : "none"}
          stroke="currentColor"
          color={isPinned ? "#ef4444" : "currentColor"}
        />
      </button>

      {/* Ellipsis button */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className="p-1 text-muted-foreground cursor-pointer transition-colors"
            aria-label="More options"
            onClick={(e) => e.stopPropagation()} // important ca să nu deschidă PDF-ul
          >
            <Ellipsis className="w-4 h-4" />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              onRename();
            }}
          >
            Rename
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-red-500"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
