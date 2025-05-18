import FileCard from "@/components/file-card/file-card";
import bookCover from "@/assets/book-of-secrets.jpg";
import ResourcesHeader from "@/components/ui/resources-header";

export default function ResourcesPage() {
  const files = [
    {
      fileName: "Lecture Notes",
      author: "Prof. Smith",
      thumbnailUrl: bookCover,
      isPinned: false,
      fileType: "image/png",
      subject: "Philosophy",
      dateAdded: "2025-05-18",
    },
    {
      fileName: "Lecture Notes",
      author: "Prof. Smith",
      thumbnailUrl: bookCover,
      isPinned: false,
      fileType: "image/png",
      subject: "Philosophy",
      dateAdded: "2025-05-18",
    },
    {
      fileName: "Lecture Notes",
      author: "Prof. Smith",
      thumbnailUrl: bookCover,
      isPinned: false,
      fileType: "image/png",
      subject: "Philosophy",
      dateAdded: "2025-05-18",
    },
    {
      fileName: "Lecture Notes",
      author: "Prof. Smith",
      thumbnailUrl: bookCover,
      isPinned: false,
      fileType: "image/png",
      subject: "Philosophy",
      dateAdded: "2025-05-18",
    },
    {
      fileName: "Lecture Notes",
      author: "Prof. Smith",
      thumbnailUrl: bookCover,
      isPinned: false,
      fileType: "image/png",
      subject: "Philosophy",
      dateAdded: "2025-05-18",
    },
    {
      fileName: "Lecture Notes",
      author: "Prof. Smith",
      thumbnailUrl: bookCover,
      isPinned: false,
      fileType: "image/png",
      subject: "Philosophy",
      dateAdded: "2025-05-18",
    },
    {
      fileName: "Lecture Notes",
      author: "Prof. Smith",
      thumbnailUrl: bookCover,
      isPinned: false,
      fileType: "image/png",
      subject: "Philosophy",
      dateAdded: "2025-05-18",
    },
    {
      fileName: "Lecture Notes",
      author: "Prof. Smith",
      thumbnailUrl: bookCover,
      isPinned: false,
      fileType: "image/png",
      subject: "Philosophy",
      dateAdded: "2025-05-18",
    },
    {
      fileName: "Lecture Notes",
      author: "Prof. Smith",
      thumbnailUrl: bookCover,
      isPinned: false,
      fileType: "image/png",
      subject: "Philosophy",
      dateAdded: "2025-05-18",
    },
    {
      fileName: "Lecture Notes",
      author: "Prof. Smith",
      thumbnailUrl: bookCover,
      isPinned: false,
      fileType: "image/png",
      subject: "Philosophy",
      dateAdded: "2025-05-18",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <ResourcesHeader />

      {/* Content grid */}
      <div className="px-4 py-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 max-w-screen-xl mx-auto">
        {files.map((file, index) => (
          <FileCard
            key={index}
            fileName={file.fileName}
            author={file.author}
            thumbnailUrl={file.thumbnailUrl}
            isPinned={file.isPinned}
            fileType={file.fileType}
            subject={file.subject}
            dateAdded={file.dateAdded}
          />
        ))}
      </div>
    </div>
  );
}
