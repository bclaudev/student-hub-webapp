// frontend/src/components/notes/notebook-editor.jsx
import { useParams, useNavigate } from "react-router-dom";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";
import { useTheme } from "@/components/ui/theme-provider";

export default function NotebookEditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("Untitled");
  const [saving, setSaving] = useState(false);
  const [initialContent, setInitialContent] = useState(null);
  const [pageId, setPageId] = useState(null);

  const { theme } = useTheme();

  const editor = useEditor(
    {
      extensions: [
        StarterKit,
        Placeholder.configure({ placeholder: "Begin to write" }),
      ],
      editorProps: {
        attributes: {
          class: `prose focus:outline-none ${
            theme === "dark" ? "prose-invert" : ""
          }`,
        },
      },
      content: initialContent || "",
      autofocus: true,
    },
    [initialContent, theme]
  );

  useEffect(() => {
    fetch(`http://localhost:8787/api/notebooks/${id}`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.title) setTitle(data.title);
      });

    fetch(`http://localhost:8787/api/notebook-pages?notebookId=${id}`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((pages) => {
        if (pages.length > 0) {
          const parsed = JSON.parse(pages[0].content);
          setInitialContent(parsed);
          setPageId(pages[0].id);
        }
      });
  }, [id]);

  const handleSave = async () => {
    if (!editor) return;
    setSaving(true);

    const content = editor.getJSON();
    console.log("🚨 handleSave a fost apelat!");
    console.log("📄 editor content:", content);
    console.log("📦 pageId înainte:", pageId);

    await fetch(`http://localhost:8787/api/notebooks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ title }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("📘 Notebook PATCH response:", data);
      });

    let currentPageId = pageId;

    if (!currentPageId) {
      console.log("🆕 POSTING NEW...");
      const res = await fetch(`http://localhost:8787/api/notebook-pages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          notebookId: id,
          title: "Page 1",
          content,
        }),
      });
      const data = await res.json();
      console.log("✅ POST response:", data);
      currentPageId = data.id;
      setPageId(data.id);
    }

    if (currentPageId) {
      console.log("🛠 PATCHING...");
      const res = await fetch(
        `http://localhost:8787/api/notebook-pages/${currentPageId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ content }),
        }
      );
      const result = await res.json();
      console.log("🛠 PATCH response:", result);
    }

    setSaving(false);
    navigate("/notebooks");
  };

  if (!id || !editor) return null;

  return (
    <div className="p-6 space-y-6 w-full max-w-none bg-background">
      <SimpleEditor
        key={initialContent ? "loaded" : "empty"}
        editor={editor}
        onSave={handleSave}
      />
    </div>
  );
}
