import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "@/layouts/dashboard-layout";
import LoginPage from "@/pages/login";
import { ThemeProvider } from "./components/ui/theme-provider";
import RegisterPage from "@/pages/register";
import CalendarPage from "@/pages/calendar";
import AdminDashboard from "@/pages/admin";
import { useUser } from "@/hooks/use-user";
import NotesPage from "@/pages/notebooks";
import NotebookEditorPage from "@/pages/notebook-editor";
import ResourcesPage from "@/pages/resources";
import PDFViewer from "@/pages/PDFViewer";
import TimetablePage from "@/pages/timetable";
import OnboardingPage from "@/pages/onboarding";
import { Toaster } from "@/components/ui/sonner";
import DocumentViewer from "@/pages/document-viewer";
import NotificationManager from "./components/notification-manager";

function App() {
  //const user = useUser();
  //if (user === null) return null; // sau un loading spinner

  return (
    <BrowserRouter>
      <ThemeProvider defaultTheme="dark" enableSystem={false}>
        <NotificationManager />
        <Toaster
          position="top-right" // any position is fine
          unstyled // ⬅ removes the default palette
          toastOptions={{
            /* shared framing for every toast */
            className: "group flex gap-3 rounded-md border shadow-lg px-4 py-3",

            /* per-variant colours */
            classNames: {
              success: "bg-green-50 border-green-700 text-green-700",
              error: "bg-red-50  border-red-700  text-red-700",
              /* optional typography tweaks */
              title: "font-medium",
              description: "text-sm opacity-90",
            },
          }}
        />
        <Routes>
          {/* Pagini fără layout */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/onboarding" element={<OnboardingPage />} />

          {/* Pagini cu layout */}
          <Route path="/" element={<DashboardLayout />}>
            <Route path="calendar" element={<CalendarPage />} />
            <Route path="notebooks" element={<NotesPage />} />
            <Route path="resources" element={<ResourcesPage />} />
            <Route path="admin" element={<AdminDashboard />} />
            <Route path="notebooks/:id" element={<NotebookEditorPage />} />
            <Route path="/pdf-viewer" element={<PDFViewer />} />
            <Route path="timetable" element={<TimetablePage />} />
            <Route path="/document-viewer" element={<DocumentViewer />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
