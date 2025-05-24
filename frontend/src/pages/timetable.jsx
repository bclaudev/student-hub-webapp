// pages/TimetablePage.jsx

import TimetableCalendar from "@/components/timetable-elements/timetable-calendar";
import TimetableHeader from "@/components/timetable-elements/timetable-header";

const sampleEvents = [
  {
    title: "Seminar Programare",
    start: new Date(2025, 4, 26, 10, 0),
    end: new Date(2025, 4, 26, 11, 50),
    location: "Sala 304",
  },
  {
    title: "Seminar Programare",
    start: new Date(2025, 4, 26, 11, 0),
    end: new Date(2025, 4, 26, 12, 50),
    location: "Sala 304",
  },
  {
    title: "Curs Matematică",
    start: new Date(2025, 4, 27, 14, 0),
    end: new Date(2025, 4, 27, 16, 0),
    location: "Online",
  },
];

const TimetablePage = () => {
  return (
    <div className="flex flex-col h-full">
      <TimetableHeader />

      <div className="flex-1">
        <TimetableCalendar events={sampleEvents} />
      </div>
    </div>
  );
};

export default TimetablePage;
