import React, { useEffect, useState } from 'react'

import { LoadingButton, LoadingButtonProps } from '@mui/lab'
import { Stack } from '@mui/material'

export interface ExtentButtonProps extends LoadingButtonProps {
  onClick: <T>(e: React.MouseEvent<T>) => Promise<any> | any
}

export interface ActionsProps {
  label?: string
  loading?: boolean
  hidden?: boolean
  props?: ExtentButtonProps
}

export interface ConfigProps {
  buttonSize?: number
  dividerMargin?: number
  buttonPadding?: number
}

export interface ButtonToolProps {
  actions: Array<ActionsProps>
}

export type ChangeListLoadingFuncType = (key: string, flag: boolean) => void

export default function ButtonTool({ actions = [] }: ButtonToolProps) {
  const [loadingMap, setLoadingMap] = useState<{
    [key: string]: boolean
  }>({})

  useEffect(() => {
    let actionsLength = actions.length

    for (let i = 0; i < actionsLength; i++) {
      let key = actions[i].label
      if (key) {
        loadingMap[key] = false
      }
    }
    setLoadingMap({
      ...loadingMap,
    })
  }, [actions])

  const changeActionsListLoading: ChangeListLoadingFuncType = (key, flag) => {
    setLoadingMap({
      ...loadingMap,
      [key]: flag,
    })
  }

  const customOnClick = <T,>(item: ActionsProps, func: ChangeListLoadingFuncType, e: React.MouseEvent<T>) => {
    if (item?.props?.onClick) {
      let result = item.props.onClick<T>(e)
      if (result?.then && item.label) {
        func(item.label, true)
        result.finally(() => {
          if (item.label) {
            func(item.label, false)
          }
        })
      }
    }
  }

  return (
    <Stack
      direction="row"
      spacing={1}
      sx={{
        marginBottom: '10px',
      }}
      component="div"
    >
      {actions.map((item, index) => {
        return (
          <React.Fragment key={index}>
            {item.hidden ? null : (
              <LoadingButton
                variant="outlined"
                loading={item.label ? loadingMap[item.label] : false}
                {...item.props}
                onClick={(e) => {
                  customOnClick<HTMLButtonElement>(item, changeActionsListLoading, e)
                }}
              >
                {item.label}
              </LoadingButton>
            )}
          </React.Fragment>
        )
      })}
    </Stack>
  )
}
