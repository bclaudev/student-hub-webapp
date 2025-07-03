// frontend/src/components/notes/notebook-editor.jsx
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { Button } from "@/components/ui/button";
import { NotebookToolbar } from "@/components/ui/notebook-toolbar";

export function NotebookEditor({ notebookId }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Write your notes here...",
      }),
    ],
    content: "",
  });

  const handleSave = async () => {
    if (!editor) return;

    const res = await fetch("/api/notebook-pages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        notebookId,
        title: "Pagina fără titlu",
        content: editor.getJSON(),
      }),
    });

    if (res.ok) {
      console.log("Salvat!");
    } else {
      console.error("Eroare la salvare.");
    }
  };

  if (!editor) return null;

  return (
    <div className="border p-4 rounded-xl bg-white shadow">
      <h2 className="text-xl font-semibold mb-4">Editor Notebook</h2>

      <NotebookToolbar />

      <EditorContent
        editor={editor}
        className="min-h-[200px] p-4 border rounded-md text-black bg-white"
      />

      <Button className="mt-4" onClick={handleSave}>
        Save
      </Button>
    </div>
  );
}
