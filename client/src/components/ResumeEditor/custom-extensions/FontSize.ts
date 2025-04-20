import '@tiptap/extension-text-style'

import { CommandProps, Extension } from '@tiptap/core'

export type FontSizeOptions = {
  /**
   * A list of node names where the font size can be applied.
   * @default ['textStyle']
   * @example ['heading', 'paragraph']
   */
  types: string[],
  defaultSize: number,
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    fontSize: {
      /**
       * Set the font size
       * @param fontSize The font size
       * @example editor.commands.setFontSize(12)
       */
      setFontSize: (fontSize: number | null) => ReturnType,
      /**
       * Unset the font size
       * @example editor.commands.unsetFontSize()
       */
      unsetFontSize: () => ReturnType,
      /**
       * Increments the font size by 1
       * @returns editor.commands.incrementFontSize()
       */
      incrementFontSize: () => ReturnType,
      /**
       * Decrements the font size by 1
       * @returns editor.commands.decrementFontSize()
       */
      decrementFontSize: () => ReturnType,
    }
  }
}

/**
 * This extension allows you to set a font size for text.
 */
export const FontSize = Extension.create<FontSizeOptions>({
  name: 'fontSize',

  addOptions() {
    return {
      types: ['textStyle'],
      defaultSize: 12,
    }
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontSize: {
            default: null,
            parseHTML: element => element.style.fontSize,
            renderHTML: attributes => {
              if (!attributes.fontSize) {
                return {}
              }

              return {
                style: `font-size: ${attributes.fontSize}px`,
              }
            },
          },
        },
      },
    ]
  },

  addCommands() {
    return {
      setFontSize: fontSize => ({ chain }: CommandProps) => {
        if (!fontSize || fontSize < 1) return false;

        return chain()
          .setMark('textStyle', { fontSize })
          .run();
      },
      unsetFontSize: () => ({ chain }: CommandProps) => {
        return chain()
          .setMark('textStyle', { fontSize: null })
          .removeEmptyTextStyle()
          .run();
      },

      incrementFontSize:
        () =>
          ({ state, dispatch }: CommandProps) => {
            if (!dispatch) {
              return false;
            }

            let tr = state.tr;
            const { schema } = state;
            const { from, to } = state.selection;

            state.doc.nodesBetween(from, to, (node, pos) => {
              if (!node.isText) {
                return;
              }

              const nodeStart = pos;
              const nodeEnd = pos + node.nodeSize;
              const start = Math.max(nodeStart, from);
              const end = Math.min(nodeEnd, to);

              if (start >= end) {
                return;
              }

              const tsMark = node.marks.find(
                (m) => m.type === schema.marks.textStyle,
              );
              const curr = (tsMark?.attrs.fontSize as number) ?? this.options.defaultSize;
              const next = Math.min(400, curr + 1);

              tr = tr.removeMark(start, end, schema.marks.textStyle);
              tr = tr.addMark(
                start,
                end,
                schema.marks.textStyle.create({ fontSize: next }),
              );
            });

            if (tr.docChanged) {
              dispatch(tr.scrollIntoView());
              return true;
            }
            return false;
          },

      decrementFontSize:
        () =>
          ({ state, dispatch }: CommandProps) => {
            if (!dispatch) {
              return false;
            }

            let tr = state.tr;
            const { schema } = state;
            const { from, to } = state.selection;

            state.doc.nodesBetween(from, to, (node, pos) => {
              if (!node.isText) {
                return;
              }

              const nodeStart = pos;
              const nodeEnd = pos + node.nodeSize;
              const start = Math.max(nodeStart, from);
              const end = Math.min(nodeEnd, to);

              if (start >= end) {
                return;
              }

              const tsMark = node.marks.find(
                (m) => m.type === schema.marks.textStyle,
              );
              const curr = (tsMark?.attrs.fontSize as number) ?? this.options.defaultSize;
              const next = Math.max(1, curr - 1);

              tr = tr.removeMark(start, end, schema.marks.textStyle);
              tr = tr.addMark(
                start,
                end,
                schema.marks.textStyle.create({ fontSize: next }),
              );
            });

            if (tr.docChanged) {
              dispatch(tr.scrollIntoView());
              return true;
            }
            return false;
          },
    }
  },
})
