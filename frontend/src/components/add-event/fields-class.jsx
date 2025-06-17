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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useEventForm } from "@/context/event-form-context";
import { useId } from "react";
import { useState } from "react";

export default function ClassFields() {
  const { form } = useEventForm();
  const id = useId();
  const locationType = form.watch("locationType");
  const classType = form.watch("classType");

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

  return (
    <div className="space-y-6">
      {/* Class Type: course / seminar / colloquy */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Class Type *</Label>
        <RadioGroup
          value={classType}
          onValueChange={(val) => form.setValue("classType", val)}
          className="flex gap-6"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="course" id="course" />
            <Label htmlFor="course">Course</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="seminar" id="seminar" />
            <Label htmlFor="seminar">Seminar</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="colloquy" id="colloquy" />
            <Label htmlFor="colloquy">Colloquy</Label>
          </div>
        </RadioGroup>
      </div>

      {/* Name & Abbreviation */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor={`${id}-name`}>Name *</Label>
          <Input
            id={`${id}-name`}
            placeholder="Course name"
            {...form.register("name", { required: true })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${id}-abbreviation`}>Abbreviation</Label>
          <Input
            id={`${id}-abbreviation`}
            placeholder="e.g. CS101"
            {...form.register("abbreviation")}
          />
        </div>
      </div>

      {/* Professor */}
      <div className="space-y-2">
        <Label htmlFor={`${id}-professor`}>Professor</Label>
        <Input
          id={`${id}-professor`}
          placeholder="Prof. John Smith"
          {...form.register("professorName")}
        />
      </div>

      {/* Format & Room/Link */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor={`${id}-locationType`}>Format</Label>
          <Select
            value={locationType}
            onValueChange={(value) => form.setValue("locationType", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select format" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="classroom">On Campus</SelectItem>
              <SelectItem value="online">Online</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {locationType === "classroom" && (
          <div className="space-y-2">
            <Label htmlFor={`${id}-room`}>Room</Label>
            <Input
              id={`${id}-room`}
              placeholder="e.g. 505"
              {...form.register("room")}
            />
          </div>
        )}

        {locationType === "online" && (
          <div className="space-y-2">
            <Label htmlFor={`${id}-meetingLink`}>Meeting Link</Label>
            <Input
              id={`${id}-meetingLink`}
              placeholder="https://..."
              {...form.register("meetingLink")}
            />
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="start-time">Start Time</Label>
        <Input
          id="start-time"
          type="time"
          {...form.register("startTime", { required: true })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="end-time">End Time</Label>
        <Input
          id="end-time"
          type="time"
          {...form.register("endTime", { required: true })}
        />
      </div>

      {/* Recurrence & Exam Date */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor={`${id}-recurrence`}>Occurrence</Label>
          <Select
            value={form.watch("recurrence")}
            onValueChange={(value) => form.setValue("recurrence", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select frequency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="once-a-week">Once a week</SelectItem>
              <SelectItem value="once-every-two-weeks">
                Every 2 weeks
              </SelectItem>
              <SelectItem value="once-every-three-weeks">
                Every 3 weeks
              </SelectItem>
              <SelectItem value="once-a-month">Once a month</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor={`${id}-examDate`}>Exam Date</Label>
          <Input
            id={`${id}-examDate`}
            type="date"
            {...form.register("examDate")}
          />
        </div>
      </div>

      {/* Color Picker */}
      <div className="space-y-2">
        <Label htmlFor="color">Color</Label>
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

      {/* Curriculum Upload */}
      <div className="space-y-2">
        <Label htmlFor={`${id}-curriculum`}>Curriculum</Label>
        <Input
          id={`${id}-curriculum`}
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={(e) =>
            form.setValue("curriculum", e.target.files?.[0] || null)
          }
        />
        <p className="text-sm text-muted-foreground">
          Upload curriculum file (PDF, DOC, DOCX)
        </p>
      </div>
    </div>
  );
}
