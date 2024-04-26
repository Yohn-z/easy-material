---
group:
  title: 组件文档
  order: 1
order: 7
toc: content
---

# 表格工具栏

```jsx
import React from 'react';
import { EasyToolBar } from 'easy-material';

export default () => {
  const tableToolBarConfig = {
    buttonToolConfig: {
      actions: [
        {
          label: '创建',
          props: {
            onClick: () => {},
          },
        },
        {
          label: '恢复',
          props: {
            onClick: () => {},
          },
        },
      ],
    },
    searchToolConfig: {
      actions: [
        {
          type: 'SelectInput',
          field: 'status',
          props: {
            options: [
              {
                label: '所有状态',
                value: 'all',
              },
              {
                label: '启用',
                value: '1',
              },
              {
                label: '停用',
                value: '2',
              },
            ],
          },
        },
        {
          type: 'SearchInput',
          field: 'name',
          props: {
            placeholder: '搜索数据别名',
          },
        },
        {
          type: 'TagSearch',
          field: 'tag',
          props: {
            label: '标签搜索',
          },
        },
        {
          type: 'RefreshIconButton',
          props: {
            onClick: () => {
              // tableRef.current.refresh();
            },
          },
        },
      ],
      onSearchChange: (ref) => {
        const { tableScope } = ref;
        tableScopeRef.current = tableScope;
        // tableRef.current.refresh();
      },
    },
  };

  return (
    <EasyToolBar>
      <EasyToolBar.ButtonTool {...tableToolBarConfig.buttonToolConfig} />
      <EasyToolBar.SearchTool {...tableToolBarConfig.searchToolConfig} />
    </EasyToolBar>
  );
};
```
