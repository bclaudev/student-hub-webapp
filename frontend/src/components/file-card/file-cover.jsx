//frontend/src/components/file-card/file-cover.jsx
import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";

export default function FileCover({ thumbnailUrl, fileType }) {
  const [loaded, setLoaded] = useState(false);

  if (fileType?.startsWith("image")) {
    return (
      <section className="flex justify-center items-center mt-2 w-full h-[80px]">
        <img
          src={thumbnailUrl}
          alt="File cover"
          className="object-contain w-[55px] h-[80px]"
        />
      </section>
    );
  }

  if (fileType === "application/pdf") {
    console.log(thumbnailUrl);
    return (
      <section className="flex justify-center items-center mt-2 w-full h-[80px]">
        <Document
          file={thumbnailUrl}
          onLoadSuccess={() => setLoaded(true)}
          onLoadError={(e) => console.error("❌ PDF load error:", e)}
        >
          <Page
            pageNumber={1}
            width={55}
            renderAnnotationLayer={false}
            renderTextLayer={false}
          />
        </Document>
        {!loaded && <p className="text-xs text-muted-foreground">Loading...</p>}
      </section>
    );
  }

  return (
    <section className="flex justify-center items-center mt-2 w-full h-[80px]">
      <p className="text-xs text-muted-foreground text-center">
        Preview unavailable
      </p>
    </section>
  );
}
