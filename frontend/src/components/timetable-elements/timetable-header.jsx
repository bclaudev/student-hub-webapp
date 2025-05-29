//src/components/timetable-elements/timetable-header.jsx
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import TimetableModal from "@/components/timetable-elements/timetable-modal";

export default function TimetableHeader({ onSave }) {
  const [activeSemester, setActiveSemester] = useState("1st Semester");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const semesters = ["1st Semester", "2nd Semester"];

  return (
    <div className="bg-background text-foreground">
      <div className="px-4 py-2 flex items-center justify-between h-20 border-b border-border relative">
        <div className="flex items-center gap-[15px]">
          <h2 className="text-lg font-semibold">Timetable</h2>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">{activeSemester}</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="z-50">
              {semesters.map((semester) => (
                <DropdownMenuItem
                  key={semester}
                  onSelect={() => setActiveSemester(semester)}
                >
                  {semester}
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
      />
    </div>
  );
}
