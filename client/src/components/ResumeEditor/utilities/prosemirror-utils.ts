import { ResolvedPos, Node } from "prosemirror-model"

interface NodeModel {
  node: Node;
  pos: number;
}

/**
 * Recursively find the *first* text node in `node`, scanning
 * its tree from front to back.
 */
function findDeepFirstText(node: Node, baseOffset = 0): NodeModel | null {
  if (node.isText) {
    return { node, pos: baseOffset }
  }
  let offset = 0
  for (let i = 0; i < node.childCount; i++) {
    const child = node.child(i)
    const hit   = findDeepFirstText(child, 0)
    if (hit) {
      return { node: hit.node, pos: baseOffset + offset + hit.pos }
    }
    offset += child.nodeSize
  }
  return null
}

/**
 * Recursively find the *last* text node in `node`, scanning
 * its tree from back to front.
 */
function findDeepLastText(node: Node, baseOffset = 0): NodeModel | null {
  if (node.isText) {
    return { node, pos: baseOffset }
  }
  let offset = node.content.size
  for (let i = node.childCount - 1; i >= 0; i--) {
    const child = node.child(i)
    offset -= child.nodeSize
    const hit = findDeepLastText(child, 0)
    if (hit) {
      return { node: hit.node, pos: baseOffset + offset + hit.pos }
    }
  }
  return null
}

/**
 * Internal helper to find the closest text node to $pos in its parent.
 */
function findClosestTextNodeFn($pos: ResolvedPos): NodeModel | null {
  const parent = $pos.parent
  const ofs    = $pos.parentOffset

  // 1) Probe the node directly before (or containing) the offset
  const before = parent.childBefore(ofs)
  if (before.node) {
    const hit = findDeepLastText(before.node, before.offset)
    if (hit) return hit
  }
  // 2) Walk earlier siblings
  for (let i = before.index - 1; i >= 0; i--) {
    const sib = parent.child(i)
    let start = 0
    for (let j = 0; j < i; j++) start += parent.child(j).nodeSize
    const hit = findDeepLastText(sib, start)
    if (hit) return hit
  }

  // 3) No text before—probe the node directly after
  const after = parent.childAfter(ofs)
  if (after.node) {
    const hit = findDeepFirstText(after.node, after.offset)
    if (hit) return hit
  }
  // 4) Walk later siblings
  for (let i = after.index + 1; i < parent.childCount; i++) {
    const sib = parent.child(i)
    let start = 0
    for (let j = 0; j < i; j++) start += parent.child(j).nodeSize
    const hit = findDeepFirstText(sib, start)
    if (hit) return hit
  }

  // nothing in parent
  return null
}

/**
 * find the closest text node *and* its parent for a given $pos.
 * @returns the text node, its direct parent, and the absolute doc position
 */
export function findClosestTextNode($pos: ResolvedPos): { node?: Node, parent?: Node } {
  const hit = findClosestTextNodeFn($pos)
  if (!hit) return {};

  // Compute the absolute document position of the found text node
  const parentOffset = $pos.parentOffset
  const from = $pos.pos - parentOffset + hit.pos

  // Resolve and grab the actual parent node at that position
  const $hit = $pos.doc.resolve(from)
  return {
    node: hit.node,
    parent: $hit.parent,
  }
}
