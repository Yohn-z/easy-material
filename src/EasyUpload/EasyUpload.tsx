import AttachFileOutlinedIcon from '@mui/icons-material/AttachFileOutlined'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
import LoadingButton from '@mui/lab/LoadingButton'
import { Grid, IconButton, Tooltip } from '@mui/material'
import { uniqueId } from 'lodash'
import React, { useRef, useState } from 'react'

interface RequestParamsProps {
  [key: string]: any
}

export type FileStatus = 'uploading' | 'success' | 'error'

export type FileType = any

export interface FileListItemProps {
  uid: string
  name?: string
  url?: string
  status?: FileStatus // 'uploading'
  tip?: string
  loading?: boolean
}

export interface ChangeParamsProps {
  file: FileListItemProps
  fileList?: Array<FileListItemProps>
  event?: React.ChangeEvent<HTMLInputElement>
}

export interface EasyUploadProps {
  accept?: string
  multiple?: boolean
  disabled?: boolean
  maxCount?: number
  name?: string
  beforeUpload?: (file: FileType) => boolean | Promise<boolean>
  customRequest?: (params: RequestParamsProps) => Promise<any>
  showUploadList?: boolean
  onChange?: (params: ChangeParamsProps) => void
  children: React.ReactElement
  fileList?: Array<FileListItemProps>
  onRemove?: (params: FileListItemProps) => void
}

function UploadFileList(props: { config: FileListItemProps; deleteUploadFileByUid: (uid: string) => void }) {
  const { config, deleteUploadFileByUid } = props

  const stausMap = {
    error: 'error.main',
    success: undefined,
    uploading: undefined,
  }

  return (
    <Tooltip title={config.tip} key={config.name}>
      <Grid
        sx={{
          display: 'flex',
          flexDirection: 'row',
          width: '100%',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '14px',
          color: stausMap[config.status || 'success'] || undefined,
          '& span': {
            verticalAlign: 'center',
            display: 'inline-block',
          },
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.02)',
            borderRadius: '4px',
            cursor: 'pointer',
          },
        }}
      >
        <div style={{ display: 'flex' }}>
          {config.loading ? (
            <LoadingButton loading={config.loading} variant="text" />
          ) : (
            <AttachFileOutlinedIcon
              fontSize="small"
              sx={{
                marginRight: '5px',
              }}
            />
          )}
          <span>{config.name}</span>
        </div>
        {!config.loading && (
          <IconButton
            onClick={() => {
              deleteUploadFileByUid(config.uid)
            }}
          >
            <DeleteOutlineOutlinedIcon
              fontSize="small"
              sx={{
                color: stausMap[config.status || 'success'] || undefined,
              }}
            />
          </IconButton>
        )}
      </Grid>
    </Tooltip>
  )
}

export default function EasyUpload(props: EasyUploadProps) {
  const {
    accept,
    multiple = false,
    disabled = false,
    maxCount = 1,
    name = 'file',
    beforeUpload,
    customRequest = null,
    children,
    showUploadList = true,
    onChange,
    fileList,
    onRemove,
  } = props
  const inputRef = useRef<HTMLInputElement | null>(null)

  const [uploadList, setUploadList] = useState<Array<FileListItemProps>>([])

  const addToUploadList = (item: FileListItemProps) => {
    let isMerge = false
    let newUploadList: Array<FileListItemProps> = []
    for (let upload of uploadList) {
      if (item.uid === upload.uid) {
        isMerge = true
        newUploadList.push({
          ...upload,
          ...item,
        })
      } else {
        newUploadList.push(upload)
      }
    }

    if (!isMerge) {
      let isOver = uploadList.length >= maxCount
      if (isOver) {
        newUploadList.shift()
        newUploadList.push(item)
      } else {
        newUploadList.push(item)
      }
    }
    setUploadList([...newUploadList])
  }

  const deleteUploadFileByUid = (uid: string) => {
    let newUploadList = uploadList.filter((item) => item.uid !== uid)
    setUploadList([...newUploadList])
    if (onRemove && typeof onRemove === 'function') { 
      onRemove({
        uid: uid
      })
    }

  }

  const handleOnChange = (curFile: FileListItemProps, e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange && typeof onChange === 'function') {
      onChange({
        file: curFile,
        fileList: uploadList,
        event: e,
      })
    }
  }

  const beforeUploadFile = async (file: FileType) => {
    if (beforeUpload) {
      try {
        const res = await beforeUpload(file)
        return !(typeof res === 'boolean' && !res)
      } catch (e) {
        return false
      }
    } else {
      return true
    }
  }

  const uploadFile = async (file: FileType, callback: (flag: FileStatus, tip: string) => void) => {
    if (!(await beforeUploadFile(file))) return
    const formData = new FormData()
    formData.append(name, file)
    customRequest?.(formData)
      .then((res) => {
        if (res.code === 200) {
          callback('success', '上传成功！')
        }
      })
      .catch((error) => {
        let msg = error.data ? error.data.msg + ': ' + error.data.data : '上传失败！'
        callback('error', msg)
      })
  }

  const fileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files || []

    if (files.length === 1) {
      let curFile: FileListItemProps = {
        uid: uniqueId('easy_'),
        name: files[0].name,
        url: '',
        status: 'uploading', // 'uploading'
        tip: '',
        loading: true,
      }

      handleOnChange(curFile, e)
      
      if(!fileList) {
        addToUploadList(curFile)
        uploadFile(files[0], (flag: FileStatus, tip: string) => {
          curFile.status = flag
          curFile.tip = tip
          curFile.loading = false
          addToUploadList(curFile)
          handleOnChange(curFile, e)
        })
      }

      e.target.value = ''
    } else {
      console.error('暂不支持多文件上传！')
    }
  }

  const uploadClick = () => {
    if (disabled) return
    inputRef?.current?.click()
  }

  return (
    <Grid onClick={() => {}}>
      <input
        accept={accept}
        multiple={multiple}
        onChange={fileChange}
        type="file"
        ref={inputRef}
        style={{ display: 'none' }}
      />
      {React.Children.map<React.ReactElement, React.ReactElement>(children, (child) => {
        return React.cloneElement(child, {
          disabled: disabled,
          onClick: (...params: any[]) => {
            let result = true
            if(child?.props?.onClick) {
              result = child?.props?.onClick?.(...params)
            }
            if(result) {
             uploadClick()
            }
          },
        })
      })}
      {showUploadList && (
        <Grid
          sx={{
            margin: '10px 0',
          }}
        >
          {(fileList || uploadList).map((item) => {
            return (
              <UploadFileList key={item.uid} config={item} deleteUploadFileByUid={deleteUploadFileByUid} />
            )
          })}
        </Grid>
      )}
    </Grid>
  )
}
