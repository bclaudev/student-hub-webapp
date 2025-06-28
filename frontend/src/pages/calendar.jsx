import Calendar from "@/components/calendar";
import DashboardLayout from "@/layouts/dashboard-layout";
import { useState, useEffect } from "react";
import { useUser } from "@/hooks/use-user.jsx";

export default function CalendarPage() {
  const [events, setEvents] = useState([]);
  const { user, fetchUser } = useUser();

  useEffect(() => {
    const fetchEvents = async () => {
      const res = await fetch("http://localhost:8787/api/events", {
        credentials: "include",
      });
      const data = await res.json();

      // Transformă în formatul necesar calendarului
      const mapped = data.events.map((ev) => ({
        id: ev.id,
        title: ev.title,
        start: new Date(ev.startDateTime),
        end: new Date(ev.endDateTime),
        allDay: false, // sau true dacă vrei
        extendedProps: ev, // pentru acces la info suplimentare
      }));

      setEvents(mapped);
    };

    fetchEvents();
  }, []);

  return (
    <div className="h-screen w-full overflow-hidden text-foreground">
      <Calendar events={events} />
    </div>
  );
}
