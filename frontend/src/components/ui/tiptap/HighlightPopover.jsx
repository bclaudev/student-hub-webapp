import { EditorContent, EditorContext, useEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import HighlightPopover from "@/components/ui/tiptap/HighlightPopover";

import "@/components/tiptap-node/paragraph-node/paragraph-node.scss";

export default function MyEditor() {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit, Highlight.configure({ multicolor: true })],
    content: `
        <p style="text-align: left">
            <mark data-color="var(--tt-highlight-purple)" style="background-color: var(--tt-highlight-purple); color: inherit">
                <span class="selection">Highlight text</span>
            </mark>
            <span class="selection"> </span>
            <mark data-color="var(--tt-highlight-red)" style="background-color: var(--tt-highlight-red); color: inherit">
                <span class="selection">in</span>
            </mark>
            <span class="selection"> </span>
            <mark data-color="var(--tt-highlight-green)" style="background-color: var(--tt-highlight-green); color: inherit">
                <span class="selection">different</span>
            </mark>
            <span class="selection"> </span>
            <mark data-color="var(--tt-highlight-blue)" style="background-color: var(--tt-highlight-blue); color: inherit">
                <span class="selection">colors</span>
            </mark>
            <span class="selection"> to draw attention to key points.</span>
        </p>
        `,
  });

  return (
    <EditorContext.Provider value={{ editor }}>
      <div className="tiptap-button-group" data-orientation="horizontal">
        <HighlightPopover />
      </div>

      <EditorContent editor={editor} role="presentation" />
    </EditorContext.Provider>
  );
}
