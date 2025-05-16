// frontend/src/components/ui/notebook-toolbar.jsx
import { useCurrentEditor } from "@tiptap/react";
import HeadingButton from "@/components/ui/tiptap/HeadingButton";
import MarkButton from "@/components/ui/tiptap/MarkButton";
import ListButton from "@/components/ui/tiptap/ListButton";
import TextAlignButton from "@/components/ui/tiptap/TextAlignButton";
import UndoRedoButton from "@/components/ui/tiptap/UndoRedoButton";

export function NotebookToolbar() {
  const { editor } = useCurrentEditor();

  if (!editor) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 p-2 rounded-md border bg-muted mb-4">
      <HeadingButton level={1} />
      <HeadingButton level={2} />
      <HeadingButton level={3} />
      <HeadingButton level={4} />

      <MarkButton type="bold" />
      <MarkButton type="italic" />
      <MarkButton type="underline" />
      <MarkButton type="strike" />
      <MarkButton type="code" />
      <MarkButton type="superscript" />
      <MarkButton type="subscript" />

      <ListButton type="bulletList" />
      <ListButton type="orderedList" />
      <ListButton type="taskList" />

      <TextAlignButton alignment="left" />
      <TextAlignButton alignment="center" />
      <TextAlignButton alignment="right" />
      <TextAlignButton alignment="justify" />

      <UndoRedoButton />
    </div>
  );
}
