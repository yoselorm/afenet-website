"use client";

import Image from "@tiptap/extension-image";
import { EditorContent, useEditor, useEditorState } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useState } from "react";
import { uploadImage } from "./ImageField";

// Word-processor style editor. The HTML is kept in a hidden input (when `name` is given) so it
// submits with the form, and/or reported through onChange.
export default function RichTextEditor({
  name,
  label,
  value = "",
  onChange,
}: {
  name?: string;
  label: string;
  value?: string;
  onChange?: (html: string) => void;
}) {
  const [html, setHtml] = useState(value);

  const editor = useEditor({
    extensions: [StarterKit.configure({ link: { openOnClick: false } }), Image],
    content: value,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      const next = editor.isEmpty ? "" : editor.getHTML();
      setHtml(next);
      onChange?.(next);
    },
  });

  const active = useEditorState({
    editor,
    selector: ({ editor }) =>
      editor
        ? {
            bold: editor.isActive("bold"),
            italic: editor.isActive("italic"),
            h2: editor.isActive("heading", { level: 2 }),
            h3: editor.isActive("heading", { level: 3 }),
            bullet: editor.isActive("bulletList"),
            ordered: editor.isActive("orderedList"),
            quote: editor.isActive("blockquote"),
            link: editor.isActive("link"),
          }
        : null,
  });

  function setLink() {
    if (!editor) return;
    const previous = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Link URL (leave empty to remove the link)", previous ?? "https://");
    if (url === null) return;
    if (url === "") editor.chain().focus().unsetLink().run();
    else editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }

  async function insertImage(input: HTMLInputElement) {
    const file = input.files?.[0];
    if (!editor || !file) return;
    try {
      const src = await uploadImage(file);
      editor.chain().focus().setImage({ src }).run();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Upload failed");
    } finally {
      input.value = "";
    }
  }

  const btn = (isOn: boolean | undefined, title: string, icon: string, onClick: () => void) => (
    <button type="button" title={title} className={`btn btn-sm ${isOn ? "btn-primary" : "btn-light"}`} onClick={onClick}>
      <i className={icon}></i>
    </button>
  );

  return (
    <div className="mb-3">
      <label className="form-label">{label}</label>
      <div className="rich-editor">
        <div className="rich-editor-toolbar">
          {btn(active?.bold, "Bold", "fa-solid fa-bold", () => editor?.chain().focus().toggleBold().run())}
          {btn(active?.italic, "Italic", "fa-solid fa-italic", () => editor?.chain().focus().toggleItalic().run())}
          <span className="divider" />
          {btn(active?.h2, "Heading", "fa-solid fa-heading", () => editor?.chain().focus().toggleHeading({ level: 2 }).run())}
          <button
            type="button"
            title="Sub-heading"
            className={`btn btn-sm ${active?.h3 ? "btn-primary" : "btn-light"}`}
            onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
          >
            H3
          </button>
          <span className="divider" />
          {btn(active?.bullet, "Bullet list", "fa-solid fa-list-ul", () => editor?.chain().focus().toggleBulletList().run())}
          {btn(active?.ordered, "Numbered list", "fa-solid fa-list-ol", () => editor?.chain().focus().toggleOrderedList().run())}
          {btn(active?.quote, "Quote", "fa-solid fa-quote-left", () => editor?.chain().focus().toggleBlockquote().run())}
          <span className="divider" />
          {btn(active?.link, "Link", "fa-solid fa-link", setLink)}
          <label className="btn btn-sm btn-light mb-0" title="Insert image">
            <i className="fa-regular fa-image"></i>
            <input type="file" accept="image/*" hidden onChange={(e) => insertImage(e.currentTarget)} />
          </label>
          <span className="divider" />
          {btn(false, "Undo", "fa-solid fa-rotate-left", () => editor?.chain().focus().undo().run())}
          {btn(false, "Redo", "fa-solid fa-rotate-right", () => editor?.chain().focus().redo().run())}
        </div>
        <EditorContent editor={editor} className="rich-editor-content" />
      </div>
      {name && <input type="hidden" name={name} value={html} />}
    </div>
  );
}
