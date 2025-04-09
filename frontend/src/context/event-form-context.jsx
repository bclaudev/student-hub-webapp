"use client"

import { createContext, useContext } from "react"
import { useForm } from "react-hook-form"

const EventFormContext = createContext(null)

export function EventFormProvider({ children }) {
  const form = useForm()

  return (
    <EventFormContext.Provider value={{ form, ...form }}>
      {children}
    </EventFormContext.Provider>
  )
}

export function useEventForm() {
  const context = useContext(EventFormContext)
  if (!context) {
    throw new Error("useEventForm must be used within an EventFormProvider")
  }
  return context
}
