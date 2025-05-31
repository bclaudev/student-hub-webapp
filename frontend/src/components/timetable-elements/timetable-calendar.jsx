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
import TimetablePreviewModal from "./timetable-preview-modal.jsx";

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

const TimetableCalendar = ({
  onColorChange,
  events,
  classes,
  onSave,
  onDeleteClass,
  semesterStartDate,
  semesterId,
}) => {
  const [editingEvent, setEditingEvent] = useState(null);
  const [previewClass, setPreviewClass] = useState(null);

  const { min, max } = getDynamicTimeBounds(events);

  const CustomEvent = ({ event }) => (
    <TimetableItem
      event={event}
      onColorChange={onColorChange}
      onEdit={() => {
        const fullClass = classes.find((c) => c.id === event.classId);
        if (fullClass) setEditingEvent(fullClass);
      }}
      onDelete={() => {
        onDeleteClass(event.classId);
      }}
      onPreview={() => {
        const fullClass = classes.find((c) => c.id === event.classId);
        if (fullClass) setPreviewClass(fullClass);
      }}
    />
  );

  return (
    <div className="h-full">
      <Calendar
        localizer={localizer}
        events={events.map((event) => ({
          ...event,
          start: new Date(event.start),
          end: new Date(event.end),
        }))}
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
        date={
          events[0]?.start && !isNaN(new Date(events[0].start))
            ? new Date(events[0].start)
            : semesterStartDate && !isNaN(new Date(semesterStartDate))
            ? new Date(semesterStartDate)
            : new Date()
        }
      />

      {editingEvent && (
        <TimetableModal
          open={true}
          onOpenChange={(open) => {
            if (!open) setEditingEvent(null);
          }}
          initialData={editingEvent}
          onSave={onSave}
          semesterId={semesterId}
        />
      )}
      {previewClass && (
        <TimetablePreviewModal
          open={true}
          onOpenChange={(open) => {
            if (!open) setPreviewClass(null);
          }}
          data={previewClass}
        />
      )}
    </div>
  );
};

export default TimetableCalendar;
