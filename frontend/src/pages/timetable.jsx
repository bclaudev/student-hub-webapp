// src/pages/timetable.jsx

import { useEffect, useState } from "react";
import TimetableHeader from "@/components/timetable-elements/timetable-header";
import TimetableCalendar from "@/components/timetable-elements/timetable-calendar";
import { RRule } from "rrule";
import { useUser } from "@/hooks/use-user.jsx";

export default function TimetablePage() {
  const [classes, setClasses] = useState([]);
  const [events, setEvents] = useState([]);
  const [activeSemesterId, setActiveSemesterId] = useState(null);
  const [activeSemester, setActiveSemester] = useState(null);
  const { user, fetchUser } = useUser();
  const startFromMonday = user?.startWeekOnMonday;
  useEffect(() => {
    fetchUser();
  }, []);
  console.log("🎯 user.startWeekOnMonday:", user?.startWeekOnMonday);

  // 1) Funcția care refetch-uiște clasele și reconstruiește evenimentele recurent
  const refetchClasses = async () => {
    if (!activeSemesterId) return;

    const res = await fetch(`/api/classes?semesterId=${activeSemesterId}`);
    const data = await res.json();

    setClasses(data.classes);
    const allEvents = data.classes.flatMap((cls) =>
      generateRecurringEvents(cls)
    );
    console.log("All generated events:", allEvents);
    setEvents(allEvents);
  };

  // 2) Funcția de ștergere a unei clase: face DELETE + refetch
  const handleDeleteClass = async (classId) => {
    try {
      const res = await fetch(`/api/classes/${classId}`, {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) {
        // Dacă serverul răspunde cu 4xx/5xx, citește eventualul JSON de eroare
        const errBody = await res.json().catch(() => null);
        const msg = errBody?.error || `Server returned ${res.status}`;
        throw new Error(msg);
      }

      // Re-fetch complet, ca să reconstruiești atât classes, cât și events
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

    setEvents((prev) =>
      prev.map((ev) => (ev.classId === id ? { ...ev, color } : ev))
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
        const allEvents = data.classes.flatMap((cls) =>
          generateRecurringEvents(cls)
        );
        setEvents(allEvents);
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
  console.log(
    "📅 Passing startFromMonday to TimetableCalendar:",
    startFromMonday
  );

  return (
    <div className="flex flex-col h-screen">
      <TimetableHeader
        onSave={refetchClasses}
        activeSemesterId={activeSemesterId}
        activeSemester={activeSemester}
        onSemesterChange={(semester) => {
          setActiveSemester(semester);
          setActiveSemesterId(semester.id);
        }}
      />
      <div className="flex-1 overflow-auto">
        <TimetableCalendar
          events={events}
          onColorChange={handleColorChange}
          classes={classes}
          onSave={refetchClasses}
          onDeleteClass={handleDeleteClass}
          semesterStartDate={activeSemester?.startDate}
          semesterId={activeSemesterId}
          startWeekOnMonday={user?.startWeekOnMonday}
        />
      </div>
    </div>
  );
}

export function generateRecurringEvents(cls) {
  if (!cls.startDate || !cls.startTime || !cls.endTime || !cls.day) {
    console.warn("Invalid class skipped:", cls);
    return [];
  }

  const dayMap = {
    monday: RRule.MO,
    tuesday: RRule.TU,
    wednesday: RRule.WE,
    thursday: RRule.TH,
    friday: RRule.FR,
  };

  const weekday = dayMap[cls.day.toLowerCase()];
  if (!weekday) {
    console.warn(" Invalid weekday in class:", cls.day);
    return [];
  }

  // Protect split format
  const [sh, sm] = cls.startTime?.slice(0, 5).split(":").map(Number);
  const [eh, em] = cls.endTime?.slice(0, 5).split(":").map(Number);

  if ([sh, sm, eh, em].some((n) => isNaN(n))) {
    console.warn("Invalid time values in class:", cls);
    return [];
  }

  const startDate = new Date(cls.startDate);
  startDate.setHours(sh, sm);

  if (isNaN(startDate.getTime())) {
    console.warn("Invalid startDate in class:", cls);
    return [];
  }

  const rule = new RRule({
    freq: RRule.WEEKLY,
    byweekday: weekday,
    dtstart: startDate,
    count: 10,
  });

  const events = rule.all().map((date, index) => {
    const endDate = new Date(date);
    endDate.setHours(eh, em);

    return {
      id: `${cls.id}-${index}`,
      classId: cls.id,
      title: cls.name,
      abbreviation: cls.abbreviation,
      start: date,
      end: endDate,
      location:
        cls.deliveryMode === "Campus" ? cls.roomNumber : cls.meetingLink,
      class_type: cls.class_type,
      color: cls.color,
    };
  });

  console.log("Generated events:", events);
  return events;
}
