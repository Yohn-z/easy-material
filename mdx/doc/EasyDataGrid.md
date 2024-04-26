---
group:
  title: 组件文档
  order: 1
order: 3
toc: content
---

# 表格

```jsx
import React from 'react';
import { EasyDataGrid } from 'easy-material';
import AddLinkIcon from '@mui/icons-material/AddLink';
import ManageSearchOutlinedIcon from '@mui/icons-material/ManageSearchOutlined';

const columns = [
  { field: 'id', headerName: 'ID', flex: 1 },
  { field: 'name', headerName: '名称', flex: 1 },
  {
    field: 'status',
    headerName: '状态',
    flex: 1,
    renderCell: (params) => {
      return params.row.status ? '正常' : '异常';
    },
  },
];

const dataSource = {
  store: {
    key: 'id',
    fetch: (props) => {
      return new Promise((resolve) => {
        const { page, pageSize } = props;
        setTimeout(() => {
          let data = [
            {
              id: 1,
              name: 'A',
              status: 1,
            },
            {
              id: 2,
              name: 'B',
              status: 0,
            },
            {
              id: 3,
              name: 'C',
              status: 1,
            },
            {
              id: 4,
              name: 'D',
              status: 1,
            },
            {
              id: 5,
              name: 'E',
              status: 0,
            },
            {
              id: 6,
              name: 'F',
              status: 1,
            },
            {
              id: 7,
              name: 'G',
              status: 1,
            },
          ];
          resolve({
            code: 200,
            msg: '',
            data: {
              results: data.slice(pageSize * (page - 1), pageSize * page),
              total: data.length,
            },
          });
        }, 100);
      });
    },
  },
};

const toolbar = [
  {
    icon: <AddLinkIcon />,
    type: 'custom',
    tooltip: '增加链接',
    onClick: () => {},
  },
  {
    icon: <ManageSearchOutlinedIcon />,
    type: 'custom',
    tooltip: '搜索',
    onClick: () => {},
  },
];

export default () => (
  <EasyDataGrid
    columns={columns}
    pageSize={5}
    dataSource={dataSource}
    showAddButton
    toolbar={toolbar}
  />
);
```
