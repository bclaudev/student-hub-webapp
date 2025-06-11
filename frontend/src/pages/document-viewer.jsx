// frontend/src/pages/document-viewer.jsx
import { useLocation, useSearchParams } from "react-router-dom";
import { useEffect, useRef } from "react";
import PSPDFKit from "@nutrient-sdk/viewer";
import { useTheme } from "@/components/ui/theme-provider";
import { vi } from "date-fns/locale";

export default function DocumentViewer() {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { theme } = useTheme();

  const fileUrl = location.state?.fileUrl || searchParams.get("file");
  const viewerRef = useRef();

  useEffect(() => {
    if (!fileUrl) return;

    const isDark = theme === "dark";

    const loadViewer = async () => {
      if (!viewerRef.current) return;

      // ✅ Descarcă viewerul existent dacă este montat deja
      try {
        PSPDFKit.unload(viewerRef.current);
      } catch (e) {
        console.warn("⚠️ Eroare la unload (ignorată):", e);
      }

      viewerRef.current.innerHTML = "";

      try {
        await PSPDFKit.load({
          container: viewerRef.current,
          document: fileUrl,
          baseUrl: `${window.location.origin}/nutrient-viewer/`,
          toolbarItems: PSPDFKit.defaultToolbarItems,
          theme: isDark ? PSPDFKit.Theme.DARK : PSPDFKit.Theme.LIGHT,
          styleSheets: [
            isDark ? "/my-pspdfkit-dark.css" : "/my-pspdfkit-light.css",
          ],
          licenseKey: import.meta.env.VITE_NUTRIENT_LICENSE_KEY,
        });

        console.log("✅ Viewer reloaded cu tema:", theme);
      } catch (err) {
        console.error("❌ Eroare în loadViewer:", err);
      }
    };

    const timeout = setTimeout(() => loadViewer(), 0);

    return () => {
      clearTimeout(timeout);
      try {
        if (viewerRef.current) PSPDFKit.unload(viewerRef.current);
      } catch (e) {
        console.warn("⚠️ Eroare la unload în cleanup:", e);
      }
    };
  }, [fileUrl, theme]);

  if (!fileUrl) {
    return (
      <div className="p-6 text-center text-red-500">
        ⚠️ Fișierul nu a fost specificat. Te rugăm să te întorci și să alegi un
        document.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div ref={viewerRef} className="w-full h-screen" />
    </div>
  );
}
