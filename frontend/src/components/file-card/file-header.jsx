import { Heart, Ellipsis } from "lucide-react";

export default function FileHeader({ isPinned, onTogglePin }) {
  return (
    <header className="flex justify-between items-start w-full">
      {/* Heart button */}
      <button
        onClick={onTogglePin}
        className="p-1 text-muted-foreground transition-colors cursor-pointer"
        aria-label="Toggle favorite"
      >
        <Heart
          className="w-3 h-3"
          fill={isPinned ? "currentColor" : "none"}
          stroke="currentColor"
          color={isPinned ? "#ef4444" : "currentColor"}
        />
      </button>

      {/* Ellipsis button */}
      <button
        className="p-1 text-muted-foreground cursor-pointer transition-colors"
        aria-label="More options"
      >
        <Ellipsis className="w-3 h-3" />
      </button>
    </header>
  );
}
