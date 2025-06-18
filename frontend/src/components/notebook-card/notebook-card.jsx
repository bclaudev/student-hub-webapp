import { useNavigate } from "react-router-dom";
import NotebookHeader from "./notebook-header";
import NotebookCover from "./notebook-cover";
import NotebookInfo from "./notebook-info";
import { useState } from "react";

export default function NotebookCard({ notebook }) {
  const navigate = useNavigate();
  const [isPinned, setIsPinned] = useState(notebook.isPinned);

  const firstPage = notebook.pages?.[0];
  let thumbnail = "";
  try {
    const parsed = JSON.parse(firstPage?.content || "{}");
    thumbnail = parsed?.content?.[0]?.content?.[0]?.text || "";
  } catch {
    thumbnail = "No preview";
  }

  const handleClick = () => {
    navigate(`/notebooks/${notebook.id}`);
  };

  const handleTogglePin = async (e) => {
    e.stopPropagation();

    const res = await fetch(
      `http://localhost:8787/api/notebooks/${notebook.id}/pin`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      }
    );

    if (res.ok) {
      const data = await res.json();
      setIsPinned(data.isPinned); // ✅ update vizual
    } else {
      console.error("❌ Eroare la toggle pin");
    }
  };

  return (
    <article
      onClick={handleClick}
      className="relative group w-[187px] h-[210px] overflow-hidden flex flex-col items-start px-5 py-6 rounded-3xl bg-card max-w-[187px] cursor-pointer"
    >
      <NotebookHeader
        isPinned={isPinned}
        onTogglePin={handleTogglePin}
        onDelete={() => console.log("delete notebook")}
        onRename={() => console.log("rename notebook")}
      />
      <NotebookCover content={thumbnail} />
      <NotebookInfo title={notebook.title} updatedAt={notebook.updatedAt} />
    </article>
  );
}
