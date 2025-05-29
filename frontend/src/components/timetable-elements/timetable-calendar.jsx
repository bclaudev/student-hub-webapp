// components/calendar/WeeklyCalendar.jsx

import { Calendar, Views, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import "react-big-calendar/lib/css/react-big-calendar.css";

import { useEffect, useState } from "react";
import TimetableItem from "./timetable-item.jsx";
import TimetableModal from "./timetable-modal.jsx";

import { generateRecurringEvents } from "@/pages/timetable";

import enUS from "date-fns/locale/en-US";

const locales = { "en-US": enUS };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const getDynamicTimeBounds = (events) => {
  const minHour = Math.min(
    ...events.map((e) => new Date(e.start).getHours()),
    9
  );
  const maxHour = Math.max(
    ...events.map((e) => new Date(e.end).getHours()),
    21
  );

  return {
    min: new Date(1970, 0, 1, Math.min(minHour, 9), 0),
    max: new Date(1970, 0, 1, Math.max(maxHour, 21), 0),
  };
};

const TimetableCalendar = ({ onColorChange, events, classes, onSave }) => {
  const [editingEvent, setEditingEvent] = useState(null);

  const { min, max } = getDynamicTimeBounds(events);

  const CustomEvent = ({ event }) => (
    <TimetableItem
      event={event}
      onColorChange={onColorChange}
      onEdit={() => {
        const fullClass = classes.find((c) => c.id === event.classId);
        if (fullClass) setEditingEvent(fullClass);
      }}
      onDelete={async (id) => {
        try {
          const res = await fetch(`/api/classes/${id}`, {
            method: "DELETE",
          });

          if (!res.ok) throw new Error("Failed to delete");

          setClasses((prev) => prev.filter((cls) => cls.id !== id));
          setEvents((prev) => prev.filter((ev) => ev.classId !== id));
        } catch (err) {
          console.error("Delete failed:", err);
          alert("Failed to delete class.");
        }
      }}
    />
  );

  return (
    <div className="h-full">
      <Calendar
        localizer={localizer}
        events={events}
        defaultView={Views.WEEK}
        views={{ week: true }}
        components={{
          event: CustomEvent,
          timeGutterHeader: () => (
            <div className="flex items-center justify-center h-full">
              <div className="bg-[#A585FF] text-white text-xl px-6 py-2 rounded-2xl w-fit font-semibold shadow-sm">
                1
              </div>
            </div>
          ),
        }}
        step={30}
        timeslots={2}
        min={min}
        max={max}
        toolbar={false}
        formats={{
          dayFormat: (date, culture, localizer) =>
            localizer.format(date, "EEE", culture).toUpperCase(),
          timeGutterFormat: (date, culture, localizer) =>
            localizer.format(date, "H 'PM'", culture),
        }}
        style={{ height: "100%" }}
        defaultDate={new Date("2025-05-29")}
      />

      {editingEvent && (
        <TimetableModal
          open={true}
          onOpenChange={(open) => {
            if (!open) setEditingEvent(null);
          }}
          initialData={editingEvent}
          onSave={onSave}
        />
      )}
    </div>
  );
};

export default TimetableCalendar;
