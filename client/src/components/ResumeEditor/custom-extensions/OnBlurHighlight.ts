import { Extension } from '@tiptap/core'
import { Plugin, PluginKey } from '@tiptap/pm/state'

const key = new PluginKey('onBlurHighlight')

export const OnBlurHighlight = Extension.create({
  name: 'onBlurHighlight',
  addProseMirrorPlugins() {
    return [
      new Plugin({
        key,
        state: {
          init: () => ({ overlays: [] as HTMLElement[] }),
          apply(tr, prev) {
            const meta = tr.getMeta(key)
            if (meta && 'overlays' in meta) return { overlays: meta.overlays as HTMLElement[] }
            if (tr.docChanged && prev.overlays.length) {
              prev.overlays.forEach(n => n.remove())
              return { overlays: [] }
            }
            return prev
          },
        },
        props: {
          handleDOMEvents: {
            blur: view => {
              const sel = view.dom.ownerDocument.getSelection()
              if (!sel?.rangeCount) return false
              const rects = Array.from(sel.getRangeAt(0).getClientRects())
              if (!rects.length) return false

              const root = view.dom.parentElement!
              if (getComputedStyle(root).position === 'static') root.style.position = 'relative'
              const rootBox = root.getBoundingClientRect()

              type Line = { top: number; bottom: number; left: number; right: number }
              const lines: Line[] = []

              rects.forEach(r => {
                const overlap = lines.find(
                  l => !(r.bottom < l.top || r.top > l.bottom) // intervals overlap
                )
                if (overlap) {
                  overlap.left = Math.min(overlap.left, r.left)
                  overlap.right = Math.max(overlap.right, r.right)
                  overlap.top = Math.min(overlap.top, r.top)
                  overlap.bottom = Math.max(overlap.bottom, r.bottom)
                } else {
                  lines.push({ top: r.top, bottom: r.bottom, left: r.left, right: r.right })
                }
              })

              const overlays: HTMLElement[] = []
              lines.forEach(l => {
                const o = document.createElement('div')
                Object.assign(o.style, {
                  position: 'absolute',
                  top: `${l.top + root.scrollTop - rootBox.top}px`,
                  left: `${l.left + root.scrollLeft - rootBox.left}px`,
                  width: `${l.right - l.left}px`,
                  height: `${l.bottom - l.top}px`,
                  background: 'rgba(177, 211, 255, 0.7)',
                  borderRadius: '2px',
                  pointerEvents: 'none',
                  zIndex: '5',
                })
                root.appendChild(o)
                overlays.push(o)
              })
              view.dispatch(view.state.tr.setMeta(key, { overlays }))
              return false
            },
            focus: view => {
              const { overlays } = key.getState(view.state) as { overlays: HTMLElement[] }
              overlays.forEach(n => n.remove())
              view.dispatch(view.state.tr.setMeta(key, { overlays: [] }))
              return false
            },
          },
        },
      }),
    ]
  },
})
