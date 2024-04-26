import AddIcon from '@mui/icons-material/Add'
import RefreshIcon from '@mui/icons-material/Refresh'
import { Autocomplete, Box, IconButton, InputAdornment, Stack, TextField, Tooltip } from '@mui/material'
import { styled } from '@mui/material/styles'
import { GridToolbarContainer } from '@mui/x-data-grid'
import React, { ReactElement, useEffect, useMemo, useState } from 'react'
import { ExpandGridColDef, ColumnsType, SearchOptionsProps, ToolbarItemProps } from './type'
import { AutocompleteRenderInputParams } from '@mui/material'

interface CustomQueryBarPorps {
  columns: ColumnsType
  values: {
    [key: string]: any
  }
  onSearch: (values: object) => void
}

interface EasyToolbarProps {
  columns: ColumnsType
  values: object
  showAddButton?: boolean
  showRefresh?: boolean
  toolbar?: Array<ToolbarItemProps>
  onAddRow?: (() => void) | undefined
  onSearch: (values: object) => void
  onRefresh?: () => void
}

type CustomButtonGroupProps = Pick<
  EasyToolbarProps,
  'toolbar' | 'showAddButton' | 'showRefresh' | 'onAddRow' | 'onRefresh'
>

const StyledAutocomplete = styled(Autocomplete)(({ theme }) => ({
  '& .MuiInputLabel-root': {
    fontSize: '0.8rem',
  },
  '& .MuiInputBase-input': {
    fontSize: '0.8rem',
  },
  '& .MuiAutocomplete-popper': {
    fontSize: '0.8rem',
  },
  padding: theme.spacing(0),
  textAlign: 'center',
  width: '25ch',
  color: theme.palette.text.secondary,
}))

const StyledTextField = styled(TextField)(() => ({
  '& .MuiTypography-root': {
    fontSize: '0.8rem',
    paddingRight: '8px',
  },
}))

interface FocusedType {
  [key: string]: boolean
}

interface ValuesType {
  [key: string]: string | number | undefined
}

const CustomQueryBar = React.memo(({ columns, values: inputValues, onSearch }: CustomQueryBarPorps) => {
  let initFocusedMap: {
    [key: string]: boolean
  } = {}
  let initValuesMap: {
    [key: string]: string | number | undefined
  } = {}

  columns.forEach((item) => {
    if (item.search) {
      initFocusedMap[item.field] = false
      initValuesMap[item.field] = inputValues?.[item.field] ? inputValues[item.field] : ''
    }
  })

  const [focused, setFocused] = useState<FocusedType>(initFocusedMap)
  const [values, setValues] = useState<ValuesType>(initValuesMap)

  const [valueChanged, setValueChanged] = useState<number>(0)

  const handleChange = () => {
    onSearch?.(values)
  }

  useEffect(() => {
    if (valueChanged) {
      handleChange()
    }
  }, [valueChanged])


  const renderSelectSearchItem = (item: ExpandGridColDef) => {
    const prefix: string = item.headerName || item.field

    const dataSource: SearchOptionsProps[] = item.searchOptions || []

    if (!dataSource.some((entity) => entity.value === '')) {
      dataSource.unshift({
        value: '',
        label: '全部',
      })
    }

    const showValue = (field: string, dataSource: SearchOptionsProps[]) => {
      if (focused[field] && values[field] === '') return ''
      let findEntity = dataSource.find((entity) => entity.value === values[field])
      return findEntity ? findEntity.label : values[field]
    }

    const searchValue = showValue(item.field, dataSource)

    const handleInputChange = (e: React.SyntheticEvent, value: string) => {
      let findEntity = dataSource.find((entity) => entity.label === value)
      if (findEntity) {
        let newValue = findEntity.value
        if (values[item.field] !== newValue) {
          setValues({
            ...values,
            [item.field]: newValue,
          })
          setValueChanged(valueChanged + 1)
        }
      }
    }

    return (
      <StyledAutocomplete
        key={`search-${item.field}`}
        size="small"
        disableClearable
        freeSolo
        forcePopupIcon
        value={searchValue}
        options={dataSource.map((option) => option.label)}
        onInputChange={handleInputChange}
        renderInput={(params: AutocompleteRenderInputParams) => (
          <StyledTextField
            {...params}
            InputProps={{
              ...params.InputProps,
              startAdornment: <InputAdornment position="start">{prefix}</InputAdornment>,
              type: 'search',
            }}
            onFocus={() =>
              setFocused({
                ...focused,
                [item.field]: true,
              })
            }
            onBlur={() => {
              setFocused({
                ...focused,
                [item.field]: false,
              })
            }}
          />
        )}
      />
    )
  }

  const renderInputSearchItem = (item: ExpandGridColDef) => {
    const prefix: string = item.headerName || item.field

    let searchValue: string | undefined = String(values[item.field])

    const handleInputChange = (e: React.SyntheticEvent, value: string) => {
      if (values[item.field] !== value) {
        setValues({
          ...values,
          [item.field]: value,
        })
      }
    }

    return (
      <StyledAutocomplete
        key={`search-${item.field}`}
        size="small"
        disableClearable
        freeSolo
        forcePopupIcon
        inputValue={searchValue}
        options={[]}
        onInputChange={handleInputChange}
        renderInput={(params: AutocompleteRenderInputParams) => {
          return (
            <StyledTextField
              {...params}
              sx={{
                '& .MuiOutlinedInput-root.MuiInputBase-sizeSmall': {
                  paddingRight: '9px',
                },
              }}
              InputProps={{
                // ...params.InputProps,
                startAdornment: <InputAdornment position="start">{prefix}</InputAdornment>,
                type: 'search',
              }}
              // onKeyUp={handleSearch}
              onFocus={() =>
                setFocused({
                  ...focused,
                  [item.field]: true,
                })
              }
              onBlur={() => {
                setFocused({
                  ...focused,
                  [item.field]: false,
                })
                setValueChanged(valueChanged + 1)
              }}
            />
          )
        }}
      />
    )
  }

  const renderSearchItem = (item: ExpandGridColDef) => {
    if (item.searchOptions !== undefined) {
      return renderSelectSearchItem(item)
    } else {
      return renderInputSearchItem(item)
    }
  }

  return (
    <Stack direction="row" spacing={1}>
      {columns.filter((item) => item.search).map((item) => renderSearchItem(item))}
    </Stack>
  )
})

