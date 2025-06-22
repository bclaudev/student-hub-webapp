import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

export default function RenameNotebookModal({
  isOpen,
  onClose,
  onConfirm,
  defaultTitle,
}) {
  const [title, setTitle] = useState("");
  useEffect(() => {
    if (isOpen) setTitle(defaultTitle || "");
  }, [isOpen, defaultTitle]);

  const onCloseWithCleanup = () => {
    document.body.style.overflow = "";
    onClose();
  };
  const handleConfirm = () => {
    if (title.trim()) {
      onConfirm(title.trim());
      onCloseWithCleanup();
    }
  };

  console.log("Modal mounted", isOpen);
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onCloseWithCleanup();
      }}
    >
      <DialogContent
        key={isOpen ? "open" : "closed"}
        className="text-foreground"
      >
        <DialogHeader>
          <DialogTitle>Rename Notebook</DialogTitle>
        </DialogHeader>

        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter new title"
        />

        <DialogFooter>
          <Button variant="ghost" onClick={onCloseWithCleanup}>
            Cancel
          </Button>
          <Button onClick={handleConfirm}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
