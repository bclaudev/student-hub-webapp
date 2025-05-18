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
} from "@/components/ui/sidebar";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import { Calendar, Clipboard, Book, Notebook, ShieldCheck } from "lucide-react";

import { useUser } from "@/hooks/use-user";

import ThemeToggle from "@/components/ui/theme-toggle";

export function AppSidebar() {
  const user = useUser();
  console.log("USER INFO:", user);
  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarHeader className="px-4 py-2 text-lg font-bold"></SidebarHeader>

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
              {user?.role === "admin" && (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <a href="/admin" className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4" />
                      Admin
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
            <SidebarTrigger />
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarFooter className="px-4 py-2 mt-auto border-t border-border">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center gap-3 cursor-pointer">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={"/claudia.jpg"} // or dynamic if you add avatars later
                    alt={`@${user?.firstName}`}
                  />
                  <AvatarFallback>
                    {(user?.firstName?.[0] ?? "") + (user?.lastName?.[0] ?? "")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="font-medium text-foreground">
                    {user ? `${user.firstName}` : "..."}
                  </span>
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
              <ThemeToggle />
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => alert("Logging out...")}>
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarFooter>
      </SidebarContent>
    </Sidebar>
  );
}
