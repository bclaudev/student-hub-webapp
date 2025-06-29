import { ChevronRight } from "lucide-react";
import { useState } from "react";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
} from "@/components/ui/context-menu";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

function darkenHexColor(hex, amount = 20) {
  return `#${hex
    .replace("#", "")
    .match(/.{2}/g)
    .map((c) =>
      Math.max(0, parseInt(c, 16) - amount)
        .toString(16)
        .padStart(2, "0")
    )
    .join("")}`;
}

const TimetableItem = ({
  event,
  onColorChange,
  onEdit,
  onDelete,
  onPreview,
}) => {
  const color = event.color || "#a585ff";
  const iconColor = darkenHexColor(color, 80);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const startTime = new Date(event.start).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const endTime = new Date(event.end).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const COLORS = [
    { label: "Vanilla Fog", value: "#D9D5BA" },
    { label: "Blush Error", value: "#D9B0B1" },
    { label: "Midnight Denim", value: "#596F8F" },
    { label: "Cloud Link", value: "#A5BAD9" },
    { label: "Parchment Whisper", value: "#F8F5E3" },
    { label: "Mint Ghost", value: "#DEEEE4" },
    { label: "Lavender Static", value: "#D1D0E4" },
    { label: "Skybuffer", value: "#E3EEF8" },
  ];

  const icon = (() => {
    const style = { backgroundColor: iconColor };
    switch (event.class_type) {
      case "course":
        return (
          <div
            style={style}
            className="w-[3px] h-3 rounded-full bg-white mt-[2px]"
          />
        );
      case "seminar":
        return (
          <ChevronRight
            size={14}
            strokeWidth={5}
            style={{ color: iconColor }}
          />
        );
      case "colloquy":
        return (
          <div
            style={style}
            className="w-[6px] h-[6px] rounded-full bg-white mt-[1px]"
          />
        );
      default:
        return null;
    }
  })();

  return (
    <>
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <div className="h-full w-full">
            <div
              onClick={() => onPreview()}
              className="h-full w-full px-3 text-sm text-black cursor-pointer !rounded-none flex flex-col justify-center gap-1 hover:brightness-105 transition"
              style={{ backgroundColor: color }}
            >
              <div className="flex items-center gap-2 font-semibold">
                {icon}
                <span>{event.abbreviation}</span>
              </div>

              <div className="text-xs leading-tight">
                <div className="opacity-90">
                  {startTime} – {endTime}
                </div>
                {event.location && (
                  <div className="opacity-90">Room: {event.location}</div>
                )}
              </div>
            </div>
          </div>
        </ContextMenuTrigger>

        <ContextMenuContent className="w-48">
          <ContextMenuItem onClick={() => onEdit()}>Edit</ContextMenuItem>

          <ContextMenuItem
            onSelect={(e) => {
              e.preventDefault();
              setTimeout(() => setShowDeleteDialog(true), 0);
            }}
          >
            Delete
          </ContextMenuItem>

          <ContextMenuSub>
            <ContextMenuSubTrigger>Change Color</ContextMenuSubTrigger>
            <ContextMenuSubContent>
              {COLORS.map((c) => (
                <ContextMenuItem
                  key={c.value}
                  onClick={() => onColorChange(event.classId, c.value)}
                >
                  <div
                    className="w-4 h-4 rounded-full mr-2 border"
                    style={{ backgroundColor: c.value }}
                  />
                  {c.label}
                </ContextMenuItem>
              ))}
            </ContextMenuSubContent>
          </ContextMenuSub>
        </ContextMenuContent>
      </ContextMenu>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this class?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              class and all its events.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 text-white hover:bg-red-700"
              onClick={() => {
                onDelete(event.classId);
                setShowDeleteDialog(false);
              }}
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default TimetableItem;
