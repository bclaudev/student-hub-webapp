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
  useSidebar,
} from "@/components/ui/sidebar";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import studenthub_logo_default from "@/assets/studenthub_logo_default.svg";
import studenthub_logo_dark from "@/assets/studenthub_logo_dark.svg";
import studenthub_logo_collapsed from "@/assets/studenthub_logo_collapsed.svg";
import studenthub_logo_collapsed_dark from "@/assets/studenthub_logo_collapsed_dark.svg";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import {
  Calendar,
  Clipboard,
  Book,
  Notebook,
  ShieldCheck,
  LogOut,
} from "lucide-react";

import { useUser } from "@/hooks/use-user.jsx";

import ThemeToggle from "@/components/ui/theme-toggle";

import { useLocation } from "react-router-dom";

import { useTheme } from "@/components/ui/theme-provider";

import { motion } from "framer-motion";

import SettingsModal from "@/components/settings-modal";

import { useState, useEffect } from "react";

export function AppSidebar() {
  const location = useLocation();
  const { state } = useSidebar();
  const { theme } = useTheme();
  const isCollapsed = state === "collapsed";
  const isDark = theme === "dark";
  const [settingsOpen, setSettingsOpen] = useState(false);

  const logo = isCollapsed
    ? isDark
      ? studenthub_logo_collapsed_dark
      : studenthub_logo_collapsed
    : isDark
    ? studenthub_logo_dark
    : studenthub_logo_default;

  const { user } = useUser();

  useEffect(() => {
    console.log("User context changed:", user);
  }, [user]);
  if (!user) return null;
  const handleLogout = async () => {
    try {
      const res = await fetch("/api/logout", {
        method: "POST",
        credentials: "include",
      });

      if (res.ok) {
        window.location.href = "/login";
      } else {
        console.error("Logout failed:", await res.text());
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <Sidebar collapsible="icon">
      <motion.div
        animate={{ width: isCollapsed ? "3rem" : "16rem" }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        className="relative overflow-visible h-full"
      >
        <SidebarContent className="relative overflow-visible h-full">
          <SidebarHeader className="mt-8 px-4 py-2 text-lg font-bold flex items-center justify-center h-12 transition-all duration-300"></SidebarHeader>
          <div className="pl-5 pr-4 mt-6 mb-8">
            <div className="flex items-center gap-3 cursor-pointer">
              <Avatar className="h-8 w-8">
                <AvatarImage src={"/claudia.jpg"} alt={`@${user?.firstName}`} />
                <AvatarFallback>
                  {(user?.firstName?.[0] ?? "") + (user?.lastName?.[0] ?? "")}
                </AvatarFallback>
              </Avatar>
              {!isCollapsed && (
                <div className="flex flex-col leading-tight">
                  <span className="font-medium text-foreground text-sm">
                    Hello, {user ? `${user.firstName}` : "Hello"}
                  </span>
                  <span
                    onClick={() => setSettingsOpen(true)}
                    className="text-xs text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    Change profile settings
                  </span>
                </div>
              )}
            </div>
          </div>
          <SidebarGroup className="relative">
            {/* <SidebarGroupLabel>Main</SidebarGroupLabel> */}
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    size="lg"
                    className="!h-12 !p-4 group-data-[collapsible=icon]:!h-12 group-data-[collapsible=icon]:!p-2 rounded-3xl pl-4"
                  >
                    <a
                      href="/timetable"
                      className="flex items-center gap-2 group-data-[state=collapsed]:justify-center"
                    >
                      <Clipboard className="w-4 h-4" />
                      <span className="group-data-[state=collapsed]:hidden">
                        Timetable
                      </span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    size="lg"
                    className="!h-12 !p-4 group-data-[collapsible=icon]:!h-12 group-data-[collapsible=icon]:!p-2 rounded-3xl pl-4"
                    isActive={location.pathname === "/calendar"}
                  >
                    <a
                      href="/calendar"
                      className="flex items-center gap-2 group-data-[state=collapsed]:justify-center"
                    >
                      <Calendar className="w-4 h-4" />
                      <span className="group-data-[state=collapsed]:hidden">
                        Calendar
                      </span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    size="lg"
                    className="!h-12 !p-4 group-data-[collapsible=icon]:!h-12 group-data-[collapsible=icon]:!p-2 rounded-3xl pl-4"
                    isActive={location.pathname === "/resources"}
                  >
                    <a
                      href="/resources"
                      className="flex items-center gap-2 group-data-[state=collapsed]:justify-center"
                    >
                      <Book className="w-4 h-4" />
                      <span className="group-data-[state=collapsed]:hidden">
                        Resources
                      </span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    size="lg"
                    className="!h-12 !p-4 group-data-[collapsible=icon]:!h-12 group-data-[collapsible=icon]:!p-2 rounded-3xl pl-4"
                    isActive={location.pathname === "/notebooks"}
                  >
                    <a
                      href="/notebooks"
                      className="flex items-center gap-2 group-data-[state=collapsed]:justify-center"
                    >
                      <Notebook className="w-4 h-4" />
                      <span className="group-data-[state=collapsed]:hidden">
                        Notebooks
                      </span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                {user?.role === "admin" && (
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      size="lg"
                      className="!h-12 !p-4 group-data-[collapsible=icon]:!h-12 group-data-[collapsible=icon]:!p-2 rounded-3xl pl-4"
                      isActive={location.pathname === "/admin"}
                    >
                      <a
                        href="/admin"
                        className="flex items-center gap-2 group-data-[state=collapsed]:justify-center"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        <span className="group-data-[state=collapsed]:hidden">
                          Admin
                        </span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )}
              </SidebarMenu>
              <div className="mt-8">
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      size="lg"
                      className="!h-12 !p-4 group-data-[collapsible=icon]:!h-12 group-data-[collapsible=icon]:!p-2 rounded-3xl pl-4"
                      onClick={handleLogout}
                    >
                      <div className="flex items-center gap-2 group-data-[state=collapsed]:justify-center">
                        <LogOut className="w-4 h-4" />

                        <span className="group-data-[state=collapsed]:hidden">
                          Logout
                        </span>
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarFooter className="mt-auto flex justify-center items-center pb-4">
            <div className="relative h-10 w-32 flex items-center justify-center">
              <motion.img
                key="full"
                src={isDark ? studenthub_logo_dark : studenthub_logo_default}
                alt="Logo"
                initial={{ opacity: 1, scale: 1 }}
                animate={{
                  opacity: isCollapsed ? 0 : 1,
                  scale: isCollapsed ? 0.95 : 1,
                }}
                transition={{ duration: 0.25 }}
                className="absolute h-6 object-contain"
                style={{ left: 0, right: 0, margin: "0 auto" }}
              />
              <motion.img
                key="collapsed"
                src={
                  isDark
                    ? studenthub_logo_collapsed_dark
                    : studenthub_logo_collapsed
                }
                alt="Logo"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{
                  opacity: isCollapsed ? 1 : 0,
                  scale: isCollapsed ? 1 : 0.95,
                }}
                transition={{ duration: 0.25 }}
                className="absolute h-6 w-6 object-contain"
                style={{ left: 0, right: 0, margin: "0 auto" }}
              />
            </div>
          </SidebarFooter>
          <SettingsModal open={settingsOpen} onOpenChange={setSettingsOpen} />
        </SidebarContent>
      </motion.div>
      <SidebarTrigger
        variant="default"
        className="absolute top-[2.75rem] left-[calc(100%-12px)] z-50 bg-primary text-white shadow-md border border-border rounded-full p-1 pointer-events-auto hover:bg-primary hover:text-white cursor-pointer"
      />
    </Sidebar>
  );
}
