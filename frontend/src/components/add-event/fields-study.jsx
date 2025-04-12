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

export default function StudyFields() {
  const { form } = useEventForm();
  const inputId = useId();

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
          htmlFor={`${inputId}-topics`}
          className="sm:w-24 text-sm font-medium"
        >
          Topics / Chapters
        </Label>
        <div onPointerDown={(e) => e.stopPropagation()}>
          <Select
            value={form.watch("topics")}
            onValueChange={(val) => form.setValue("topics", val)}
          >
            <SelectTrigger className="flex-1 w-full">
              <SelectValue placeholder="Choose a topic" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="chapter-1">Chapter 1</SelectItem>
              <SelectItem value="chapter-2">Chapter 2</SelectItem>
              <SelectItem value="revision">Final Revision</SelectItem>
            </SelectContent>
          </Select>
        </div>
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
            onValueChange={(val) => form.setValue("linkedClass", val)}
          >
            <SelectTrigger className="flex-1 w-full">
              <SelectValue placeholder="Select class" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="math101">Math 101</SelectItem>
              <SelectItem value="cs205">CS 205</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
