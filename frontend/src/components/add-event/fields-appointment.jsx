import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useEventForm } from "@/context/event-form-context"

export default function AppointmentFields() {
  const { form } = useEventForm()

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
      <Label htmlFor="location" className="sm:w-24 text-sm font-medium">
        Location
      </Label>
      <Input
        id="location"
        className="flex-1 w-full"
        {...form.register("location")}
        placeholder="e.g. Doctor's Office, Room 301"
      />
    </div>
  )
}
