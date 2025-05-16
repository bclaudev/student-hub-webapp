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


export default function NotesPage() {
  const navigate = useNavigate();
  const [notebooks, setNotebooks] = useState([]);

  useEffect(() => {
    fetch("/api/notebooks")
      .then((res) => res.json())
      .then((data) => setNotebooks(data));
  }, []);


  const handleCreateNotebook = async () => {
    const res = await fetch("/api/notebooks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "Untitled", userId: 1 }),
    });

    const data = await res.json();
    navigate(`/notebooks/${data.id}`);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Your notes</h1>
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {notebooks.map((notebook) => (
          <Link
            to={`/notebooks/${notebook.id}`}
            key={notebook.id}
            className="p-4 border rounded-lg bg-white shadow hover:bg-gray-100"
          >
            <h2 className="text-lg font-medium">{notebook.title}</h2>
            <p className="text-sm text-muted-foreground">
              {new Date(notebook.createdAt).toLocaleDateString()}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}