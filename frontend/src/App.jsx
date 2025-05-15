
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import DashboardLayout from "@/layouts/dashboard-layout"
import LoginPage from "@/pages/login"
import { ThemeProvider } from "./components/ui/theme-provider"
import RegisterPage from "@/pages/register"
import CalendarPage from "@/pages/calendar"
import AdminDashboard from "@/pages/admin"
import { useUser } from "@/hooks/use-user"
import NotesPage from "@/pages/notebooks"

function App() {
  const user = useUser();

  return (
    <BrowserRouter>
    <ThemeProvider defaultTheme="dark" enableSystem={false}>
      <Routes>
        {/* Pagini fără layout */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Pagini cu layout */}
        <Route path="/" element={<DashboardLayout />}>
          <Route path="calendar" element={<CalendarPage />} />
          <Route path="notebooks" element={<NotesPage />} />
          <Route path="admin" element={<AdminDashboard />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
      </ThemeProvider>
    </BrowserRouter>
  )
}

export default App
