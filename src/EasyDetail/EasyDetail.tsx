import React from 'react'

import { Box, Button, Divider, Grid, Typography } from '@mui/material'
import { ButtonProps } from '@mui/material'

let BOTTON_TEXT_SIZE = '13px'
let DETAIL_TEXT_SIZE = '14px'
let TITLE_TEXT_SIZE = BOTTON_TEXT_SIZE

export interface DetailExtentButtonProps extends ButtonProps {
  onClick: <T>(e: React.MouseEvent<T>) => Promise<any> | void
}

export interface DtailActionsProps {
  label?: string
  loading?: boolean
  props?: DetailExtentButtonProps
}

export interface RowsType {
  [key: string]: any
}

export interface ColumnsItemsProps {
  labelName: string
  field: string
  actions?: Array<DtailActionsProps>
  renderCell?: (params: {
    rows: RowsType,
  }) => void
}


export interface ContentProps {
  columns: Array<ColumnsItemsProps>
  type?: string
}
export type EasyDetailContentProps = {
  rows: RowsType
} & ContentProps


export interface EasyDetailProps {
  headerSlot?: React.ReactNode
  content?: Array<ContentProps>
  rows?: RowsType
}

export interface EasyDetailItemProps {
  config: ContentProps
  showDivider: boolean
  rows: RowsType
}

function EasyDetailContent({ columns, rows }: EasyDetailContentProps) {
  const isShowAction = columns.some((item) => !!item.actions)
  let layout = isShowAction
    ? {
        GridOne: 3,
        GridTwo: 5,
        GridThree: 4,
      }
    : {
        GridOne: 3,
        GridTwo: 9,
        GridThree: 0,
      }
  return (
    <>
      {columns.map((item) => (
        <Grid
          sx={{
            display: 'flex',
            fontSize: TITLE_TEXT_SIZE,
            margin: '2px 0',
            justifyContent: 'space-between',
            alignItems: 'start',
            minHeight: '30px',
            width: '100%',
            height: 'max-content',
            '& .MuiGrid-root.MuiGrid-item': {
              paddingTop: 0,
              paddingLeft: 0,
              height: '100%',
            },
          }}
          container
          key={item.field}
          spacing={2}
        >
          <Grid md={layout.GridOne} item>
            <Typography
              // variant="subtitle3"
              sx={{
                fontSize: DETAIL_TEXT_SIZE,
              }}
            >
              {item.labelName}
            </Typography>
          </Grid>
          <Grid
            md={layout.GridTwo}
            item
            sx={{
              fontSize: DETAIL_TEXT_SIZE,
            }}
          >
            {item.renderCell ? (
              <>
                {item.renderCell({
                  rows: rows,
                })}
              </>
            ) : (
              <>{rows[item.field] ?? '-'}</>
            )}
          </Grid>
          <Grid
            md={layout.GridThree}
            item
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              fontSize: DETAIL_TEXT_SIZE,
            }}
          >
            {item?.actions &&
              item.actions.map((item, index) => {
                return (
                  <Button
                    key={index}
                    variant="text"
                    sx={{
                      fontSize: BOTTON_TEXT_SIZE,
                      margin: '0 8px',
                      position: 'relative',
                      transform: 'translateY(-20%)',
                      minWidth: 'max-content',
                    }}
                    {...item.props}
                  >
                    {item.label}
                  </Button>
                )
              })}
          </Grid>
        </Grid>
      ))}
    </>
  )
}



function EasyDetailItem({ config, showDivider = true, rows }: EasyDetailItemProps) {
  const { type, columns } = config
  if (type !== 'group') {
    return null
  }
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <EasyDetailContent columns={columns} rows={rows} />
      {showDivider && (
        <Divider
          flexItem
          sx={{
            height: '100%',
            margin: '25px 0',
          }}
        />
      )}
    </Box>
  )
}

function EasyDetail({ headerSlot, content = [], rows = {} }: EasyDetailProps) {
  return (
    <Box
      sx={{
        fontSize: TITLE_TEXT_SIZE,
      }}
    >
      {headerSlot}
      <div
        style={{
          marginTop: headerSlot ? '26px' : '0',
        }}
      >
        {content.map((item, index) => {
          return (
            <EasyDetailItem key={index} config={item} showDivider={index < content.length - 1} rows={rows} />
          )
        })}
      </div>
    </Box>
  )
}

export default EasyDetail
