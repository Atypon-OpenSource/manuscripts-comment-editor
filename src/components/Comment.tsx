import { EditorState, TextSelection } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import React from 'react'
import { parse } from '../parse'
import { schema } from '../schema'
import { Keyword, UserProfile } from '../types'
import { createKeywordView, createMentionView } from '../views'

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  getCollaborator: (id: string) => UserProfile | undefined
  getKeyword: (id: string) => Keyword | undefined
  id?: string
  value?: string
}

export class Comment extends React.Component<Props> {
  private readonly editorRef: React.RefObject<HTMLDivElement>
  private view: EditorView

  public constructor(props: Props) {
    super(props)

    this.editorRef = React.createRef()

    const doc = parse(props.value)

    this.view = new EditorView(undefined, {
      attributes: {
        class: 'plain',
      },
      editable: () => false,
      nodeViews: {
        keyword: createKeywordView(props.getKeyword),
        mention: createMentionView(props.getCollaborator),
      },
      state: EditorState.create({
        doc,
        schema,
        selection: TextSelection.create(doc, doc.nodeSize - 2),
      }),
    })
  }

  public componentDidMount() {
    this.editorRef.current!.appendChild(this.view.dom)
    this.updateClassList()
  }

  public componentWillReceiveProps(nextProps: Props) {
    this.view.updateState(
      EditorState.create({
        doc: parse(nextProps.value),
        schema: this.view.state.schema,
      })
    )
    this.updateClassList()
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