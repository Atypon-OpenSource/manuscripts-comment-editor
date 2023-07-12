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
import Select, { SelectInstance, StylesConfig } from 'react-select'

import { plainStyles } from '../select'

interface OptionType {
  label: string
  value: string
}

interface Props {
  options: OptionType[]
  portal: HTMLDivElement
  selectRef: React.RefObject<SelectInstance<OptionType>>
  selected: string
  handleChange: (id: string) => void
}

export const MentionSelect: React.FC<Props> = ({
  handleChange,
  options,
  portal,
  selectRef,
  selected,
}) => (
  <Select
    ref={selectRef}
    options={options}
    value={options.find((option) => option.value === selected)}
    onChange={(value) => {
      const singleOption = value as OptionType

      if (singleOption && singleOption.value) {
        handleChange(singleOption.value)
      }
    }}
    menuPortalTarget={portal}
    openMenuOnFocus={true}
    styles={plainStyles as StylesConfig<OptionType>}
  />
)
