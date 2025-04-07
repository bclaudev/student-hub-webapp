import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"

export default function DashboardLayout({ children }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <AppSidebar />
        <div className="flex-1">
          {/* TOP BAR */}
          <div className="p-4 border-b bg-background flex items-center gap-4">
            <SidebarTrigger />
          </div>

          {/* MAIN CONTENT */}
          <main className="p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
