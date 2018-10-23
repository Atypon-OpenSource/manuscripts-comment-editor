import { schema } from '../schema'
import { serialize } from '../serialize'

describe('serialize', () => {
  test('serializes a simple comment', () => {
    const input = schema.nodeFromJSON({
      content: [
        {
          content: [{ text: 'This is a comment', type: 'text' }],
          type: 'paragraph',
        },
      ],
      type: 'comment',
    })

    const output = serialize(input)

    expect(output).toEqual(`<div><p>This is a comment</p></div>`)
  })

  test('parses a comment with a blockquote', () => {
    const input = schema.nodeFromJSON({
      content: [
        {
          content: [
            {
              content: [{ text: 'This is a quote', type: 'text' }],
              type: 'paragraph',
            },
          ],
          type: 'blockquote',
        },
        {
          content: [{ text: 'This is a comment', type: 'text' }],
          type: 'paragraph',
        },
      ],
      type: 'comment',
    })

    const output = serialize(input)

    expect(output).toEqual(
      `<div><blockquote><p>This is a quote</p></blockquote><p>This is a comment</p></div>`
    )
  })
})
