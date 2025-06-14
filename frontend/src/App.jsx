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

function App() {
  //const user = useUser();
  //if (user === null) return null; // sau un loading spinner

  return (
    <BrowserRouter>
      <ThemeProvider defaultTheme="dark" enableSystem={false}>
        <Toaster />
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
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
