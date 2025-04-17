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
import { toast } from "sonner";
import { useEffect } from "react";
import AddEventModal from "./add-event/add-event-dialog";
import { set } from "date-fns";

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

export default function Calendar() {
  const [events, setEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleAddEvent = async (eventObj) => {
    try {
      const { dateRange, startTime, endTime, eventType, ...rest } = eventObj;

      if (!dateRange?.from || !startTime || !endTime || !eventType) {
        console.error("Missing date/time in form data", {
          dateRange,
          startTime,
          endTime,
          eventType,
        });
        return;
      }

      if (!startTime || !endTime) {
        toast.error("Please select a start and end time.");
        return;
      }

      const fromDate = new Date(dateRange.from);
      const toDate = new Date(dateRange.to ?? dateRange.from);

      // Constructing start and end using local date parts (not ISO)
      const start = new Date(
        fromDate.getFullYear(),
        fromDate.getMonth(),
        fromDate.getDate(),
        ...startTime.split(":").map(Number)
      );

      const end = new Date(
        toDate.getFullYear(),
        toDate.getMonth(),
        toDate.getDate(),
        ...endTime.split(":").map(Number)
      );

      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        console.error("Invalid start or end time value", {
          startTime,
          endTime,
          start,
          end,
        });
        return;
      }

      const payload = {
        ...rest,
        startDateTime: start.toISOString(), // Optional: only if backend expects ISO
        endDateTime: end.toISOString(),
        eventType,
      };

      const res = await fetch("/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Failed to create event");

      const newEvent = {
        ...result.event[0],
        start: new Date(result.event[0].startDateTime),
        end: new Date(result.event[0].endDateTime),
      };

      setEvents((prev) => [...prev, newEvent]);
    } catch (err) {
      console.error("Failed to add event:", err.message);
    }
  };

  const eventPropGetter = (event) => {
    return {
      style: {
        backgroundColor: event.color || "#a855f7",
        borderRadius: "6px",
        paddingLeft: "4px",
        color: "white",
        border: "none",
      },
    };
  };

  const EventComponent = ({ event }) => {
    const timeLabel = format(event.start, "HH:mm");
    return (
      <span>
        {timeLabel}{" "}
        {event.eventType
          ? event.eventType.charAt(0).toUpperCase() + event.eventType.slice(1)
          : ""}
        : {event.title}
      </span>
    );
  };

  const handleOpenNewEventModal = () => {
    console.log("📅 Opening New Event Modal");
    setSelectedEvent(null);
    setIsEditing(false);
    setIsModalOpen(true);
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch("/api/events", {
          credentials: "include",
        });
        const data = await res.json();

        if (!res.ok) {
          console.error("Failed to load events:", data.error);
          return;
        }

        const formatted = data.events.map((event) => ({
          ...event,
          start: new Date(event.startDateTime),
          end: new Date(event.endDateTime),
        }));

        setEvents(formatted);
      } catch (err) {
        console.error("Error fetching events:", err.message);
      }
    };

    fetchEvents();
  }, []);

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
          toolbar: (props) => (
            <CalendarToolbar
              {...props}
              onAddEvent={handleAddEvent}
              onNewEvent={handleOpenNewEventModal}
            />
          ),
          event: EventComponent,
        }}
        eventPropGetter={eventPropGetter}
        onSelectEvent={(event) => {
          setSelectedEvent(event);
          setIsModalOpen(true);
          setIsEditing(true);
        }}
      />
      {isModalOpen && (
        <AddEventModal
          onSave={handleAddEvent}
          initialData={selectedEvent}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedEvent(null);
            setIsEditing(false);
          }}
          open={isModalOpen}
          isEditing={isEditing}
        />
      )}
    </div>
  );
}
