---
group:
  title: 组件文档
  order: 1
order: 5
toc: content
---

# 表单

初步开发中，代码如下...

```js
import React, { createContext, useContext, useMemo } from 'react';
import { Controller } from 'react-hook-form';

import { FormControl, Grid } from '@mui/material';

const formContext = createContext({});

function Form({ children, control, errors }) {
  const contextValue = useMemo(() => {
    return {
      control: control,
      errors: errors,
    };
  }, []);
  return (
    <formContext.Provider value={contextValue}>
      <form>{children}</form>
    </formContext.Provider>
  );
}

export function FormItem({
  children,
  colon,
  label,
  name = 'formName',
  defaultValue,
  rules,
}) {
  const { control } = useContext(formContext);
  return (
    <Grid container>
      <Grid item md={2}>
        <label form={name} className={`${colon ? 'colon' : ''}`}>
          {label}
        </label>
      </Grid>
      <Grid item md={10}>
        <FormControl>
          <Controller
            name={name}
            control={control}
            defaultValue={defaultValue}
            rules={rules}
            as={children}
          />
        </FormControl>
      </Grid>
    </Grid>
  );
}

export default Form;
```
