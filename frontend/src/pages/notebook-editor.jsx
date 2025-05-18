// frontend/src/components/notes/notebook-editor.jsx
import { useParams, useNavigate } from "react-router-dom";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";

export default function NotebookEditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("Untitled");
  const [saving, setSaving] = useState(false);
  const [initialContent, setInitialContent] = useState(null);
  const [pageId, setPageId] = useState(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: "Begin to write" }),
    ],
    content: initialContent || "",
  });

  useEffect(() => {
    fetch(`/api/notebooks/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.title) setTitle(data.title);
      });

    fetch(`/api/notebook-pages?notebookId=${id}`)
      .then((res) => res.json())
      .then((pages) => {
        if (pages.length > 0) {
          const parsed = JSON.parse(pages[0].content);
          setInitialContent(parsed);
          setPageId(pages[0].id);
          editor?.commands.setContent(parsed);
        }
      });
  }, [id, editor]);

  const handleSave = async () => {
    if (!editor) return;
    setSaving(true);

    await fetch(`/api/notebooks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });

    if (pageId) {
      await fetch(`/api/notebook-pages/${pageId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: editor.getJSON() }),
      });
    } else {
      await fetch(`/api/notebook-pages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          notebookId: id,
          title: "Page 1",
          content: editor.getJSON(),
        }),
      });
    }

    setSaving(false);
    navigate("/notebooks");
  };

  if (!id || !editor) return null;

  return (
    <div className="p-6 space-y-6 w-full max-w-screen-xl mx-auto">
      <SimpleEditor editor={editor} onSave={handleSave} />
    </div>
  );
}
