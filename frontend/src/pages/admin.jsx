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
    return <div className="p-6 text-muted-foreground">Se încarcă datele…</div>;
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
    <div className="p-6 bg-background">
      <h1 className="text-2xl font-bold mb-4 text-foreground">
        Admin Dashboard
      </h1>
      <p className="text-muted-foreground mb-6">
        Hello, {user.firstName}! You have admin access.
      </p>

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
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="notebooks">Notebooks</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <AdminUsersTable />
          <UserGrowthChart />
          <div className="mt-6 rounded-lg overflow-hidden border">
            <iframe
              width="100%"
              height="400"
              frameborder="0"
              allowfullscreen
              src="https://eu.posthog.com/embedded/fUGFPUsDWSFUV2nTieYMH0j8ev53zQ"
            ></iframe>
            <iframe
              width="25%"
              height="400"
              frameborder="0"
              allowfullscreen
              src="https://eu.posthog.com/embedded/EOzbJOruk4d6H8KGUbZ2xeGDMCbBkw"
            ></iframe>
            <iframe
              width="25%"
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
            <iframe
              width="100%"
              height="400"
              frameborder="0"
              allowfullscreen
              src="https://eu.posthog.com/embedded/MYL_YCLAwVNJxintLRrbYhSn1dWgqw"
            ></iframe>
          </div>
        </TabsContent>
        <TabsContent value="resources">
          <div className="mt-4">🔧 Aici va fi lista de fișiere</div>
        </TabsContent>
        <TabsContent value="notebooks">
          <div className="mt-4">🔧 Aici va fi lista de notebook-uri</div>
        </TabsContent>
        <TabsContent value="events">
          <div className="mt-4">🔧 Aici va fi lista de evenimente</div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
