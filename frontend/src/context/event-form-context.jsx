"use client";

import { createContext, useContext } from "react";
import { useForm } from "react-hook-form";

/** -------------------------------------------------
 *  1. Context definition
 * -------------------------------------------------*/
const EventFormContext = createContext(null);

/** -------------------------------------------------
 *  2. Provider
 *     – if a form instance is supplied, reuse it
 *     – otherwise create a fresh one (for “new event”)
 * -------------------------------------------------*/
export function EventFormProvider({ children, form: externalForm }) {
  const form = externalForm ?? internalForm;

  return (
    <EventFormContext.Provider value={{ form, ...form }}>
      {children}
    </EventFormContext.Provider>
  );
}

/** -------------------------------------------------
 *  3. Hook
 * -------------------------------------------------*/
export function useEventForm() {
  const ctx = useContext(EventFormContext);
  if (!ctx)
    throw new Error("useEventForm must be used within EventFormProvider");
  return ctx;
}
