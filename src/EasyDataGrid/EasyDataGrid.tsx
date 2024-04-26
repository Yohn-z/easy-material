import { alpha, styled } from '@mui/material/styles'
import { DataGrid, gridClasses, useGridApiRef } from '@mui/x-data-grid'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { ExpandGridColDef } from './type'
import { Box } from '@mui/material'
import { EasyPagination } from './Pagination'
import { EasyToolbar } from './ToolBar'
import { GridRowClassNameParams } from '@mui/x-data-grid'
import {
  ColumnsType,
  FetchProps,
  GridRefProps,
  EasyDataGridProps,
  Key,
  OptionKey,
  PageInfo,
  QueryProps,
} from './type'

const ODD_OPACITY = 0.2

const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
  '& .MuiDataGrid-cell:focus': {
    outline: 'none',
  },
  [`& .${gridClasses.row}`]: {
    '&.even': {
      backgroundColor: theme.palette.action.hover,
      '&:hover, &.Mui-hovered': {
        backgroundColor: alpha(theme.palette.primary.main, ODD_OPACITY),
        '@media (hover: none)': {
          backgroundColor: 'transparent',
        },
      },
    },
    '&.Mui-selected': {
      backgroundColor: alpha(theme.palette.primary.main, ODD_OPACITY + theme.palette.action.selectedOpacity),
      '&:hover, &.Mui-hovered': {
        backgroundColor: alpha(
          theme.palette.primary.main,
          ODD_OPACITY + theme.palette.action.selectedOpacity + theme.palette.action.hoverOpacity
        ),
        // Reset on touch devices, it doesn't add specificity
        '@media (hover: none)': {
          backgroundColor: alpha(
            theme.palette.primary.main,
            ODD_OPACITY + theme.palette.action.selectedOpacity
          ),
        },
      },
    },
  },
}))

function useQuery({ dataSource, queryOptions, forceUpdate }: QueryProps) {
  const { store } = dataSource
  const { values, page, pageSize } = queryOptions
  const [rows, setRows] = useState<object[]>([])
  const [isLoading, setLoading] = useState<boolean>(false)
  const [pageInfo, setPageInfo] = useState<PageInfo>({})

  useEffect(() => {
    ;(async () => {
      if (page < 0) return

      const scope = Object.entries(values)
        .map((entity) => ({ key: entity[0], value: entity[1] }))
        .filter((entity) => entity.value !== '')

      setLoading(true)
      if (store.fetch) {
        store
          .fetch({
            scope,
            page: page + 1,
            pageSize,
          })
          .then((res) => {
            setRows(res.data.results)
            setPageInfo(() => ({ totalRowCount: res.data.total }))
            setLoading(false)
          })
      } else if (store.rows) {
        let storeRow = store.rows || []
        setRows(storeRow)
        setPageInfo(() => ({ totalRowCount: storeRow.length }))
        setLoading(false)
      }
    })()
  }, [queryOptions, store.rows, forceUpdate])

  return {
    rows,
    isLoading,
    pageInfo,
  }
}

function checkColumns(columns: ColumnsType) {
  return columns.map((item: ExpandGridColDef) => {
    if (item.type && item.type === 'date') {
      item.valueGetter = (params: any) => {
        return new Date(params.row[item.field || ''])
      }
    }
    return item
  })
}

