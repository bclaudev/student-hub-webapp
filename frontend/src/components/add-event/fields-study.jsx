"use client"

import { useId } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { FormSection } from "./form-section"
import { DateRangePicker } from "../shared/date-range-picker"
import TimeRangePicker from "../shared/time-range-picker"
import { useEventForm } from "@/context/event-form-context"

export default function StudyFields() {
  const { form, watch } = useEventForm()
  const inputId = useId()

  return (
    <div className="space-y-6">
      

      

      <FormSection title="Location">
        <Input
          id={`${inputId}-location`}
          placeholder="Library, Zoom, etc."
          {...form.register("location")}
        />
      </FormSection>

      <FormSection title="Details">
        <div className="grid gap-4">
          <Label htmlFor={`${inputId}-topics`}>
            Topics / Chapters
            <Select onValueChange={(val) => form.setValue("topics", val)} defaultValue={watch("topics")}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a topic" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="chapter-1">Chapter 1</SelectItem>
                <SelectItem value="chapter-2">Chapter 2</SelectItem>
                <SelectItem value="revision">Final Revision</SelectItem>
              </SelectContent>
            </Select>
          </Label>

          <Label htmlFor={`${inputId}-linkedClass`}>
            Linked Class
            <Select onValueChange={(val) => form.setValue("linkedClass", val)} defaultValue={watch("linkedClass")}>
              <SelectTrigger>
                <SelectValue placeholder="Select class" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="math101">Math 101</SelectItem>
                <SelectItem value="cs205">CS 205</SelectItem>
              </SelectContent>
            </Select>
          </Label>
        </div>
      </FormSection>
    </div>
  )
}
