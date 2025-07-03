import { faker } from "@faker-js/faker";
import { db } from "./db.js";
import { usersTable, calendarEventsTable } from "./drizzle/schema.js";
import { posthog } from "./lib/posthog.js";

const EVENT_TYPES = ["appointment", "study", "event"];
const NOTIFY_OPTIONS = [15, 30, 60];

function getRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomDateBetween(start, end) {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
}

async function seedUsers(count = 50) {
  const now = new Date();
  const sixWeeksAgo = new Date();
  sixWeeksAgo.setDate(now.getDate() - 7 * 6);

  const users = Array.from({ length: count }, () => {
    const createdAt = getRandomDateBetween(sixWeeksAgo, now);
    return {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      uploadSize: 0,
      dateOfBirth: faker.date.birthdate(),
      role: "user",
      createdAt,
    };
  });

  const inserted = await db
    .insert(usersTable)
    .values(users)
    .returning({ id: usersTable.id });

  inserted.forEach((u, i) => {
    posthog.capture({
      distinctId: u.id.toString(),
      event: "user_created",
      properties: {
        email: users[i].email,
        source: "seed",
      },
    });
  });

  return inserted.map((u) => ({ id: u.id }));
}

async function seedCalendarEvents(users) {
  for (const { id: userId } of users) {
    const count = 100; // 👈 fix 10 events per user
    for (let i = 0; i < count; i++) {
      const start = faker.date.future();
      const end = new Date(start);
      end.setHours(start.getHours() + 2);
      const durationMinutes = Math.round((end - start) / 60000);

      const eventType = getRandom(EVENT_TYPES);
      const event = {
        title: faker.word.words(3),
        description: faker.lorem.sentence(),
        startDateTime: start,
        endDateTime: end,
        eventType,
        color: faker.color.rgb({ prefix: "#" }),
        notifyMe: getRandom(NOTIFY_OPTIONS),
        recurrence: null,
        seriesId: null,
        createdBy: userId,
        additionalInfo: JSON.stringify({}),
      };

      const [{ id }] = await db
        .insert(calendarEventsTable)
        .values(event)
        .returning({ id: calendarEventsTable.id });

      posthog.capture({
        distinctId: userId.toString(),
        event: "calendar_event_created",
        properties: {
          eventId: id,
          type: eventType,
          title: event.title,
          notifyMe: event.notifyMe,
          source: "seed",
          durationMinutes,
        },
      });
    }
  }
}

(async () => {
  const users = await seedUsers();
  await seedCalendarEvents(users);
  console.log("Users and calendar events seeded + PostHog events tracked.");
})();
