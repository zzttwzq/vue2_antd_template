import Vue from 'vue';
import Router from 'vue-router';
import { formatRoutes } from '@/utils/routerUtil';

Vue.use(Router);

// 不需要登录拦截的路由配置
const loginIgnore = {
  names: ['404', '403'], //根据路由名称匹配
  paths: ['/login', '/testpage', '/register'], //根据路由fullPath匹配
  /**
   * 判断路由是否包含在该配置中
   * @param route vue-router 的 route 对象
   * @returns {boolean}
   */
  includes(route) {
    return this.names.includes(route.name) || this.paths.includes(route.path);
  },
};

/**
 * 初始化路由实例
 * @returns {VueRouter}
 */
function initRouter() {
  const options = require('./local').default;
  formatRoutes(options.routes);
  return new Router(options);
}

function addDynamicRoutes(router, fromMenus) {

  // 处理动态路由
  const formatRoutes = (menus) => {
    return menus.map(menu => {
      const route = {
        path: menu.path,
        name: menu.path,
        component: () => import(`@/pages${menu.component}`),
        meta: {
          title: menu.title,
          icon: menu.icon
        },
        visible: menu.visible,
      }
      if (menu.children && menu.children.length > 0) {
        route.children = formatRoutes(menu.children)
      }
      return route
    })
  }

  // 获取动态路由
  const dynamicRoutes = formatRoutes(fromMenus)

  // 将动态路由添加到路由表中
  router.addRoutes(dynamicRoutes)
}

export { loginIgnore, initRouter, addDynamicRoutes };
