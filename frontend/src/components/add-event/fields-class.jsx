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
import { Button } from "@/components/ui/button";

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
    <div className="grid [grid-template-columns:120px_1fr_100px_1fr] gap-y-3 gap-x-4 py-4 items-center">
      {/* Class Type */}
      <Label className="text-sm font-medium">Class Type *</Label>
      <div className="col-span-3">
        <RadioGroup
          value={classType}
          onValueChange={(val) => form.setValue("classType", val)}
          className="flex gap-6"
        >
          {[
            { id: "course", label: "Course" },
            { id: "seminar", label: "Seminar" },
            { id: "colloquy", label: "Colloquy" },
          ].map(({ id, label }) => (
            <div key={id} className="flex items-center space-x-2">
              <RadioGroupItem value={id} id={id} />
              <Label htmlFor={id}>{label}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* Name and Abbreviation */}
      <Label htmlFor={`${id}-name`} className="text-sm font-medium">
        Name *
      </Label>
      <div className="-mt-1">
        <Input
          id={`${id}-name`}
          placeholder="Course name"
          {...form.register("name", { required: true })}
        />
      </div>
      <Label htmlFor={`${id}-abbreviation`} className="text-sm font-medium">
        Abbreviation
      </Label>
      <Input
        id={`${id}-abbreviation`}
        placeholder="e.g. CS101"
        {...form.register("abbreviation")}
      />

      {/* Professor */}
      <Label htmlFor={`${id}-professor`} className="text-sm font-medium">
        Professor
      </Label>
      <Input
        id={`${id}-professor`}
        placeholder="Prof. John Smith"
        {...form.register("professorName")}
        className="col-span-3"
      />

      {/* Format and Recurrence */}
      <Label className="text-sm font-medium">Format</Label>
      <Select
        value={locationType}
        onValueChange={(value) => form.setValue("locationType", value)}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select format" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="classroom">On Campus</SelectItem>
          <SelectItem value="online">Online</SelectItem>
        </SelectContent>
      </Select>
      <Label className="text-sm font-medium">Occurrence</Label>
      <Select
        value={form.watch("recurrence")}
        onValueChange={(value) => form.setValue("recurrence", value)}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select frequency" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="once-a-week">Once a week</SelectItem>
          <SelectItem value="once-every-two-weeks">Every 2 weeks</SelectItem>
          <SelectItem value="once-every-three-weeks">Every 3 weeks</SelectItem>
          <SelectItem value="once-a-month">Once a month</SelectItem>
        </SelectContent>
      </Select>

      {/* Room / Meeting Link */}
      {locationType === "classroom" && (
        <>
          <Label htmlFor={`${id}-room`} className="text-sm font-medium">
            Room
          </Label>
          <Input
            id={`${id}-room`}
            placeholder="e.g. 505"
            {...form.register("room")}
            className="col-span-3"
          />
        </>
      )}
      {locationType === "online" && (
        <>
          <Label htmlFor={`${id}-meetingLink`} className="text-sm font-medium">
            Meeting Link
          </Label>
          <Input
            id={`${id}-meetingLink`}
            placeholder="https://..."
            {...form.register("meetingLink")}
            className="col-span-3"
          />
        </>
      )}

      {/* Time Fields */}
      <Label htmlFor="start-time" className="text-sm font-medium">
        Start Time
      </Label>
      <Input
        id="start-time"
        type="time"
        {...form.register("startTime", { required: true })}
      />
      <Label htmlFor="end-time" className="text-sm font-medium">
        End Time
      </Label>
      <Input
        id="end-time"
        type="time"
        {...form.register("endTime", { required: true })}
      />
      <Label htmlFor="date" className="text-sm font-medium">
        Date
      </Label>
      <Input id="date" type="date" {...form.register("date")} />
      {/* Exam Date */}
      <Label htmlFor={`${id}-examDate`} className="text-sm font-medium">
        Exam Date
      </Label>
      <Input id={`${id}-examDate`} type="date" {...form.register("examDate")} />

      {/* Color Picker */}
      <Label className="text-sm font-medium">Color</Label>
      <div className="col-span-3 flex gap-2">
        {COLORS.map((color) => (
          <button
            key={color.value}
            type="button"
            className={`w-8 h-8 rounded-full border-2 transition-all ${
              form.watch("color") === color.value
                ? "border-gray-900 scale-110"
                : "border-gray-300 hover:scale-105"
            }`}
            style={{ backgroundColor: color.value }}
            onClick={() => form.setValue("color", color.value)}
            title={color.label}
          />
        ))}
      </div>

      {/* Curriculum Upload */}
      <Label
        htmlFor={`${id}-curriculum`}
        className="text-sm font-medium self-start pt-2"
      >
        Curriculum
      </Label>
      <div className="col-span-3 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
        <Input
          id={`${id}-curriculum`}
          type="file"
          accept=".pdf,.doc,.docx"
          className="hidden"
          onChange={(e) =>
            form.setValue("curriculum", e.target.files?.[0] || null)
          }
        />
        <Label
          htmlFor={`${id}-curriculum`}
          className="cursor-pointer inline-block"
        >
          <Button type="button" variant="outline" size="sm">
            Choose File
          </Button>
        </Label>
        <p className="text-sm text-muted-foreground mt-2">PDF, DOC, DOCX</p>
      </div>
    </div>
  );
}
