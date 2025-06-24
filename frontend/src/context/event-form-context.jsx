"use client";

import { createContext, useContext } from "react";
import { useForm } from "react-hook-form";

const EventFormContext = createContext(null);

export function EventFormProvider({ children, form: externalForm }) {
  const form = externalForm ?? internalForm;

  return (
    <EventFormContext.Provider value={{ form, ...form }}>
      {children}
    </EventFormContext.Provider>
  );
}

export function useEventForm() {
  const ctx = useContext(EventFormContext);
  if (!ctx)
    throw new Error("useEventForm must be used within EventFormProvider");
  return ctx;
}
