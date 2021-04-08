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

import { CSSProperties } from 'react'
import { StylesConfig } from 'react-select'

export const plainStyles: StylesConfig = {
  control: (base: CSSProperties) => ({
    ...base,
    background: 'none',
    border: 'none',
    boxShadow: 'none',
    minHeight: 0,
    outline: 'none',
  }),
  dropdownIndicator: () => ({
    display: 'none',
  }),
  indicatorSeparator: () => ({
    display: 'none',
  }),
  input: () => ({
    width: 1,
  }),
  menu: (base: CSSProperties) => ({
    ...base,
    fontFamily: 'Barlow, sans-serif',
    width: 'auto',
  }),
  option: (base: CSSProperties) => ({
    ...base,
    maxWidth: 500,
    minWidth: 200,
    overflow: 'visible',
    padding: '8px 16px',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    width: 200,
  }),
  singleValue: (base: CSSProperties) => ({
    ...base,
    color: '#617ba8',
    marginLeft: 0,
    marginRight: 0,
    overflow: 'visible',
    position: 'relative',
    transform: 'none',
    width: 'auto',
  }),
  valueContainer: (base: CSSProperties) => ({
    ...base,
    padding: 0,
  }),
}
