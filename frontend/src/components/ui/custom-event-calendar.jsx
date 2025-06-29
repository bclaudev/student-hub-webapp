// custom-event-calendar.jsx
import format from "date-fns/format";
export function CustomEventCalendar({ event }) {
  const timeLabel = format(event.start, "HH:mm");
  const background = event.color || event.additionalInfo?.color || "#a585ff";

  return (
    <div
      className="px-1 py-0.5 text-sm font-medium customEventCalendar"
      style={{ backgroundColor: background }}
    >
      <span>
        {timeLabel} {event.title}
      </span>
    </div>
  );
}
