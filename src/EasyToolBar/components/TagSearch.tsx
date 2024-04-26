import React, { useContext, useState } from 'react'

import AddIcon from '@mui/icons-material/Add'
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown'
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp'
import { Box, Button, Chip, Grid, Stack, TextField, Typography } from '@mui/material'
import { ButtonProps } from '@mui/material'

import { SearchChangeType } from '../SearchTool'
import { StateContext } from '../context/StateContext'
import ToolIconButton from './ToolIconButton'

interface TagSearchProps {
  label: string
  props: ButtonProps
  field: string
  onSearchChange: SearchChangeType
}

interface KvProps {
  key: string
  value: string
}

const TagContainer = ({ onSearchChange }: { onSearchChange: SearchChangeType }) => {
  const ctx = useContext(StateContext)

  let field = ctx?.containerState?.field

  let tagList: Array<KvProps> = ctx?.searchState[ctx?.containerState?.field] || []

  const [kv, setKv] = useState({
    key: '',
    value: '',
  })

  const addTag = () => {
    if (!field) {
      return
    }
    let lastCtxSearchState: Array<KvProps> = ctx?.searchState[field] ?? []
    let hasTag = lastCtxSearchState.some((item) => item.key === kv.key && item.value === kv.value)
    if (!hasTag && kv.key) {
      lastCtxSearchState.push(kv)
      ctx?.setSearchState({
        ...ctx?.searchState,
        [field]: lastCtxSearchState,
      })
    }
  }

  const deleteTag = (key: string, value: string) => {
    if (!field) {
      return
    }
    let lastCtxSearchState: Array<KvProps> = ctx?.searchState[field]

    if (lastCtxSearchState) {
      let filterCtxSearchState = lastCtxSearchState.filter((item) => item.key !== key || item.value !== value)
      ctx?.setSearchState({
        ...ctx?.searchState,
        [field]: filterCtxSearchState,
      })
    }
  }

  const updateKv = (type: string, value: string) => {
    setKv({
      ...kv,
      [type]: value,
    })
  }

  const handleTagDelete = (data: KvProps) => {
    deleteTag(data.key, data.value)
  }

  const resetTag = () => {
    ctx?.setSearchState({
      ...ctx?.searchState,
      [field]: [],
    })
  }

  return (
    <Box
      sx={{
        padding: '20px',
      }}
    >
      <Stack direction="row" spacing={1}>
        <TextField
          value={kv.key}
          onChange={(e) => {
            updateKv('key', e.target.value)
          }}
          placeholder="键"
          sx={{ width: '200px' }}
          size="small"
        />
        <TextField
          value={kv.value}
          onChange={(e) => {
            updateKv('value', e.target.value)
          }}
          placeholder="值"
          sx={{ width: '200px' }}
          size="small"
        />
        <ToolIconButton
          icon={<AddIcon />}
          onClick={() => {
            addTag()
          }}
        />
      </Stack>
      <Stack
        spacing={0}
        sx={{
          marginTop: '20px',
        }}
      >
        <Typography variant="body2">此查询功能仅支持选择下拉列表中已存在的键和值。</Typography>
        <Typography variant="body2">
          支持最多20个不同标签的组合搜索。如果输入多个标签，则不同标签之间为与的关系。
        </Typography>
      </Stack>
      <Grid
        container
        sx={{
          pt: 2,
          pb: 2,
        }}
      >
        {ctx &&
          tagList.map((item) => {
            return (
              <Chip
                key={item.key + '=' + item.value}
                label={`${item.key}=${item.value}`}
                variant="outlined"
                onDelete={() => {
                  handleTagDelete(item)
                }}
                sx={{
                  mr: 1,
                  mb: 1,
                }}
              />
            )
          })}
      </Grid>
      <Stack
        direction="row"
        spacing={1}
        sx={{
          justifyContent: 'flex-end',
        }}
      >
        <Button
          variant="outlined"
          onClick={() => {
            onSearchChange({
              searchState: ctx?.searchState,
              tableScope: {},
              target: {
                field: field,
                type: 'TagSearch',
              },
            })
          }}
        >
          搜索
        </Button>
        <Button
          variant="outlined"
          onClick={() => {
            resetTag()
          }}
        >
          重置
        </Button>
      </Stack>
      <Grid />
    </Box>
  )
}

export default function TagSearch(cusProps: TagSearchProps) {
  const { label = '标签搜索', props = {}, field, onSearchChange } = cusProps
  const ctx = useContext(StateContext)

  const getTagContainer = () => {
    return <TagContainer onSearchChange={onSearchChange} />
  }

  const tagShowClick = () => {
    if (ctx) {
      let newContainerState = ctx?.containerState
      let isShow = !newContainerState.show
      if (isShow && ctx?.containerState?.container !== getTagContainer) {
        newContainerState.container = getTagContainer
      }
      newContainerState.show = isShow
      newContainerState.field = field
      ctx?.setContainerState({
        ...ctx?.containerState,
        ...newContainerState,
      })
    }
  }

  let count = ctx?.searchState[field]?.length || 0

  return (
    <>
      <Button
        color="inherit"
        variant="outlined"
        endIcon={ctx?.containerState?.show ? <KeyboardDoubleArrowUpIcon /> : <KeyboardDoubleArrowDownIcon />}
        sx={{
          fontWeight: 'normal',
        }}
        {...props}
        onClick={tagShowClick}
      >
        {label}
        {!!count && ` (${count})`}
      </Button>
    </>
  )
}
