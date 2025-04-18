import { Editor, EditorContent, useEditor } from '@tiptap/react';
import styles from './ResumeEditor.module.css';
import Document from '@tiptap/extension-document';
import History from "@tiptap/extension-history";
import Paragraph from '@tiptap/extension-paragraph';
import Bold from '@tiptap/extension-bold';
import Italic from '@tiptap/extension-italic';
import Underline from '@tiptap/extension-underline';
import Strike from '@tiptap/extension-strike';
import HorizontalRule from '@tiptap/extension-horizontal-rule';
import Text from '@tiptap/extension-text';
import BulletList from '@tiptap/extension-bullet-list';
import ListItem from '@tiptap/extension-list-item';
import Heading from '@tiptap/extension-heading';
import TextStyle from '@tiptap/extension-text-style';
import FontFamily from '@tiptap/extension-font-family';
import Color from '@tiptap/extension-color';
import TextAlign from '@tiptap/extension-text-align';
import HardBreak from '@tiptap/extension-hard-break'
import { MdFormatBold } from "react-icons/md";
import { MdFormatItalic } from "react-icons/md";
import { MdFormatUnderlined } from "react-icons/md";
import FontDropdown, { fontOptions } from "./FontDropdown/FontDropdown";
import { useEffect, useState } from "react";
import FontSizeInput from "./FontSizeInput/FontSizeInput";
import { FontSize } from "./custom-extensions/FontSize";

const iconSize: number = 18;

function ResumeEditor() {
  const editor = useEditor({
    extensions: [
      Document,
      History,
      Paragraph,
      Bold,
      Italic,
      Underline,
      Strike,
      HorizontalRule,
      Text,
      TextStyle,
      FontFamily,
      Color,
      FontSize,
      BulletList,
      ListItem,
      Heading.configure({
        levels: [1, 2, 3],
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      HardBreak,
    ],
    injectCSS: false,
    editorProps: {
      attributes: {
        class: styles.editorContentContainer,
      },
    },
    onSelectionUpdate({ editor, transaction }) {
      const { from, to } = transaction.selection;
      updateActiveFont(editor, from, to);
    }
  }) as Editor;
  if (!editor) return null;

  const [font, setFont] = useState<string | null>('Arial');

  useEffect(() => {
    editor.chain().focus().setFontFamily(font ?? '').run();
  }, [font]);

  function updateActiveFont(editor: Editor, selectionStartPos: number, selectionEndPos: number): void {
    let editorFont: string | null = editor.getAttributes('textStyle').fontFamily ?? null;

    if (selectionStartPos === selectionEndPos) {
      if (editorFont) {
        setFont(editorFont);
      }
      else if (selectionStartPos === 1 && selectionEndPos === 1) {
        setFont(fontOptions[0]);
      }
    }
    else {
      const activeFont = fontOptions.find(f => editor.isActive('textStyle', { fontFamily: f }));
      if (!activeFont) {
        setFont(null);
      }
    }
  }

  const [fontSize, _setFontSize] = useState<number | null>(12);
  function setFontSize(size: number | null): void {
    _setFontSize((previousSize: number | null) => {
      if (size == null) return previousSize;
      return size;
    });
  }

  useEffect(() => {
    editor.chain().focus().setFontSize(fontSize).run();
  }, [fontSize]);

  return (
    <>
      <div className={styles.editorContainer}>
        <div className={styles.toolbar}>
          <FontDropdown
            selectedFont={font}
            setFont={setFont}
          />
          <div className={styles.toolbarSpacer}></div>
          <FontSizeInput
            fontSize={fontSize}
            setFontSize={setFontSize}
          />
          <div className={styles.toolbarSpacer}></div>
          <button className={`${styles.toolbarButton} ${editor.isActive('bold') ? styles.isActive : ''}`}
            onClick={() => editor.chain().focus().toggleBold().run()}
          >
            <MdFormatBold size={iconSize} />
          </button>
          <button className={`${styles.toolbarButton} ${editor.isActive('italic') ? styles.isActive : ''}`}
            onClick={() => editor.chain().focus().toggleItalic().run()}
          >
            <MdFormatItalic size={iconSize} />
          </button>
          <button className={`${styles.toolbarButton} ${editor.isActive('underline') ? styles.isActive : ''}`}
            onClick={() => editor.chain().focus().toggleUnderline().run()}
          >
            <MdFormatUnderlined size={iconSize} />
          </button>
        </div>
        <EditorContent editor={editor} />
      </div>
    </>
  )
}

export default ResumeEditor;