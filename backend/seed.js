import { faker } from "@faker-js/faker";
import { db } from "./db.js"; // modifică dacă e în alt path
import {
  usersTable,
  semestersTable,
  classesTable,
  calendarEventsTable,
  notebooks,
  notebookPages,
} from "./drizzle/schema.js";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";

const today = new Date();

const EVENT_TYPES = [
  "event",
  "appointment",
  "deadline",
  "study session",
  "exam",
];
const NOTIFY_OPTIONS = [15, 30, 60];
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

function getRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomDateBetween(start, end) {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
}

async function seedUsers(count = 50) {
  const users = Array.from({ length: count }, () => ({
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    uploadSize: 0,
    dateOfBirth: faker.date.birthdate(),
    role: "user",
  }));

  const inserted = await db
    .insert(usersTable)
    .values(users)
    .returning({ id: usersTable.id });
  return inserted.map((u) => u.id);
}

async function seedSemesters(userIds) {
  const allSemesterIds = [];

  for (const userId of userIds) {
    const count = faker.number.int({ min: 3, max: 4 });
    const semesters = [];

    for (let i = 0; i < count; i++) {
      const start = faker.date.past({ years: 2 });
      const end = new Date(start);
      end.setMonth(start.getMonth() + 5);

      semesters.push({
        createdBy: userId,
        name: `Semestrul ${i + 1}`,
        startDate: start.toISOString().split("T")[0],
        endDate: end.toISOString().split("T")[0],
      });
    }

    const inserted = await db
      .insert(semestersTable)
      .values(semesters)
      .returning({ id: semestersTable.id });
    inserted.forEach((sem) =>
      allSemesterIds.push({ userId, semesterId: sem.id })
    );
  }

  return allSemesterIds;
}

async function seedClasses(semesterData) {
  const allClasses = [];

  for (const { userId, semesterId } of semesterData) {
    const count = faker.number.int({ min: 5, max: 6 });
    const classes = [];

    for (let i = 0; i < count; i++) {
      const day = getRandom(DAYS);
      const startHour = faker.number.int({ min: 8, max: 16 });
      const startTime = `${String(startHour).padStart(2, "0")}:00:00`;
      const endTime = `${String(startHour + 2).padStart(2, "0")}:00:00`;
      const startDate = faker.date.recent({ days: 30 });
      const recurrence = faker.helpers.arrayElement(["weekly", "biweekly"]);
      const color = faker.color.rgb({ prefix: "#" });

      classes.push({
        class_type: "course",
        name: faker.word.words(2),
        abbreviation: faker.string.alpha({ length: 4 }),
        teacherName: faker.person.fullName(),
        deliveryMode: faker.helpers.arrayElement(["online", "on-campus"]),
        roomNumber: faker.location.buildingNumber(),
        meetingLink: faker.internet.url(),
        day,
        startTime,
        endTime,
        recurrence,
        examDate: faker.date.future(),
        curriculum: faker.lorem.sentence(),
        startDate,
        color,
        semesterId,
        createdBy: userId,
      });
    }

    const inserted = await db
      .insert(classesTable)
      .values(classes)
      .returning({ id: classesTable.id });

    inserted.forEach((cls, index) => {
      const c = classes[index];
      const start = new Date(
        `${faker.date.recent().toISOString().split("T")[0]}T${c.startTime}`
      );
      const end = new Date(
        `${faker.date.recent().toISOString().split("T")[0]}T${c.endTime}`
      );

      allClasses.push({
        classId: cls.id,
        userId,
        color: c.color ?? "#a585ff",
        start,
        end,
        day: c.day,
        recurrence: c.recurrence,
      });
    });
  }

  return allClasses;
}

async function seedCalendarEvents(users, classes) {
  const events = [];

  for (const cls of classes) {
    const seriesId = randomUUID();
    const weeks = cls.recurrence === "biweekly" ? 8 : 15;

    for (let i = 0; i < weeks; i++) {
      const start = new Date(cls.start);
      const end = new Date(cls.end);
      start.setDate(start.getDate() + 7 * i);
      end.setDate(end.getDate() + 7 * i);

      events.push({
        title: `Class: ${faker.word.words(2)}`,
        description: faker.lorem.sentence(),
        startDateTime: start,
        endDateTime: end,
        eventType: "class",
        color: cls.color,
        notifyMe: getRandom(NOTIFY_OPTIONS),
        recurrence: cls.recurrence,
        seriesId,
        createdBy: cls.userId,
        additionalInfo: {},
      });
    }
  }

  for (const userId of users) {
    const count = faker.number.int({ min: 5, max: 10 });
    for (let i = 0; i < count; i++) {
      const start = faker.date.future();
      const end = new Date(start);
      end.setHours(start.getHours() + 2);

      events.push({
        title: faker.word.words(3),
        description: faker.lorem.sentence(),
        startDateTime: start,
        endDateTime: end,
        eventType: getRandom(EVENT_TYPES),
        color: faker.color.rgb({ prefix: "#" }),
        notifyMe: getRandom(NOTIFY_OPTIONS),
        recurrence: null,
        seriesId: null,
        createdBy: userId,
        additionalInfo: {},
      });
    }
  }

  const BATCH_SIZE = 100;
  for (let i = 0; i < events.length; i += BATCH_SIZE) {
    const batch = events.slice(i, i + BATCH_SIZE);
    await db.insert(calendarEventsTable).values(batch);
  }
}

async function seedNotebooks(userIds) {
  for (const userId of userIds) {
    const count = faker.number.int({ min: 7, max: 8 });

    for (let i = 0; i < count; i++) {
      const notebookId = randomUUID();

      await db.insert(notebooks).values({
        id: notebookId,
        userId,
        title: faker.word.words(2),
        isPinned: faker.datatype.boolean(),
      });

      const pages = Array.from(
        { length: faker.number.int({ min: 2, max: 5 }) },
        () => ({
          id: randomUUID(),
          notebookId,
          title: faker.word.words(3),
          content: faker.lorem.paragraphs(2),
          createdAt: new Date(),
          updatedAt: new Date(),
        })
      );

      await db.insert(notebookPages).values(pages);
    }
  }
}

(async () => {
  const userIds = await seedUsers();
  const semesters = await seedSemesters(userIds);
  const classes = await seedClasses(semesters);
  await seedCalendarEvents(userIds, classes);
  await seedNotebooks(userIds);
  console.log("✅ Seed completed.");
})();
