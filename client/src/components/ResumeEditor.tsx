import { Editor, EditorContent, useEditor } from '@tiptap/react';
import './ResumeEditor.css';
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
import { MdFormatBold } from "react-icons/md";
import { MdFormatItalic } from "react-icons/md";
import { MdFormatUnderlined } from "react-icons/md";

const content: string = '<p>Hello World!</p>';

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
      BulletList,
      ListItem,
      Heading.configure({
        levels: [1, 2, 3],
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    injectCSS: false,
    editorProps: {
      attributes: {
        class: 'editor-content-wrapper',
      },
    },
  }) as Editor;

  return (
    <>
      <div className="editor">
        <div className="toolbar">
            <button className="toolbar-button"><MdFormatBold /></button>
            <button className="toolbar-button"><MdFormatItalic /></button>
            <button className="toolbar-button"><MdFormatUnderlined /></button>
        </div>
        <EditorContent editor={editor} />
      </div>
    </>
  )
}

export default ResumeEditor;