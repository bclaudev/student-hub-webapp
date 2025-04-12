import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import CommonFields from "@/components/add-event/fields-common";
import AppointmentFields from "@/components/add-event/fields-appointment";
import DeadlineFields from "@/components/add-event/fields-deadline";
import ClassFields from "@/components/add-event/fields-class";
import ExamFields from "@/components/add-event/fields-exam";
import StudyFields from "@/components/add-event/fields-study";
import { EventFormProvider, useEventForm } from "@/context/event-form-context";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Form } from "@/components/ui/form";
import { toast } from "sonner";

const eventTypes = [
  { label: "Event", value: "event" },
  { label: "Appointment", value: "appointment" },
  { label: "Deadline", value: "deadline" },
  { label: "Class", value: "class" },
  { label: "Exam", value: "exam" },
  { label: "Study", value: "study" },
];

export default function AddEventModal({ onSave }) {
  const [open, setOpen] = useState(false);
  const [eventType, setEventType] = useState("event");

  const handleSave = async (data) => {
    console.log("📦 Submitting event data:", data);
    await onSave({ ...data, eventType });
    toast.success("Event saved!");
    setOpen(false);
  };

  return (
    <EventFormProvider>
      <Dialog open={open} onOpenChange={setOpen} modal={false}>
        <DialogTrigger asChild>
          <Button variant="default">New Event</Button>
        </DialogTrigger>
        <DialogContent className="w-full max-w-[100vw] sm:max-w-[800px] p-6 overflow-y-auto overflow-x-hidden">
          <DialogHeader>
            <DialogTitle>New Event</DialogTitle>
          </DialogHeader>

          {/* Event Type Toggle Group */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center sm:gap-4">
            <Label className="sm:w-24 text-sm font-medium">Event Type *</Label>
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
                  className="min-w-[104px] px-4 py-2 text-sm font-medium text-center justify-center"
                >
                  {label}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>

          <FormWrapper eventType={eventType} onSave={handleSave} />
        </DialogContent>
      </Dialog>
    </EventFormProvider>
  );
}

function RenderEventFields({ type }) {
  switch (type) {
    case "appointment":
      return <AppointmentFields />;
    case "deadline":
      return <DeadlineFields />;
    case "class":
      return <ClassFields />;
    case "exam":
      return <ExamFields />;
    case "study":
      return <StudyFields />;
    default:
      return null;
  }
}

function FormWrapper({ eventType, onSave }) {
  const { form } = useEventForm();

  if (!form || !form.control) return null;

  const onSubmit = async (data) => {
    await onSave(data);
    form.reset(); // ✅ clear form fields after submission
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <CommonFields />
        <RenderEventFields type={eventType} />
        <Button type="submit" className="w-full">
          Save Event
        </Button>
      </form>
    </Form>
  );
}
