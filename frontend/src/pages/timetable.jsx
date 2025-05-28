// pages/TimetablePage.jsx

import TimetableCalendar from "@/components/timetable-elements/timetable-calendar";
import TimetableHeader from "@/components/timetable-elements/timetable-header";

import { useEffect, useState } from "react";

const TimetablePage = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await fetch("/api/classes");
        const data = await res.json();

        if (Array.isArray(data.classes)) {
          const parsed = data.classes.flatMap((cls) => {
            const events = [];

            // Helper: convert HH:MM string and day to Date
            const parseTime = (day, timeStr) => {
              const days = [
                "Sunday",
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
              ];
              const baseDate = new Date();
              const currentDay = baseDate.getDay();
              const targetDay = days.indexOf(day);
              const diff = (targetDay - currentDay + 7) % 7;
              const date = new Date(baseDate);
              date.setDate(baseDate.getDate() + diff);
              const [hours, minutes] = timeStr.split(":").map(Number);
              date.setHours(hours);
              date.setMinutes(minutes);
              date.setSeconds(0);
              return date;
            };

            if (cls.startTime && cls.endTime) {
              events.push({
                title: `Curs ${cls.name}`,
                start: parseTime(cls.day, cls.startTime),
                end: parseTime(cls.day, cls.endTime),
                location:
                  cls.deliveryMode === "campus"
                    ? cls.roomNumber
                    : cls.meetingLink || "Online",
              });
            }

            if (cls.seminarTime && cls.seminarEndTime) {
              events.push({
                title: `Seminar ${cls.name}`,
                start: parseTime(cls.seminarDay, cls.seminarTime),
                end: parseTime(cls.seminarDay, cls.seminarEndTime),
                location:
                  cls.seminarDeliveryMode === "campus"
                    ? cls.seminarRoom
                    : cls.seminarLink || "Online",
              });
            }

            return events;
          });

          setEvents(parsed);
        }
      } catch (err) {
        console.error("Failed to fetch classes:", err);
      }
    };

    fetchClasses();
  }, []);

  return (
    <div className="flex flex-col h-full">
      <TimetableHeader />

      <div className="flex-1">
        <TimetableCalendar events={events} />
      </div>
    </div>
  );
};

export default TimetablePage;
