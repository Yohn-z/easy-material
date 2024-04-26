import MuiPagination from '@mui/material/Pagination'
import { GridPagination } from '@mui/x-data-grid'
import React from 'react'

interface PaginationComponentProps {
  page: number
  count: number
  rowsPerPage: number
  className: string
  onPageChange: (event: React.ChangeEvent<unknown>, newPage: number) => void
}

function PaginationComponent(props: PaginationComponentProps) {
  const { page, count, rowsPerPage, onPageChange, className } = props
  const pageCount = Math.ceil(count / rowsPerPage)

  const onChange = (event: React.ChangeEvent<unknown>, newPage: number) => {
    onPageChange(event, newPage - 1)
  }
  return (
    <MuiPagination
      color="primary"
      className={className}
      count={pageCount}
      page={page + 1}
      onChange={onChange}
    />
  )
}

export function EasyPagination(props: any) {
  return <GridPagination ActionsComponent={PaginationComponent} {...props} />
}