const EasyDataGrid = React.forwardRef<GridRefProps, EasyDataGridProps>((props: EasyDataGridProps, ref) => {
  const {
    pageSize = 100,
    dataSource,
    columns,
    focusedRowEnabled = false,
    focusedRowKeys,
    autoNavigateToFocusedRow = false,
    showBorders = false,
    showAddButton = false,
    showRefresh = true,
    disablePagination = false,
    toolbar,
    onFocusedRowChanged,
    onAddRow,
    ...rest
  } = props

  const { store } = dataSource

  const apiRef = useGridApiRef()
  const [searchValues, setSearchValues] = useState({})
  const [forceUpdate, setForceUpdate] = useState(false)
  const [selectedRowIds, setSelectedRowIds] = useState<Array<Key>>([])
  const [paginationModel, setPaginationModel] = useState<FetchProps>({
    page: 0,
    pageSize: pageSize,
  })


  useEffect(() => {
    if (focusedRowEnabled) {
      if (autoNavigateToFocusedRow && focusedRowKeys) {
        // TODO: 自动导航到第一个选中的表格项
        apiRef.current.setRowSelectionModel([...focusedRowKeys])
        setSelectedRowIds([...focusedRowKeys])
      }
    }
  }, [focusedRowEnabled, focusedRowKeys, autoNavigateToFocusedRow])

  // Otherwise filter will be applied on fields such as the hidden column id
  const appliedColumns = useMemo(() => checkColumns(columns), [columns])

  const queryOptions = useMemo(
    () => ({
      values: searchValues,
      page: paginationModel.page,
      pageSize: paginationModel.pageSize,
    }),
    [paginationModel, searchValues]
  )

  const { isLoading, rows, pageInfo } = useQuery({ dataSource, queryOptions, forceUpdate })

  const handlePaginationModelChange = (newPaginationModel: FetchProps) => {
    setPaginationModel(newPaginationModel)
  }

  const [rowCountState, setRowCountState] = useState(pageInfo.totalRowCount || 0)

  useEffect(() => {
    setRowCountState((prevRowCountState) =>
      pageInfo.totalRowCount !== undefined ? pageInfo.totalRowCount : prevRowCountState
    )
  }, [pageInfo.totalRowCount, setRowCountState])

  const getRowId = (row: { [key: string]: any }) => row[store.key || 'id']

  const onRowSelectionModelChange = (newRowSelectionModel: Array<Key>) => {
    if (onFocusedRowChanged && typeof onFocusedRowChanged === 'function') {
      // let row = rows.find((item) => getRowId(item) === newRowSelectionModel[0]) || {};
      let rowList = rows.filter((item) => newRowSelectionModel.includes(getRowId(item)))
      let firstRow = rowList[0]
      onFocusedRowChanged({
        row: {
          data: firstRow,
          keyList: newRowSelectionModel,
          paginationModel: paginationModel,
        },
        component: {
          option: (key: OptionKey): object | undefined => {
            if (key === 'focusRowKey') {
              return getRowId(firstRow)
            } else if (key === 'focusRowOption') {
              let rowList = rows.filter((item) => newRowSelectionModel.includes(getRowId(item)))
              return rowList
            }
            return {}
          },
        },
      })
    }
  }

  const sxOptions = {
    ...(showBorders ? {} : { border: 'none' }),
  }

  const onToolbarSearch = useCallback((values: object) => {
    setSearchValues(values)
  }, [])


  React.useImperativeHandle(ref, () => ({
    setFocusedRowKey: (rowKey: Key) => {
      apiRef.current.setRowSelectionModel([rowKey])
      setSelectedRowIds([rowKey])
    },
    setFocusedRowKeys: (rowKeys: Array<Key>) => {
      if (rowKeys) {
        apiRef.current.setRowSelectionModel([...rowKeys])
        setSelectedRowIds([...rowKeys])
      }
    },
    getSelectedRowIds: () => {
      return selectedRowIds
    },
    getRow: (rowKey: Key): object | undefined => {
      return rows.find((item) => getRowId(item) === rowKey)
    },
    refresh: () => {
      setForceUpdate(!forceUpdate)
    },
  }))

  return (
    <Box sx={{ height: '100%', width: '100%' }}>
      <StyledDataGrid
        apiRef={apiRef}
        sx={sxOptions}
        columns={appliedColumns}
        getRowId={getRowId}
        disableColumnFilter
        disableColumnSelector
        disableDensitySelector
        // pagination
        slots={{
          toolbar: () =>
            EasyToolbar({
              columns: appliedColumns,
              values: searchValues,
              toolbar,
              showAddButton,
              showRefresh,
              onAddRow,
              onSearch: onToolbarSearch,
              onRefresh: () => setForceUpdate(!forceUpdate),
            }),
          pagination: disablePagination ? null : EasyPagination,
        }}
        hideFooter={disablePagination}
        pageSizeOptions={[pageSize]}
        rowCount={rowCountState}
        paginationMode="server"
        onPaginationModelChange={handlePaginationModelChange}
        paginationModel={paginationModel}
        loading={isLoading}
        initialState={{
          pagination: { paginationModel: { pageSize } },
        }}
        onRowSelectionModelChange={onRowSelectionModelChange}
        getRowClassName={(params: GridRowClassNameParams) => (params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd')}
        {...rest}
        rows={rows}
      />
    </Box>
  )
})

export default EasyDataGrid
