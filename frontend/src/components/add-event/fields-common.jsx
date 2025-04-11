"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { DateRangePicker } from "../shared/date-range-picker"
import TimeRangePicker from "@/components/shared/time-range-picker"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { useEventForm } from "@/context/event-form-context"

export default function CommonFields() {
  const { form } = useEventForm()

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
        <Label htmlFor="title" className="sm:w-24 text-sm font-medium">
          Title *
        </Label>
        <Input id="title" className="flex-1 w-full" {...form.register("title", { required: true })} />
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
        <Label htmlFor="description" className="sm:w-24 pt-2 text-sm font-medium">
          Description
        </Label>
        <Textarea id="description" className="flex-1 w-full min-h-[120px]" {...form.register("description")} />
      </div>

      <div className="flex flex-wrap gap-4">
        {/* Date Range */}
        <div className="flex-1 min-w-[200px] space-y-2">
          <Label>Date Range *</Label>
          <DateRangePicker
            value={form.watch("dateRange")}
            onChange={(range) => form.setValue("dateRange", range)}
          />
        </div>

        {/* Time Range */}
        <div className="flex-1 min-w-[300px]">
          <TimeRangePicker
            defaultStart={form.watch("startTime")}
            defaultEnd={form.watch("endTime")}
            onChange={(start, end) => {
              form.setValue("startTime", start)
              form.setValue("endTime", end)
            }}
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
        <Label htmlFor="color" className="sm:w-24 text-sm font-medium">
          Color
        </Label>
        <Input id="color" type="color" className="flex-1 w-full" {...form.register("color")} />
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
        <Label htmlFor="notify" className="sm:w-24 text-sm font-medium">
          Notify
        </Label>
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
  )
}
