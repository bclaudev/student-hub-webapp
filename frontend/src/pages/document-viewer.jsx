// frontend/src/pages/document-viewer.jsx
import { useLocation, useSearchParams } from "react-router-dom";
import { useEffect, useRef } from "react";
import PSPDFKit from "@nutrient-sdk/viewer";
import { useTheme } from "@/components/ui/theme-provider";

export default function DocumentViewer() {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { theme } = useTheme();

  const fileUrl = location.state?.fileUrl || searchParams.get("file");
  const fileId = location.state?.fileId;
  const viewerRef = useRef();

  const saveAnnotations = async (instance, fileId) => {
    const instantJson = await instance.exportInstantJSON();
    console.log("📤 Salvare adnotări:", { fileId, instantJson });

    const res = await fetch("http://localhost:8787/api/annotations", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fileId,
        annotations: instantJson,
      }),
    });

    if (!res.ok) {
      console.error("❌ Eroare la salvarea adnotărilor:", await res.text());
    } else {
      console.log("✅ Adnotările au fost salvate cu succes");
    }
  };

  useEffect(() => {
    if (!fileUrl) return;

    const isDark = theme === "dark";

    const loadViewer = async () => {
      if (!viewerRef.current) return;

      try {
        await PSPDFKit.unload(viewerRef.current);
        console.log("ℹ️ PSPDFKit a fost dezinstalat cu succes");
      } catch (e) {
        console.warn("⚠️ Eroare la unload:", e);
      }

      viewerRef.current.innerHTML = "";
      const res = await fetch(`/api/annotations/${fileId}`);

      const instantJson = await res.json();

      try {
        const instance = await PSPDFKit.load({
          container: viewerRef.current,
          document: fileUrl,
          baseUrl: `${window.location.origin}/nutrient-viewer/`,
          toolbarItems: PSPDFKit.defaultToolbarItems,
          theme: isDark ? PSPDFKit.Theme.DARK : PSPDFKit.Theme.LIGHT,
          styleSheets: [
            isDark ? "/my-pspdfkit-dark.css" : "/my-pspdfkit-light.css",
          ],
          licenseKey: import.meta.env.VITE_NUTRIENT_LICENSE_KEY,
          instantJSON: instantJson || undefined,
        });

        let saveTimeout;
        const autoSave = async () => {
          clearTimeout(saveTimeout);
          saveTimeout = setTimeout(async () => {
            if (!fileId)
              return console.warn("⚠️ fileId lipsă, autosave anulat");
            await saveAnnotations(instance, fileId);
          }, 300);
        };

        instance.addEventListener("annotations.change", autoSave);
        instance.addEventListener("comments.change", autoSave);
      } catch (err) {
        console.error("❌ Eroare în loadViewer:", err);
      }
    };

    loadViewer();

    return () => {
      try {
        if (viewerRef.current) {
          PSPDFKit.unload(viewerRef.current);
          console.log("🔁 Viewer curățat la unmount");
        }
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
