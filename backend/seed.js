import { faker } from "@faker-js/faker";
import { db } from "./db.js";
import {
  usersTable,
  semestersTable,
  classesTable,
  calendarEventsTable,
  notebooks,
  notebookPages,
} from "./drizzle/schema.js";
import { randomUUID } from "crypto";
import { posthog } from "./lib/posthog.js";

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

async function seedUsers(count = 10) {
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
      properties: { email: users[i].email, source: "seed" },
    });
  });
  return inserted.map((u) => ({
    id: u.id,
    email: users.find((usr, i) => inserted[i].id === u.id).email,
  }));
}

async function seedSemesters(users) {
  const allSemesterIds = [];
  for (const { id: userId } of users) {
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
    inserted.forEach((sem, i) => {
      allSemesterIds.push({ userId, semesterId: sem.id });
      posthog.capture({
        distinctId: userId.toString(),
        event: "semester_created",
        properties: {
          semesterId: sem.id,
          name: semesters[i].name,
          source: "seed",
        },
      });
    });
  }
  return allSemesterIds;
}

async function seedClasses(semesterData) {
  const allClasses = [];
  for (const { userId, semesterId } of semesterData) {
    const count = faker.number.int({ min: 5, max: 6 });
    for (let i = 0; i < count; i++) {
      const day = getRandom(DAYS);
      const startHour = faker.number.int({ min: 8, max: 16 });
      const startTime = `${String(startHour).padStart(2, "0")}:00:00`;
      const endTime = `${String(startHour + 2).padStart(2, "0")}:00:00`;
      const startDate = faker.date.recent({ days: 30 });
      const recurrence = faker.helpers.arrayElement(["weekly", "biweekly"]);
      const color = faker.color.rgb({ prefix: "#" });
      const newClass = {
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
      };
      const [{ id }] = await db
        .insert(classesTable)
        .values(newClass)
        .returning({ id: classesTable.id });
      posthog.capture({
        distinctId: userId.toString(),
        event: "class_created",
        properties: {
          classId: id,
          title: newClass.name,
          abbreviation: newClass.abbreviation,
          recurrence: newClass.recurrence,
          source: "seed",
        },
      });
      const baseDate = faker.date.recent().toISOString().split("T")[0];
      const start = new Date(`${baseDate}T${newClass.startTime}`);
      const end = new Date(`${baseDate}T${newClass.endTime}`);
      allClasses.push({
        classId: id,
        userId,
        color: newClass.color ?? "#a585ff",
        start,
        end,
        day: newClass.day,
        recurrence: newClass.recurrence,
        title: newClass.name, // store title for later linking
      });
    }
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

    // create study session linked to class
    const start = new Date(cls.start);
    start.setDate(start.getDate() + 1);
    start.setHours(18);
    const end = new Date(start);
    end.setHours(end.getHours() + 2);
    events.push({
      title: `Study for ${cls.title}`,
      description: "Linked study session",
      startDateTime: start,
      endDateTime: end,
      eventType: "study session",
      color: cls.color,
      notifyMe: getRandom(NOTIFY_OPTIONS),
      recurrence: null,
      seriesId: null,
      createdBy: cls.userId,
      additionalInfo: { linkedClassId: cls.classId },
    });
  }

  for (const { id: userId } of users) {
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

  const normalized = events.map((ev) => ({
    ...ev,
    additionalInfo: JSON.stringify(ev.additionalInfo ?? {}),
  }));

  const BATCH_SIZE = 100;
  for (let i = 0; i < normalized.length; i += BATCH_SIZE) {
    const batch = normalized.slice(i, i + BATCH_SIZE);
    await db.insert(calendarEventsTable).values(batch);
  }
}

(async () => {
  const users = await seedUsers();
  const semesters = await seedSemesters(users);
  const classes = await seedClasses(semesters);
  await seedCalendarEvents(users, classes);
  console.log("Seed completed.");
})();
