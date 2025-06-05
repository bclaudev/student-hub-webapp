import FileHeader from "./file-header";
import FileCover from "./file-cover";
import FileInfo from "./file-info";
import FileFooter from "./file-footer";
import { useNavigate } from "react-router-dom";
import { CreateTagModal } from "./create-tag-modal";
import { useState } from "react";
import Tag from "@/components/ui/tag";

import { motion } from "framer-motion";

import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSub,
  ContextMenuSubTrigger,
  ContextMenuSubContent,
} from "@/components/ui/context-menu";

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

  const predefinedTags = allTags?.map((tag) => tag.label) ?? [];

  const handleClick = () => {
    if (fileType === "application/pdf") {
      navigate(`/pdf-viewer?file=${encodeURIComponent(thumbnailUrl)}`);
    }
  };

  const handleTogglePin = async () => {
    try {
      const res = await fetch(
        `http://localhost:8787/api/resources/${fileId}/pin`,
        {
          method: "PATCH",
          credentials: "include",
        }
      );

      if (!res.ok) {
        const errorText = await res.text();
        console.error("❌ Eroare la pin/unpin:", errorText);
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
      <ContextMenu>
        <ContextMenuTrigger className="w-full h-full">
          <article
            onClick={handleClick}
            className="relative group w-[187px] h-[210px] overflow-hidden flex flex-col items-start px-5 py-6 rounded-3xl bg-slate-50 dark:bg-stone-900 max-w-[187px]"
          >
            <FileHeader isPinned={isPinned} onTogglePin={handleTogglePin} />
            <FileCover thumbnailUrl={thumbnailUrl} fileType={fileType} />
            <FileInfo fileName={fileName} author={author} />
            <FileFooter />

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
        </ContextMenuTrigger>

        <ContextMenuContent>
          <ContextMenuSub>
            <ContextMenuSubTrigger>Tags</ContextMenuSubTrigger>
            <ContextMenuSubContent>
              {predefinedTags.map((tag) => (
                <ContextMenuItem
                  key={tag}
                  onClick={async () => {
                    try {
                      const res = await fetch(
                        "http://localhost:8787/api/tags",
                        {
                          method: "POST",
                          credentials: "include",
                          headers: {
                            "Content-Type": "application/json",
                          },
                          body: JSON.stringify({
                            name: tag,
                            fileId,
                          }),
                        }
                      );

                      if (res.ok) {
                        const data = await res.json();
                        console.log("✅ Tag adăugat:", data);

                        // Opțional: actualizezi contorul local
                        setTags((prev) =>
                          prev.map((t) =>
                            t.label === tag
                              ? { ...t, count: (t.count || 0) + 1 }
                              : t
                          )
                        );
                      } else {
                        const errText = await res.text();
                        console.error("❌ Eroare la adăugare tag:", errText);
                      }
                    } catch (err) {
                      console.error("❌ Eroare fetch:", err);
                    }
                  }}
                >
                  {tag}
                </ContextMenuItem>
              ))}

              <ContextMenuItem onClick={() => setOpenCreateTag(true)}>
                Create new tag
              </ContextMenuItem>
            </ContextMenuSubContent>
          </ContextMenuSub>
        </ContextMenuContent>
      </ContextMenu>

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
    </>
  );
}
