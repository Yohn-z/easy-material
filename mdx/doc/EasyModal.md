---
group:
  title: 组件文档
  order: 1
order: 6
toc: content
---

# 模态框

```jsx
import React from 'react';
import { EasyModal } from 'easy-material';
import { Button } from '@mui/material';

export default () => {
  const args = {
    onOK: () => {},
    onCancel: () => {},
    title: 'Are you sure?',
    message: 'Some contents...',
  };
  return (
    <>
      <Button
        variant="contained"
        color="primary"
        sx={{
          margin: '10px',
        }}
        onClick={() => {
          EasyModal.confirm({
            ...args,
            type: 'primary',
          });
        }}
      >
        Open Primary Confirm
      </Button>
      <Button
        variant="contained"
        color="success"
        sx={{
          margin: '10px',
        }}
        onClick={() => {
          EasyModal.confirm({
            ...args,
            type: 'success',
          });
        }}
      >
        Open Success Confirm
      </Button>
      <Button
        variant="contained"
        color="warning"
        sx={{
          margin: '10px',
        }}
        onClick={() => {
          EasyModal.confirm({
            ...args,
            type: 'warning',
          });
        }}
      >
        Open Warning Confirm
      </Button>
      <Button
        variant="contained"
        color="error"
        sx={{
          margin: '10px',
        }}
        onClick={() => {
          EasyModal.confirm({
            ...args,
            type: 'error',
          });
        }}
      >
        Open Error Confirm
      </Button>
    </>
  );
};
```
