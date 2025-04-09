import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useEventForm } from "@/context/event-form-context"

export default function AppointmentFields() {

    const { form } = useEventForm()

    return (
    <div className="grid gap-4">
        <div className="grid gap-1">
        <Label htmlFor="location">Location</Label>
        <Input
            id="location"
            {...form.register("location")}
            placeholder="e.g. Doctor's Office, Room 301"
        />
        </div>
    </div>
  )
}
