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
}) {
  const navigate = useNavigate();

  const [openCreateTag, setOpenCreateTag] = useState(false);

  const predefinedTags = allTags?.map((tag) => tag.label) ?? [];

  const handleClick = () => {
    if (fileType === "application/pdf") {
      navigate(`/pdf-viewer?file=${encodeURIComponent(thumbnailUrl)}`);
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
            <FileHeader isPinned={isPinned} />
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
                  onClick={() => console.log("Tag:", tag)}
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
