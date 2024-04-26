import React, { useContext } from 'react'

import { Box } from '@mui/material'

import { StateContext } from './context/StateContext'

export default function CustomContainer() {
  let ctx = useContext(StateContext)
  return (
    <Box
      sx={{
        width: '100%',
        height: 'max-content',
        minHeight: '150px',
        backgroundColor: '#f9fafb',
        borderRadius: '10px',
        display: ctx?.containerState?.show ? 'block' : 'none',
      }}
    >
      {ctx?.containerState?.container()}
    </Box>
  )
}
