// src/hooks/use-user.jsx
import { createContext, useContext, useEffect, useState } from "react";

const UserContext = createContext();
export function UserProvider({ children }) {
  const [user, setUser] = useState(null);

  // Funcție refolosibilă care face fetch la user
  const fetchUser = async () => {
    try {
      const res = await fetch("/api/user", {
        credentials: "include",
      });

      if (!res.ok) throw new Error("Unauthorized");

      const data = await res.json();
      setUser(data.user);
      return data.user;
    } catch (err) {
      console.error("Failed to fetch user:", err.message);
      setUser(null);
    }
  };

  // Fetch o dată la start
  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, fetchUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
