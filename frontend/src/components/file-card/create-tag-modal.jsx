import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function CreateTagModal({ open, onOpenChange, fileId, onTagCreated }) {
  const [tagName, setTagName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!tagName.trim()) return;
    setLoading(true);

    const res = await fetch("http://localhost:8787/api/tags", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ name: tagName, fileId }),
    });

    let data = {};
    try {
      data = await res.json();
    } catch (err) {
      console.error("❌ Răspuns invalid JSON de la backend:", err);
    }

    setLoading(false);

    if (!res.ok) {
      console.error("❌ Eroare la creare tag:", data);
      return;
    }

    onTagCreated?.(data);
    setTagName("");
    onOpenChange(false);
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Tag</DialogTitle>
        </DialogHeader>

        <Input
          placeholder="Tag name"
          value={tagName}
          onChange={(e) => setTagName(e.target.value)}
        />

        <DialogFooter>
          <Button onClick={handleCreate} disabled={loading}>
            {loading ? "Creating..." : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
