import React, { useEffect, useRef, useState } from 'react'

import LoadingButton, { LoadingButtonProps } from '@mui/lab/LoadingButton'
import { Divider, Fade, Grid, IconButton, Menu, MenuItem, Stack } from '@mui/material'
import TextWidthCalculator from './utils/getHTMLTextStyleWidth'

const SMALL_TEXT_BUTTON_FONTSIZE = 12
const DIVIDER_MARGIN = 4
const BUTTON_PADDING = 6

export interface ExtentButtonProps extends LoadingButtonProps {
  onClick: <T>(e: React.MouseEvent<T>) => Promise<any> | any
}

export interface ActionsProps {
  label?: string
  loading?: boolean
  props?: ExtentButtonProps
}

export interface ConfigProps {
  buttonSize?: number
  dividerMargin?: number
  buttonPadding?: number
}

export interface EasyButtonListProps {
  actions: Array<ActionsProps>
  config?: ConfigProps
}

export type ChangeListLoadingFuncType = (index: number, flag: boolean) => void

export default function EasyButtonList({ actions = [], config = {} }: EasyButtonListProps) {
  const lock = useRef<boolean | undefined>()
  const stackRef = useRef<HTMLDivElement | null>(null)
  const {
    buttonSize = SMALL_TEXT_BUTTON_FONTSIZE,
    dividerMargin = DIVIDER_MARGIN,
    buttonPadding = BUTTON_PADDING,
  } = config
  const [actionsList, setActionsList] = useState<Array<ActionsProps>>([])
  const [menuList, setMenuList] = useState<Array<ActionsProps>>([])
  const [isShowMenu, setIsShowMenu] = useState(false)

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event?: React.MouseEvent<HTMLElement>) => {
    if (event?.currentTarget) {
      setAnchorEl(event?.currentTarget)
    }
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  useEffect(() => {
    if (lock.current) {
      return
    }
    let actionsLength = actions.length
    let parentEl = stackRef?.current?.parentElement
    let sumWidth = buttonPadding
    let hideFlag = actions.length
    let lastSumWidth = 0
    let textWidthCalculator = new TextWidthCalculator({
      fontSize: buttonSize,
    })
    for (let i = 0; i < actions.length; i++) {
      let text = actions[i].label
      actions[i].loading = false
      let curWidth = textWidthCalculator.getTextWidth(String(text))
      const dividerBlock = dividerMargin * 2 + 1
      const isLast = i === actions.length - 1
      let dividerWidth = !isLast ? dividerBlock : 0
      sumWidth += Number(curWidth) + buttonPadding * 2 + dividerWidth
      if (parentEl?.offsetWidth && sumWidth > parentEl.offsetWidth) {
        hideFlag = i
        if (lastSumWidth + dividerBlock + 16 > parentEl.offsetWidth) {
          hideFlag = hideFlag - 1
        }
        if (hideFlag <= 0) {
          hideFlag = 1
        }
        break
      }
      lastSumWidth = sumWidth
    }
    textWidthCalculator.destroyDom()

    let showMenu = !!(actionsLength > hideFlag)
    let actionsList = []

    for (let i = 0; i < hideFlag; i++) {
      if (!actions[i]) {
        break
      }
      actionsList.push(actions[i])
    }
    let menuList: Array<ActionsProps> = []
    if (showMenu) {
      menuList = actions.slice(hideFlag, actions.length)
    }
    setActionsList(actionsList)
    setMenuList(menuList)
    setIsShowMenu(showMenu)
  }, [actions])

  const changeActionsListLoading: ChangeListLoadingFuncType = (index, flag) => {
    let newActionsList = actionsList.map((item, i) => {
      if (index === i) {
        item.loading = flag
      }
      return item
    })
    setActionsList([...newActionsList])
  }

  const changeMenuListLoading: ChangeListLoadingFuncType = (index, flag) => {
    let newMenuList = menuList.map((item, i) => {
      if (index === i) {
        item.loading = flag
      }
      return item
    })
    setMenuList([...newMenuList])
  }

  const customOnClick = <T,>(
    item: ActionsProps,
    func: ChangeListLoadingFuncType,
    flagIndex: number,
    e: React.MouseEvent<T>
  ) => {
    if (item?.props?.onClick) {
      let result = item.props.onClick<T>(e)
      if (result?.then) {
        lock.current = true
        func(flagIndex, true)
        result.finally(() => {
          func(flagIndex, false)
          lock.current = false
        })
      }
    }
  }

  return (
    <Stack direction="row" sx={{ justifyContent: 'flex-start' }} ref={stackRef} component="div">
      <Grid
        sx={{
          display: 'flex',
          justifyContent: 'flex-start',
          fontSize: `${buttonSize}px`,
          transform: `translateX(-${buttonPadding}px)`,
        }}
      >
        {actionsList.map((item, index) => {
          return (
            <React.Fragment key={index}>
              <LoadingButton
                // variant="outlined"
                loading={item.loading}
                sx={{
                  fontSize: `${buttonSize}px`,
                  fontWeight: '700',
                  margin: '0',
                  minWidth: 'max-content',
                  padding: `2px ${buttonPadding}px`,
                }}
                {...item.props}
                onClick={(e) => {
                  customOnClick<HTMLButtonElement>(item, changeActionsListLoading, index, e)
                }}
              >
                {item.label}
              </LoadingButton>
              {(index < actionsList.length - 1 || isShowMenu) && (
                <Divider
                  sx={{
                    margin: `0 ${dividerMargin}px`,
                    height: '60%',
                    alignSelf: 'center',
                  }}
                  orientation="vertical"
                  variant="middle"
                  flexItem
                />
              )}
              {!!(isShowMenu && index === actionsList.length - 1) && (
                <>
                  <IconButton
                    aria-label="more"
                    id="long-button"
                    aria-controls={open ? 'fade-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    onClick={handleClick}
                    size="small"
                    sx={{
                      fontSize: `${buttonSize}px`,
                      margin: '0',
                      width: '22px',
                      height: '22px',
                      alignSelf: 'center',
                      [`& svg`]: {
                        width: '0.7em',
                        height: '0.7em',
                      },
                    }}
                  >
                    更多
                  </IconButton>
                  <Menu
                    id="fade-menu"
                    MenuListProps={{
                      'aria-labelledby': 'fade-button',
                    }}
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    TransitionComponent={Fade}
                    elevation={0}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'right',
                    }}
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    sx={{
                      fontSize: `${buttonSize}px`,
                    }}
                  >
                    {menuList.map((item, index) => {
                      return (
                        <MenuItem
                          // {...item.props}
                          key={item.label}
                          sx={{
                            fontSize: `${buttonSize}px`,
                            display: 'flex',
                            justifyContent: 'flex-start',
                          }}
                          disabled={item.loading}
                          onClick={(e) => {
                            customOnClick<HTMLLIElement>(item, changeMenuListLoading, index, e)
                          }}
                        >
                          {item.loading && (
                            <LoadingButton
                              loading={item.loading}
                              sx={{
                                fontSize: `${buttonSize}px`,
                                margin: '0',
                                minWidth: 'max-content',
                                padding: `2px 2px`,
                                marginRight: '10px',
                              }}
                            />
                          )}
                          {item.loading && <>&nbsp;</>}
                          {item.label}
                        </MenuItem>
                      )
                    })}
                  </Menu>
                </>
              )}
            </React.Fragment>
          )
        })}
      </Grid>
    </Stack>
  )
}
