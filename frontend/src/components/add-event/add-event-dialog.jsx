import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import CommonFields from "@/components/add-event/fields-common"
import AppointmentFields from "@/components/add-event/fields-appointment"
import DeadlineFields from "@/components/add-event/fields-deadline"
import ClassFields from "@/components/add-event/fields-class"
import ExamFields from "@/components/add-event/fields-exam"
import StudyFields from "@/components/add-event/fields-study"
import { EventFormProvider } from "@/context/event-form-context"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"

const eventTypes = [
  { label: "Event", value: "event" },
  { label: "Appointment", value: "appointment" },
  { label: "Deadline", value: "deadline" },
  { label: "Class", value: "class" },
  { label: "Exam", value: "exam" },
  { label: "Study", value: "study" },
]

export default function AddEventModal() {
  const [open, setOpen] = useState(false)
  const [eventType, setEventType] = useState("event")

  const renderForm = () => {
    console.log("eventType:", eventType)
    switch (eventType) {
      case "appointment":
        return <AppointmentFields />
      case "deadline":
        return <DeadlineFields />
      case "class":
        return <ClassFields />
      case "exam":
        return <ExamFields />
      case "study":
        return <StudyFields />
      default:
        return null
    }
  }

  return (
    <EventFormProvider>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="default">New Event</Button>
        </DialogTrigger>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>New Event</DialogTitle>
          </DialogHeader>

          {/* Event Type Toggle Group */}
          <ToggleGroup
            type="single"
            value={eventType}
            onValueChange={(value) => value && setEventType(value)}
            className="mb-4"
          >
            {eventTypes.map(({ label, value }) => (
              <ToggleGroupItem key={value} value={value}>
                {label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>

          {/* Common Fields always visible */}
          <CommonFields />

          {/* Conditional Fields */}
          {renderForm()}
        </DialogContent>
      </Dialog>
    </EventFormProvider>
  )
}
