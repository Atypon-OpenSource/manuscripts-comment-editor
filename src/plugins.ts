import { baseKeymap, toggleMark } from 'prosemirror-commands'
import { history, redo, undo } from 'prosemirror-history'
import { keymap } from 'prosemirror-keymap'
import { rules } from './rules'
import { schema } from './schema'

export const plugins = [
  rules,
  keymap(baseKeymap),
  keymap({
    'Mod-b': toggleMark(schema.marks.bold),
    'Mod-i': toggleMark(schema.marks.italic),
    'Mod-y': redo,
    'Mod-z': undo,
  }),
  history(),
]
