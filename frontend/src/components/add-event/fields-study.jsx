"use client";

import { useId } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { FormSection } from "./form-section";
import { DateRangePicker } from "../shared/date-range-picker";
import TimeRangePicker from "../shared/time-range-picker";
import { useEventForm } from "@/context/event-form-context";
import { useQuery } from "@tanstack/react-query";

export default function StudyFields() {
  const { form } = useEventForm();
  const inputId = useId();
  const { data: semesterData } = useQuery({
    queryKey: ["activeSemester"],
    queryFn: () => fetch("/api/semesters/active").then((res) => res.json()),
  });

  const activeSemesterId = semesterData?.activeSemester?.id;

  const { data: classData } = useQuery({
    queryKey: ["classes", activeSemesterId],
    queryFn: () =>
      fetch(`/api/classes?semesterId=${activeSemesterId}`).then((res) =>
        res.json()
      ),
    enabled: !!activeSemesterId,
  });

  console.log("ID semestru activ:", activeSemesterId);

  const classes = classData?.classes || [];
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
        <Label
          htmlFor={`${inputId}-location`}
          className="sm:w-24 text-sm font-medium"
        >
          Location
        </Label>
        <Input
          id={`${inputId}-location`}
          placeholder="Library, Zoom, etc."
          className="flex-1 w-full"
          {...form.register("location")}
        />
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
        <Label
          htmlFor={`${inputId}-linkedClass`}
          className="sm:w-24 text-sm font-medium"
        >
          Linked Class
        </Label>
        <div onPointerDown={(e) => e.stopPropagation()}>
          <Select
            value={form.watch("linkedClass")}
            onValueChange={(val) => {
              form.setValue("linkedClass", val); // id
              const selected = classes.find((cls) => cls.id.toString() === val);
              form.setValue(
                "linkedClassName",
                selected?.abbreviation || selected?.name || "Unnamed"
              );
            }}
          >
            <SelectTrigger className="flex-1 w-full">
              <SelectValue placeholder="Select class" />
            </SelectTrigger>
            <SelectContent>
              {classes.length === 0 ? (
                <SelectItem disabled value="no-classes">
                  No classes found
                </SelectItem>
              ) : (
                classes.map((cls) => (
                  <SelectItem key={cls.id} value={cls.id.toString()}>
                    <span className="flex items-center gap-2">
                      <span className="text-muted-foreground text-xs uppercase">
                        {cls.class_type}
                      </span>
                      <span>
                        {cls.abbreviation || cls.name || "Unnamed Class"}
                      </span>
                    </span>{" "}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
