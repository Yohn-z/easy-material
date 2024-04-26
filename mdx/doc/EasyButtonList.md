---
group:
  title: 组件文档
  order: 1
order: 1
toc: content
---

# 按钮列表

```jsx
import React from 'react';
import { EasyButtonList } from 'easy-material';

export default () => (
  <EasyButtonList
    actions={[
      {
        label: '修改',
        props: {
          onClick: () => {},
          color: 'inherit',
        },
      },
      {
        label: '操作',
        props: {
          onClick: () => {},
          color: 'primary',
        },
      },
      {
        label: '详情',
        props: {
          onClick: () => {},
          color: 'success',
        },
      },
      {
        label: '加入',
        props: {
          onClick: () => {},
          color: 'secondary',
        },
      },
      {
        label: '快速生成',
        props: {
          onClick: () => {},
          color: 'info',
        },
      },
      {
        label: '重置',
        props: {
          onClick: () => {},
          color: 'warning',
        },
      },
      {
        label: '删除',
        props: {
          onClick: () => {},
          color: 'error',
        },
      },
      {
        label: 'Loading',
        props: {
          loading: true,
          onClick: () => {},
        },
      },
      {
        label: '点击后异步加载',
        props: {
          color: 'primary',
          variant: 'outlined',
          onClick: () => {
            return new Promise((resolve) => {
              setTimeout(() => {
                resolve(true);
              }, 2000);
            });
          },
        },
      },
    ]}
  />
);
```
