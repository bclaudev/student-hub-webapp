import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function CreateSemesterDialog({
  open,
  onOpenChange,
  onSemesterCreated,
  onSemesterEdited,
  editingSemester,
}) {
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    if (editingSemester) {
      setName(editingSemester.name || "");
      setStartDate(editingSemester.startDate?.slice(0, 10) || "");
      setEndDate(editingSemester.endDate?.slice(0, 10) || "");
    } else {
      setName("");
      setStartDate("");
      setEndDate("");
    }
  }, [editingSemester]);

  const handleSave = async () => {
    if (new Date(startDate) >= new Date(endDate)) {
      toast.error("Start date must be before end date.");
      return;
    }

    const payload = { name, startDate, endDate };

    try {
      if (editingSemester) {
        const res = await fetch(
          `http://localhost:8787/api/semesters/${editingSemester.id}`,
          {
            method: "PATCH",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }
        );
        if (!res.ok) throw new Error("Failed to update semester");
        const updated = await res.json();
        onSemesterEdited?.(updated);
        toast.success("Semester updated.");
      } else {
        const res = await fetch("http://localhost:8787/api/semesters/set", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Failed to create semester");
        const created = await res.json();
        onSemesterCreated?.(created);
        toast.success("Semester created.");
      }

      onOpenChange(false);
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-foreground">
            {editingSemester ? "Edit semester" : "Create new semester"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm text-foreground">
              Semester name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-background text-foreground"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="startDate" className="text-sm text-foreground">
              Start date
            </Label>
            <Input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="bg-background text-foreground"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="endDate" className="text-sm text-foreground">
              End date
            </Label>
            <Input
              id="endDate"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="bg-background text-foreground"
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={handleSave}
            disabled={!name || !startDate || !endDate}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
