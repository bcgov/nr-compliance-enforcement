import { Button, ButtonGroup, ToggleButton } from "react-bootstrap";
import { useEditor, useEditorState } from "@tiptap/react";
import "@assets/sass/investigation-continuation.scss";

interface MenuBarProps {
  editor: ReturnType<typeof useEditor>;
}

export function MenuBarEditor({ editor }: Readonly<MenuBarProps>) {
  if (!editor) return null;

  const editorState = useEditorState({
    editor,
    selector: (ctx) => {
      return {
        isBold: ctx.editor.isActive("bold") ?? false,
        isItalic: ctx.editor.isActive("italic") ?? false,
        isStrike: ctx.editor.isActive("strike") ?? false,
        isUnderline: ctx.editor.isActive("underline") ?? false,
        isCode: ctx.editor.isActive("code") ?? false,
        isHeading1: ctx.editor.isActive("heading", { level: 1 }) ?? false,
        isHeading2: ctx.editor.isActive("heading", { level: 2 }) ?? false,
        isBulletList: ctx.editor.isActive("bulletList") ?? false,
        isOrderedList: ctx.editor.isActive("orderedList") ?? false,
      };
    },
  });

  return (
    <ButtonGroup
      className="mb-3 flex-wrap"
      size="sm"
    >
      {/* Bold */}
      <ToggleButton
        className="menu-editor-button"
        type="checkbox"
        variant="none"
        checked={editorState.isBold}
        onClick={() => editor.chain().focus().toggleBold().run()}
        title="Bold"
        id={""}
        value={""}
      >
        <i className={`bi bi-type-bold ${editorState.isBold ? "menu-icon-active" : "menu-icon"}`}></i>
      </ToggleButton>

      {/* Italic */}
      <ToggleButton
        className="menu-editor-button"
        type="checkbox"
        variant="none"
        checked={editor.isActive("italic")}
        onClick={() => editor.chain().focus().toggleItalic().run()}
        title="Italic"
        id=""
        value={""}
      >
        <i className={`bi bi-type-italic ${editorState.isItalic ? "menu-icon-active" : "menu-icon"}`}></i>
      </ToggleButton>

      {/* Underline */}
      <ToggleButton
        className="menu-editor-button"
        type="checkbox"
        variant="none"
        checked={editor.isActive("underline")}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        title="Underline"
        id=""
        value={""}
      >
        <i className={`bi bi-type-underline ${editorState.isUnderline ? "menu-icon-active" : "menu-icon"}`}></i>
      </ToggleButton>

      <ToggleButton
        className="menu-editor-button"
        type="checkbox"
        variant="none"
        checked={editor.isActive("strike")}
        onClick={() => editor.chain().focus().toggleStrike().run()}
        title="Strikethrough"
        id=""
        value={""}
      >
        <i className={`bi bi-type-strikethrough ${editorState.isStrike ? "menu-icon-active" : "menu-icon"}`}></i>
      </ToggleButton>

      <div className="border-end mx-1" />

      {/* Heading 1 */}
      <ToggleButton
        className="menu-editor-button mx-1"
        type="checkbox"
        variant="none"
        checked={editor.isActive("heading", { level: 1 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        title="Heading 1"
        id=""
        value=""
      >
        <i className={`bi bi-type-h1 ${editorState.isHeading1 ? "menu-icon-active" : "menu-icon"}`}></i>
      </ToggleButton>

      {/* Heading 2 */}
      <ToggleButton
        type="checkbox"
        className="menu-editor-button"
        variant="none"
        checked={editor.isActive("heading", { level: 2 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        title="Heading 2"
        id=""
        value={""}
      >
        <i className={`bi bi-type-h2 ${editorState.isHeading2 ? "menu-icon-active" : "menu-icon"}`}></i>
      </ToggleButton>

      <div className="border-end" />

      {/* Bullet List */}
      <ToggleButton
        className="menu-editor-button"
        type="checkbox"
        variant="none"
        checked={editor.isActive("bulletList")}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        title="Bullet List"
        id=""
        value={""}
      >
        <i className={`bi bi-list-ul mx-2 ${editorState.isBulletList ? "menu-icon-active" : "menu-icon"}`}></i>
      </ToggleButton>

      {/* Ordered List */}
      <ToggleButton
        type="checkbox"
        variant="none"
        checked={editor.isActive("orderedList")}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        title="Numbered List"
        className="menu-editor-button"
        id=""
        value={""}
      >
        <i className={`bi bi-list-ol ${editorState.isOrderedList ? "menu-icon-active" : "menu-icon"}`}></i>
      </ToggleButton>

      <div className="border-end mx-1" />

      {/* Clear Format */}
      <Button
        className="menu-editor-button"
        variant="none"
        onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
        title="Clear Formatting"
        id=""
        value={""}
      >
        <i className={`bi bi-eraser mx-2 menu-icon`}></i>
      </Button>
    </ButtonGroup>
  );
}
