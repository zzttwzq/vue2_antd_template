import Router from 'vue-router'
import localRouters from '@/router/local'
import { componentMap, routerMap } from '@/router/router.map'

import { mergeI18nFromRoutes } from '@/utils/i18n'
import deepMerge from 'deepmerge'

//应用配置
let appOptions = {
    router: undefined,
    i18n: undefined,
    store: undefined
}

/**
 * 设置应用配置
 * @param options
 */
function setAppOptions(options) {
    const { router, store, i18n } = options
    appOptions.router = router
    appOptions.store = store
    appOptions.i18n = i18n
}

/**
 * 加载路由
 */
function loadRoutes(routesConfigs) {

    // 应用配置
    const { router, store, i18n } = appOptions

    // 如果 routesConfig 有值，则更新到本地，否则从本地获取
    if (routesConfigs && routesConfigs.length > 0) {
        store.commit('account/setRoutesConfig', routesConfigs);
    } else {
        routesConfigs = store.getters['account/routesConfig']
    }

    // 本地路由
    let tempRouter = [];
    localRouters.routes.map(it => {
        tempRouter.push({
            ...it
        });
    });

    // 合并异步路由
    if (routesConfigs && routesConfigs.length > 0) {
        let list = parseRoutes(routesConfigs);

        // console.log('>>>tempRouter1', tempRouter);
        // console.log('>>>11', localRouters.routes[3].children);
        // console.log('>>>111', tempRouter[3].children);

        tempRouter[3].children = tempRouter[3].children.concat(list);

        // console.log('>>>tempRouter', tempRouter[3].children);
    }

    // console.log('>>>localRouters', localRouters);

    const finalRoutes = tempRouter;
    formatRoutes(finalRoutes);

    // console.log('>>>finalRoutes', finalRoutes);

    // console.log('>>>>>router.options1', router.options);

    router.options = {...router.options, routes: finalRoutes }

    // console.log('>>>>>router.options2', router.options);

    router.matcher = new Router({...router.options, routes: [] }).matcher
    router.addRoutes(finalRoutes);

    // 提取路由国际化数据
    mergeI18nFromRoutes(i18n, router.options.routes);

    // 初始化Admin后台菜单数据
    const rootRoute = router.options.routes.find(item => item.path === '/');
    // console.log('>>>>>', rootRoute);
    let menuRoutes = rootRoute && rootRoute.children

    // menuRoutes = menuRoutes.splice(3, 1);
    // console.log('>>>>>', menuRoutes);

    if (menuRoutes) {
        store.commit('setting/setMenuData', menuRoutes)
    }
}

/**
 * 根据 路由配置 和 路由组件注册 解析路由
 * @param routesConfig 路由配置
 * @param routerMap 本地路由组件注册配置
 */
function parseRoutes(routesConfigs) {

    let list = [];

    routesConfigs.map(it => {

        if (it.path && it.path.length > 0) {

            let route = {};

            if (typeof(it) == 'string') {
                if (routerMap[it.path]) {
                    route = routerMap[it.path];
                }

            } else if (typeof(it) == 'object') {

                route = {
                    ...it
                }

                // console.log('it.path', it.path);
                // console.log('componentMap', componentMap[it.path]);

                if (componentMap[it.path]) {
                    route.component = componentMap[it.path];
                }
            }

            if (route != {} && typeof(route.component) == "object") {
                if (it.children && it.children.length > 0) {
                    let list2 = parseRoutes(it.children);
                    route.children = list2;
                }

                list.push(route);
            }
        }
    });

    return list;
}

/**
 * 深度合并路由
 * @param target {Route[]}
 * @param source {Route[]}
 * @returns {Route[]}
 */
function deepMergeRoutes(target, source) {
    // 映射路由数组
    const mapRoutes = routes => {
        const routesMap = {}
        routes.forEach(item => {
            routesMap[item.path] = {
                ...item,
                children: item.children ? mapRoutes(item.children) : undefined
            }
        })
        return routesMap
    }
    const tarMap = mapRoutes(target)
    const srcMap = mapRoutes(source)

    // 合并路由
    const merge = deepMerge(tarMap, srcMap)

    // 转换为 routes 数组
    const parseRoutesMap = routesMap => {
        return Object.values(routesMap).map(item => {
            if (item.children) {
                item.children = parseRoutesMap(item.children)
            } else {
                delete item.children
            }
            return item
        })
    }
    return parseRoutesMap(merge)
}

/**
 * 格式化路由
 * @param routes 路由配置
 */
function formatRoutes(routes) {
    routes.forEach(route => {
        const { path } = route
        if (!path.startsWith('/') && path !== '*') {
            route.path = '/' + path
        }
    })

    formatAuthority(routes)
}

/**
 * 格式化路由的权限配置
 * @param routes 路由
 * @param pAuthorities 父级路由权限配置集合
 */
function formatAuthority(routes, pAuthorities = []) {
    routes.forEach(route => {
        const meta = route.meta
        const defaultAuthority = pAuthorities[pAuthorities.length - 1] || { permission: '*' }
        if (meta) {
            let authority = {}
            if (!meta.authority) {
                authority = defaultAuthority
            } else if (typeof meta.authority === 'string') {
                authority.permission = meta.authority
            } else if (typeof meta.authority === 'object') {
                authority = meta.authority
                const { role } = authority
                if (typeof role === 'string') {
                    authority.role = [role]
                }
                if (!authority.permission && !authority.role) {
                    authority = defaultAuthority
                }
            }
            meta.authority = authority
        } else {
            const authority = defaultAuthority
            route.meta = { authority }
        }
        route.meta.pAuthorities = pAuthorities
        if (route.children) {
            formatAuthority(route.children, [...pAuthorities, route.meta.authority])
        }
    })
}

/**
 * 从路由 path 解析 i18n key
 * @param path
 * @returns {*}
 */
function getI18nKey(path) {
    const keys = path.split('/').filter(item => !item.startsWith(':') && item != '')
    keys.push('name')
    return keys.join('.')
}

/**
 * 加载导航守卫
 * @param guards
 * @param options
 */
function loadGuards(guards, options) {
    const { beforeEach, afterEach } = guards
    const { router } = options
    beforeEach.forEach(guard => {
        if (guard && typeof guard === 'function') {
            router.beforeEach((to, from, next) => guard(to, from, next, options))
        }
    })
    afterEach.forEach(guard => {
        if (guard && typeof guard === 'function') {
            router.afterEach((to, from) => guard(to, from, options))
        }
    })
}

export { parseRoutes, loadRoutes, formatAuthority, getI18nKey, loadGuards, deepMergeRoutes, formatRoutes, setAppOptions }