import type { RichTextBlock } from '@resumedia-demo/shared/payload-types'

export type RichNode = { h2: string } | { p: string } | { ul: string[] }

const text = (value: string) => ({ type: 'text', text: value, format: 0, detail: 0, mode: 'normal', style: '', version: 1 })

const element = { direction: 'ltr' as const, format: '' as const, indent: 0, version: 1 }

function toLexicalNode(node: RichNode) {
  if ('h2' in node) return { ...element, type: 'heading', tag: 'h2', children: [text(node.h2)] }
  if ('p' in node) return { ...element, type: 'paragraph', textFormat: 0, textStyle: '', children: [text(node.p)] }
  return {
    ...element,
    type: 'list',
    listType: 'bullet',
    tag: 'ul',
    start: 1,
    children: node.ul.map((item, i) => ({ ...element, type: 'listitem', value: i + 1, children: [text(item)] })),
  }
}

export function richText(nodes: RichNode[]): RichTextBlock['content'] {
  return { root: { ...element, type: 'root', children: nodes.map(toLexicalNode) } }
}
