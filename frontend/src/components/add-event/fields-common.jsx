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
import { useEffect, useState } from "react";
import { Controller } from "react-hook-form";

export default function CommonFields() {
  const { form } = useEventForm();

  /* ---------- helpers ---------- */
  const swatchColor = form.watch("color")?.match(/^#[0-9a-f]{6}$/i)
    ? form.watch("color")
    : "#A585FF";

  /* ---------- UI ---------- */
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
        {/* title -------------------------------------------------------- */}
        <Label htmlFor="title" className="sm:w-24 text-sm font-medium">
          Title *
        </Label>
        <Input
          id="title"
          className="flex-1 w-full"
          {...form.register("title", { required: true })}
        />
      </div>

      {/* description -------------------------------------------------- */}
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

      {/* date & time -------------------------------------------------- */}

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
              <Controller
                name="startTime"
                control={form.control}
                render={({ field }) => (
                  <CustomTimePicker
                    label="Start Time"
                    value={field.value || ""}
                    onChange={(val) => {
                      if (val && val.includes(":")) {
                        field.onChange(val);
                      }
                    }}
                  />
                )}
              />
              <Controller
                name="endTime"
                control={form.control}
                render={({ field }) => (
                  <CustomTimePicker
                    label="End Time"
                    value={field.value || ""}
                    onChange={(val) => {
                      if (val && val.includes(":")) {
                        field.onChange(val);
                      }
                    }}
                  />
                )}
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
