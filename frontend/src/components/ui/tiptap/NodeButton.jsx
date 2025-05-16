import { EditorContent, EditorContext, useEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import NodeButton from "@/components/ui/tiptap/NodeButton";

import "@/components/tiptap-node/code-block-node/code-block-node.scss";
import "@/components/tiptap-node/paragraph-node/paragraph-node.scss";

export default function MyEditor() {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit],
    content: `
        <blockquote>
            <p>"The best way to predict the future is to invent it."</p><p>— Alan Kay</p>
        </blockquote>
        <pre><code>console.log('Hello, World!');</code></pre>
        `,
  });

  return (
    <EditorContext.Provider value={{ editor }}>
      <div className="tiptap-button-group" data-orientation="horizontal">
        <NodeButton type="blockquote" />
        <NodeButton type="codeBlock" />
      </div>

      <EditorContent editor={editor} role="presentation" />
    </EditorContext.Provider>
  );
}
