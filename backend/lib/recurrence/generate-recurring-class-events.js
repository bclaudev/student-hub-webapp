export function generateRecurringClassEvents({
  weekday,
  startTime,
  endTime,
  recurrence,
  semesterStart,
  semesterEnd,
  startDate,
}) {
  const results = [];
  const [startHour, startMin] = startTime.split(":").map(Number);
  const [endHour, endMin] = endTime.split(":").map(Number);

  const dayMap = {
    Sunday: 0,
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
  };

  const targetDay = dayMap[weekday];
  if (targetDay === undefined) return [];

  let current;

  if (startDate) {
    current = new Date(startDate);
  } else {
    current = new Date(semesterStart);
    while (current.getDay() !== targetDay) {
      current.setDate(current.getDate() + 1);
    }
  }

  const intervalMap = {
    "once-a-week": 7,
    "once-every-two-weeks": 14,
    "once-every-three-weeks": 21,
    "once-a-month": 28,
  };

  const interval = intervalMap[recurrence] ?? 7;

  console.log(
    "🔁 Generating class events from:",
    current,
    "interval:",
    interval,
    "weekday:",
    weekday
  );
  while (current <= new Date(semesterEnd)) {
    const start = new Date(current);
    start.setHours(startHour, startMin, 0, 0);

    const end = new Date(current);
    end.setHours(endHour, endMin, 0, 0);

    results.push({ start, end });

    current.setDate(current.getDate() + interval);
  }

  return results;
}
