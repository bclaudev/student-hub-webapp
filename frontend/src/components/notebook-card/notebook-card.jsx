import { useNavigate } from "react-router-dom";
import NotebookHeader from "./notebook-header";
import NotebookCover from "./notebook-cover";
import NotebookInfo from "./notebook-info";
import RenameNotebookModal from "./rename-notebook-modal";
import { useRef } from "react";

import { useState, useEffect } from "react";

export default function NotebookCard({ notebook }) {
  const cardRef = useRef(null);

  const navigate = useNavigate();
  const [isPinned, setIsPinned] = useState(notebook.isPinned);
  const [isRenameOpen, setIsRenameOpen] = useState(false);
  const [title, setTitle] = useState(notebook.title);

  useEffect(() => {
    setTitle(notebook.title);
  }, [notebook.title]);

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
      setIsPinned(data.isPinned);
    } else {
      console.error("Eroare la toggle pin");
    }
  };

  const handleRename = async (newTitle) => {
    await fetch(`/api/notebooks/${notebook.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTitle }),
    });
    setTitle(newTitle);
    setIsRenameOpen(false);
    onRename?.(notebook.id, newTitle);
  };

  const handleDelete = async () => {
    const confirmed = confirm("Are you sure you want to delete this notebook?");
    if (!confirmed) return;

    await fetch(`/api/notebooks/${notebook.id}`, {
      method: "DELETE",
    });
    onDelete?.(notebook.id);
  };
  const closeModal = () => {
    setIsRenameOpen(false);
    setTimeout(() => {
      cardRef.current?.focus(); // readuce focusul într-un loc valid
    }, 0);
  };

  const handleDownload = () => {
    const content = JSON.stringify(notebook, null, 2);
    const blob = new Blob([content], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `${notebook.title || "notebook"}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <article
      ref={cardRef}
      tabIndex={-1}
      onClick={(e) => {
        // Ignoră clickurile care vin din butoane sau inputuri (inclusiv din modal)
        if (
          e.target.closest("button") ||
          e.target.closest("input") ||
          e.target.closest("[role='dialog']")
        ) {
          return;
        }
        navigate(`/notebooks/${notebook.id}`);
      }}
      className="relative group w-[187px] h-[210px] overflow-hidden flex flex-col items-start px-5 py-6 rounded-3xl bg-slate-50 dark:bg-stone-900 max-w-[187px] cursor-pointer"
    >
      <NotebookHeader
        isPinned={isPinned}
        onTogglePin={handleTogglePin}
        onRename={() => setIsRenameOpen(true)}
        onDelete={handleDelete}
        onDownload={handleDownload}
      />
      <NotebookCover content={thumbnail} />
      <NotebookInfo title={title} updatedAt={notebook.updatedAt} />
      {isRenameOpen && (
        <RenameNotebookModal
          isOpen={true}
          onClose={closeModal}
          onConfirm={handleRename}
          defaultTitle={notebook.title}
        />
      )}
    </article>
  );
}
