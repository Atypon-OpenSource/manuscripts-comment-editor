import React from 'react'
import { Creatable as CreatableSelect } from 'react-select'
import { OptionsType } from 'react-select/lib/types'
import { Keyword } from '../../types'
import { plainStyles } from '../select'

interface OptionType {
  label: string
  value: string
}

interface Props {
  options: OptionsType<OptionType>
  portal: HTMLElement
  selectRef: React.RefObject<CreatableSelect<OptionType>>
  selected: string
  createKeyword: (name: string) => Promise<Keyword>
  handleChange: (id: string) => void
}

interface State {
  isLoading: boolean
  options: OptionsType<OptionType>
  selected: string
}

export class KeywordSelect extends React.Component<Props, State> {
  public constructor(props: Props) {
    super(props)

    this.state = {
      isLoading: false,
      options: props.options,
      selected: props.selected,
    }
  }

  public render() {
    const { portal, selectRef } = this.props
    const { isLoading, options, selected } = this.state

    const value = options.find(option => option.value === selected)

    // TODO: sort options?
    // TODO: use menuRenderer to render in popper

    return (
      <CreatableSelect<OptionType>
        isLoading={isLoading}
        menuPortalTarget={portal}
        onChange={this.handleChange}
        onCreateOption={this.handleCreateOption}
        openMenuOnFocus={true}
        options={options}
        ref={selectRef}
        styles={plainStyles}
        value={value}
      />
    )
  }

  private handleChange = (option?: OptionType | OptionType[] | null) => {
    const singleOption = option as OptionType

    if (singleOption && singleOption.value) {
      this.props.handleChange(singleOption.value)
    }
  }

  private handleCreateOption = async (inputValue: string) => {
    this.setState({
      isLoading: true,
    })

    const keyword: Keyword = await this.props.createKeyword(inputValue)

    const option: OptionType = {
      label: keyword.name,
      value: keyword._id,
    }

    this.setState(state => ({
      ...state,
      isLoading: false,
      options: [...state.options, option],
      selected: option.value,
    }))

    this.props.handleChange(option.value)
  }
}
