import FileCard from "@/components/file-card/file-card";
import bookCover from "@/assets/book-of-secrets.jpg";
import ResourcesHeader from "@/components/ui/resources-header";
import { useEffect, useState } from "react";

export default function ResourcesPage() {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    const fetchFiles = async () => {
      const res = await fetch("http://localhost:8787/api/resources", {
        credentials: "include",
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Server error:", text);
        return;
      }

      const data = await res.json();
      setFiles(data);
    };

    fetchFiles();
  }, []);
  //   const files = [
  //     {
  //       fileName: "Lecture Notes",
  //       author: "Prof. Smith",
  //       thumbnailUrl: bookCover,
  //       isPinned: false,
  //       fileType: "image/png",
  //       subject: "Philosophy",
  //       dateAdded: "2025-05-18",
  //     },
  //   ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <ResourcesHeader />

      {/* Content grid */}
      <div className="px-4 py-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 max-w-screen-xl mx-auto">
        {files.map((file, index) => (
          <FileCard
            key={index}
            fileName={file.name}
            author="You" // opțional: adaugă și user info mai târziu
            thumbnailUrl={`http://localhost:8787${file.filePath}`}
            isPinned={false} // opțional: vei adăuga pin logic mai încolo
            fileType={file.fileType}
            subject="Unknown" // adaugă în schema ta dacă vrei categorii
            dateAdded={new Date(file.uploadedAt).toLocaleDateString()}
          />
        ))}
      </div>
    </div>
  );
}
