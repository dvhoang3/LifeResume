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
import { useCallback, useEffect, useState } from "react";
import FontSizeInput from "./FontSizeInput/FontSizeInput";
import { FontSize } from "./custom-extensions/FontSize";
import { Node } from '@tiptap/pm/model';
import { OnBlurHighlight } from './custom-extensions/OnBlurHighlight';
import OrderedList from '@tiptap/extension-ordered-list';
import { BiRedo, BiUndo } from "react-icons/bi";
import ToolbarTooltip from "./ToolbarTooltip/ToolbarTooltip";
import { OnePageLimitCharacters } from "./custom-extensions/OnePageLimitCharacters";
import { OnePageLimitParagraph } from "./custom-extensions/OnePageLimitParagraph";



interface ResumeEditorProps {
  isEditable: boolean,
}

const PAGE_WIDTH_PX = 816;
const PAGE_HEIGHT_PX = 1056;
const PAGE_MARGIN_PX = 72;
const ICON_SIZE: number = 18;

function ResumeEditor({ isEditable }: ResumeEditorProps) {
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
      OnePageLimitCharacters,
      OnePageLimitParagraph,
    ],
    injectCSS: false,
    editorProps: {
      attributes: {
        class: styles.editorContent,
      },
    },
    editable: isEditable,
    onSelectionUpdate({ editor, transaction }) {
      const { from, to } = transaction.selection;
      updateActiveTextStyles(editor.state.doc, from, to);
    },
    onCreate({ editor }) {
      updateActiveTextStyles(editor.state.doc, 1, 1);
    },
    onPaste() {
      console.log('pasting')
    },
  }) as Editor;
  if (!editor) return null;

  function findClosestTextNode(doc: Node, pos: number): { node: Node | null, parent: Node | null } {
    let node: Node | null = null;
    let parent: Node | null = null;
    while (!node && pos >= 0) {
      const nodeAtPos = doc.nodeAt(pos);
      if (nodeAtPos?.isText) {
        node = nodeAtPos;
      }
      pos--;
    }

    if (node != null) {
      parent = editor.state.doc.resolve(pos + 1).parent;
    }

    return { node, parent };
  }

  // TODO: paste and styles are being applied to entire node after inserting with selection active (have to split node)
  const updateActiveTextStyles = useCallback((doc: Node, selectionStartPos: number, selectionEndPos: number): void => {
    const nodes: {node: Node, parent: Node}[] = [];
    if (selectionStartPos === selectionEndPos) {
      const { node, parent } = findClosestTextNode(doc, selectionStartPos - 1);
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
      setDisplayedFontSize(!isNaN(activeStylesProperties.get('fontSize')) ? (activeStylesProperties.get('fontSize') ?? null) : null);
    }
  }, [editor]);

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
  const setActiveFont = useCallback((font: string): void => {
    editor.chain().focus().setFontFamily(font).run();
    setDisplayedFont(font);
  }, [editor]);

  const [displayedFontSize, setDisplayedFontSize] = useState<number | null>(null);
  const setActiveFontSize = useCallback((fontSize: number | null): void => {
    if (fontSize === null || isNaN(fontSize)) return;

    const boundedFontSize = Math.min(Math.max(fontSize, 1), 400);
    editor.chain().focus().setFontSize(boundedFontSize).run();
    setDisplayedFontSize(boundedFontSize);
  }, [editor]);
  const handleDecrementFontSizes = (): void => {
    setDisplayedFontSize((previousFontSize) => {
      if (previousFontSize === null || isNaN(previousFontSize)) return previousFontSize;

      return Math.min(Math.max(previousFontSize - 1, 1), 400);
    });

    editor.chain().focus().decrementFontSize().run();
  }
  const handleIncrementFontSizes = (): void => {
    setDisplayedFontSize((previousFontSize) => {
      if (previousFontSize === null || isNaN(previousFontSize)) return previousFontSize;

      return Math.min(Math.max(previousFontSize + 1, 1), 400);
    });
    
    editor.chain().focus().incrementFontSize().run();
  }
  
  const [textAlign, setTextAlign] = useState<'left' | 'center' | 'right' | 'justify'>('left');
  useEffect(() => {
    editor.chain().focus().setTextAlign(textAlign).run();
  }, [textAlign]);

  const insertHorizontalLine = useCallback((): void => {
    editor.chain().focus()
      .setHorizontalRule()
      .run();
  }, [editor]);

  const handleUndo = useCallback((): void => {
    editor.chain().focus().undo().run();
  }, [editor]);
  const handleRedo = useCallback((): void => {
    editor.chain().focus().redo().run();
  }, [editor]);
  const handleBold = useCallback((): void => {
    editor.chain().focus().toggleBold().run();
  }, [editor]);
  const handleItalic = useCallback((): void => {
    editor.chain().focus().toggleItalic().run();
  }, [editor]);
  const handleUnderline = useCallback((): void => {
    editor.chain().focus().toggleUnderline().run();
  }, [editor]);
  const handleBulletList = useCallback((): void => {
    editor.chain().focus().toggleBulletList().run();
  }, [editor]);
  const handleOrderedList = useCallback((): void => {
    editor.chain().focus().toggleOrderedList().run();
  }, [editor]);

  return (
    <>
      <div className={styles.editorContainer}>
        {isEditable && <div className={styles.toolbar}>
          <ToolbarTooltip tooltipText="Undo (Ctrl+Z)">
            <button className={styles.toolbarButton} onClick={handleUndo}>
              <BiUndo size={ICON_SIZE} />
            </button>
          </ToolbarTooltip>
          <ToolbarTooltip tooltipText="Redo (Ctrl+Y)">
            <button className={styles.toolbarButton} onClick={handleRedo}>
              <BiRedo size={ICON_SIZE} />
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
          <ToolbarTooltip tooltipText="Bold (Ctrl+B)">
            <button className={`${styles.toolbarButton} ${editor.isActive('bold') ? styles.isActive : ''}`}
              onClick={handleBold}
            >
              <MdFormatBold size={ICON_SIZE} />
            </button>
          </ToolbarTooltip>
          <ToolbarTooltip tooltipText="Italic (Ctrl+I)">
            <button className={`${styles.toolbarButton} ${editor.isActive('italic') ? styles.isActive : ''}`}
              onClick={handleItalic}
            >
              <MdFormatItalic size={ICON_SIZE} />
            </button>
          </ToolbarTooltip>
          <ToolbarTooltip tooltipText="Underline (Ctrl+U)">
            <button className={`${styles.toolbarButton} ${editor.isActive('underline') ? styles.isActive : ''}`}
              onClick={handleUnderline}
            >
              <MdFormatUnderlined size={ICON_SIZE} />
            </button>
          </ToolbarTooltip>
          <div className={styles.toolbarSpacer}></div>
          <ToolbarTooltip tooltipText="Left Align (Ctrl+Shift+L)">
            <button className={`${styles.toolbarButton} ${editor.isActive({ textAlign: 'left' }) ? styles.isActive : ''}`}
              onClick={() => setTextAlign('left')}
            >
              <MdFormatAlignLeft size={ICON_SIZE} />
            </button>
          </ToolbarTooltip>
          <ToolbarTooltip tooltipText="Center Align (Ctrl+Shift+E)">
            <button className={`${styles.toolbarButton} ${editor.isActive({ textAlign: 'center' }) ? styles.isActive : ''}`}
              onClick={() => setTextAlign('center')}
            >
              <MdFormatAlignCenter size={ICON_SIZE} />
            </button>
          </ToolbarTooltip>
          <ToolbarTooltip tooltipText="Right Align (Ctrl+Shift+R)">
            <button className={`${styles.toolbarButton} ${editor.isActive({ textAlign: 'right' }) ? styles.isActive : ''}`}
              onClick={() => setTextAlign('right')}
            >
              <MdFormatAlignRight size={ICON_SIZE} />
            </button>
          </ToolbarTooltip>
          <ToolbarTooltip tooltipText="Justify (Ctrl+Shift+J)">
            <button className={`${styles.toolbarButton} ${editor.isActive({ textAlign: 'justify' }) ? styles.isActive : ''}`}
              onClick={() => setTextAlign('justify')}
            >
              <MdFormatAlignJustify size={ICON_SIZE} />
            </button>
          </ToolbarTooltip>
          <div className={styles.toolbarSpacer}></div>
          <ToolbarTooltip tooltipText="Bulleted List (Ctrl+Shift+8)">
            <button className={`${styles.toolbarButton} ${editor.isActive('bulletList') ? styles.isActive : ''}`}
              onClick={handleBulletList}
            >
              <MdFormatListBulleted size={ICON_SIZE} />
            </button>
          </ToolbarTooltip>
          <ToolbarTooltip tooltipText="Numbered List (Ctrl+Shift+7)">
            <button className={`${styles.toolbarButton} ${editor.isActive('orderedList') ? styles.isActive : ''}`}
              onClick={handleOrderedList}
            >
              <MdFormatListNumbered size={ICON_SIZE} />
            </button>
          </ToolbarTooltip>
          <div className={styles.toolbarSpacer}></div>
          <ToolbarTooltip tooltipText="Horizontal Line">
            <button className={styles.toolbarButton}
              onClick={insertHorizontalLine}
            >
              <MdOutlineHorizontalRule size={ICON_SIZE} />
            </button>
          </ToolbarTooltip>
        </div>}
        <div className={styles.editorContentWrapper}>
          <div className={styles.editorContentContainer} style={{width: `${PAGE_WIDTH_PX}px`, minHeight: `${PAGE_HEIGHT_PX}px`, maxHeight: `${PAGE_HEIGHT_PX}px`, padding: `${PAGE_MARGIN_PX}px`}}>
            <EditorContent editor={editor} />
          </div>
        </div>
      </div>
    </>
  )
}

export default ResumeEditor;