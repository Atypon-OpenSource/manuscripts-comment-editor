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

import { EditorState } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import React from 'react'

import { parse } from '../parse'
import { plugins } from '../plugins'
import { schema } from '../schema'
import { serialize } from '../serialize'
import { Keyword, UserProfile } from '../types'
import { createEditableKeywordView, createEditableMentionView } from '../views'

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string
  createKeyword: (name: string) => Promise<Keyword>
  handleChange?: (value: string) => void
  handleFocus?: (view: EditorView, event: Event) => boolean
  id?: string
  listCollaborators: () => UserProfile[]
  listKeywords: () => Keyword[]
  value?: string
}

export class CommentField extends React.Component<Props> {
  private readonly editorRef: React.RefObject<HTMLDivElement>
  private view: EditorView

  public constructor(props: Props) {
    super(props)

    this.editorRef = React.createRef()

    const attributes: { [name: string]: string } = {
      class: 'plain comment-editor',
    }

    this.view = new EditorView(undefined, {
      attributes,
      dispatchTransaction: (transaction) => {
        const { state, transactions } = this.view.state.applyTransaction(
          transaction
        )

        this.view.updateState(state)

        if (
          this.props.handleChange &&
          transactions.some((tr) => tr.docChanged)
        ) {
          this.props.handleChange(serialize(state.doc))
        }
      },
      handleDOMEvents: {
        focus: (view, event) => {
          return this.props.handleFocus
            ? this.props.handleFocus(view, event)
            : false
        },
      },
      handleKeyDown: (view, event) => {
        if (event.key === 'Enter') {
          const element = this.view.dom as HTMLDivElement
          element.blur()
          return true
        }

        return false
      },
      nodeViews: {
        // @ts-ignore (types)
        keyword: createEditableKeywordView(
          props.listKeywords,
          props.createKeyword
        ),
        // @ts-ignore (types)
        mention: createEditableMentionView(props.listCollaborators),
      },
      state: EditorState.create({
        doc: parse(props.value),
        plugins,
        schema,
      }),
    })
  }

  public componentDidMount() {
    if (this.editorRef.current) {
      this.editorRef.current.appendChild(this.view.dom)
    }

    if (this.props.autoFocus) {
      this.view.focus()
    }
  }

  // eslint-disable-next-line react/no-deprecated
  public componentWillReceiveProps(nextProps: Props) {
    if (!this.view.hasFocus()) {
      this.view.updateState(
        EditorState.create({
          doc: parse(nextProps.value),
          plugins: this.view.state.plugins,
          schema: this.view.state.schema,
        })
      )
    }
  }

  public render() {
    return (
      <div
        className={this.props.className}
        id={this.props.id}
        ref={this.editorRef}
      />
    )
  }
}
