import TabsView from '@/layouts/tabs/TabsView'
//### 自动生成的Routers1
//### 自动生成的Routers1

// 全局路由配置
// 内容路由需要添加在 首页 下面，如果要显示在侧边栏则需要添加 
// meta: {
//   invisible: true
// }
const routesConfig = [{
        path: '/login',
        name: '登录页',
        component: () =>
            import ('@/pages/login/Login')
    },
    {
        path: '*',
        name: '404',
        component: () =>
            import ('@/pages/exception/404'),
    },
    {
        path: '/403',
        name: '403',
        component: () =>
            import ('@/pages/exception/403'),
    }, {
        path: '/',
        name: '首页',
        component: TabsView,
        redirect: '/login',
        children: [{
                path: '/home',
                name: '首页',
                meta: {
                    icon: 'user'
                },
                component: () =>
                    import ('@/pages/home/'),
            },

            //### 自动生成的Routers2
            //### 自动生成的Routers2
        ]
    },
];

const options = {
    routes: routesConfig
}

export default options