// components/calendar/WeeklyCalendar.jsx

import { Calendar, Views, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import "react-big-calendar/lib/css/react-big-calendar.css";
import TimetableItem from "./timetable-item.jsx";

import enUS from "date-fns/locale/en-US";

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

const TimetableCalendar = ({ events }) => {
  console.log("events:", events);
  const { min, max } = getDynamicTimeBounds(events); // 👈 AICI era lipsă
  return (
    <div className="h-[90vh]">
      <Calendar
        localizer={localizer}
        events={events}
        defaultView={Views.WEEK}
        views={{ week: true }}
        components={{
          event: TimetableItem,
          timeGutterHeader: () => (
            <div className="flex items-center justify-center h-full">
              <div className="bg-[#A585FF] text-white text-2xl px-6 py-2 rounded-lg w-fit font-semibold shadow-sm">
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
            localizer.format(date, "H 'PM'", culture), // ex: 13 PM, 14 PM
        }}
        style={{ height: "90vh" }}
        defaultDate={new Date()}
      />
    </div>
  );
};

export default TimetableCalendar;
