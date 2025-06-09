// src/pages/document-viewer.jsx
import { useLocation, useSearchParams } from "react-router-dom";
import { useEffect, useRef } from "react";
import PSPDFKit from "@nutrient-sdk/viewer";

export default function DocumentViewer() {
  const location = useLocation();
  const fileUrl = location.state?.fileUrl || searchParams.get("file");

  const [searchParams] = useSearchParams();

  const viewerRef = useRef();

  useEffect(() => {
    if (!fileUrl) {
      console.warn("⚠️ fileUrl este undefined sau null:", fileUrl);
      return;
    }

    if (!viewerRef.current) {
      console.warn("⚠️ viewerRef.current este null");
      return;
    }

    const loadViewer = async () => {
      try {
        console.log("🔍 Începem load viewer cu fileUrl:", fileUrl);
        console.log("📎 fileUrl typeof:", typeof fileUrl);
        console.log("📎 fileUrl:", fileUrl);
        await PSPDFKit.load({
          container: viewerRef.current,
          document: fileUrl,
          baseUrl: `${window.location.origin}/nutrient-viewer/`, // ⭐️ important!
          toolbarItems: PSPDFKit.defaultToolbarItems,
        });

        console.log("✅ Viewer loaded cu succes:", instance);
      } catch (err) {
        console.error("❌ Eroare CATCH în loadViewer:", err);
      }
    };

    // delay 0 ca să ne asigurăm că ref-ul e montat
    const timeout = setTimeout(() => loadViewer(), 0);

    return () => {
      clearTimeout(timeout);
      if (viewerRef.current) {
        PSPDFKit.unload(viewerRef.current).catch(() =>
          console.warn("⚠️ Eroare la unload (ignorat)")
        );
      }
    };
  }, [fileUrl]);

  if (!fileUrl) {
    return (
      <div className="p-6 text-center text-red-500">
        ⚠️ Fișierul nu a fost specificat. Te rugăm să te întorci și să alegi un
        document.
      </div>
    );
  }

  console.log("fileUrl primit:", fileUrl);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div ref={viewerRef} style={{ height: "100vh" }} />
    </div>
  );
}
