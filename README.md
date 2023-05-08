<h1 align="center">vue2_antd_template</h1>

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
├── mock mock数据
├── pages 页面
│   ├── components 页面内公共组件
│   ├── exception 报错页面，404，403等
│   ├── login
│   │   ├── Login.vue 登陆页面
│   │   ├── changePassword.vue 修改密码
│   │   ├── editUserInfo.vue 编辑用户信息
│   ├── permission 权限管理
│   │   ├── department  部门管理
│   │   ├── role 角色管理
│   │   └── userAccount 账号管理
│   │   └── menu 菜单管理
│   └── project 项目管理
│       ├── add.vue 项目新增
│       ├── edit.vue 项目修改
│       ├── tonggaoAdd.vue 通告新增
│       └── tonggaoEdit.vue 通告修改
│       ├── detail 项目详情入口
│       ├── index.vue 项目列表
│       ├── projectDetail 项目详情
│       ├── projectNamelist 名单列表
│       │   ├── button_list_view.vue 
│       │   ├── index.vue 名单列表入口
│       │   ├── namelist_PR.vue pr角色页面
│       │   ├── namelist_administrator.vue admin角色页面
│       │   ├── namelist_business.vue 商务角色页面
│       │   ├── namelist_edit.vue 编辑模式页面
│       │   └── namelist_kocNick.vue koc页面
│       ├── projectProgress 项目进程
│       ├── projectSettlement 项目结算
│       │   ├── detail.vue 项目结算详情列表
│       │   └── index.vue 项目结算列表
├── router
│   ├── async 异步路由
│   │   ├── config.async.js 异步固定的路由
│   │   └── router.map.js 异步路由表
│   ├── config.js 同步路由（暂时不用）
│   ├── guards.js 路由守卫
│   ├── i18n.js 多语言
│   └── index.js 路由入口
├── services 服务，请求封装（通过 npm run createApi自动生成）和其他的服务
├── store 全局的vuex
├── theme 全局的主题
└── utils 工具类
    ├── Objects.js
    ├── apiCreator 自动生成 api请求类和apiurl等
    ├── authority-utils.js
    ├── colors.js
    ├── formatter.js
    ├── i18n.js
    ├── imageUtil.js 图片处理；生成upload组件需要的filelist，生成服务端要传的文件列表等
    ├── request.js
    ├── routerUtil.js
    ├── theme-color-replacer-extend.js
    ├── themeUtil.js
    ├── timeUtil.js 处理本地与服务端的时间格式
    ├── tools.js 通过字符串生成 select radio checkbox 等需要的options参数
    ├── uploadAliOss.js 上传文件到阿里oss工具
    └── util.js
.env 环境配置文件
.env.development
package.json
vue.config.js
docs 项目的一些其他介绍

