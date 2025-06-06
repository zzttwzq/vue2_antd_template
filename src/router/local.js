import TabsView from '@/layouts/tabs/TabsView';
import PageView from '@/layouts/PageView';
console.log(PageView);

// 全局路由配置
// 内容路由需要添加在 首页 下面，如果要显示在侧边栏则需要添加
// meta: {
//   invisible: true
// }
const routesConfig = [
  {
    path: '/index',
    name: '首页',
    component: () => import('@/pages/index/'),
  },
  // {
  //   path: '/register',
  //   name: '登录页',
  //   component: () => import('@/pages/register/'),
  // },
  {
    path: '/login',
    name: '登录页',
    component: () => import('@/pages/login/Login'),
  },
  {
    path: '*',
    name: '404',
    component: () => import('@/pages/exception/404'),
  },
  {
    path: '/403',
    name: '403',
    component: () => import('@/pages/exception/403'),
  },
  {
    path: '/',
    name: '首页',
    component: TabsView,
    redirect: '/user/userManager',
    children: [
      {
        path: '/user',
        name: '用户管理',
        des: '用户管理',
        meta: {
          icon: 'user',
        },
        component: PageView,
        children: [
          {
            path: '/user/userManager',
            name: '平台用户',
            des: '平台用户',
            meta: {
              icon: '',
            },
            component: () => import('@/pages/User/UserManager'),
          },
          {
            path: '/user/siteManager',
            name: '分站合作',
            des: '分站合作',
            meta: {
              icon: '',
            },
            component: () => import('@/pages/User/SiteManager'),
          },
          {
            path: '/user/userInfo',
            name: '用户中心',
            des: '用户中心',
            meta: {
              icon: '',
              invisible: true
            },
            component: () => import('@/pages/User/UserInfo'),
          },
          {
            path: '/user/userCharge',
            name: '用户充值',
            des: '用户充值',
            meta: {
              icon: '',
              invisible: true
            },
            component: () => import('@/pages/User/UserCharge'),
          },
          {
            path: '/user/userComputeDetail',
            name: '用户充值详情',
            des: '用户充值详情',
            meta: {
              icon: '',
              invisible: true
            },
            component: () => import('@/pages/User/UserComputeDetail'),
          },
          {
            path: '/user/changePhone',
            name: '修改手机号',
            des: '修改手机号',
            meta: {
              icon: '',
              invisible: true
            },
            component: () => import('@/pages/User/ChangePhone'),
          },
          {
            path: '/user/paymentSuccess',
            name: '支付成功',
            des: '支付成功',
            meta: {
              icon: '',
              invisible: true
            },
            component: () => import('@/pages/User/PaymentSuccess'),
          },
        ],
      },
      {
        path: '/finance',
        name: '财务管理',
        des: '财务管理',
        meta: {
          icon: 'user',
        },
        component: PageView,
        children: [
          {
            path: '/finance/finaceManager',
            name: '收支记录',
            des: '收支记录',
            meta: {
              icon: '',
            },
            component: () => import('@/pages/Finance/FinanceManager'),
          },
          {
            path: '/finance/cashOutManager',
            name: '提现审核',
            des: '提现审核',
            meta: {
              icon: '',
            },
            component: () => import('@/pages/Finance/FinanceCashOutManager'),
          },
        ],
      },
      {
        path: '/order',
        name: '订单查询',
        des: '订单查询',
        meta: {
          icon: 'user',
        },
        component: PageView,
        children: [
          {
            path: '/order/historyOrder',
            name: '历史订单',
            des: '历史订单',
            meta: {
              icon: '',
            },
            component: () => import('@/pages/Order/OrderManager'),
          },
        ],
      },
      {
        path: '/operation',
        name: '运营管理',
        des: '运营管理',
        meta: {
          icon: 'user',
        },
        component: PageView,
        children: [
          {
            path: '/operation/videoList',
            name: '首页视频秀',
            des: '首页视频秀',
            meta: {
              icon: '',
            },
            component: () => import('@/pages/Operation/VideoManager'),
          },
          {
            path: '/operation/setting',
            name: '参数配置',
            des: '参数配置',
            meta: {
              icon: '',
            },
            component: () => import('@/pages/Operation/SettingManager'),
          },
          {
            path: '/operation/whiteList',
            name: '白名单配置',
            des: '白名单配置',
            meta: {
              icon: '',
            },
            component: () => import('@/pages/Operation/WhiteListManager'),
          },
        ],
      },
      {
        path: '/role',
        name: '角色管理',
        des: '角色管理',
        meta: {
          icon: 'user',
        },
        component: PageView,
        children: [
          {
            path: '/role/adminUserManager',
            name: '员工账号',
            des: '员工账号',
            meta: {
              icon: '',
            },
            component: () => import('@/pages/Role/AdminUserManager'),
          },
          {
            path: '/role/userRoleManager',
            name: '角色权限',
            des: '角色权限',
            meta: {
              icon: '',
            },
            component: () => import('@/pages/Role/UserRoleManager'),
          },
        ],
      },
      //### 自动生成 ###
      //### 自动生成 ###
    ],
  },
];

const options = {
  routes: routesConfig,
};

export default options;
