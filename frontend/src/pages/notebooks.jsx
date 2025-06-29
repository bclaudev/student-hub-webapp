// pages/notebooks.jsx
import { useNavigate, Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import NotebookCard from "@/components/notebook-card/notebook-card";

export default function NotesPage() {
  const navigate = useNavigate();
  const [notebooks, setNotebooks] = useState([]);

  const updateNotebookTitle = (id, newTitle) => {
    setNotebooks((prev) =>
      prev.map((n) => (n.id === id ? { ...n, title: newTitle } : n))
    );
  };

  const deleteNotebookFromList = (id) => {
    setNotebooks((prev) => prev.filter((n) => n.id !== id));
  };

  useEffect(() => {
    fetch("/api/notebooks", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setNotebooks(data));
  }, []);

  const handleCreateNotebook = async () => {
    const res = await fetch("/api/notebooks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ title: "Untitled" }),
    });

    if (!res.ok) {
      const error = await res.json();
      console.error("❌ Eroare la creare notebook:", error);
      alert("Eroare la creare notebook: " + (error?.error || res.statusText));
      return;
    }

    const data = await res.json();
    console.log("✅ Notebook creat:", data);
    navigate(`/notebooks/${data.id}`);
  };

  return (
    <div className="p-6 space-y-6 bg-background min-h-screen">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-foreground">Your notes</h1>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>Create</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={handleCreateNotebook}>
              Notebook
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div
        className="py-4 grid max-w-screen-xl gap-4 w-full h-[calc(100vh-100px)] overflow-y-auto"
        style={{
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        }}
      >
        {notebooks.map((notebook) => (
          <NotebookCard
            key={notebook.id}
            notebook={notebook}
            onRename={updateNotebookTitle}
            onDelete={deleteNotebookFromList}
          />
        ))}
      </div>
    </div>
  );
}
