---
group:
  title: 组件
  order: 1
order: 8
toc: content
---

# 文件上传

```jsx
import React from 'react';
import { EasyUpload } from 'easy-material';
import DraggerBox from 'easy-material/EasyUpload/DraggerBox';
import { Button } from '@mui/material';

export default () => {
  return (
    <EasyUpload
      maxCount={2}
      name="file"
      customRequest={() => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve({
              code: 200,
              data: '上传失败',
            });
          }, 2000);
        });
      }}
      onChange={(params) => {
        console.log(params);
      }}
    >
      <DraggerBox title="点击上传文件" message="点击上传文件" />
    </EasyUpload>
  );
};
```
