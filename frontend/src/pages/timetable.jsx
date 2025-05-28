// src/pages/timetable.jsx

import { useEffect, useState } from "react";
import TimetableHeader from "@/components/timetable-elements/timetable-header";
import TimetableCalendar from "@/components/timetable-elements/timetable-calendar";
import { RRule } from "rrule";

export default function TimetablePage() {
  const [classes, setClasses] = useState([]);
  const [events, setEvents] = useState([]);

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
    <div>
      <TimetableHeader />
      <TimetableCalendar events={events} />
    </div>
  );
}

function generateRecurringEvents(cls) {
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
      title: cls.name,
      start: date,
      end: endDate,
      location:
        cls.deliveryMode === "Campus" ? cls.roomNumber : cls.meetingLink,
    };
  });
}
