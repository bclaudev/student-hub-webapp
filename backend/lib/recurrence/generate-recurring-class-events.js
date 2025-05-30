export function generateRecurringClassEvents({
  weekday,
  startTime,
  endTime,
  recurrence,
  semesterStart,
  semesterEnd,
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

  let current = new Date(semesterStart);

  while (current.getDay() !== targetDay) {
    current.setDate(current.getDate() + 1);
  }

  while (current <= new Date(semesterEnd)) {
    const start = new Date(current);
    start.setHours(startHour, startMin, 0, 0);

    const end = new Date(current);
    end.setHours(endHour, endMin, 0, 0);

    results.push({ start, end });

    current.setDate(current.getDate() + (recurrence === "biweekly" ? 14 : 7));
  }

  return results;
}
