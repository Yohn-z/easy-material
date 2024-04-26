---
group:
  title: 组件文档
  order: 1
order: 4
toc: content
---

# 详情

```jsx
import React from 'react';
import { EasyDetail } from 'easy-material';

const detailConfig = {
  headerSlot: <h2>基本信息</h2>,
  content: [
    {
      type: 'group',
      columns: [
        {
          labelName: '名称',
          field: 'name',
          actions: [
            {
              label: '修改名称',
              props: {
                onClick: () => {},
              },
            },
          ],
        },
        {
          labelName: '状态',
          field: 'status',
          renderCell: (params) => {
            return params.rows.status ? (
              <div
                style={{
                  color: 'red',
                }}
              >
                异常
              </div>
            ) : (
              <div
                style={{
                  color: '#fff',
                  backgroundColor: '#999',
                  width: 'max-content',
                  padding: '2px 6px',
                  fontSize: '13px',
                  borderRadius: '4px',
                }}
              >
                正常
              </div>
            );
          },
        },
        {
          labelName: '标签',
          field: 'label',
        },
      ],
    },
    {
      type: 'group',
      columns: [
        {
          labelName: '数量',
          field: 'count',
        },
        {
          labelName: '备注',
          field: 'remark',
        },
      ],
    },
  ],
  rows: {
    name: '12312',
    status: 0,
    label: 'TEST',
    count: 1,
    remark:
      '一些内容...一些内容...一些内容...一些内容...一些内容...一些内容...一些内容...一些内容...一些内容...一些内容...一些内容...一些内容...一些内容...一些内容...一些内容...',
  },
};

export default () => <EasyDetail {...detailConfig} />;
```
