import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const acceptedFileTypes = {
  "image/*": [".jpg", ".jpeg", ".png", ".gif"],
  "application/pdf": [".pdf"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
    ".docx",
  ],
  "text/plain": [".txt"],
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": [
    ".pptx",
  ],
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
    ".xlsx",
  ],
  "application/zip": [".zip"],
};

export function FileUploader({ onUploadSuccess }) {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    setFiles(acceptedFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFileTypes,
  });

  const handleUpload = async () => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file); // <- "files", nu "file"
    });

    try {
      const res = await fetch("http://localhost:8787/api/upload", {
        method: "POST",
        body: formData,
        credentials: "include", // dacă ai login prin cookie
        // NU adăuga manual Content-Type!
      });

      if (!res.ok) throw new Error("Upload failed");
      const result = await res.json();
      onUploadSuccess?.(result);
    } catch (error) {
      console.error("❌ Upload error:", error);
    }
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed p-6 rounded-lg cursor-pointer text-center",
          isDragActive ? "bg-violet-100" : "bg-muted"
        )}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the files here...</p>
        ) : (
          <p>Drag & drop some files here, or click to select</p>
        )}
      </div>

      {files.length > 0 && (
        <ul className="text-sm text-muted-foreground">
          {files.map((file, i) => (
            <li key={i}>{file.name}</li>
          ))}
        </ul>
      )}

      <Button onClick={handleUpload} disabled={uploading || files.length === 0}>
        {uploading ? "Uploading..." : "Upload"}
      </Button>
    </div>
  );
}
