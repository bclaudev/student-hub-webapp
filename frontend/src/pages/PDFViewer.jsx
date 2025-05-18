import { useSearchParams } from "react-router-dom";
import { Document, Page, pdfjs } from "react-pdf";
import { useState } from "react";
import "../../public/pdf.worker.min.js";

pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";

export default function PDFViewer() {
  const [params] = useSearchParams();
  const file = params.get("file");
  const [numPages, setNumPages] = useState(null);

  if (!file) return <p className="p-4 text-red-500">No file specified.</p>;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-start p-6">
      <div className="border border-muted rounded-md shadow max-w-4xl w-full">
        <Document
          file={file}
          onLoadSuccess={({ numPages }) => setNumPages(numPages)}
          onLoadError={(e) => console.error("PDF load error:", e)}
        >
          {Array.from(new Array(numPages), (_, index) => (
            <Page
              key={`page_${index + 1}`}
              pageNumber={index + 1}
              width={800}
            />
          ))}
        </Document>
      </div>
    </div>
  );
}
