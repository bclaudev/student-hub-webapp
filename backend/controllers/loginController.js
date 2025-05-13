import jwt from 'jsonwebtoken';
import { db } from '../db.js';
import { usersTable } from '../drizzle/schema.js';
import { eq } from 'drizzle-orm';
import { setCookie } from 'hono/cookie';

export const login = async (c) => {
  try {
    const { email, password } = await c.req.json(); // Parse email and password from the request body

    // Find user by email
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));

    // If user not found, return an error
    if (!user) {
      return c.json({ message: "Invalid email or password." }, 401);
    }

    // Compare password
    if (password !== user.password) {
      return c.json({ message: "Invalid email or password." }, 401);
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: '12h' } // Token expires in 12 hours
    );

    // Set the token as a cookie
    setCookie(c, 'token', token, {
      httpOnly: true,
      secure: false, // Change to `true` in production
      sameSite: 'Lax',
      path: '/',
      maxAge: 12 * 60 * 60, // 12 hours
    });

    // Return success message and user details
    return c.json({
      message: "Login successful!",
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      }
    });
  } catch (error) {
    // Handle any errors that occur during the login process
    console.error("Error during login:", error);
    return c.json({ message: "An error occurred. Please try again later." }, 500);
  }
};
