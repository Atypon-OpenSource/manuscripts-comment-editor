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
      dispatchTransaction: transaction => {
        const { state, transactions } = this.view.state.applyTransaction(
          transaction
        )

        this.view.updateState(state)
        this.updateClassList()

        if (this.props.handleChange && transactions.some(tr => tr.docChanged)) {
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
        keyword: createEditableKeywordView(
          props.listKeywords,
          props.createKeyword
        ),
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
    this.editorRef.current!.appendChild(this.view.dom)
    this.updateClassList()

    if (this.props.autoFocus) {
      this.view.focus()
    }
  }

  public componentWillReceiveProps(nextProps: Props) {
    if (!this.view.hasFocus()) {
      this.view.updateState(
        EditorState.create({
          doc: parse(nextProps.value),
          plugins: this.view.state.plugins,
          schema: this.view.state.schema,
        })
      )
      this.updateClassList()
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

  protected updateClassList() {
    this.view.dom.classList.toggle(
      'empty-node',
      this.view.state.doc.childCount === 0
    )
  }
}