import React from 'react'
import { useContext } from 'react'

import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import { TextField } from '@mui/material'
import { TextFieldProps } from '@mui/material'

import { SearchChangeType } from '../SearchTool'
import { StateContext } from '../context/StateContext'

type SearchInputProps = {
  field: string
  onSearchChange?: SearchChangeType
} & TextFieldProps

export default function SearchInput(props: SearchInputProps) {
  const { field, onSearchChange = () => {} } = props
  const ctx = useContext(StateContext)

  return (
    <TextField
      label=""
      sx={{
        width: '200px',
        fontSize: '0.875rem',
        '& .MuiInputBase-root': {
          height: '100%',
        },
        '& .MuiInputBase-root.MuiOutlinedInput-root': {
          fontSize: '0.875rem',
        },
      }}
      size="small"
      placeholder="搜索"
      value={ctx?.searchState[field]}
      onChange={(e) => {
        ctx?.setSearchState({
          ...ctx.searchState,
          [field]: e.target.value,
        })
      }}
      InputProps={{
        endAdornment: (
          <SearchOutlinedIcon
            sx={{
              width: '1.25rem',
              height: '1.25rem',
              opacity: '0.7',
              cursor: 'pointer',
              '&:hover': {
                opacity: '1',
              },
            }}
            onClick={() => {
              onSearchChange({
                searchState: ctx?.searchState,
                tableScope: {},
                target: {
                  field: field,
                  type: 'SearchInput',
                },
              })
            }}
          />
        ),
      }}
      {...props}
    />
  )
}
