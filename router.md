## 项目路由配置

### 路由文件内容
    路由路径 cms-wefree/router/*

#### router
  - index.js  路由入口文件
  - local.js  本地路由文件
  - guards.js 路由守卫
  - i18n.js   多语言支持
  - router.map.js 路由组件映射
    - routerMap   映射整个路由内容，无法通过配置修改（* 被废弃）
    - componentMap  只映射组件，以后使用的方式
  - config.js 本地路由（* 被废弃）
  
#### utils/routerUtil.js 路由工具
  
```js
- loadRouter()  ///重新加载路由。
- praseRouter() ///解析路由，根据网络请求返回的路由参数来进行解析。
- formatRoutes() ///对齐路由的path 如果没有 / 则会添加上 /
- formatAuthority() ///解析路由的权限配置.
```

#### 路由本地添加
```js
/// 在local.js 文件中找到首页，在children 中添加内容
{
  path: '/',
  name: '首页',
  component: TabsView,
  redirect: '/login',
  children: [ 
    /// 新增的本地router
    {
      name: '编辑通告',
      path: 'tonggaoEdit',
      meta: {
        invisible: false,
        keepAlive: false // 不需要被缓存
      },
      component: tonggaoEdit
    }
  ]
}

添加完还需要在 router/index.js 里的 loginIgnore 里添加刚刚的router
可以选择 name 或者 path

完成以后刷新下页面即可
```
