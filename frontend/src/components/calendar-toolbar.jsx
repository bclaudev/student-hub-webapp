import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Plus } from "lucide-react"

export default function CustomToolbar({ label, onNavigate }) {
  return (
    <div className="flex items-center justify-between px-4 py-2 border-b bg-background text-foreground h-20">
      {/* Left: Title */}
    <div className="flex items-center gap-4">
      <h2 className="text-lg font-semibold">Calendar</h2>
        <Button size="sm" variant="ghost" onClick={() => onNavigate("TODAY")}>
          Today
        </Button>
        <Button size="icon" variant="ghost" onClick={() => onNavigate("PREV")}>
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <Button size="icon" variant="ghost" onClick={() => onNavigate("NEXT")}>
          <ChevronRight className="w-4 h-4" />
        </Button>
      <span className="text-sm font-medium text-muted-foreground">{label}</span>
    </div>

    <Button size="sm" className="ml-auto px-4 text-foreground">
        New event
    </Button>
    </div>
  )
}