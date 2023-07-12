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

import React from 'react'
import { OnChangeValue, SelectInstance, StylesConfig } from 'react-select'
import CreatableSelect from 'react-select/creatable'

import { Keyword } from '../../types'
import { plainStyles } from '../select'

interface OptionType {
  label: string
  value: string
}

interface Props {
  options: OptionType[]
  portal: HTMLElement
  selectRef: React.RefObject<SelectInstance<OptionType>>
  selected: string
  createKeyword: (name: string) => Promise<Keyword>
  handleChange: (id: string) => void
}

interface State {
  isLoading: boolean
  options: OptionType[]
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

    const value = options.find((option) => option.value === selected)

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
        styles={plainStyles as StylesConfig<OptionType>}
        value={value}
      />
    )
  }

  private handleChange = (option?: OnChangeValue<OptionType, false>) => {
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

    this.setState((state) => ({
      ...state,
      isLoading: false,
      options: [...state.options, option],
      selected: option.value,
    }))

    this.props.handleChange(option.value)
  }
}
