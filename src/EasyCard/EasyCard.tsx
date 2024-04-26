import React, { createContext, useContext, useState } from 'react'
import { red } from '@mui/material/colors'
import {
  Box,
  Button,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Avatar,
  Tabs,
  Tab,
} from '@mui/material'
import { AvatarProps } from '@mui/material'

interface TabPanelProps {
  children: React.ReactNode
  value: number
  index: number
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  )
}

interface ItemContextProps {
  addItem?: AddItemFucType
}

const ItemContext = createContext<ItemContextProps>({})

interface ConfigAvatarProps {
  props?: AvatarProps
  children?: React.ReactNode
}

interface ActionsItemProps {
  label?: string
  onClick?: () => void
}

export interface EasyCardProps {
  title?: string
  desc?: string
  sx?: object
  actions?: Array<ActionsItemProps>
  children: React.ReactNode
  defaultValue?: number
  avatar?: ConfigAvatarProps
}

export interface EasyCardContentItem {
  title?: string
  children?: React.ReactNode
}

export interface TabItemsProps {
  [key: string]: EasyCardContentItem
}

export type AddItemFucType = (item: EasyCardContentItem) => void

export function useAddItem() {
  const { addItem } = useContext<ItemContextProps>(ItemContext)
  return addItem
}

export const EasyCard = (props: EasyCardProps) => {
  const { title, desc, sx, actions, children, defaultValue = 0, avatar = {
    props: {}
  } } = props
  const [value, setValue] = useState<number>(defaultValue)
  const [tabItems, setTabItems] = useState<TabItemsProps>({} as TabItemsProps)

  const addItem: AddItemFucType = (item: EasyCardContentItem) => {
    const curTabItems: TabItemsProps = { ...tabItems }
    const newKey = `tab-${item.title}`
    curTabItems[newKey] = item
    setTabItems({
      ...curTabItems,
    })
  }

  const handleChange = (event: React.SyntheticEvent, newValue: number): void => {
    setValue(newValue)
  }

  const a11yProps = (
    index: number
  ): {
    id: string
    'aria-controls': string
  } => {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    }
  }

  const renderTab = (item: EasyCardContentItem, idx: number) => {
    const { title } = item

    return <Tab key={`tab-${title}`} label={title} {...a11yProps(idx)} />
  }

  const renderTabContent = (item: EasyCardContentItem, idx: number) => {
    const { children } = item

    return (
      <TabPanel key={`tabpanel-${idx}`} value={value} index={idx}>
        {children}
      </TabPanel>
    )
  }

  return (
    <Card>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe" {...avatar.props}>
            {(avatar && avatar.children) ? <>{avatar.children}</> : title ? title.substring(0, 1) : ''}
          </Avatar>
        }
        title={title}
        subheader={desc}
      />
      <ItemContext.Provider value={{ addItem }}>{children}</ItemContext.Provider>
      <CardContent>
        <Box sx={{ width: '100%', ...sx }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={value} onChange={handleChange} aria-label="basic tabs">
              {Object.values(tabItems).map((item, idx) => renderTab(item, idx))}
            </Tabs>
          </Box>
          {Object.values(tabItems).map((item, idx) => renderTabContent(item, idx))}
        </Box>
      </CardContent>
      {actions && (
        <CardActions sx={{ float: 'right', mr: 4 }}>
          {actions.map((action) => (
            <Button key={action.label} size="small" onClick={action.onClick}>
              {action.label}
            </Button>
          ))}
        </CardActions>
      )}
    </Card>
  )
}
