import { Schema } from 'prosemirror-model'

export type Nodes =
  | 'blockquote'
  | 'comment'
  | 'keyword'
  | 'mention'
  | 'paragraph'
  | 'text'

export type Marks =
  | 'bold'
  | 'italic'
  | 'smallcaps'
  | 'subscript'
  | 'superscript'

export const schema = new Schema<Nodes, Marks>({
  marks: {
    bold: {
      parseDOM: [
        {
          getAttrs: dom =>
            (dom as HTMLElement).style.fontWeight !== 'normal' && null,
          tag: 'b',
        },
        { tag: 'strong' },
        {
          getAttrs: value =>
            /^(bold(er)?|[5-9]\d{2,})$/.test(value as string) && null,
          style: 'font-weight',
        },
      ],
      toDOM() {
        return ['b']
      },
    },
    italic: {
      parseDOM: [{ tag: 'i' }, { tag: 'em' }, { style: 'font-style=italic' }],
      toDOM() {
        return ['i']
      },
    },
    smallcaps: {
      parseDOM: [
        { style: 'font-variant=small-caps' },
        { style: 'font-variant-caps=small-caps' }, // TODO: all the other font-variant-caps options?
      ],
      toDOM: () => [
        'span',
        {
          style: 'font-variant:small-caps',
        },
      ],
    },
    subscript: {
      excludes: 'superscript',
      group: 'position',
      parseDOM: [{ tag: 'sub' }, { style: 'vertical-align=sub' }],
      toDOM: () => ['sub'],
    },
    superscript: {
      excludes: 'subscript',
      group: 'position',
      parseDOM: [{ tag: 'sup' }, { style: 'vertical-align=super' }],
      toDOM: () => ['sup'],
    },
  },
  nodes: {
    blockquote: {
      content: 'paragraph+',
      defining: true,
      group: 'block',
      parseDOM: [{ tag: 'blockquote' }],
      toDOM: () => ['blockquote', 0],
    },
    comment: {
      content: '(paragraph | blockquote)? paragraph+',
      parseDOM: [{ tag: 'div' }],
      toDOM: () => ['div', 0],
    },
    keyword: {
      atom: true,
      attrs: {
        keywordID: { default: '' },
        name: { default: '' },
      },
      draggable: true,
      group: 'inline',
      inline: true,
      parseDOM: [
        {
          getAttrs: dom => ({
            keywordID: (dom as HTMLElement).getAttribute('data-keyword'),
            name: (dom as HTMLElement).textContent,
          }),
          tag: 'span.keyword',
        },
      ],
      toDOM: node => [
        'span',
        {
          class: 'keyword',
          'data-keyword': node.attrs.keywordID,
        },
        node.attrs.name,
      ],
    },
    mention: {
      atom: true,
      attrs: {
        name: { default: '' },
        userID: { default: '' },
      },
      draggable: true,
      group: 'inline',
      inline: true,
      parseDOM: [
        {
          getAttrs: dom => ({
            name: (dom as HTMLElement).textContent,
            userID: (dom as HTMLElement).getAttribute('data-user'),
          }),
          tag: 'span.mention',
        },
      ],
      toDOM: node => [
        'span',
        {
          class: 'mention',
          'data-user': node.attrs.userID,
        },
        node.attrs.name,
      ],
    },
    paragraph: {
      content: 'inline*',
      group: 'block',
      parseDOM: [{ tag: 'p' }],
      toDOM() {
        return ['p', 0]
      },
    },
    text: {
      group: 'inline',
    },
  },
  topNode: 'comment',
})
