import { NotebookEditor } from "@/components/notes/notebook-editor";

export default function NotesPage() {
    const dummyNotebookId = "f2a7bfc2-b58e-4ad6-8f83-c8e17ec18210";

  return (
    <main className="p-6 space-y-10">
      <h1 className="text-xl font-bold text-foreground">Notes Page</h1>
      <NotebookEditor notebookId={dummyNotebookId} />
    </main>
  );
}
