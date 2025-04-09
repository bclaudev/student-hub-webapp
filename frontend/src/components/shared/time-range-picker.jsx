// src/components/shared/time-range-picker.jsx
"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

export default function TimeRangePicker({ defaultStart, defaultEnd, onChange }) {
  const [start, setStart] = useState(defaultStart || "")
  const [end, setEnd] = useState(defaultEnd || "")

  const handleStartChange = (e) => {
    const val = e.target.value
    setStart(val)
    onChange?.(val, end)
  }

  const handleEndChange = (e) => {
    const val = e.target.value
    setEnd(val)
    onChange?.(start, val)
  }

  return (
    <div className="grid gap-2">
      <Label>Start Time</Label>
      <Input
        type="time"
        value={start}
        onChange={handleStartChange}
      />
      <Label>End Time</Label>
      <Input
        type="time"
        value={end}
        onChange={handleEndChange}
      />
    </div>
  )
}
