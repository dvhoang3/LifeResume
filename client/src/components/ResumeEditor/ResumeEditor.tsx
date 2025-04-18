import 'prosemirror-view/style/prosemirror.css';
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
import { MdFormatAlignCenter, MdFormatAlignJustify, MdFormatAlignLeft, MdFormatAlignRight, MdFormatBold, MdFormatListBulleted, MdFormatListNumbered } from "react-icons/md";
import { MdFormatItalic } from "react-icons/md";
import { MdFormatUnderlined } from "react-icons/md";
import FontDropdown from "./FontDropdown/FontDropdown";
import { useEffect, useState } from "react";
import FontSizeInput from "./FontSizeInput/FontSizeInput";
import { FontSize } from "./custom-extensions/FontSize";
import { Node } from '@tiptap/pm/model';
import { OnBlurHighlight } from './custom-extensions/OnBlurHighlight';
import OrderedList from '@tiptap/extension-ordered-list';

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
      OrderedList,
      ListItem,
      Heading.configure({
        levels: [1, 2, 3],
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        defaultAlignment: 'left',
      }),
      HardBreak,
      OnBlurHighlight,
    ],
    injectCSS: false,
    editorProps: {
      attributes: {
        class: styles.editorContentContainer,
      },
    },
    onSelectionUpdate({ editor, transaction }) {
      const { from, to } = transaction.selection;
      updateActiveTextStyles(editor, editor.state.doc, from, to);
    },
  }) as Editor;
  if (!editor) return null;

  function updateActiveTextStyles(editor: Editor, doc: Node, selectionStartPos: number, selectionEndPos: number): void {
    if (selectionStartPos === selectionEndPos) {
      const attrs = editor.getAttributes('textStyle');
  
      setFont(attrs.fontFamily ?? 'Arial');
      setFontSize(attrs.fontSize  ?? 12);
      return;
    }

    const appliedTextStyles: Map<string, Set<any>> = new Map<string, Set<any>>();

    doc.nodesBetween(selectionStartPos, selectionEndPos, node => {
      node.marks?.forEach(mark => {
        if (mark.type.name !== 'textStyle') return;

        Object.entries(mark.attrs).forEach(([key, value]) => {
          if (value == null) return;

          if (!appliedTextStyles.has(key)) {
            appliedTextStyles.set(key, new Set<any>());
          }
          appliedTextStyles.get(key)!.add(value);
        });
      });
    });
    
    const handlers: Record<string, (value: any) => void> = {
      fontFamily: setFont,
      fontSize: setFontSize,
    };
    appliedTextStyles.forEach((values, key) => {
      const handler = handlers[key];
      if (!handler) return;

      handler(values.size === 1 ? [...values][0] : null);
    });
  }

  const [font, setFont] = useState<string | null>(null);
  useEffect(() => {
    if (font == null) return;
    editor.chain().focus().setFontFamily(font).run();
  }, [font]);

  const [fontSize, setFontSize] = useState<number | null>(null);
  useEffect(() => {
    if (fontSize == null) return;
    editor.chain().focus().setFontSize(fontSize).run();
  }, [fontSize]);

  const [textAlign, setTextAlign] = useState<'left' | 'center' | 'right' | 'justify'>('left');
  useEffect(() => {
    editor.chain().focus().setTextAlign(textAlign).run();
  }, [textAlign]);

  useEffect(() => {
    setupActiveToolbarOptions();
  }, []);
  function setupActiveToolbarOptions(): void {
    setFont('Arial');
    setFontSize(12);
    setTextAlign('left');
  }

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
          <div className={styles.toolbarSpacer}></div>
          <button className={`${styles.toolbarButton} ${editor.isActive({ textAlign: 'left' }) ? styles.isActive : ''}`}
            onClick={() => setTextAlign('left')}
          >
            <MdFormatAlignLeft size={iconSize} />
          </button>
          <button className={`${styles.toolbarButton} ${editor.isActive({ textAlign: 'center' }) ? styles.isActive : ''}`}
            onClick={() => setTextAlign('center')}
          >
            <MdFormatAlignCenter size={iconSize} />
          </button>
          <button className={`${styles.toolbarButton} ${editor.isActive({ textAlign: 'right' }) ? styles.isActive : ''}`}
            onClick={() => setTextAlign('right')}
          >
            <MdFormatAlignRight size={iconSize} />
          </button>
          <button className={`${styles.toolbarButton} ${editor.isActive({ textAlign: 'justify' }) ? styles.isActive : ''}`}
            onClick={() => setTextAlign('justify')}
          >
            <MdFormatAlignJustify size={iconSize} />
          </button>
          <div className={styles.toolbarSpacer}></div>
          <button className={`${styles.toolbarButton} ${editor.isActive('bulletList') ? styles.isActive : ''}`}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          >
            <MdFormatListBulleted size={iconSize} />
          </button>
          <button className={`${styles.toolbarButton} ${editor.isActive('orderedList') ? styles.isActive : ''}`}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
          >
            <MdFormatListNumbered size={iconSize} />
          </button>
        </div>
        <div className={styles.editorContentWrapper}>
          <EditorContent editor={editor} />
        </div>
      </div>
    </>
  )
}

export default ResumeEditor;