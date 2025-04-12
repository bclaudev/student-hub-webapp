"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEventForm } from "@/context/event-form-context";
import { useId } from "react";

export default function ClassFields() {
  const { form } = useEventForm();
  const locationType = form.watch("locationType");
  const id = useId();

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
        <Label
          htmlFor={`${id}-locationType`}
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
          <Label htmlFor={`${id}-room`} className="sm:w-24 text-sm font-medium">
            Room
          </Label>
          <Input
            id={`${id}-room`}
            className="flex-1 w-full"
            placeholder="Room number or name"
            {...form.register("room")}
          />
        </div>
      )}

      {locationType === "online" && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
          <Label
            htmlFor={`${id}-meetingLink`}
            className="sm:w-24 text-sm font-medium"
          >
            Meeting Link
          </Label>
          <Input
            id={`${id}-meetingLink`}
            className="flex-1 w-full"
            placeholder="https://..."
            {...form.register("meetingLink")}
          />
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
        <Label
          htmlFor={`${id}-professorName`}
          className="sm:w-24 text-sm font-medium"
        >
          Professor
        </Label>
        <Input
          id={`${id}-professorName`}
          className="flex-1 w-full"
          placeholder="Prof. John Smith"
          {...form.register("professorName")}
        />
      </div>
    </div>
  );
}
