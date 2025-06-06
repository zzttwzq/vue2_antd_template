// import { hasAuthority } from '@/utils/authority-utils'
import { loginIgnore } from '@/router/index';
import { checkAuthorization } from '@/utils/request';
import NProgress from 'nprogress';

NProgress.configure({ showSpinner: false });

/**
 * 进度条开始
 * @param to
 * @param form
 * @param next
 */
const progressStart = (to, from, next) => {
  // start progress bar
  if (!NProgress.isStarted()) {
    NProgress.start();
  }
  next();
};

/**
 * 登录守卫
 * @param to
 * @param form
 * @param next
 * @param options
 */
const loginGuard = (to, from, next, options) => {
  const { message } = options;
  if (!loginIgnore.includes(to) && !checkAuthorization()) {
    message.warning('登录已失效，请重新登录');
    next({ path: '/login' });
  } else {
    next();
  }
};

/**
 * 权限守卫
 * @param to
 * @param form
 * @param next
 * @param options
 */
const authorityGuard = (to, from, next, options) => {
  // console.log('before each1', to);

  const { store } = options;
  // const permissions = store.getters['account/permissions']
  const roles = store.getters['account/roles'];

  // let path = to.path;
  let path1 = to.path.split('/');
  path1 = path1[path1.length - 1];

  let flag = roles.indexOf(path1) == -1 && path1 != 'login';
  let flag3 = roles.indexOf(path1) == -1 && path1 != 'register';
  let flag2 = !loginIgnore.includes(to);
  console.log('routering...', flag, flag2, flag3);

  // console.log('before each3', path1);
  // console.log('before flag', flag);
  // console.log('before flag2', flag2);
  // console.log('before each3', roles);
  // console.log('before each3', path1);

  // if (flag && flag2 && flag3) {
  //   message.warning(`对不起，暂无权限，请联系管理员！`);
  //   // next({ path: '/403' });
  // } else {
  //   next();
  // }
  next();
};

/**
 * 混合导航模式下一级菜单跳转重定向
 * @param to
 * @param from
 * @param next
 * @param options
 * @returns {*}
 */
const redirectGuard = (to, from, next, options) => {
  const { store } = options;
  const getFirstChild = (routes) => {
    const route = routes[0];
    if (!route.children || route.children.length === 0) {
      return route;
    }
    return getFirstChild(route.children);
  };
  if (store.state.setting.layout === 'mix') {
    const firstMenu = store.getters['setting/firstMenu'];
    if (firstMenu.find((item) => item.fullPath === to.fullPath)) {
      store.commit('setting/setActivatedFirst', to.fullPath);
      const subMenu = store.getters['setting/subMenu'];
      if (subMenu.length > 0) {
        const redirect = getFirstChild(subMenu);
        return next({ path: redirect.fullPath });
      }
    }
  }
  next();
};

/**
 * 进度条结束
 * @param to
 * @param form
 * @param options
 */
const progressDone = () => {
  // finish progress bar
  NProgress.done();
};

export default {
  beforeEach: [progressStart, loginGuard, authorityGuard, redirectGuard],
  afterEach: [progressDone],
};
