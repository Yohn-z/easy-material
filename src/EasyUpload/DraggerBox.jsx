import FolderZipOutlinedIcon from '@mui/icons-material/FolderZipOutlined'
import { Grid } from '@mui/material'

export default function DraggerBox({ title, message, disabled, onClick }) {
  return (
    <Grid
      onClick={onClick}
      sx={{
        border: '1px dashed #ccc',
        borderRadius: '4px',
        backgroundColor: 'rgba(0, 0, 0, 0.02)',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        p: 3,
        '&:hover': {
          border: disabled ? '1px dashed #ccc' : '1px dashed #1677ff',
          cursor: 'pointer',
        },
        '& p': {
          marginBottom: '5px',
        },
        fontSize: '14px',
      }}
    >
      <Grid>
        <FolderZipOutlinedIcon
          fontSize="large"
          sx={{
            width: '70px',
            height: '70px',
            color: disabled ? '#999' : '#1677ff',
          }}
        />
      </Grid>
      <p>{title}</p>
      <p
        style={{
          marginTop: '0',
          fontSize: '12px',
          color: '#999',
        }}
      >
        {message}
      </p>
    </Grid>
  )
}
