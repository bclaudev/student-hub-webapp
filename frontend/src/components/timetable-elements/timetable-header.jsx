// src/components/timetable-elements/timetable-header.jsx
import { useState, useEffect } from "react";
import { Pencil, Trash } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { Button } from "@/components/ui/button";
import TimetableModal from "@/components/timetable-elements/timetable-modal";
import CreateSemesterDialog from "./timetable-semester-dialog";
import { toast } from "sonner";

export default function TimetableHeader({
  onSave,
  onSemesterChange,
  activeSemesterId,
  activeSemester,
}) {
  const [semesters, setSemesters] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSemester, setEditingSemester] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  useEffect(() => {
    const fetchSemesters = async () => {
      try {
        const res = await fetch("/api/semesters", {
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });
        if (!res.ok) throw new Error(`Error ${res.status}`);
        const data = await res.json();
        setSemesters(data.semesters || []);
        if (data.semesters && data.semesters.length > 0) {
          onSemesterChange?.(data.semesters[0]);
        }
      } catch (err) {
        console.error("Failed to fetch semesters:", err);
      }
    };
    fetchSemesters();
  }, []);

  const handleSelectSemester = (semester) => {
    onSemesterChange?.(semester);
  };

  const handleDeleteSemester = async (id) => {
    try {
      const res = await fetch(`http://localhost:8787/api/semesters/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to delete semester");

      setSemesters((prev) => prev.filter((s) => s.id !== id));
      onSemesterChange?.(null);
      toast("Semester deleted successfully.");
    } catch (err) {
      toast("Could not delete semester.");
    }
  };

  const handleEdit = async () => {
    const res = await fetch(`/api/semesters/${editingSemester.id}`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, startDate, endDate }),
    });

    if (!res.ok) throw new Error("Failed to update semester");

    const updated = await res.json();
    onSemesterEdited?.(updated);
    onOpenChange(false);
  };

  const handleEditSemester = (semester) => {
    setEditingSemester(semester);
    setIsDialogOpen(true);
  };

  return (
    <div className="bg-background text-foreground">
      <div className="px-4 py-2 flex items-center justify-between h-20 border-b border-border relative">
        {/* LEFT SIDE */}
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold">Timetable</h2>

          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  {activeSemester?.name || "Select semester"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="z-50">
                {semesters.map((semester) => (
                  <DropdownMenuItem
                    key={semester.id}
                    onSelect={() => handleSelectSemester(semester)}
                  >
                    {semester.name}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuItem onSelect={() => setIsDialogOpen(true)}>
                  Create new semester
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {activeSemester && (
              <>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleEditSemester(activeSemester)}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="icon">
                      <Trash className="w-4 h-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete semester?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action is <strong>permanent</strong> and cannot be
                        undone.
                        <br />
                        All classes and calendar events associated with this
                        semester will be <strong>permanently deleted</strong>.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-red-600 text-white hover:bg-red-700"
                        onClick={() => handleDeleteSemester(activeSemester.id)}
                      >
                        Confirm
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </>
            )}
          </div>
        </div>

        {/* RIGHT SIDE */}
        <Button onClick={() => setIsModalOpen(true)}>Add new class</Button>
      </div>

      <TimetableModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSave={onSave}
        semesterId={activeSemesterId}
        semesterStartDate={activeSemester?.startDate}
      />

      <CreateSemesterDialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) setEditingSemester(null); // reset după închidere
        }}
        editingSemester={editingSemester}
        onSemesterCreated={(newSemester) => {
          setSemesters((prev) => [...prev, newSemester]);
          onSemesterChange?.(newSemester);
        }}
        onSemesterEdited={(updatedSemester) => {
          setSemesters((prev) =>
            prev.map((s) => (s.id === updatedSemester.id ? updatedSemester : s))
          );
          onSemesterChange?.(updatedSemester);
        }}
      />
    </div>
  );
}
