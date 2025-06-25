import { db } from "../db.js";
import { usersTable } from "../drizzle/schema.js";
import { eq } from "drizzle-orm";
import { posthog } from "../lib/posthog.js";

export const registerUser = async (c) => {
  try {
    const rawBody = await c.req.text(); // Get the raw request body as text

    // Check if the request body is empty
    if (!rawBody.trim()) {
      return c.json({ message: "Request body cannot be empty" }, 400);
    }

    const parsedBody = JSON.parse(rawBody); // Manually parse JSON

    const { email, password, firstName, lastName, dateOfBirth } = parsedBody; // Destructure the parsed body

    // Check if all required fields are provided
    if (!email || !password || !firstName || !lastName || !dateOfBirth) {
      return c.json(
        {
          message:
            "All fields (email, password, firstName, lastName, dateOfBirth) are required",
        },
        400
      );
    }

    // Validate date format
    const parsedDate = new Date(dateOfBirth);
    if (isNaN(parsedDate.getTime())) {
      return c.json(
        {
          message: "Please provide a valid date of birth in YYYY-MM-DD format.",
        },
        400
      );
    }

    // Check if user already exists
    const existingUser = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));

    if (existingUser.length) {
      return c.json({ message: "Email already in use" }, 400);
    }

    // Insert new user into the database
    const [newUser] = await db
      .insert(usersTable)
      .values({
        email,
        password,
        firstName,
        lastName,
        dateOfBirth: parsedDate, // Save properly formatted date
      })
      .returning();
    console.log("📬 Sending PostHog event for user:", newUser.email);

    // Posthog event tracking
    await posthog.capture({
      distinctId: newUser.id,
      event: "user_registered",
      properties: {
        email: newUser.email,
        role: newUser.role || "user", // dacă nu ai încă `role` setat
        source: "manual_signup",
      },
    });
    await posthog.flush();

    // Return success message and user details
    return c.json({
      message: "User registered successfully",
      user: {
        id: newUser.id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        password: newUser.password,
        dateOfBirth: newUser.dateOfBirth,
      },
    });
  } catch (error) {
    // Handle any errors that occur during the registration process
    console.error("Error during registration:", error);
    return c.json({ message: "Internal server error" }, 500);
  }
};
