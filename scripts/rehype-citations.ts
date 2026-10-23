// Turns "[3]" in a paper-style post into a link to item 3 under its "References" heading.
// Posts without that heading are left alone, so a literal [1] elsewhere stays text.

interface Node {
  type: string
  tagName?: string
  value?: string
  properties?: Record<string, unknown>
  children?: Node[]
}

const text = (n: Node): string => n.value ?? (n.children ?? []).map(text).join('')

function linkCitations(node: Node, count: number): void {
  if (!node.children || node.tagName === 'a' || node.tagName === 'code' || node.tagName === 'pre') return
  node.children = node.children.flatMap((child) => {
    if (child.type !== 'text' || !child.value) {
      linkCitations(child, count)
      return [child]
    }
    const parts = child.value.split(/\[(\d+)\]/)
    if (parts.length === 1) return [child]
    return parts.flatMap((part, i): Node[] => {
      if (i % 2 === 0) return part ? [{ type: 'text', value: part }] : []
      const n = Number(part)
      if (n < 1 || n > count) return [{ type: 'text', value: `[${part}]` }]
      return [{
        type: 'element',
        tagName: 'a',
        properties: { href: `#ref-${n}`, className: ['cite'] },
        children: [{ type: 'text', value: `[${n}]` }],
      }]
    })
  })
}

export default function rehypeCitations() {
  return (tree: Node) => {
    const top = tree.children ?? []
    const at = top.findIndex((n) => n.tagName === 'h2' && text(n).trim() === 'References')
    if (at < 0) return
    const list = top.slice(at + 1).find((n) => n.type === 'element')
    if (list?.tagName !== 'ol') return
    const items = (list.children ?? []).filter((n) => n.tagName === 'li')
    items.forEach((li, i) => {
      li.properties = { ...li.properties, id: `ref-${i + 1}` }
    })
    for (const n of top.slice(0, at)) linkCitations(n, items.length)
  }
}
