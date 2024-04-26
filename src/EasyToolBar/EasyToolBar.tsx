import React from 'react'

import { Grid, Stack } from '@mui/material'

import ButtonTool from './ButtonTool'
import CustomContainer from './CustomContainer'
import SearchTool from './SearchTool'
import StateProvider from './context/StateContext'

export interface TableToolBarProps {
  children: React.ReactNode
}

export default function EasyToolBar(props: TableToolBarProps) {
  const { children } = props
  return (
    <StateProvider>
      <Stack>
        <Grid
          sx={{
            width: '100%',
            margin: '6px 0 0px',
            justifyContent: 'space-between',
          }}
          container
          spacing={1}
        >
          {children}
        </Grid>
        <CustomContainer />
      </Stack>
    </StateProvider>
  )
}

EasyToolBar.ButtonTool = ButtonTool
EasyToolBar.SearchTool = SearchTool
