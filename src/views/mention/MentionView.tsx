import { Node as ProsemirrorNode } from 'prosemirror-model'
import { TextSelection } from 'prosemirror-state'
import { EditorView, NodeView } from 'prosemirror-view'
import React from 'react'
import ReactDOM from 'react-dom'
import Select from 'react-select'
import { OptionsType } from 'react-select/lib/types'
import { BibliographicName, UserProfile } from '../../types'
import { MentionSelect } from './MentionSelect'

interface OptionType {
  label: string
  value: string
}

const buildName = (name: BibliographicName): string =>
  [name.given, name.family].filter(item => item).join(' ')

export const createMentionView = (
  getCollaborator: (id: string) => UserProfile | undefined
) => (node: ProsemirrorNode): NodeView => {
  const user = getCollaborator(node.attrs.userID)

  const dom = document.createElement('span')
  dom.style.color = '#92c6ed'
  dom.textContent = '@' + (user ? buildName(user.bibliographicName) : '?')

  return { dom }
}

export const createEditableMentionView = (
  listCollaborators: () => UserProfile[]
) => (
  node: ProsemirrorNode,
  view: EditorView,
  getPos: () => number
): NodeView => {
  const dom = document.createElement('span')
  dom.style.display = 'inline-flex'
  dom.style.alignItems = 'center'

  const prefix = document.createElement('span')
  prefix.textContent = '@'
  dom.appendChild(prefix)

  const select = document.createElement('span')
  select.style.display = 'inline-block'
  dom.appendChild(select)

  const selectRef = React.createRef<Select<OptionType>>()
  const portal = document.getElementById('menu') as HTMLDivElement

  const handleChange = (userID: string) => {
    view.focus()

    let tr = view.state.tr

    tr = tr.setNodeMarkup(getPos(), undefined, {
      ...node.attrs,
      userID,
    })

    const $anchor = tr.doc.resolve(getPos() + node.nodeSize)

    tr = tr.setSelection(TextSelection.between($anchor, $anchor))

    view.dispatch(tr)
  }

  const updateContents = () => {
    const options: OptionsType<OptionType> = listCollaborators().map(item => ({
      label: buildName(item.bibliographicName),
      value: item._id,
    }))

    // TODO: sort options?
    // TODO: use menuRenderer to render in popper

    ReactDOM.render(
      <MentionSelect
        options={options}
        portal={portal}
        selectRef={selectRef}
        selected={node.attrs.userID}
        handleChange={handleChange}
      />,
      select
    )
  }

  updateContents()

  return {
    dom,
    ignoreMutation: () => true,
    selectNode: () => {
      if (selectRef.current) {
        selectRef.current.focus()
      }
    },
    stopEvent: event => {
      return !event.type.startsWith('drag')
    },
    update: (newNode: ProsemirrorNode) => {
      if (newNode.type.name !== node.type.name) return false
      node = newNode
      updateContents()
      return true
    },
  }
}