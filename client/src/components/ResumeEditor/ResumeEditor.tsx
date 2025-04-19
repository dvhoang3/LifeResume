import 'prosemirror-view/style/prosemirror.css';
import { Editor, EditorContent, useEditor } from '@tiptap/react';
import styles from './ResumeEditor.module.css';
import Document from '@tiptap/extension-document';
import History from "@tiptap/extension-history";
import Paragraph from '@tiptap/extension-paragraph';
import Bold from '@tiptap/extension-bold';
import Italic from '@tiptap/extension-italic';
import Underline from '@tiptap/extension-underline';
import HorizontalRule from '@tiptap/extension-horizontal-rule';
import Text from '@tiptap/extension-text';
import BulletList from '@tiptap/extension-bullet-list';
import ListItem from '@tiptap/extension-list-item';
import TextStyle from '@tiptap/extension-text-style';
import FontFamily from '@tiptap/extension-font-family';
import TextAlign from '@tiptap/extension-text-align';
import HardBreak from '@tiptap/extension-hard-break'
import { MdFormatAlignCenter, MdFormatAlignJustify, MdFormatAlignLeft, MdFormatAlignRight, MdFormatBold, MdFormatListBulleted, MdFormatListNumbered, MdOutlineHorizontalRule } from "react-icons/md";
import { MdFormatItalic } from "react-icons/md";
import { MdFormatUnderlined } from "react-icons/md";
import FontDropdown from "./FontDropdown/FontDropdown";
import { useEffect, useState } from "react";
import FontSizeInput from "./FontSizeInput/FontSizeInput";
import { FontSize } from "./custom-extensions/FontSize";
import { Attrs, Node } from '@tiptap/pm/model';
import { OnBlurHighlight } from './custom-extensions/OnBlurHighlight';
import OrderedList from '@tiptap/extension-ordered-list';
import { BiRedo, BiUndo } from "react-icons/bi";
import ToolbarTooltip from "./ToolbarTooltip/ToolbarTooltip";
import { findClosestTextNode } from "./utilities/prosemirror-utils";

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
      HorizontalRule,
      Text,
      TextStyle,
      FontFamily,
      FontSize,
      BulletList,
      OrderedList,
      ListItem,
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
    onCreate({ editor }) {
      updateActiveTextStyles(editor, editor.state.doc, 1, 1);
    },
    onUpdate({ editor }) {
      console.log(editor.getHTML())
    }
  }) as Editor;
  if (!editor) return null;

  function updateActiveTextStyles(editor: Editor, doc: Node, selectionStartPos: number, selectionEndPos: number): void {
    const nodes: {node: Node, parent: Node}[] = [];
    if (selectionStartPos === selectionEndPos) {
      const { node, parent } = findClosestTextNode(editor.state.doc.resolve(selectionStartPos));
      if (node && parent && node.isText) {
        nodes.push({ node, parent });
      }
    }
    else {
      doc.nodesBetween(selectionStartPos, selectionEndPos, (node, _, parent) => {
        if (node && parent && node.isText) {
          nodes.push({ node, parent });
        }
      });
    }

    const activeStylesProperties: Map<string, any> = new Map<string, any>();
    [...getActiveStylesFromNodes(nodes).entries()].forEach(([key, values]) => {
      const style = values.size === 1 ? [...values][0] : null;
      activeStylesProperties.set(key, style);
    });
    
    if (selectionStartPos === selectionEndPos) {
      setActiveFont(activeStylesProperties.get('fontFamily') ?? 'Arial');
      setActiveFontSize(activeStylesProperties.get('fontSize') ?? 12);
    }
    else {
      setDisplayedFont(activeStylesProperties.get('fontFamily') ?? null);
      setDisplayedFontSize(activeStylesProperties.get('fontSize') ?? null);
    }
  }

  function getActiveStylesFromNodes(nodes: {node: Node, parent: Node}[]): Map<string, Set<any>> {
    const activeStyles: Map<string, Set<any>> = new Map<string, Set<any>>();

    nodes.forEach(({node, parent}) => {
      Object.entries(parent.attrs).forEach(([key, value]) => {
        if (value == null) return;

        if (!activeStyles.has(key)) {
          activeStyles.set(key, new Set<any>());
        }
        activeStyles.get(key)!.add(value);
      });

      node.marks?.forEach(mark => {
        if (mark.type.name !== 'textStyle') return;
        Object.entries(mark.attrs).forEach(([key, value]) => {
          if (value == null) return;

          if (!activeStyles.has(key)) {
            activeStyles.set(key, new Set<any>());
          }
          activeStyles.get(key)!.add(value);
        });
      });
    });

    return activeStyles;
  }

  const [displayedFont, setDisplayedFont] = useState<string | null>(null);
  function setActiveFont(font: string): void {
    editor.chain().focus().setFontFamily(font).run();
    setDisplayedFont(font);
  }

  const [displayedFontSize, setDisplayedFontSize] = useState<number | null>(null);
  function setActiveFontSize(fontSize: number | null): void {
    if (fontSize === null) return;

    const boundedFontSize = Math.min(Math.max(fontSize, 1), 400);
    editor.chain().focus().setFontSize(boundedFontSize).run();
    setDisplayedFontSize(boundedFontSize);
  }
  function handleDecrementFontSizes(): void {
    if (displayedFontSize !== null) {
      const boundedFontSize = Math.min(Math.max(displayedFontSize - 1, 1), 400);
      setDisplayedFontSize(boundedFontSize);
    };

    editor.chain().focus().run();
    editor.commands.decrementFontSize();
  }
  function handleIncrementFontSizes(): void {
    if (displayedFontSize !== null) {
      const boundedFontSize = Math.min(Math.max(displayedFontSize + 1, 1), 400);
      setDisplayedFontSize(boundedFontSize);
    }
    
    editor.chain().focus().run();
    editor.commands.incrementFontSize();
  }


  // const [fontSize, _setFontSize] = useState<number | null>(null);
  // function setFontSize(fontSize: number | null): void {
  //   _setFontSize(fontSize ? Math.min(Math.max(fontSize, 1), 400) : null);
  // }
  // useEffect(() => {
  //   editor.chain().focus().setFontSize(fontSize).run();
  // }, [fontSize]);
  
  
  // const [textAlign, setTextAlign] = useState<'left' | 'center' | 'right' | 'justify'>('left');
  // useEffect(() => {
  //   editor.chain().focus().setTextAlign(textAlign).run();
  // }, [textAlign]);

  // useEffect(() => {
  //   setupActiveToolbarOptions();
  // }, []);
  // function setupActiveToolbarOptions(): void {
  //   setFont('Arial');
  //   setFontSize(12);
  //   setTextAlign('left');
  // }

  // function insertHorizontalLine(): void {
  //   editor.chain().focus()
  //     .setHorizontalRule()
  //     .run();
  // }

  return (
    <>
      <div className={styles.editorContainer}>
        <div className={styles.toolbar}>
          <ToolbarTooltip tooltipText="Undo (Ctrl+Z)">
            <button className={styles.toolbarButton} onClick={() => editor.chain().focus().undo().run()}>
              <BiUndo size={iconSize} />
            </button>
          </ToolbarTooltip>
          <ToolbarTooltip tooltipText="Redo (Ctrl+Y)">
            <button className={styles.toolbarButton} onClick={() => editor.chain().focus().redo().run()}>
              <BiRedo size={iconSize} />
            </button>
          </ToolbarTooltip>
          <div className={styles.toolbarSpacer}></div>
          <FontDropdown
            displayedFont={displayedFont}
            setActiveFont={setActiveFont}
          />
          <div className={styles.toolbarSpacer}></div>
          <FontSizeInput
            displayedFontSize={displayedFontSize}
            setActiveFontSize={setActiveFontSize}
            handleDecrementFontSizes={handleDecrementFontSizes}
            handleIncrementFontSizes={handleIncrementFontSizes}
          />
          <div className={styles.toolbarSpacer}></div>
          {/* <ToolbarTooltip tooltipText="Bold (Ctrl+B)">
            <button className={`${styles.toolbarButton} ${editor.isActive('bold') ? styles.isActive : ''}`}
              onClick={() => editor.chain().focus().toggleBold().run()}
            >
              <MdFormatBold size={iconSize} />
            </button>
          </ToolbarTooltip>
          <ToolbarTooltip tooltipText="Italic (Ctrl+I)">
            <button className={`${styles.toolbarButton} ${editor.isActive('italic') ? styles.isActive : ''}`}
              onClick={() => editor.chain().focus().toggleItalic().run()}
            >
              <MdFormatItalic size={iconSize} />
            </button>
          </ToolbarTooltip>
          <ToolbarTooltip tooltipText="Underline (Ctrl+U)">
            <button className={`${styles.toolbarButton} ${editor.isActive('underline') ? styles.isActive : ''}`}
              onClick={() => editor.chain().focus().toggleUnderline().run()}
            >
              <MdFormatUnderlined size={iconSize} />
            </button>
          </ToolbarTooltip>
          <div className={styles.toolbarSpacer}></div>
          <ToolbarTooltip tooltipText="Left Align (Ctrl+Shift+L)">
            <button className={`${styles.toolbarButton} ${editor.isActive({ textAlign: 'left' }) ? styles.isActive : ''}`}
              onClick={() => setTextAlign('left')}
            >
              <MdFormatAlignLeft size={iconSize} />
            </button>
          </ToolbarTooltip>
          <ToolbarTooltip tooltipText="Center Align (Ctrl+Shift+E)">
            <button className={`${styles.toolbarButton} ${editor.isActive({ textAlign: 'center' }) ? styles.isActive : ''}`}
              onClick={() => setTextAlign('center')}
            >
              <MdFormatAlignCenter size={iconSize} />
            </button>
          </ToolbarTooltip>
          <ToolbarTooltip tooltipText="Right Align (Ctrl+Shift+R)">
            <button className={`${styles.toolbarButton} ${editor.isActive({ textAlign: 'right' }) ? styles.isActive : ''}`}
              onClick={() => setTextAlign('right')}
            >
              <MdFormatAlignRight size={iconSize} />
            </button>
          </ToolbarTooltip>
          <ToolbarTooltip tooltipText="Justify (Ctrl+Shift+J)">
            <button className={`${styles.toolbarButton} ${editor.isActive({ textAlign: 'justify' }) ? styles.isActive : ''}`}
              onClick={() => setTextAlign('justify')}
            >
              <MdFormatAlignJustify size={iconSize} />
            </button>
          </ToolbarTooltip>
          <div className={styles.toolbarSpacer}></div>
          <ToolbarTooltip tooltipText="Bulleted List (Ctrl+Shift+8)">
            <button className={`${styles.toolbarButton} ${editor.isActive('bulletList') ? styles.isActive : ''}`}
              onClick={() => editor.chain().focus().toggleBulletList().run()}
            >
              <MdFormatListBulleted size={iconSize} />
            </button>
          </ToolbarTooltip>
          <ToolbarTooltip tooltipText="Numbered List (Ctrl+Shift+7)">
            <button className={`${styles.toolbarButton} ${editor.isActive('orderedList') ? styles.isActive : ''}`}
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
            >
              <MdFormatListNumbered size={iconSize} />
            </button>
          </ToolbarTooltip>
          <div className={styles.toolbarSpacer}></div>
          <ToolbarTooltip tooltipText="Horizontal Line">
            <button className={styles.toolbarButton}
              onClick={() => insertHorizontalLine()}
            >
              <MdOutlineHorizontalRule size={iconSize} />
            </button>
          </ToolbarTooltip> */}
        </div>
        <div className={styles.editorContentWrapper}>
          <EditorContent editor={editor} />
        </div>
      </div>
    </>
  )
}

export default ResumeEditor;