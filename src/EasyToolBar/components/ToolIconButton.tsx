import React from 'react'

import { IconButton, Tooltip } from '@mui/material'
import { styled } from '@mui/material/styles'

interface ToolIconButtonProps {
  tooltip?: string
  onClick?: () => void
  icon?: React.ReactElement
}

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

const ToolIconButton = (props: ToolIconButtonProps) => {
  const { tooltip, onClick, icon } = props
  return (
    <Tooltip title={tooltip}>
      <StyledIconButton size="small" onClick={onClick}>
        {icon}
      </StyledIconButton>
    </Tooltip>
  )
}

export default ToolIconButton
