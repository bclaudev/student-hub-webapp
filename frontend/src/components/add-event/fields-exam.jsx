"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useEventForm } from "@/context/event-form-context"
import { cn } from "@/lib/utils"
import { useId } from "react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { DatePickerWithPresets } from "@/components/ui/calendar-date-picker"
import { Textarea } from "@/components/ui/textarea"

export default function ExamFields() {
  const { form, watch } = useEventForm()
  const locationType = watch("locationType")
  const inputId = useId()

  return (
    <>
      <div className="grid gap-3">
        <Label htmlFor={`${inputId}-exam-date`}>Exam Date</Label>
        <CalendarDatePicker
          name="examDate"
          control={form.control}
          defaultDate={new Date()}
        />
      </div>

      <div className="grid gap-3">
        <Label htmlFor={`${inputId}-location-type`}>Location</Label>
        <RadioGroup
          className="flex gap-4"
          defaultValue="classroom"
          onValueChange={(val) => form.setValue("locationType", val)}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="classroom" id="classroom" />
            <Label htmlFor="classroom">Classroom</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="online" id="online" />
            <Label htmlFor="online">Online</Label>
          </div>
        </RadioGroup>
      </div>

      {locationType === "classroom" && (
        <div className="grid gap-3">
          <Label htmlFor={`${inputId}-room`}>Room</Label>
          <Input id={`${inputId}-room`} {...form.register("room")} />
        </div>
      )}

      {locationType === "online" && (
        <div className="grid gap-3">
          <Label htmlFor={`${inputId}-meetingLink`}>Meeting link</Label>
          <Input id={`${inputId}-meetingLink`} {...form.register("meetingLink")} />
        </div>
      )}

      <div className="grid gap-3">
        <Label htmlFor={`${inputId}-materials`}>Allowed Materials</Label>
        <Textarea id={`${inputId}-materials`} {...form.register("materials")} />
      </div>
    </>
  )
}