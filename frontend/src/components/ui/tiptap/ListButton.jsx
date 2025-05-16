import { EditorContent, EditorContext, useEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import ListButton from "@/components/ui/tiptap/ListButton";

import "@/components/tiptap-node/code-block-node/code-block-node.scss";
import "@/components/tiptap-node/list-node/list-node.scss";
import "@/components/tiptap-node/paragraph-node/paragraph-node.scss";

export default function MyEditor() {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit, TaskList, TaskItem.configure({ nested: true })],
    content: `
        <ul>
            <li>
                <strong>Bold</strong> for emphasis with <code>**</code> or <code>⌘+B</code> or the <code>B</code> button.
            </li>
            <li>
                <em>Italic</em> for subtle nuances with <code>*</code> or <code>⌘+I</code> or the <code>I</code> button.
            </li>
            <li>
                <s>Strikethrough</s> to show revisions with <code>~~</code> or the <code>~~S~~</code> button.
            </li>
        </ul>
        <ul data-type="taskList">
          <li data-type="taskItem" data-checked="true">
            <div>Test template</div>
          </li>
          <li data-type="taskItem" data-checked="false">
            <div>
              <a target="_blank" rel="noopener noreferrer nofollow" href="https://tiptap.dev/pricing">Create account</a>
            </div>
          </li>
          <li data-type="taskItem" data-checked="false">
            <div>Download free template</div>
          </li>
        </ul>
        `,
  });

  return (
    <EditorContext.Provider value={{ editor }}>
      <div className="tiptap-button-group" data-orientation="horizontal">
        <ListButton type="bulletList" />
        <ListButton type="orderedList" />
        <ListButton type="taskList" />
      </div>

      <EditorContent editor={editor} role="presentation" />
    </EditorContext.Provider>
  );
}
