import FileHeader from "./file-header";
import FileCover from "./file-cover";
import FileInfo from "./file-info";
import FileFooter from "./file-footer";
import { useNavigate } from "react-router-dom";

import { motion } from "framer-motion";

export default function FileCard({
  fileName,
  author,
  thumbnailUrl,
  tags = [],
  isPinned = false,
  fileType,
  dateAdded,
  subject,
}) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (fileType === "application/pdf") {
      navigate(`/pdf-viewer?file=${encodeURIComponent(thumbnailUrl)}`);
    }
  };

  return (
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
        <p>Subject: {subject}</p>
      </motion.div>
    </article>
  );
}
