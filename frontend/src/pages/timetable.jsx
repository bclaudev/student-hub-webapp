import { useEffect, useState } from "react";
import TimetableHeader from "@/components/timetable-elements/timetable-header";
import TimetableCalendar from "@/components/timetable-elements/timetable-calendar";
import { useUser } from "@/hooks/use-user.jsx";

export default function TimetablePage() {
  const [classes, setClasses] = useState([]);
  const [activeSemesterId, setActiveSemesterId] = useState(null);
  const [activeSemester, setActiveSemester] = useState(null);
  const { user, fetchUser } = useUser();
  const startFromMonday = user?.startWeekOnMonday;

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    const loadInitialSemester = async () => {
      const res = await fetch("/api/semesters", {
        credentials: "include",
      });
      const data = await res.json();

      if (data.semesters && data.semesters.length > 0) {
        const now = new Date();

        // Sortează semestrele după startDate
        const sorted = data.semesters.sort(
          (a, b) => new Date(a.startDate) - new Date(b.startDate)
        );

        // Încearcă să găsești semestrul în care e azi
        let active = sorted.find((s) => {
          const start = new Date(s.startDate);
          const end = new Date(s.endDate);
          return now >= start && now <= end;
        });

        // Dacă nu există semestru activ, ia-l pe cel mai apropiat din viitor
        if (!active) {
          active =
            sorted.find((s) => new Date(s.startDate) > now) ||
            sorted[sorted.length - 1];
        }

        setActiveSemester(active);
        setActiveSemesterId(active.id);
        console.log("Semestrul selectat automat:", active);
      }
    };

    loadInitialSemester();
  }, []);

  const refetchClasses = async () => {
    if (!activeSemesterId) return;

    const res = await fetch(`/api/classes?semesterId=${activeSemesterId}`);
    const data = await res.json();
    console.log("Classes received from backend:", data.classes);

    setClasses(data.classes);
  };

  const handleDeleteClass = async (classId) => {
    try {
      const res = await fetch(`/api/classes/${classId}`, {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) {
        const errBody = await res.json().catch(() => null);
        const msg = errBody?.error || `Server returned ${res.status}`;
        throw new Error(msg);
      }
      await refetchClasses();
    } catch (err) {
      console.error("Failed to delete class:", err);
      alert("Failed to delete class: " + err.message);
    }
  };

  const handleColorChange = async (id, color) => {
    await fetch(`http://localhost:8787/api/classes/${id}`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ color }),
    });

    setClasses((prev) =>
      prev.map((cls) => (cls.id === id ? { ...cls, color } : cls))
    );
  };

  useEffect(() => {
    console.log("activeSemesterId:", activeSemesterId);
    if (!activeSemesterId) return;

    const fetchClasses = async () => {
      try {
        const res = await fetch(`/api/classes?semesterId=${activeSemesterId}`);
        const data = await res.json();
        setClasses(data.classes);
      } catch (error) {
        console.error("Error fetching classes:", error);
      }
    };

    fetchClasses();
  }, [activeSemesterId]);

  useEffect(() => {
    console.log("🔍 User in timetable:", user);
    console.log("🔁 startWeekOnMonday:", startFromMonday);
  }, [user]);

  return (
    <div className="flex flex-col h-screen">
      <TimetableHeader
        onSave={refetchClasses}
        activeSemester={activeSemester}
        activeSemesterId={activeSemesterId}
        onSemesterChange={(semester) => {
          setActiveSemester(semester);
          setActiveSemesterId(semester.id);
          console.log("🎓 Selected semester:", semester);
        }}
      />
      <div className="flex-1 overflow-auto">
        <TimetableCalendar
          classes={classes}
          onColorChange={handleColorChange}
          onSave={refetchClasses}
          onDeleteClass={handleDeleteClass}
          semesterStartDate={activeSemester?.startDate}
          semesterEndDate={activeSemester?.endDate}
          semesterId={activeSemesterId}
          startWeekOnMonday={user?.startWeekOnMonday}
        />
      </div>
    </div>
  );
}
