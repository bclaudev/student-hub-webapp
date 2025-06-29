import { Hono } from "hono";
import { db } from "../db.js";
import { calendarEventsTable } from "../drizzle/schema.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { eq } from "drizzle-orm";
import { generateRecurringClassEvents } from "../lib/recurrence/generate-recurring-class-events.js";
import { randomUUID } from "crypto";

const eventsRoute = new Hono();

// Middleware to verify user token
eventsRoute.use("*", verifyToken);

// Route to create a new event
eventsRoute.post("/", async (c) => {
  try {
    const userId = c.get("user").id;
    const body = await c.req.json();
    const {
      title,
      description,
      startDateTime,
      endDateTime,
      eventType,
      color,
      notifyMe,
      recurrence,
    } = body;

    if (!title || !startDateTime || !endDateTime || !eventType) {
      return c.json({ error: "Missing required fields" }, 400);
    }

    const additionalInfo = { ...body };
    delete additionalInfo.title;
    delete additionalInfo.description;
    delete additionalInfo.startDateTime;
    delete additionalInfo.endDateTime;
    delete additionalInfo.eventType;
    delete additionalInfo.color;
    delete additionalInfo.notifyMe;

    const seriesId = recurrence ? randomUUID() : undefined;

    if (recurrence) {
      const start = new Date(startDateTime);
      const end = new Date(endDateTime);

      const weekday = start.toLocaleString("en-US", { weekday: "long" });
      const startTimeStr = start.toTimeString().slice(0, 5);
      const endTimeStr = end.toTimeString().slice(0, 5);

      const recurrenceEnd = new Date(start);
      recurrenceEnd.setDate(recurrenceEnd.getDate() + 84);

      const recurringDates = generateRecurringClassEvents({
        weekday,
        startTime: startTimeStr,
        endTime: endTimeStr,
        recurrence,
        semesterStart: start,
        semesterEnd: recurrenceEnd,
      });

      const eventsToInsert = recurringDates.map(({ start, end }) => ({
        title,
        description,
        startDateTime: start,
        endDateTime: end,
        eventType,
        color,
        notifyBeforeMinutes: notifyMe,
        createdBy: userId,
        seriesId,
        additionalInfo,
      }));

      const inserted = await db
        .insert(calendarEventsTable)
        .values(eventsToInsert)
        .returning();

      return c.json({ events: inserted }, 201);
    }

    // Fără recurență
    const newEvent = await db
      .insert(calendarEventsTable)
      .values({
        title,
        description,
        startDateTime: new Date(startDateTime),
        endDateTime: new Date(endDateTime),
        eventType,
        color,
        notifyBeforeMinutes: body.notifyMe,
        createdBy: userId,
        additionalInfo,
      })
      .returning();

    return c.json({ event: newEvent }, 201);
  } catch (error) {
    return c.json({ error: "Internal server error" }, 500);
  }
});

// Route to update an existing event
eventsRoute.put("/:id", async (c) => {
  try {
    const user = c.get("user"); // Get user from the request context
    const eventId = parseInt(c.req.param("id")); // Get event ID from the request parameters
    const body = await c.req.json(); // Parse request body

    const {
      title,
      description,
      startDateTime,
      endDateTime,
      eventType,
      color,
      notifyMe,
    } = body; // Destructure event details from the request body

    // Validate required fields
    if (!title || !startDateTime || !endDateTime || !eventType) {
      return c.json({ error: "Missing required fields" }, 400);
    }

    // Check if the event exists and belongs to the user
    const [existingEvent] = await db
      .select()
      .from(calendarEventsTable)
      .where(eq(calendarEventsTable.id, eventId))
      .where(eq(calendarEventsTable.createdBy, user.id))
      .execute();

    if (!existingEvent) {
      return c.json({ error: "Event not found" }, 404);
    }

    // Prepare new additional info by excluding certain fields
    const newAdditionalInfo = { ...body };
    delete newAdditionalInfo.title;
    delete newAdditionalInfo.description;
    delete newAdditionalInfo.startDateTime;
    delete newAdditionalInfo.endDateTime;
    delete newAdditionalInfo.eventType;
    delete newAdditionalInfo.color;
    delete newAdditionalInfo.notifyMe;

    // Merge existing additional info with new additional info
    const mergedAdditionalInfo = {
      ...existingEvent.additionalInfo,
      ...newAdditionalInfo,
    };

    // Update the event in the database
    const [updatedEvents] = await db
      .update(calendarEventsTable)
      .set({
        title,
        description,
        startDateTime: new Date(startDateTime),
        endDateTime: new Date(endDateTime),
        eventType,
        color,
        notifyMe,
        additionalInfo: mergedAdditionalInfo,
      })
      .where(
        recurrence
          ? eq(calendarEventsTable.seriesId, existingEvent.seriesId)
          : eq(calendarEventsTable.id, eventId)
      )
      .returning();

    return c.json({
      message: "Event updated successfully",
      event: updatedEvents,
    }); // Return the updated event
  } catch (error) {
    return c.json({ error: "Internal server error" }, 500);
  }
});

// Route to delete an event
eventsRoute.delete("/:id", async (c) => {
  try {
    const user = c.get("user");
    const eventId = parseInt(c.req.param("id"));
    const { deleteAll } = await c.req.json();

    const [existingEvent] = await db
      .select()
      .from(calendarEventsTable)
      .where(eq(calendarEventsTable.id, eventId))
      .where(eq(calendarEventsTable.createdBy, user.id))
      .execute();

    if (!existingEvent) {
      return c.json({ error: "Event not found" }, 404);
    }

    if (deleteAll === true && existingEvent.seriesId) {
      await db
        .delete(calendarEventsTable)
        .where(eq(calendarEventsTable.seriesId, existingEvent.seriesId))
        .execute();
      return c.json({ message: "All recurring events deleted successfully" });
    } else if (deleteAll === "following" && existingEvent.seriesId) {
      await db
        .delete(calendarEventsTable)
        .where(
          and(
            eq(calendarEventsTable.seriesId, existingEvent.seriesId),
            sql`${calendarEventsTable.startDateTime} >= ${existingEvent.startDateTime}`
          )
        )
        .execute();
      return c.json({
        message: "This and following events deleted successfully",
      });
    } else {
      await db
        .delete(calendarEventsTable)
        .where(eq(calendarEventsTable.id, eventId))
        .execute();
      return c.json({ message: "Event deleted successfully" });
    }
  } catch (error) {
    console.error(error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// Route to get all events for the logged-in user
eventsRoute.get("/", async (c) => {
  try {
    const userId = c.get("user").id; // Get user ID from the request context
    const events = await db
      .select()
      .from(calendarEventsTable)
      .where(eq(calendarEventsTable.createdBy, userId))
      .execute(); // Retrieve events from the database
    return c.json({ events }); // Return the events
  } catch (error) {
    return c.json({ error: "Internal server error" }, 500);
  }
});

export default eventsRoute;
