import { Extension } from '@tiptap/core'
import { Plugin } from 'prosemirror-state'

export const OnePageLimitCharacters = Extension.create({
  name: 'onePageLimitCharacters',
  addProseMirrorPlugins() {
    return [
      new Plugin({
        props: {
          handleDOMEvents: {
            input(view, event) {
              if (!(event instanceof InputEvent) ||
                  !event.inputType.startsWith('insert')) {
                return false
              }

              const wrapper = view.dom.closest('.tiptap') as HTMLElement
              if (!wrapper) return false

              if (wrapper.scrollHeight > wrapper.clientHeight) {
                const { state, dispatch } = view
                const { from } = state.selection
                let added = event.data?.length ?? 1
                dispatch(
                  state.tr.delete(from - added, from)
                )
                return true
              }
              return false
            }
          }
        }
      })
    ]
  }
})
