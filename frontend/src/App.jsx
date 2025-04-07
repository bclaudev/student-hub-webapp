
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import DashboardLayout from "@/layouts/dashboard-layout"
import LoginPage from "@/pages/login"
import { ThemeProvider } from "./components/ui/theme-provider"
import RegisterPage from "@/pages/register"

function App() {
  return (
    <BrowserRouter>
    <ThemeProvider defaultTheme="dark" enableSystem={false}>
      <Routes>
        {/* Login Page (no layout) */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* All other pages wrapped in DashboardLayout */}
        <Route
          path="/"
          element={
            <DashboardLayout>
              <div>Welcome to Student Hub 🧠</div>
            </DashboardLayout>
          }
        />

        {/* Catch-all fallback to redirect to login */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
      </ThemeProvider>
    </BrowserRouter>
  )
}

export default App
