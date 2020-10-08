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

import { Node as ProsemirrorNode } from 'prosemirror-model'
import { TextSelection } from 'prosemirror-state'
import { EditorView, NodeView } from 'prosemirror-view'
import React from 'react'
import ReactDOM from 'react-dom'
import { OptionsType } from 'react-select'
import Creatable from 'react-select/creatable'

import { Keyword } from '../../types'
import { KeywordSelect } from './KeywordSelect'

interface OptionType {
  label: string
  value: string
}

export const createKeywordView = (
  getKeyword: (id: string) => Keyword | undefined
) => (node: ProsemirrorNode): NodeView => {
  const keyword = getKeyword(node.attrs.keywordID)

  const content = '#' + (keyword ? keyword.name : '?')

  const dom = document.createElement('span')
  dom.style.color = '#92c6ed'
  dom.textContent = content

  return { dom }
}

export const createEditableKeywordView = (
  listKeywords: () => Keyword[],
  createKeyword: (name: string) => Promise<Keyword>
) => (
  node: ProsemirrorNode,
  view: EditorView,
  getPos: () => number
): NodeView => {
  const dom = document.createElement('span')
  dom.style.display = 'inline-flex'
  dom.style.alignItems = 'center'
  dom.style.color = '#617ba8'

  const prefix = document.createElement('span')
  prefix.textContent = '#'
  dom.appendChild(prefix)

  const select = document.createElement('span')
  select.style.display = 'inline-block'
  dom.appendChild(select)

  const selectRef = React.createRef<Creatable<OptionType>>()
  const portal = document.getElementById('menu') as HTMLDivElement

  const handleChange = (keywordID: string) => {
    view.focus()

    let tr = view.state.tr

    tr = tr.setNodeMarkup(getPos(), undefined, {
      ...node.attrs,
      keywordID,
    })

    const $anchor = tr.doc.resolve(getPos() + node.nodeSize)

    tr = tr.setSelection(TextSelection.between($anchor, $anchor))

    view.dispatch(tr)
  }

  const updateContents = () => {
    const options: OptionsType<OptionType> = listKeywords().map((item) => ({
      label: item.name,
      value: item._id,
    }))

    ReactDOM.render(
      <KeywordSelect
        handleChange={handleChange}
        createKeyword={createKeyword}
        options={options}
        portal={portal}
        selectRef={selectRef}
        selected={node.attrs.keywordID}
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
    stopEvent: (event) => {
      return !event.type.startsWith('drag')
    },
    update: (newNode: ProsemirrorNode) => {
      if (newNode.type.name !== node.type.name) {
        return false
      }
      node = newNode
      updateContents()
      return true
    },
  }
}
