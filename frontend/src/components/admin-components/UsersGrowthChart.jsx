import { useQuery } from "@tanstack/react-query";
import {
  ResponsiveContainer,
  LineChart,
  XAxis,
  YAxis,
  Tooltip,
  Line,
  CartesianGrid,
} from "recharts";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function UserGrowthChart() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-user-growth"],
    queryFn: async () => {
      const res = await fetch("/api/admin/stats/users-per-week", {
        credentials: "include",
      });
      return res.json();
    },
  });

  if (isLoading) return <div>Se încarcă graficul...</div>;

  return (
    <Card>
      <CardHeader>
        <h2 className="text-lg font-semibold">Utilizatori noi / săptămână</h2>
      </CardHeader>
      <CardContent className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="week"
              tickFormatter={(str) =>
                new Date(str).toLocaleDateString("ro-RO", {
                  month: "short",
                  day: "numeric",
                })
              }
            />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="count" stroke="#A585FF" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
