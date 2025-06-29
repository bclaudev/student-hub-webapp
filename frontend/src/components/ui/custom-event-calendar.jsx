// custom-event-calendar.jsx
import format from "date-fns/format";

function darkenHexColor(hex, amount = 60) {
  return `#${hex
    .replace("#", "")
    .match(/.{2}/g)
    .map((c) =>
      Math.max(0, parseInt(c, 16) - amount)
        .toString(16)
        .padStart(2, "0")
    )
    .join("")}`;
}

export function CustomEventCalendar({ event }) {
  const timeLabel = format(event.start, "HH:mm");
  const background = event.color || event.additionalInfo?.color || "#a585ff";
  const textColor = darkenHexColor(background, 90);

  return (
    <div
      className="px-1 py-0.5 text-sm font-medium customEventCalendar"
      style={{ backgroundColor: background, color: textColor }}
    >
      <span>
        {timeLabel} {event.title}
      </span>
    </div>
  );
}
