// components/calendar/WeeklyCalendar.jsx

import { Calendar, Views, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import "react-big-calendar/lib/css/react-big-calendar.css";
import differenceInCalendarWeeks from "date-fns/differenceInCalendarWeeks";

import { useState } from "react";
import TimetableItem from "./timetable-item.jsx";
import TimetableModal from "./timetable-modal.jsx";
import TimetablePreviewModal from "./timetable-preview-modal.jsx";

import enUS from "date-fns/locale/en-US";

const locales = { "en-US": enUS };

const getDynamicTimeBounds = (events = []) => {
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
  classes = [],
  onSave,
  onDeleteClass,
  semesterStartDate,
  semesterEndDate,
  semesterId,
  startWeekOnMonday = false,
}) => {
  const [editingEvent, setEditingEvent] = useState(null);
  const [previewClass, setPreviewClass] = useState(null);

  const dayMap = {
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6,
    sunday: 0,
  };

  const events = classes.map((cls) => {
    const today = new Date();
    const date = new Date(today);
    const currentDay = date.getDay();
    const targetDay = dayMap[cls.day?.toLowerCase()] ?? 1;
    const diff = (targetDay - currentDay + 7) % 7;
    date.setDate(today.getDate() + diff);

    const [sh, sm] = cls.startTime?.slice(0, 5).split(":").map(Number) || [];
    const [eh, em] = cls.endTime?.slice(0, 5).split(":").map(Number) || [];

    const start = new Date(date);
    const end = new Date(date);
    start.setHours(sh, sm || 0, 0, 0);
    end.setHours(eh, em || 0, 0, 0);

    return {
      id: cls.id,
      classId: cls.id,
      title: cls.name,
      start,
      end,
      color: cls.color,
      abbreviation: cls.abbreviation,
      location:
        cls.deliveryMode === "Campus" ? cls.roomNumber : cls.meetingLink,
      class_type: cls.class_type,
    };
  });

  const { min, max } = getDynamicTimeBounds(events);

  const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek: (date, options) =>
      startOfWeek(date, { weekStartsOn: startWeekOnMonday ? 1 : 0 }),
    getDay,
    locales,
  });

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
        events={events}
        defaultView={Views.WEEK}
        views={{ week: true }}
        components={{
          event: CustomEvent,
          timeGutterHeader: () => {
            console.log("Gutter render!");
            const now = new Date();
            const start = semesterStartDate
              ? new Date(semesterStartDate)
              : null;
            const end = semesterEndDate ? new Date(semesterEndDate) : null;

            console.log("NOW:", now.toISOString());
            console.log("START:", start?.toISOString());
            console.log("END:", end?.toISOString());

            if (!start || !end || isNaN(start) || isNaN(end)) return null;

            const isInSemester =
              now.getTime() >= start.getTime() &&
              now.getTime() <= end.getTime();

            if (!isInSemester) return null;

            const weekNumber = Math.max(
              1,
              differenceInCalendarWeeks(now, start, { weekStartsOn: 1 }) + 1
            );
            console.log("Start:", semesterStartDate, "End:", semesterEndDate);

            return (
              <div className="flex items-center justify-center h-full">
                <div className="bg-[#A585FF] text-white text-xl px-4 py-2 rounded-2xl w-fit font-semibold shadow-sm">
                  {weekNumber}
                </div>
              </div>
            );
          },
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
            localizer.format(date, "HH:mm", culture),
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
          semesterStartDate={semesterStartDate}
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
