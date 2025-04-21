import Paragraph from '@tiptap/extension-paragraph'

export const OnePageLimitParagraph = Paragraph.extend({
  name: 'onePageLimitParagraph',

  addKeyboardShortcuts() {
    return {
      Enter: () => {
        const view = this.editor.view
        const wrapper = view.dom.closest('.tiptap') as HTMLElement

        this.editor
          .chain()
          .focus()
          .splitBlock({ keepMarks: true })
          .run()

        if (wrapper && wrapper.scrollHeight > wrapper.clientHeight) {
          const { state, dispatch } = view
          const { $from } = state.selection
          const boundaryPos = $from.before()
          dispatch(
            state.tr.join(boundaryPos)
          )
        }

        return true
      },
    }
  },
})
