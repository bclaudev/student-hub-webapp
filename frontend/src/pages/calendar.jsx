import Calendar from "@/components/calendar"
import DashboardLayout from "@/layouts/dashboard-layout"

export default function CalendarPage() {
  return (
    <DashboardLayout>
        <div classname="h-screen w-screen overflow-hidden text-foreground">
            <Calendar />
        </div>
    </DashboardLayout>
  )
}
