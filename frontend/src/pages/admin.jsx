import { Navigate } from "react-router-dom";
import { useUser } from "@/hooks/use-user";

export default function AdminDashboard() {
  const user = useUser();

  if (!user) return null; // sau un spinner de încărcare
  if (user.role !== "admin") return <Navigate to="/" />;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <p className="text-muted-foreground">Salut, {user.firstName}! Ai acces de administrator.</p>
    </div>
  );
}
