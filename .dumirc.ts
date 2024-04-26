import { defineConfig } from 'dumi';

const repo = 'easy-material';

export default defineConfig({
  title: repo,
  hash: true,
  resolve: {
    // 配置 dumi 嗅探的文档目录
    docDirs: ['mdx'],
  },
  outputPath: 'docs',
  // github page
  base: `/${repo}/`,
  publicPath: `/${repo}/`,
  themeConfig: {
    name: 'Easy Material',
    title: 'Easy Material',
    nav: [{ title: '组件文档', link: '/doc/easy-button-list' }],
    footer: 'Copyright © Yohn-z. All rights reserved',
  },
});
