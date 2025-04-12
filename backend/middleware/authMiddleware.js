import jwt from "jsonwebtoken";
import { getCookie } from "hono/cookie"; // Import getCookie to extract cookies

export const verifyToken = async (c, next) => {
  try {
    // Ensure the context and request are defined
    if (!c || !c.req) {
      return c.json({ message: "Unauthorized" }, 401);
    }

    // Extract token from cookies
    const token = getCookie(c, "token");

    // Check if the token is missing or invalid
    if (!token) {
      return c.json({ message: "Unauthorized" }, 401);
    }

    // Verify the token using the secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Set user data in the request context
    c.set("user", decoded);

    // Proceed to the next middleware or route handler
    return next();
  } catch (error) {
    // Handle any errors that occur during token verification
    return c.json({ message: "Unauthorized" }, 401);
  }
};
