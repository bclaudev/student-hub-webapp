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

  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  /* ---------- helpers ---------- */
  const swatchColor = form.watch("color")?.match(/^#[0-9a-f]{6}$/i)
    ? form.watch("color")
    : "#A585FF";

  const COLORS = [
    { label: "Vanilla Fog", value: "#D9D5BA" },
    { label: "Blush Error", value: "#D9B0B1" },
    { label: "Midnight Denim", value: "#596F8F" },
    { label: "Cloud Link", value: "#A5BAD9" },
    { label: "Parchment Whisper", value: "#F8F5E3" },
    { label: "Mint Ghost", value: "#DEEEE4" },
    { label: "Lavender Static", value: "#D1D0E4" },
    { label: "Skybuffer", value: "#E3EEF8" },
  ];

  /* ---------- UI ---------- */
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

          <div
            className="grid grid-cols-2 gap-4 flex-1 min-w-[260px]"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="space-y-2">
              <Input
                id="start-time"
                placeholder="Start Time"
                type="time"
                {...form.register("startTime", { required: true })}
              />
            </div>
            <div className="space-y-2">
              <Input
                id="end-time"
                placeholder="End Time"
                type="time"
                {...form.register("endTime", { required: true })}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
        <Label className="sm:w-24 text-sm font-medium">Occurrence</Label>
        <div className="flex-1" onMouseDown={(e) => e.stopPropagation()}>
          <Select
            value={form.watch("recurrence")}
            onValueChange={(value) => form.setValue("recurrence", value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select frequency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>

              <SelectItem value="weekly">Once a week</SelectItem>
              <SelectItem value="biweekly">Every 2 weeks</SelectItem>
              <SelectItem value="every-three-weeks">Every 3 weeks</SelectItem>
              <SelectItem value="monthly">Once a month</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
        <Label htmlFor="color" className="sm:w-24 text-sm font-medium">
          Color
        </Label>

        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
          {COLORS.map((color) => (
            <button
              key={color.value}
              type="button"
              className={`w-6 h-6 rounded-full border-2 transition ${
                form.watch("color") === color.value
                  ? "ring-2 ring-offset-1 ring-black"
                  : "border-transparent"
              }`}
              style={{ backgroundColor: color.value }}
              onClick={() => form.setValue("color", color.value)}
              title={color.label}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
        <Label htmlFor="notify" className="sm:w-24 text-sm font-medium">
          Notify
        </Label>
        <div onMouseDown={(e) => e.stopPropagation()}>
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
