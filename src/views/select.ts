import { CSSProperties } from 'react'

export const plainStyles = {
  control: (base: CSSProperties): CSSProperties => ({
    ...base,
    background: 'none',
    border: 'none',
    boxShadow: 'none',
    minHeight: 0,
    outline: 'none',
  }),
  dropdownIndicator: (): CSSProperties => ({
    display: 'none',
  }),
  indicatorSeparator: (): CSSProperties => ({
    display: 'none',
  }),
  input: () => ({
    width: 1,
  }),
  menu: (base: CSSProperties): CSSProperties => ({
    ...base,
    fontFamily: 'Barlow, sans-serif',
    width: 'auto',
  }),
  option: (base: CSSProperties): CSSProperties => ({
    ...base,
    maxWidth: 500,
    minWidth: 200,
    overflow: 'visible',
    padding: '8px 16px',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    width: 200,
  }),
  singleValue: (base: CSSProperties): CSSProperties => ({
    ...base,
    color: '#617ba8',
    marginLeft: 0,
    marginRight: 0,
    overflow: 'visible',
    position: 'relative',
    transform: 'none',
    width: 'auto',
  }),
  valueContainer: (base: CSSProperties): CSSProperties => ({
    ...base,
    padding: 0,
  }),
}
