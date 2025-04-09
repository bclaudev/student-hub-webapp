"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
      <div>
        <Label>Title *</Label>
        <Input {...form.register("title", { required: true })} />
      </div>

      <div>
        <Label>Description</Label>
        <Input {...form.register("description")} />
      </div>

      <div>
        <Label>Date Range *</Label>
        <DateRangePicker
          value={form.watch("dateRange")}
          onChange={(range) => form.setValue("dateRange", range)}
        />
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <TimeRangePicker
            value={form.watch("startTime")}
            onChange={(val) => form.setValue("startTime", val)}
          />
        </div>
        
      </div>

      <div>
        <Label>Color</Label>
        <Input type="color" {...form.register("color")} />
      </div>

      <div>
        <Label>Notify</Label>
        <Select
          value={form.watch("notify")}
          onValueChange={(val) => form.setValue("notify", val)}
        >
          <SelectTrigger>
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
