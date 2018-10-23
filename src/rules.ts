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
