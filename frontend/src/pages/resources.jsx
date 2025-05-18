import FileCard from "@/components/file-card/file-card";
import bookCover from "@/assets/book-of-secrets.jpg";

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
    <div className="p-6 space-y-6 bg-background min-h-screen">
      <h1 className="text-2xl font-semibold mb-4 text-stone-950 dark:text-white">
        Resources
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-1 gap-y-2 justify-center max-w-screen-xl mx-auto">
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
