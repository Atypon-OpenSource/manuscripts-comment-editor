import { DOMSerializer, Node as ProsemirrorNode } from 'prosemirror-model'
import { schema } from './schema'

export const serializer = DOMSerializer.fromSchema(schema)

export const serialize = (node: ProsemirrorNode): string => {
  const element = serializer.serializeNode(node) as HTMLElement

  return element.innerHTML
}
