import { EditorContent, EditorContext, useEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Superscript from "@tiptap/extension-superscript";
import Subscript from "@tiptap/extension-subscript";
import MarkButton from "@/components/ui/tiptap/MarkButton";

import "@/components/tiptap-node/code-block-node/code-block-node.scss";
import "@/components/tiptap-node/paragraph-node/paragraph-node.scss";

export default function MyEditor() {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit, Underline, Superscript, Subscript],
    content: `
        <p>
            <strong>Bold</strong> for emphasis with <code>**</code> or <code>⌘+B</code> or the <code>B</code> button.
        </p>
        <p>
            <em>Italic</em> for subtle nuances with <code>*</code> or <code>⌘+I</code> or the <code>I</code> button.
        </p>
        <p>
            <s>Strikethrough</s> to show revisions with <code>~~</code> or the <code>~~S~~</code> button.
        </p>
        <p>
            <code>Code</code> for code snippets with <code>:</code> or <code>⌘+⇧+C</code> or the <code>C</code> button.
        </p>
        <p>
            <u>Underline</u> for emphasis with <code>⌘+U</code> or the <code>U</code> button.
        </p>
        <p>
            <sup>Superscript</sup> for footnotes with <code>⌘+.</code> or the <code>.</code> button.
        </p>
        <p>
            <sub>Subscript</sub> for chemical formulas with <code>⌘+,</code> or the <code>,</code> button.
        </p>
        `,
  });

  return (
    <EditorContext.Provider value={{ editor }}>
      <div className="tiptap-button-group" data-orientation="horizontal">
        <MarkButton type="bold" />
        <MarkButton type="italic" />
        <MarkButton type="strike" />
        <MarkButton type="code" />
        <MarkButton type="underline" />
        <MarkButton type="superscript" />
        <MarkButton type="subscript" />
      </div>

      <EditorContent editor={editor} role="presentation" />
    </EditorContext.Provider>
  );
}
