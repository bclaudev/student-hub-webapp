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
    <div className="flex flex-wrap gap-4">
      <div className="flex-1 min-w-[150px] space-y-2">
        <Label>Start Time *</Label>
        <Input type="time" value={start} onChange={handleStartChange} />
      </div>
      <div className="flex-1 min-w-[150px] space-y-2">
        <Label>End Time *</Label>
        <Input type="time" value={end} onChange={handleEndChange} />
      </div>
    </div>
  )
}
