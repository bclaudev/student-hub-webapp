// src/pages/timetable.jsx

import { useEffect, useState } from "react";
import TimetableHeader from "@/components/timetable-elements/timetable-header";
import TimetableCalendar from "@/components/timetable-elements/timetable-calendar";
import { RRule } from "rrule";

export default function TimetablePage() {
  const [classes, setClasses] = useState([]);
  const [events, setEvents] = useState([]);

  const refetchClasses = async () => {
    const res = await fetch("/api/classes");
    const data = await res.json();

    setClasses(data.classes);
    const allEvents = data.classes.flatMap((cls) =>
      generateRecurringEvents(cls)
    );
    setEvents(allEvents);
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
    const fetchClasses = async () => {
      try {
        const res = await fetch("/api/classes");
        const data = await res.json();

        const allEvents = data.classes.flatMap((cls) =>
          generateRecurringEvents(cls)
        );
        setClasses(data.classes);
        setEvents(allEvents);
      } catch (error) {
        console.error("Error fetching classes:", error);
      }
    };

    fetchClasses();
  }, []);

  return (
    <div className="flex flex-col h-screen">
      <TimetableHeader onSave={refetchClasses} />
      <div className="flex-1 overflow-auto">
        <TimetableCalendar
          events={events}
          onColorChange={handleColorChange}
          classes={classes}
          onSave={refetchClasses}
        />
      </div>
    </div>
  );
}

export function generateRecurringEvents(cls) {
  if (!cls.startDate || !cls.startTime || !cls.endTime || !cls.day) {
    console.warn("Invalid class data skipped:", cls);
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
  if (!weekday) return [];

  const startDate = new Date(cls.startDate);
  startDate.setHours(...cls.startTime.split(":").map(Number));

  const rule = new RRule({
    freq: RRule.WEEKLY,
    byweekday: weekday,
    dtstart: startDate,
    count: 10,
  });

  return rule.all().map((date, index) => {
    const [endHour, endMinute] = cls.endTime.split(":").map(Number);
    const endDate = new Date(date);
    endDate.setHours(endHour, endMinute);

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
}
