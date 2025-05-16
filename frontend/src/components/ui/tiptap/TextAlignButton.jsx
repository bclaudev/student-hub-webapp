import { EditorContent, EditorContext, useEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import TextAlignButton from "@/components/ui/tiptap/TextAlignButton";

import "@/components/tiptap-node/paragraph-node/paragraph-node.scss";

export default function MyEditor() {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: `
        <p>Try selecting a paragraph and clicking one of the text alignment buttons.</p>
        <p style="text-align: left">Left-aligned text.</p>
        <p style="text-align: center">Center-aligned text.</p>
        <p style="text-align: right">Right-aligned text.</p>
        <p style="text-align: justify">Justified text.</p>
        `,
  });

  return (
    <EditorContext.Provider value={{ editor }}>
      <div className="tiptap-button-group" data-orientation="horizontal">
        <TextAlignButton align="left" />
        <TextAlignButton align="center" />
        <TextAlignButton align="right" />
        <TextAlignButton align="justify" />
      </div>

      <EditorContent editor={editor} role="presentation" />
    </EditorContext.Provider>
  );
}
