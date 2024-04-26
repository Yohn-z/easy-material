import { defineConfig } from 'dumi';

export default defineConfig({
  outputPath: 'docs-dist',
  themeConfig: {
    name: 'Easy Material',
    nav: [
      { title: '组件文档', link: '/doc' },
    ],
    footer: 'Copyright © Yohn-z. All rights reserved',
  },
});
