import { useNavigate } from "react-router-dom";
import NotebookHeader from "./notebook-header";
import NotebookCover from "./notebook-cover";
import NotebookInfo from "./notebook-info";
import RenameNotebookModal from "./rename-notebook-modal";
import { useRef } from "react";
import { jsPDF } from "jspdf";

import { useState, useEffect } from "react";

function extractTextFromTipTapJSON(json) {
  let text = "";

  if (json.type === "text" && json.text) {
    text += json.text;
  }

  if (Array.isArray(json.content)) {
    for (const child of json.content) {
      text += extractTextFromTipTapJSON(child) + "\n";
    }
  }

  return text;
}

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
    const doc = new jsPDF();
    const title = notebook.title || "Notebook";
    const updatedAt = new Date(notebook.updatedAt).toLocaleDateString("ro-RO");
    let y = 20;

    doc.setFontSize(16);
    doc.text(title, 10, y);
    y += 10;

    doc.setFontSize(10);
    doc.text(`Last updated: ${updatedAt}`, 10, y);
    y += 10;

    doc.setFontSize(12);
    y += 10;

    notebook.pages.forEach((page, index) => {
      try {
        const parsed = JSON.parse(page.content || "{}");
        const pageText = extractTextFromTipTapJSON(parsed).trim();

        doc.setFontSize(11);

        y += 6;

        const wrapped = doc.splitTextToSize(pageText, 180);
        doc.text(wrapped, 10, y);
        y += wrapped.length * 6;

        if (y > 270) {
          doc.addPage();
          y = 20;
        }
      } catch (e) {
        doc.text(`Page ${index + 1}: (could not read content)`, 10, y);
        y += 10;
      }
    });

    doc.save(`${title}.pdf`);
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
      className="self-start relative group w-[187px] h-[210px] overflow-hidden flex flex-col items-start px-5 py-6 rounded-3xl bg-slate-50 dark:bg-stone-900 max-w-[187px] cursor-pointer"
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
