//src/components/timetable-elements/timetable-header.jsx
import { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import TimetableModal from "@/components/timetable-elements/timetable-modal";

export default function TimetableHeader({
  onSave,
  onSemesterChange,
  activeSemesterId,
  activeSemester,
}) {
  const [semesters, setSemesters] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchSemesters = async () => {
      try {
        const res = await fetch("/api/semesters", {
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });
        if (!res.ok) throw new Error(`Error ${res.status}`);
        const data = await res.json(); // ne așteptăm la { semesters: [...] }
        setSemesters(data.semesters || []);
        if (data.semesters && data.semesters.length > 0) {
          // Selectează automat primul semester ca activ
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

  return (
    <div className="bg-background text-foreground">
      <div className="px-4 py-2 flex items-center justify-between h-20 border-b border-border relative">
        <div className="flex items-center gap-[15px]">
          <h2 className="text-lg font-semibold">Timetable</h2>

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
              <DropdownMenuItem
                onSelect={() => console.log("Create new semester clicked")}
              >
                Create new semester
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>Add new class</Button>
      </div>
      <TimetableModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSave={onSave}
        semesterId={activeSemesterId}
        semesterStartDate={activeSemester?.startDate}
      />
    </div>
  );
}
