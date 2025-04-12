import {
  Calendar as ReactBigCalendar,
  dateFnsLocalizer,
} from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useMemo, useState } from "react";
import { enUS } from "date-fns/locale";
import CalendarToolbar from "./calendar-toolbar";

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const defaultEvents = [
  {
    title: "Math Exam 🧮",
    start: new Date(2025, 3, 10, 9, 0),
    end: new Date(2025, 3, 10, 10, 0),
  },
  {
    title: "Project Presentation 🎤",
    start: new Date(2025, 3, 12, 13, 0),
    end: new Date(2025, 3, 12, 15, 0),
  },
];

export default function Calendar() {
  const [events, setEvents] = useState(defaultEvents);

  return (
    <div className="h-screen">
      <ReactBigCalendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: "100%" }}
        className="rounded-md"
        components={{
          toolbar: CalendarToolbar,
        }}
      />
    </div>
  );
}
