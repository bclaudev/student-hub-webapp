import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { Button } from "@/components/ui/button";

export function NotebookEditor({ notebookId }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Scrie notițele tale aici...",
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

      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 mb-4">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive("bold") ? "bg-muted text-foreground" : ""}
        >
          Bold
        </Button>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive("italic") ? "bg-muted text-foreground" : ""}
        >
          Italic
        </Button>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive("bulletList") ? "bg-muted text-foreground" : ""}
        >
          Listă
        </Button>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => editor.chain().focus().undo().run()}
        >
          Undo
        </Button>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => editor.chain().focus().redo().run()}
        >
          Redo
        </Button>
      </div>

      {/* Editor content */}
      <EditorContent
        editor={editor}
        className="min-h-[200px] p-4 border rounded-md text-black bg-white"
      />

      <Button className="mt-4" onClick={handleSave}>
        Salvează
      </Button>
    </div>
  );
}
