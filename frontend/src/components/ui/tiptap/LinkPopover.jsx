import { EditorContent, EditorContext, useEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import Link from "@/components/tiptap-extension/link-extension";
import LinkPopover from "@/components/ui/tiptap/LinkPopover";

import "@/components/tiptap-node/paragraph-node/paragraph-node.scss";

export default function MyEditor() {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit, Link.configure({ openOnClick: false })],
    content: `
        <p>Click the button to open the link popover.</p>
        <p><a href="https://www.tiptap.dev">Tiptap</a></p>
        `,
  });

  return (
    <EditorContext.Provider value={{ editor }}>
      <div className="tiptap-button-group" data-orientation="horizontal">
        <LinkPopover />
      </div>

      <EditorContent editor={editor} role="presentation" />
    </EditorContext.Provider>
  );
}
