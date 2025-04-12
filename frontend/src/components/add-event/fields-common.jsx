"use client";

import { Input } from "@/components/ui/input";
import { ColorPicker } from "@/components/ui/color-picker";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DateRangePicker } from "../shared/date-range-picker";
import CustomTimePicker from "@/components/shared/time-range-picker";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useEventForm } from "@/context/event-form-context";

export default function CommonFields() {
  const { form } = useEventForm();
  const color = form.watch("color");
  const fallbackColor = "#A585FF";
  const swatchColor = color && color.length === 7 ? color : fallbackColor;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
        <Label htmlFor="title" className="sm:w-24 text-sm font-medium">
          Title *
        </Label>
        <Input
          id="title"
          className="flex-1 w-full"
          {...form.register("title", { required: true })}
        />
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
        <Label
          htmlFor="description"
          className="sm:w-24 pt-2 text-sm font-medium"
        >
          Description
        </Label>
        <Textarea
          id="description"
          className="flex-1 w-full min-h-[120px]"
          {...form.register("description")}
        />
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
        <Label className="sm:w-24 text-sm font-medium">Date & Time *</Label>
        <div className="flex flex-1 flex-wrap gap-4 w-full">
          <div className="min-w-[200px]">
            <DateRangePicker
              value={form.watch("dateRange")}
              onChange={(range) => form.setValue("dateRange", range)}
            />
          </div>
          <div className="min-w-[300px] flex-1">
            <div onPointerDown={(e) => e.stopPropagation()}>
              <CustomTimePicker
                start={form.watch("startTime")}
                end={form.watch("endTime")}
                onChange={(start, end) => {
                  form.setValue("startTime", start);
                  form.setValue("endTime", end);
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
        <Label htmlFor="color" className="sm:w-24 text-sm font-medium">
          Color
        </Label>

        <ColorPicker
          value={swatchColor}
          onChange={(val) => form.setValue("color", val)}
        />
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
        <Label htmlFor="notify" className="sm:w-24 text-sm font-medium">
          Notify
        </Label>
        <div onPointerDown={(e) => e.stopPropagation()}>
          <Select
            value={form.watch("notify")}
            onValueChange={(val) => form.setValue("notify", val)}
          >
            <SelectTrigger className="flex-1 w-full">
              <SelectValue placeholder="Notification time" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="15">15 min before</SelectItem>
              <SelectItem value="30">30 mins before</SelectItem>
              <SelectItem value="60">1h before</SelectItem>
              <SelectItem value="never">Never</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
