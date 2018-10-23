import { parse } from '../parse'

describe('parser', () => {
  test('parses a simple comment', () => {
    const input = `<div><p>This is a comment</p></div>`

    const output = parse(input)

    expect(output.toJSON()).toEqual({
      content: [
        {
          content: [{ text: 'This is a comment', type: 'text' }],
          type: 'paragraph',
        },
      ],
      type: 'comment',
    })
  })

  test('parses a comment with a blockquote', () => {
    const input = `<div><blockquote><p>This is a quote</p></blockquote><p>This is a comment</p></div>`

    const output = parse(input)

    expect(output.toJSON()).toEqual({
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
  })
})
