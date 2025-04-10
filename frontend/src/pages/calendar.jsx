import Calendar from "@/components/calendar"
import DashboardLayout from "@/layouts/dashboard-layout"

export default function CalendarPage() {
  return (
    <DashboardLayout>
        <div className="h-screen w-full overflow-hidden text-foreground">
            <Calendar />
        </div>
    </DashboardLayout>
  )
}
