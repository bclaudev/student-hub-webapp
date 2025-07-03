import { Navigate } from "react-router-dom";
import { useUser } from "@/hooks/use-user.jsx";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Users,
  FileText,
  CalendarDays,
  NotebookPen,
  Clipboard,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import AdminUsersTable from "@/components/admin-components/AdminUsersTable";
import { UserGrowthChart } from "@/components/admin-components/UsersGrowthChart";

export default function AdminDashboard() {
  const { user } = useUser();
  const isAdmin = user?.role === "admin";

  if (user === null) {
    return <div className="p-6 text-muted-foreground">Loading…</div>;
  }

  if (user.role !== "admin") {
    return <Navigate to="/" />;
  }

  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-overview"],
    queryFn: async () => {
      const res = await fetch("/api/admin/overview", {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
    enabled: isAdmin,
  });

  return (
    <div>
      <div className="px-4 py-2 flex items-center justify-between h-20 border-b border-border">
        <h1 className="text-lg font-semibold ">Admin Dashboard</h1>
      </div>
      <div className="p-6 bg-background">
        {/* KPI CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <span className="text-sm font-medium text-foreground">Users</span>
              <Users className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading ? "…" : data?.totalUsers ?? "0"}
              </div>
              <p className="text-xs text-muted-foreground">total</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">
                Resources
              </span>
              <FileText className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading ? "…" : data?.totalResources ?? "0"}
              </div>
              <p className="text-xs text-muted-foreground">uploaded</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">
                Events
              </span>
              <CalendarDays className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading ? "…" : data?.totalEvents ?? "0"}
              </div>
              <p className="text-xs text-muted-foreground">create</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">
                Notebooks
              </span>
              <NotebookPen className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading ? "…" : data?.totalNotebooks ?? "0"}
              </div>
              <p className="text-xs text-muted-foreground">saved</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">
                Classes
              </span>
              <Clipboard className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading ? "…" : data?.totalClasses ?? "0"}
              </div>
              <p className="text-xs text-muted-foreground">planned</p>
            </CardContent>
          </Card>
        </div>

        {/* TABS */}
        <Tabs defaultValue="users" className="w-full">
          <TabsList>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
            <TabsTrigger value="notebooks">Notebooks</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
          </TabsList>
          <TabsContent value="analytics">
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div>
                <iframe
                  width="100%"
                  height="400"
                  frameborder="0"
                  allowfullscreen
                  src="https://eu.posthog.com/embedded/mWwQmcU15LrEENXr3y33Bz2uPEHAZA"
                ></iframe>
              </div>
              <div>
                <iframe
                  width="100%"
                  height="400"
                  frameborder="0"
                  allowfullscreen
                  src="https://eu.posthog.com/embedded/i24qOQnGohTgH3RSXnQ4OC8rrNV9aw"
                ></iframe>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-8">
              <iframe
                width="100%"
                height="400"
                frameborder="0"
                allowfullscreen
                src="https://eu.posthog.com/embedded/fUGFPUsDWSFUV2nTieYMH0j8ev53zQ"
              ></iframe>
              <iframe
                width="100%"
                height="400"
                frameborder="0"
                allowfullscreen
                src="https://eu.posthog.com/embedded/5IY3Lsxbp_LL6o6gGA_agjgDM3gNog"
              ></iframe>
            </div>
          </TabsContent>
          <TabsContent value="users">
            <div className="grid grid-cols-3 gap-4 mb-8 mt-8">
              <iframe
                width="100%"
                height="400"
                frameborder="0"
                allowfullscreen
                src="https://eu.posthog.com/embedded/EOzbJOruk4d6H8KGUbZ2xeGDMCbBkw"
              ></iframe>
              <iframe
                width="100%"
                height="400"
                frameborder="0"
                allowfullscreen
                src="https://eu.posthog.com/embedded/6WVFe_1CDtVQetfO8za34ONCn4aS0g"
              ></iframe>
              <iframe
                width="100%"
                height="400"
                frameborder="0"
                allowfullscreen
                src="https://eu.posthog.com/embedded/mlXwzowa1rzkOIji6IFPZsvESEI-NA"
              ></iframe>
            </div>
            <AdminUsersTable />
          </TabsContent>
          <TabsContent value="resources">
            <div className="grid grid-cols-2 gap-4 mb-8 mt-8">
              <iframe
                width="100%"
                height="400"
                frameborder="0"
                allowfullscreen
                src="https://eu.posthog.com/embedded/0KoqpvOFp65aqQbIVAJFFz7_uUOE8w"
              ></iframe>
              <iframe
                width="100%"
                height="400"
                frameborder="0"
                allowfullscreen
                src="https://eu.posthog.com/embedded/5sm5SsVvtiFsMAxoeOmNXpsqIQXGoA"
              ></iframe>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-8 mt-8">
              <iframe
                width="100%"
                height="400"
                frameborder="0"
                allowfullscreen
                src="https://eu.posthog.com/embedded/JCdCndtMsLnJIO7mpjEnW1KkqE8rrw"
              ></iframe>
              <iframe
                width="100%"
                height="400"
                frameborder="0"
                allowfullscreen
                src="https://eu.posthog.com/embedded/Vcoq8Gj_vcPnw2TYQ3y41gKd_hCJvg"
              ></iframe>
            </div>
          </TabsContent>
          <TabsContent value="notebooks">
            <div className="mt-4">
              <iframe
                width="100%"
                height="400"
                frameborder="0"
                allowfullscreen
                src="https://eu.posthog.com/embedded/MYL_YCLAwVNJxintLRrbYhSn1dWgqw"
              ></iframe>
            </div>
          </TabsContent>
          <TabsContent value="events">
            <div className="mt-4">
              <iframe
                width="100%"
                height="700"
                frameborder="0"
                allowfullscreen
                src="https://eu.posthog.com/embedded/RGpRJXMQ3uXieD45tVa0dJ9rbEkuxQ?legend"
              ></iframe>
              <iframe
                width="100%"
                height="400"
                frameborder="0"
                allowfullscreen
                src="https://eu.posthog.com/embedded/sBeyO3gpwJEPUwgbP_UGakcaBaXlzw"
              ></iframe>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
