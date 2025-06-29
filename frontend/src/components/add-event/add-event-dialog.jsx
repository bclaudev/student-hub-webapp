"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

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

export default function AddEventModal({
  onSave,
  onClose,
  initialData,
  open,
  onDelete,
}) {
  // Create one form instance
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
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Initialize the form with initial data when the modal opens
  useEffect(() => {
    if (!open || !initialData) return;

    const start = new Date(initialData.start);
    const end = new Date(initialData.end);
    const info = initialData.additionalInfo || {};

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
      priority: "",

      name: info.name ?? "",
      abbreviation: info.abbreviation ?? "",
      professorName: info.teacherName ?? "",
      locationType: info.deliveryMode === "Campus" ? "classroom" : "online",
      room: info.roomNumber ?? "",
      meetingLink: info.meetingLink ?? "",
      recurrence: info.recurrence ?? "",
      examDate: info.examDate ? info.examDate.split("T")[0] : "",
      curriculum: null, // we can't prefill a file input
      classType: info.classType ?? "",
    });

    setEventType(initialData.eventType ?? "event");
  }, [open, initialData, form]);

  // Handle form submission
  const handleSubmit = (data) => {
    console.log("✅ FORM SUBMIT:", data);

    const additionalInfo = {};
    if (eventType === "study") {
      additionalInfo.linkedClass = data.linkedClass;
      additionalInfo.linkedClassName = data.linkedClassName;
    }

    onSave({
      ...data,
      notifyMe: data.notify === "never" ? null : parseInt(data.notify),
      eventType,
      title: eventType === "class" ? data.name : data.title,
      additionalInfo,
    });

    onClose();

    // notificare programată în browser
    // notificare în browser
    if (data.notify !== "never" && Notification.permission === "granted") {
      const [hours, minutes] = data.startTime.split(":").map(Number);
      const startDate = new Date(data.dateRange.from);
      startDate.setHours(hours, minutes, 0, 0);

      const notifyTime = new Date(
        startDate.getTime() - parseInt(data.notify) * 60 * 1000
      );
      const delay = notifyTime.getTime() - Date.now();

      const title =
        eventType === "class"
          ? data.name || "Class reminder"
          : data.title || "Reminder";

      // salvăm în localStorage
      const scheduled = {
        title,
        time: notifyTime.getTime(),
        startTime: data.startTime,
      };
      const existing = JSON.parse(
        localStorage.getItem("pendingNotifications") || "[]"
      );
      localStorage.setItem(
        "pendingNotifications",
        JSON.stringify([...existing, scheduled])
      );

      if (delay > 0) {
        setTimeout(() => {
          new Notification(title, {
            body: `Starts at ${data.startTime}`,
            icon: "/icon.png",
          });
        }, delay);
      }
    }
  };

  const handleInvalid = (errors) => {
    console.log("FORM INVALID:", errors);
  };
  console.log("VALORI ACTUALE:", form.getValues());

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
      <EventFormProvider form={form}>
        <DialogContent className="w-full max-w-[100vw] sm:max-w-[800px] p-6 overflow-y-auto text-foreground">
          <form
            onSubmit={form.handleSubmit(handleSubmit, handleInvalid)}
            className="space-y-4"
          >
            <DialogHeader>
              <DialogTitle>
                {initialData ? "Edit Event" : "New Event"}
              </DialogTitle>
            </DialogHeader>

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

            {eventType !== "class" && <CommonFields />}
            {renderEventSpecificFields(eventType)}

            <div className="flex justify-end pt-4 text-foreground">
              {initialData && (
                <AlertDialog
                  open={showDeleteConfirm}
                  onOpenChange={setShowDeleteConfirm}
                >
                  <AlertDialogTrigger asChild>
                    <Button
                      type="button"
                      variant="destructive"
                      className="mr-auto"
                    >
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-foreground">
                        Delete recurring event?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This event is part of a series. Do you want to delete
                        only this occurrence or the entire series?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel
                        onClick={() => {
                          onDelete?.({
                            id: initialData.id,
                            seriesId: initialData.seriesId,
                            deleteAll: false,
                          });
                          setShowDeleteConfirm(false);
                        }}
                        className="text-foreground"
                      >
                        Only this event
                      </AlertDialogCancel>

                      <AlertDialogAction
                        onClick={() => {
                          onDelete?.({
                            id: initialData.id,
                            seriesId: initialData.seriesId,
                            deleteAll: true,
                          });
                          setShowDeleteConfirm(false);
                        }}
                      >
                        This and following events
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}

              <Button type="submit">{initialData ? "Update" : "Save"}</Button>
            </div>
          </form>
        </DialogContent>
      </EventFormProvider>
    </Dialog>
  );
}
