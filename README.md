<h1 align="center">vue_antd_template</h1>

## node 版本

v16.20.2

## 浏览器支持

现代浏览器及 IE10

## 使用

### yarn

```bash
$ yarn install
$ yarn dev
```

### or npm

```
$ npm install
$ npm run dev
```

## 项目介绍

### 项目目录

├── App.vue
├── assets 图片/字体/声音等资源
├── bootstrap.js 配置路由，请求拦截等
├── components 公共组件
├── config 公共配置
├── layouts 页面主体，侧边栏，导航栏等视图
├── main.js 入口文件
├── mock mock 数据
├── pages 页面
│   ├── components 页面内公共组件
│   ├── exception 报错页面，404，403 等
│   ├── login
│   │   ├── Login.vue 登陆页面
├── router
│   ├── async 异步路由
│   │   ├── config.async.js 异步固定的路由
│   │   └── router.map.js 异步路由表
│   ├── config.js 同步路由（暂时不用）
│   ├── local.js 本地路由
│   ├── i18n.js 多语言
│   └── index.js 路由入口
├── services 服务，请求封装（通过 npm run createApi 自动生成）和其他的服务
├── store 全局的 vuex
├── theme 全局的主题
└── utils 工具类
├── Objects.js
├── authority-utils.js
├── colors.js
├── formatter.js
├── i18n.js
├── imageUtil.js 图片处理；生成 upload 组件需要的 filelist，生成服务端要传的文件列表等
├── request.js
├── routerUtil.js
├── theme-color-replacer-extend.js
├── themeUtil.js
├── timeUtil.js 处理本地与服务端的时间格式
├── tools.js 通过字符串生成 select radio checkbox 等需要的 options 参数
├── uploadAliOss.js 上传文件到阿里 oss 工具
└── util.js
.env 环境配置文件
.env.development
package.json
vue.config.js
