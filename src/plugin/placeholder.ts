/*!
 * © 2021 Atypon Systems LLC
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
import { Plugin } from 'prosemirror-state'
import { Decoration, DecorationSet } from 'prosemirror-view'

export default () => {
  return new Plugin({
    props: {
      decorations: (state) => {
        const decorations: Decoration[] = []

        state.doc.descendants((node, pos) => {
          if (node.type.isBlock && node.childCount === 0) {
            decorations.push(
              Decoration.node(pos, pos + node.nodeSize, {
                class: 'empty-node',
              })
            )
          }
        })

        return DecorationSet.create(state.doc, decorations)
      },
    },
  })
}
