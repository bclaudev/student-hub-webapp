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

/**
 * FileHeader — now includes "Tags" submenu directly in the dropdown.
 */
export default function FileHeader({
  isPinned,
  onTogglePin,
  fileId, // kept for potential future use
  onRename,
  onDelete,
  predefinedTags = [],
  onAddTag = () => {},
  onOpenCreateTag = () => {},
}) {
  return (
    <header className="flex justify-between items-start w-full">
      {/* ❤️ Pin / Unpin button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
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

      {/* ⋯ Dropdown actions */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className="p-1 text-muted-foreground cursor-pointer transition-colors"
            aria-label="More options"
            onClick={(e) => e.stopPropagation()}
          >
            <Ellipsis className="w-4 h-4" />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          {/* Tags submenu */}
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Tags</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              {predefinedTags.map((tag) => (
                <DropdownMenuItem
                  key={tag}
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddTag(tag);
                  }}
                >
                  {tag}
                </DropdownMenuItem>
              ))}
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenCreateTag();
                }}
              >
                Create new tag
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          {/* Rename */}
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              onRename();
            }}
          >
            Rename
          </DropdownMenuItem>

          {/* Delete */}
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
