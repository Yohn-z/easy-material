import { LoadingButton } from '@mui/lab'
import React, { useEffect } from 'react'
import { createRoot } from 'react-dom/client'

import { LoadingButtonProps } from '@mui/lab'
import {
  Box,
  Breakpoint,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Stack,
} from '@mui/material'

export type ButtonColor = 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning'

export interface EasyModalProps {
  title?: string
  footer?: React.ReactNode
  okText?: string
  cancelText?: string
  open: boolean
  onOK?: () => void
  confirmLoading?: boolean
  onCancel?: () => void
  okButtonProps?: LoadingButtonProps
  maxWidth?: Breakpoint | false
  children?: React.ReactNode
  afterOpenChange?: (open: boolean) => void
}

const EasyModal = (props: EasyModalProps) => {
  const {
    title,
    footer,
    okText = '确认',
    cancelText = '取消',
    open = false,
    onOK,
    confirmLoading,
    onCancel,
    okButtonProps,
    maxWidth,
    children,
    afterOpenChange,
  } = props

  useEffect(() => {
    if (afterOpenChange) {
      afterOpenChange(open)
    }
  }, [open])

  const okButtonPropsMerge: LoadingButtonProps = {
    color: 'primary',
    ...okButtonProps,
  }

  const handleConfirm = () => {
    if (onOK) {
      onOK()
    }
  }

  const handleCancel = () => {
    if (onCancel) {
      onCancel()
    }
  }

  const renderFooter = () => {
    if (footer === undefined) {
      return (
        <DialogActions sx={{ px: 2.5, pb: 2.5 }}>
          <Stack direction="row" spacing={2}>
            <Button color="primary" variant="outlined" onClick={handleCancel}>
              {cancelText}
            </Button>
            <LoadingButton
              variant="contained"
              loading={confirmLoading}
              onClick={handleConfirm}
              {...okButtonPropsMerge}
            >
              {okText}
            </LoadingButton>
          </Stack>
        </DialogActions>
      )
    } else {
      return footer
    }
  }

  return (
    <Dialog open={open} onClose={handleCancel} maxWidth={maxWidth} fullWidth sx={{ padding: 5 }}>
      <Box position="absolute" top={8} right={8}>
        <IconButton size="small" onClick={handleCancel}>
          X
        </IconButton>
      </Box>

      {title !== '' ? <DialogTitle>{title}</DialogTitle> : <DialogTitle sx={{ py: 2 }} />}

      <DialogContent sx={{ pb: 3 }}>{children}</DialogContent>
      {renderFooter()}
    </Dialog>
  )
}

export interface EasyModalConfirmProps {
  onOK: () => void
  onCancel: () => void
  type: ButtonColor
  title: string
  message: string
}

EasyModal.confirm = (props: EasyModalConfirmProps) => {
  const { onOK = () => {}, onCancel = () => {}, type = 'error', title, message } = props
  let id = 'easy-confirm'
  let parentRoot: HTMLElement | null = document.getElementById('root')
  let div: HTMLElement | null
  let root: any
  let open = true
  let confirmLoading = false

  function clear() {
    open = false
    if (parentRoot && div) {
      parentRoot.removeChild(div)
    }

    if (div) {
      div.innerHTML = ''
    }
    div = null
    setTimeout(() => {
      if (root) {
        root.unmount()
      }
    }, 0)
  }



  let easyModal = (action: {
    handleOk: () => void,
    handleClose: () => void
  }) => (
    <EasyModal
      okButtonProps={{
        color: type,
      }}
      title={title}
      open={open}
      onOK={() => action.handleOk()}
      confirmLoading={confirmLoading}
      onCancel={action.handleClose}
    >
      <Stack spacing={2}>
        <DialogContentText>{message}</DialogContentText>
      </Stack>
    </EasyModal>
  )

  function handleClose() {
    onCancel()
    clear()
  }

  function handleOk() {
    let result: any = onOK()
    console.log(result.then)
    if (result?.then) {
      confirmLoading = true
      root.render(easyModal({
        handleOk,
        handleClose
      }))
      result
        .then(() => {})
        .finally(() => {
          confirmLoading = false
          root.render(easyModal({
            handleOk,
            handleClose
          }))
          setTimeout(() => {
            clear()
          }, 300)
        })
    } else {
      clear()
    }
  }

  function initConfirm() {
    let JNConfirm = document.getElementById(id)
    if (JNConfirm) {
      div = JNConfirm
      div.innerHTML = ''
    } else {
      div = document.createElement('div')
      div.id = 'easy-confirm'
      if (parentRoot) {
        parentRoot.appendChild(div)
      }
    }
    open = true
    root = createRoot(div)
    root.render(easyModal({
      handleOk,
      handleClose
    }))
  }

  initConfirm()
}

export default EasyModal
