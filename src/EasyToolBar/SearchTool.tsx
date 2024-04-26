import React, { useEffect } from 'react'
import { useContext } from 'react'

import RefreshIcon from '@mui/icons-material/Refresh'
import { Stack } from '@mui/material'

import SearchInput from './components/SearchInput'
import SelectInput from './components/SelectInput'
import TagSearch from './components/TagSearch'
import ToolIconButton from './components/ToolIconButton'
import { StateContext } from './context/StateContext'
import { SearchStateType } from './context/StateContext'

interface SearchActionsProps {
  type: string
  field: string
  props: any
}

interface CallbackProps {
  searchState: SearchStateType | undefined
  tableScope: object
  target: any
}
export type SearchChangeType = (callbackProps: CallbackProps) => void

export interface SearchToolProps {
  actions: Array<SearchActionsProps>
  onSearchChange: SearchChangeType
}

export default function SearchTool(props: SearchToolProps) {
  const { actions, onSearchChange } = props
  const ctx = useContext(StateContext)

  const _onSearchChange = (params: CallbackProps) => {
    if (params?.searchState) {
      let scope: Array<{
        key: string
        value: string | number
      }> = []

      const checkPush = (v: string | number) => {
        if (v === undefined) {
          return false
        }
        let { type } = params.target
        if (type === 'SelectInput' && v === 'all') {
          return false
        }
        return true
      }

      if (params?.searchState) {
        let searchState = params?.searchState
        Object.keys(params.searchState).forEach((key) => {
          if (checkPush(searchState[key])) {
            scope.push({
              key: key,
              value: searchState[key],
            })
          }
        })
        params.tableScope = scope
      }
    }

    onSearchChange(params)
  }

  const renderCompnentsByType = (compProps: any) => {
    const { type, props, field } = compProps

    switch (type) {
      case 'IconButton':
        return <ToolIconButton {...props} />
      case 'RefreshIconButton':
        return <ToolIconButton tooltip="刷新" icon={<RefreshIcon />} {...props} />
      case 'SearchInput':
        return <SearchInput {...props} field={field} onSearchChange={_onSearchChange} />
      case 'SelectInput':
        return <SelectInput {...props} field={field} onSearchChange={_onSearchChange} />
      case 'TagSearch':
        return <TagSearch {...props} field={field} onSearchChange={_onSearchChange} />
      default:
        return <></>
    }
  }

  useEffect(() => {
    let dataFieldMap: {
      [key: string]: any
    } = {}
    actions.forEach((item) => {
      if (item.field) {
        dataFieldMap[item.field] = undefined
      }
    })
    ctx?.setSearchState(dataFieldMap)
  }, [])

  return (
    <Stack
      direction="row"
      spacing={1}
      sx={{
        height: '40px',
        marginBottom: '10px',
      }}
    >
      {actions.map((item, index) => {
        return <React.Fragment key={index}>{renderCompnentsByType(item)}</React.Fragment>
      })}
    </Stack>
  )
}
