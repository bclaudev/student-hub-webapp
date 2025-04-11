import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import CommonFields from "@/components/add-event/fields-common"
import AppointmentFields from "@/components/add-event/fields-appointment"
import DeadlineFields from "@/components/add-event/fields-deadline"
import ClassFields from "@/components/add-event/fields-class"
import ExamFields from "@/components/add-event/fields-exam"
import StudyFields from "@/components/add-event/fields-study"
import { EventFormProvider } from "@/context/event-form-context"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"
import { Label } from "@/components/ui/label"


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
    switch (eventType) {
      case "appointment":
        return <AppointmentFields />
      case "deadline":
        //return <div>Test: Deadline Fields</div>
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
        <DialogContent className="w-full max-w-[100vw] sm:max-w-[800px] p-6 overflow-y-auto overflow-x-hidden">
          <DialogHeader className="mb-2">
            <DialogTitle className="text-xl">New Event</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Event Type Toggle Group */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Event Type *</Label>
              <ToggleGroup
                type="single"
                value={eventType}
                onValueChange={(value) => value && setEventType(value)}
                className="flex flex-wrap"
              >
                {eventTypes.map(({ label, value }) => (
                  <ToggleGroupItem
                    key={value}
                    value={value}
                    className="min-w-[120px] px-4 py-2 text-sm font-medium text-center justify-center"
                    >
                    {label}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </div>

            {/* Common Fields always visible */}
            <CommonFields />

            {/* Conditional Fields */}
            {renderForm()}
          </div>
        </DialogContent>
      </Dialog>
    </EventFormProvider>
  )
}
