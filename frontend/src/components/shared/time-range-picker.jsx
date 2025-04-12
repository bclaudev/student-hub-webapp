"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"));
const minutes = Array.from({ length: 60 }, (_, i) =>
  String(i).padStart(2, "0")
);

export default function CustomTimePicker({ label = "Time", value, onChange }) {
  const [hour, setHour] = useState(value?.split(":")[0] || "12");
  const [minute, setMinute] = useState(value?.split(":")[1] || "00");

  const handleChange = (h, m) => {
    const newValue = `${h}:${m}`;
    onChange?.(newValue);
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
      <div className="flex gap-2 w-full">
        <Select
          value={hour}
          onValueChange={(val) => {
            setHour(val);
            handleChange(val, minute);
          }}
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="HH" />
          </SelectTrigger>
          <SelectContent className="max-h-48 overflow-y-auto">
            {hours.map((h) => (
              <SelectItem key={h} value={h}>
                {h}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={minute}
          onValueChange={(val) => {
            setMinute(val);
            handleChange(hour, val);
          }}
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="MM" />
          </SelectTrigger>
          <SelectContent className="max-h-48 overflow-y-auto">
            {minutes.map((m) => (
              <SelectItem key={m} value={m}>
                {m}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
