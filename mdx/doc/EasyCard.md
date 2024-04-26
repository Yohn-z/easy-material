---
group:
  title: 组件文档
  order: 1
order: 2
toc: content
---

# 卡片

```jsx
import React from 'react';
import { EasyCard, EasyDetail, EasyCardContent } from 'easy-material';

const detailConfig = {
  content: [
    {
      type: 'group',
      columns: [
        {
          labelName: '姓名',
          field: 'name',
        },
        {
          labelName: '年龄',
          field: 'age',
        },
        {
          labelName: '标签',
          field: 'label',
          actions: [
            {
              label: '修改标签',
              props: {
                onClick: () => {},
              },
            },
          ],
        },
      ],
    },
    {
      type: 'group',
      columns: [
        {
          labelName: '邮箱',
          field: 'email',
        },
        {
          labelName: '个人简介',
          field: 'remark',
        },
      ],
    },
  ],
  rows: {
    name: '12312',
    age: 25,
    label: 'TEST',
    email: 'xiaowang@example.com',
    remark:
      '一些内容...一些内容...一些内容...一些内容...一些内容...一些内容...一些内容...一些内容...一些内容...一些内容...一些内容...一些内容...一些内容...一些内容...一些内容...',
  },
};

export default () => (
  <EasyCard
    title="卡片标题"
    desc={'描述信息'}
    defaultValue={0}
    sx={{ height: 'max-content' }}
  >
    <EasyCardContent title="基本信息">
      <EasyDetail {...detailConfig} />
    </EasyCardContent>
  </EasyCard>
);
```
