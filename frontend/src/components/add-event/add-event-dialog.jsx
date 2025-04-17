"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import CommonFields from "@/components/add-event/fields-common";
import AppointmentFields from "@/components/add-event/fields-appointment";
import DeadlineFields from "@/components/add-event/fields-deadline";
import ClassFields from "@/components/add-event/fields-class";
import ExamFields from "@/components/add-event/fields-exam";
import StudyFields from "@/components/add-event/fields-study";
import { EventFormProvider } from "@/context/event-form-context"; // ← keep using it
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Label } from "@/components/ui/label";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { format, isValid } from "date-fns";

const eventTypes = [
  { label: "Event", value: "event" },
  { label: "Appointment", value: "appointment" },
  { label: "Deadline", value: "deadline" },
  { label: "Class", value: "class" },
  { label: "Exam", value: "exam" },
  { label: "Study", value: "study" },
];

export default function AddEventModal({ onSave, onClose, initialData, open }) {
  /* ------------------------------------------------------------------ */
  /* 1. create ONE form instance                                         */
  /* ------------------------------------------------------------------ */
  const form = useForm({
    defaultValues: {
      title: "",
      description: "",
      color: "#a585ff",
      notify: "never",
      startTime: "",
      endTime: "",
      dateRange: { from: new Date(), to: new Date() },
      eventType: "event",
    },
  });

  /* keep the toggle in sync with the form */
  const [eventType, setEventType] = useState(initialData?.eventType || "event");

  /* ------------------------------------------------------------------ */
  /* 2. hydrate that instance when initialData arrives                   */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    if (!open || !initialData) return; // editing happens *after* modal opens

    const start = new Date(initialData.start);
    const end = new Date(initialData.end);

    form.reset({
      title: initialData.title ?? "",
      description: initialData.description ?? "",
      color: initialData.color ?? "#a585ff",
      notify: initialData.notifyMe ?? "never",
      eventType: initialData.eventType ?? "event",
      startTime: isValid(start) ? format(start, "HH:mm") : "",
      endTime: isValid(end) ? format(end, "HH:mm") : "",
      dateRange:
        isValid(start) && isValid(end)
          ? { from: start, to: end }
          : { from: new Date(), to: new Date() },
    });

    setEventType(initialData.eventType ?? "event");
  }, [open, initialData, form]);

  /* ------------------------------------------------------------------ */
  /* 3. submit handler                                                   */
  /* ------------------------------------------------------------------ */
  const handleSubmit = (values) => {
    console.log(form.formState.errors);
    onSave({ ...values, eventType });
    onClose();
  };

  const renderEventSpecificFields = (type) => {
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
  };

  return (
    <Dialog open={open} onOpenChange={onClose} modal={false}>
      <DialogContent className="w-full max-w-[100vw] sm:max-w-[800px] p-6 overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit Event" : "New Event"}</DialogTitle>
        </DialogHeader>

        {/* ❗ 4. PROVIDE *THIS* FORM INSTANCE TO THE REST OF THE APP  */}
        <EventFormProvider form={form}>
          <Form {...form} onSubmit={form.handleSubmit(handleSubmit)}>
            {/* event‑type selector */}
            <div className="space-y-2 mb-6">
              <Label className="text-sm font-medium">Event Type *</Label>
              <ToggleGroup
                type="single"
                value={eventType}
                onValueChange={(val) => {
                  if (val) {
                    setEventType(val);
                    form.setValue("eventType", val);
                  }
                }}
                className="flex flex-wrap"
              >
                {eventTypes.map(({ label, value }) => (
                  <ToggleGroupItem
                    key={value}
                    value={value}
                    className="min-w-[120px] px-4 py-2 text-sm font-medium text-center"
                  >
                    {label}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </div>

            {/* common + conditional fields */}
            <CommonFields />
            {renderEventSpecificFields(eventType)}

            <div className="flex justify-end pt-4">
              {console.log("⛳ form id", form.formId)}
              <Button type="submit">{initialData ? "Update" : "Save"}</Button>
            </div>
          </Form>
        </EventFormProvider>
      </DialogContent>
    </Dialog>
  );
}
