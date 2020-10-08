/*!
 * © 2020 Atypon Systems LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
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
