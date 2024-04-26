import React, { useEffect } from 'react'
import { useContext } from 'react'

import { SelectChangeEvent } from '@mui/material'
import { MenuItem, Select } from '@mui/material'
import FormControl from '@mui/material/FormControl'

import { SearchChangeType } from '../SearchTool'
import { StateContext } from '../context/StateContext'

interface SelectInputProps {
  options: Array<{
    label: string
    value: string
  }>
  field: string
  onSearchChange?: SearchChangeType
}

export default function SelectInput(props: SelectInputProps) {
  const {
    options = [
      {
        label: '暂无选项',
        value: undefined,
      },
    ],
    field,
    onSearchChange = () => {},
  } = props

  const ctx = useContext(StateContext)

  const setCtxValue = (value: string) => {
    if (ctx) {
      let newState = {
        ...ctx.searchState,
        [field]: value,
      }
      console.log(value, ctx)
      ctx?.setSearchState(newState)
    }
  }

  useEffect(() => {
    if (options.length > 0 && options[0].value !== undefined) {
      setCtxValue(options[0]?.value)
    }
  }, [])

  const handleChange = (e: SelectChangeEvent) => {
    if (e?.target?.value) {
      setCtxValue(e?.target?.value)
      let newState = {
        ...ctx?.searchState,
        [field]: e?.target?.value,
      }
      onSearchChange({
        searchState: newState,
        tableScope: {},
        target: {
          field: field,
          type: 'SelectInput',
        },
      })
    }
  }

  return (
    <FormControl>
      <Select
        size="small"
        value={ctx?.searchState[field]}
        defaultValue={options[0]?.value}
        sx={{
          width: '200px',
          fontSize: '0.875rem',
          height: '100%',
        }}
        onChange={handleChange}
      >
        {options.map((item) => {
          return (
            <MenuItem
              key={item.label}
              value={item.value}
              sx={{
                fontSize: '0.875rem',
              }}
            >
              {item.label}
            </MenuItem>
          )
        })}
      </Select>
    </FormControl>
  )
}
