import { DOMParser, ParseOptions } from 'prosemirror-model'
import { schema } from './schema'

export const parser = DOMParser.fromSchema(schema)

export const parse = (contents: string = '', options?: ParseOptions) => {
  const node = document.createElement('div')
  node.innerHTML = contents

  return parser.parse(node, options)
}
