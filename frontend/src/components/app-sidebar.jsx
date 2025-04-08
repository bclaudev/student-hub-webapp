import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarTrigger,
  } from "@/components/ui/sidebar"

  import {
    Avatar,
    AvatarFallback,
    AvatarImage,
  } from "@/components/ui/avatar"

  import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuItem,
  } from "@/components/ui/dropdown-menu"
  
  import { Calendar, Clipboard, Book, Notebook } from "lucide-react"
  
  export function AppSidebar() {
    return (
      <Sidebar collapsible="icon">
        <SidebarContent>
          <SidebarHeader className="px-4 py-2 text-lg font-bold">
            
          </SidebarHeader>
  
          <SidebarGroup>
            {/* <SidebarGroupLabel>Main</SidebarGroupLabel> */}
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <a href="/" className="flex items-center gap-2">
                      <Clipboard className="w-4 h-4" />
                      Timetable
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <a href="/calendar" className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Calendar
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <a href="/resources" className="flex items-center gap-2">
                      <Book className="w-4 h-4" />
                      Resources
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <a href="/notebooks" className="flex items-center gap-2">
                      <Notebook className="w-4 h-4" />
                      Notebooks
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
              <SidebarTrigger />
            </SidebarGroupContent>
          </SidebarGroup>
  
          <SidebarFooter className="px-4 py-2 mt-auto border-t border-border">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                <div className="flex items-center gap-3 cursor-pointer">
                    <Avatar className="h-8 w-8">
                    <AvatarImage src="/claudia.jpg" alt="@claudia" />
                    <AvatarFallback>CL</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                    <span className="font-medium text-foreground">Claudia</span>
                    
                    </div>
                </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="top" align="start" className="w-48">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => alert("Go to profile")}>
                    Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => alert("Go to settings")}>
                    Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => alert("Logging out...")}>
                    Log out
                </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </SidebarFooter>
        </SidebarContent>
      </Sidebar>
    )
  }
  