"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useEventForm } from "@/context/event-form-context"
import { useId } from "react"

export default function ClassFields() {
  const { form, watch } = useEventForm()
  const locationType = watch("locationType")
  const id = useId()

  return (
    <div className="grid gap-4">
      <div className="grid gap-2">
        <Label>Location</Label>
        <Select
          value={locationType}
          onValueChange={(value) => form.setValue("locationType", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select location type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="classroom">Classroom</SelectItem>
            <SelectItem value="online">Online</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {locationType === "classroom" && (
        <div className="grid gap-2">
          <Label htmlFor={`${id}-room`}>Room</Label>
          <Input
            id={`${id}-room`}
            placeholder="Room number or name"
            {...form.register("room")}
          />
        </div>
      )}

      {locationType === "online" && (
        <div className="grid gap-2">
          <Label htmlFor={`${id}-meetingLink`}>Meeting Link</Label>
          <Input
            id={`${id}-meetingLink`}
            placeholder="https://..."
            {...form.register("meetingLink")}
          />
        </div>
      )}

      <div className="grid gap-2">
        <Label htmlFor={`${id}-professorName`}>Professor Name</Label>
        <Input
          id={`${id}-professorName`}
          placeholder="Prof. John Smith"
          {...form.register("professorName")}
        />
      </div>
    </div>
  )
}
