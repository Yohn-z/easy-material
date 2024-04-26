import { DataGridProps, GridColDef } from '@mui/x-data-grid'
import { GridValidRowModel } from '@mui/x-data-grid/models'
import * as React from 'react'

export type Key = string | number

export interface ToolbarItemProps {
  type?: string
  icon?: React.ReactElement
  tooltip?: string
  onClick?: () => void
}

interface ScopeItem {
  key: string
  value: unknown
}

export interface FetchProps {
  page: number
  pageSize: number
  keyword?: string
  scope?: ScopeItem[]
}

export interface PageInfo {
  totalRowCount?: number
}

interface FetchResult {
  total: number
  results: any
}

interface ResponseData<T = any> {
  code: number
  data: T
  msg: string
}

interface DataSourceProps {
  store: {
    key: string
    fetch?: (params: FetchProps) => Promise<ResponseData<FetchResult>>
    rows?: object[]
  }
}

export type OptionKey = 'focusRowOption' | 'focusRowKey' | undefined

interface RowChangedparams {
  row: {
    data: object | undefined
    keyList: Array<Key>
    paginationModel: FetchProps
  }
  component: { option: (key: OptionKey) => void }
}

type OnFocusedRowChangedFuncType = (params: RowChangedparams) => object

interface QueryOptions {
  values: object
  page: number
  pageSize: number
}

export interface QueryProps {
  dataSource: DataSourceProps
  queryOptions: QueryOptions
  forceUpdate: boolean
}

export interface SearchOptionsProps {
  value: string | number | undefined
  label: string
}

export type ExpandGridColDef<R extends GridValidRowModel = any, V = any, F = V> = GridColDef<R, V, F> & {
  search?: boolean
  searchOptions?: SearchOptionsProps[]
}

export type ColumnsType = Array<ExpandGridColDef>

export interface EasyDataGridProps extends Omit<DataGridProps, 'rows' | 'columns'> {
  pageSize?: number
  dataSource: DataSourceProps
  columns: ColumnsType
  focusedRowEnabled?: boolean
  focusedRowKeys?: Array<string | number>
  autoNavigateToFocusedRow?: boolean
  showBorders?: boolean
  showAddButton?: boolean
  showRefresh?: boolean
  disablePagination?: boolean
  toolbar?: any
  children?: React.ReactNode
  onAddRow?: (() => void) | undefined
  onFocusedRowChanged?: OnFocusedRowChangedFuncType
}

export interface GridRefProps {
  setFocusedRowKey?: (rowKeys: Key) => void
  setFocusedRowKeys?: (rowKeys: Array<Key>) => void
  getRow?: (rowKey: Key) => object | undefined
  refresh?: () => void
}

// export interface EasyDataGridComponent {
//   (
//     props: EasyDataGridProps & React.RefAttributes<HTMLDivElement>,
//   ): JSX.Element;
//   propTypes?: any;
// }
