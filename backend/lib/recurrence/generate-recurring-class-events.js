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

    const recurrenceMap = {
      daily: 1,
      weekly: 7,
      biweekly: 14,
      "every-three-weeks": 21,
      monthly: 30,
    };

    const interval = recurrenceMap[recurrence] ?? 7;
    current.setDate(current.getDate() + interval);
  }

  return results;
}