const StyledIconButton = styled(IconButton)(() => ({
  fontSize: '0.6rem',
  border: '1px solid #c2c2c2',
  borderRadius: '5px',
  padding: '10px',
  '& .MuiSvgIcon-root': {
    width: '1rem',
    height: '1rem',
  },
}))

const CustomButtonGroup = (props: CustomButtonGroupProps) => {
  const { toolbar, showAddButton, showRefresh, onAddRow, onRefresh } = props
  const renderToolButton = (barItem: ToolbarItemProps, idx: number | string) => {
    return (
      <Tooltip key={`baritem-${idx}`} title={barItem.tooltip}>
        <StyledIconButton
          size="small"
          // variant="contained"
          onClick={barItem.onClick}
          aria-label={barItem.tooltip}
        >
          {barItem.icon}
        </StyledIconButton>
      </Tooltip>
    )
  }
  return (
    <Stack spacing={1} direction="row">
      {toolbar ? toolbar.map((barItem, idx) => renderToolButton(barItem, idx)) : null}
      {showAddButton ? (
        <Tooltip title="新建">
          <StyledIconButton
            size="small"
            // variant="contained"
            onClick={onAddRow}
            aria-label="add to shopping cart"
          >
            <AddIcon />
          </StyledIconButton>
        </Tooltip>
      ) : null}
      {showRefresh ? (
        <Tooltip title="刷新">
          <StyledIconButton
            size="small"
            // variant="contained"
            onClick={onRefresh}
            aria-label="add to shopping cart"
          >
            <RefreshIcon />
          </StyledIconButton>
        </Tooltip>
      ) : null}
    </Stack>
  )
}

export const EasyToolbar = (props: EasyToolbarProps): ReactElement | null => {
  const { columns, values, showAddButton, showRefresh, toolbar, onAddRow, onSearch, onRefresh } = props

  // let showQueryBar = false;
  // columns.forEach(item => {if (item.search) showQueryBar = true})
  let showQueryBar = useMemo<boolean>(() => {
    return columns.some((item) => {
      return item.search
    })
  }, [columns, columns.length])

  let showButtonGroup = showAddButton || showRefresh || toolbar

  let showBar = showButtonGroup || showQueryBar
  if (!showBar) return null

  return (
    <GridToolbarContainer>
      {showQueryBar ? <CustomQueryBar columns={columns} onSearch={onSearch} values={values} /> : null}
      <Box sx={{ flexGrow: 1 }} />
      {showButtonGroup ? (
        <CustomButtonGroup
          toolbar={toolbar}
          showAddButton={showAddButton}
          showRefresh={showRefresh}
          onAddRow={onAddRow}
          onRefresh={onRefresh}
        />
      ) : null}
    </GridToolbarContainer>
  )
}
