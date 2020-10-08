/*!
 * © 2019 Atypon Systems LLC
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

import {
  InputRule,
  inputRules,
  wrappingInputRule,
} from 'prosemirror-inputrules'
import { NodeSelection } from 'prosemirror-state'

import { schema } from './schema'

export const rules = inputRules({
  rules: [
    // > blockquote
    wrappingInputRule(/^\s*>\s$/, schema.nodes.blockquote),

    // @mention
    new InputRule(/@\w*/, (state, match, start, end) => {
      let tr = state.tr
      tr = tr.replaceWith(start, end, schema.nodes.mention.createChecked())
      tr = tr.setSelection(NodeSelection.create(tr.doc, start))
      return tr
    }),

    // #keyword
    new InputRule(/#\w*/, (state, match, start, end) => {
      let tr = state.tr
      tr = tr.replaceWith(start, end, schema.nodes.keyword.createChecked())
      tr = tr.setSelection(NodeSelection.create(tr.doc, start))
      return tr
    }),
  ],
})
