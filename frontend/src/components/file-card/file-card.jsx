import FileHeader from "./file-header";
import FileCover from "./file-cover";
import FileInfo from "./file-info";
import FileFooter from "./file-footer";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";

import Tag from "@/components/ui/tag";
import { CreateTagModal } from "./create-tag-modal";
import { RenameModal } from "./rename-modal";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

/**
 * 🔄 FileCard component without ContextMenu.
 * All tag‑related actions are handled through the dropdown in <FileHeader/>.
 */
export default function FileCard({
  fileId,
  fileName,
  author,
  thumbnailUrl,
  tags = [],
  isPinned = false,
  fileType,
  dateAdded,
  subject,
  allTags = [],
  setTags = () => {},
  setFiles = () => {},
}) {
  const navigate = useNavigate();

  const [openCreateTag, setOpenCreateTag] = useState(false);
  const [openRename, setOpenRename] = useState(false);
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);

  /**
   * Predefined tag labels available to the user.
   */
  const predefinedTags = allTags?.map((t) => t.label) ?? [];

  /**
   * Add an existing tag to the current file (invoked from <FileHeader/>).
   */
  const handleAddTag = async (tag) => {
    try {
      const res = await fetch("http://localhost:8787/api/tags", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: tag, fileId }),
      });

      if (!res.ok) {
        console.error("❌ Eroare la adăugare tag:", await res.text());
        return;
      }

      const data = await res.json();
      console.log("✅ Tag adăugat:", data);

      // local optimistic update
      setTags((prev) =>
        prev.map((t) =>
          t.label === tag ? { ...t, count: (t.count || 0) + 1 } : t
        )
      );
    } catch (err) {
      console.error("❌ Eroare fetch:", err);
    }
  };

  /**
   * Navigate to viewer for supported document types.
   */
  const handleClick = () => {
    const supported = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
      "application/vnd.openxmlformats-officedocument.presentationml.presentation", // .pptx
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
    ];

    if (supported.includes(fileType)) {
      navigate(
        `/document-viewer?file=${encodeURIComponent(
          thumbnailUrl
        )}&id=${fileId}`,
        { state: { fileUrl: thumbnailUrl, fileId } }
      );
    } else {
      alert("⚠️ Tip de fișier momentan nesuportat de viewer.");
    }
  };

  /**
   * Toggle pin/unpin status for current file.
   */
  const handleTogglePin = async () => {
    try {
      const res = await fetch(
        `http://localhost:8787/api/resources/${fileId}/pin`,
        { method: "PATCH", credentials: "include" }
      );

      if (!res.ok) {
        console.error("❌ Eroare la pin/unpin:", await res.text());
        return;
      }

      const data = await res.json();
      setFiles((prev) =>
        prev
          .map((f) => (f.id === fileId ? { ...f, isPinned: data.isPinned } : f))
          .sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0))
      );
    } catch (err) {
      console.error("❌ Eroare fetch:", err);
    }
  };

  return (
    <>
      {/* 💾 File card body */}
      <article
        onClick={handleClick}
        className="relative group w-[187px] h-[210px] overflow-hidden flex flex-col items-start px-5 py-6 rounded-3xl bg-slate-50 dark:bg-stone-900 max-w-[187px]"
      >
        <FileHeader
          isPinned={isPinned}
          onTogglePin={handleTogglePin}
          fileId={fileId}
          onRename={() => setOpenRename(true)}
          onDelete={() => setOpenDeleteConfirm(true)}
          predefinedTags={predefinedTags}
          onAddTag={handleAddTag}
          onOpenCreateTag={() => setOpenCreateTag(true)}
        />

        <FileCover thumbnailUrl={thumbnailUrl} fileType={fileType} />
        <FileInfo fileName={fileName} author={author} />
        <FileFooter />

        {/* Hover overlay with metadata */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileHover={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute bottom-0 left-0 w-full bg-stone-900 text-white dark:bg-white dark:text-stone-900 rounded-3xl px-4 py-4 text-xs z-10"
        >
          <p>Date added: {dateAdded}</p>
          <div className="flex flex-wrap gap-1 mt-2">
            {tags.map((tag) => (
              <Tag key={tag} label={tag} />
            ))}
          </div>
        </motion.div>
      </article>

      {/* 🏷️ Create Tag modal */}
      <CreateTagModal
        open={openCreateTag}
        onOpenChange={setOpenCreateTag}
        fileId={fileId}
        onTagCreated={(tag) => {
          if (!allTags.some((t) => t.label === tag.name)) {
            setTags((prev) => [
              ...prev,
              { label: tag.name, id: tag.id, count: 1 },
            ]);
          }
          setOpenCreateTag(false);
        }}
      />

      {/* ✏️ Rename modal */}
      <RenameModal
        open={openRename}
        onOpenChange={setOpenRename}
        currentName={fileName}
        onRename={async (newName) => {
          try {
            const res = await fetch(
              `http://localhost:8787/api/resources/${fileId}/rename`,
              {
                method: "PATCH",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: newName }),
              }
            );
            if (res.ok) {
              setFiles((prev) =>
                prev.map((f) => (f.id === fileId ? { ...f, name: newName } : f))
              );
            }
          } catch (err) {
            console.error("❌ Eroare redenumire:", err);
          }
        }}
      />

      {/* 🗑️ Delete confirmation */}
      <AlertDialog open={openDeleteConfirm} onOpenChange={setOpenDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete this file?
            </AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={async () => {
                try {
                  const res = await fetch(
                    `http://localhost:8787/api/resources/${fileId}`,
                    { method: "DELETE", credentials: "include" }
                  );
                  if (res.ok) {
                    setFiles((prev) => prev.filter((f) => f.id !== fileId));
                  }
                } catch (err) {
                  console.error("❌ Eroare la ștergere:", err);
                }
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
