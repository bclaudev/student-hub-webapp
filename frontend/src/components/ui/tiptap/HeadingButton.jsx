import HeadingButton from "@/components/ui/tiptap/HeadingButton";
import { EditorContent, EditorContext, useEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";

import "@/components/tiptap-node/paragraph-node/paragraph-node.scss";

export default function MyEditor() {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit],
    content: `
          <h1>Heading 1</h1>
          <h2>Heading 2</h2>
          <h3>Heading 3</h3>
          <h4>Heading 4</h4>
        `,
  });

  return (
    <EditorContext.Provider value={{ editor }}>
      <div className="tiptap-button-group" data-orientation="horizontal">
        <HeadingButton level={1}></HeadingButton>
        <HeadingButton level={2}></HeadingButton>
        <HeadingButton level={3}></HeadingButton>
        <HeadingButton level={4}></HeadingButton>
      </div>

      <EditorContent editor={editor} role="presentation" />
    </EditorContext.Provider>
  );
}
