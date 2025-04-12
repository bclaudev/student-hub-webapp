"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEventForm } from "@/context/event-form-context";
import { cn } from "@/lib/utils";
import { useId } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { DatePickerWithPresets } from "@/components/ui/calendar-date-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ExamFields() {
  const { form, watch } = useEventForm();
  const locationType = form.watch("locationType");
  const inputId = useId();

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
        <Label
          htmlFor={`${inputId}-locationType`}
          className="sm:w-24 text-sm font-medium"
        >
          Location
        </Label>
        <div onPointerDown={(e) => e.stopPropagation()}>
          <Select
            value={locationType}
            onValueChange={(value) => form.setValue("locationType", value)}
          >
            <SelectTrigger className="flex-1 w-full">
              <SelectValue placeholder="Select location type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="classroom">Classroom</SelectItem>
              <SelectItem value="online">Online</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {locationType === "classroom" && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
          <Label
            htmlFor={`${inputId}-room`}
            className="sm:w-24 text-sm font-medium"
          >
            Room
          </Label>
          <Input
            id={`${inputId}-room`}
            className="flex-1 w-full"
            placeholder="Room number or name"
            {...form.register("room")}
          />
        </div>
      )}

      {locationType === "online" && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
          <Label
            htmlFor={`${inputId}-meetingLink`}
            className="sm:w-24 text-sm font-medium"
          >
            Meeting Link
          </Label>
          <Input
            id={`${inputId}-meetingLink`}
            className="flex-1 w-full"
            placeholder="https://..."
            {...form.register("meetingLink")}
          />
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-start gap-2 sm:gap-4">
        <Label
          htmlFor={`${inputId}-materials`}
          className="sm:w-24 pt-2 text-sm font-medium"
        >
          Allowed Materials
        </Label>
        <Textarea
          id={`${inputId}-materials`}
          className="flex-1 w-full min-h-[120px]"
          {...form.register("materials")}
        />
      </div>
    </div>
  );
}
