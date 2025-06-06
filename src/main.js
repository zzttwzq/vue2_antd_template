import Vue from 'vue';
import Antd from 'ant-design-vue';
import store from './store';
import './theme/index.less';
import 'animate.css/source/animate.css'
import bootstrap from '@/bootstrap';
import 'moment/locale/zh-cn';

import { initRouter } from './router';
import { initI18n } from '@/utils/i18n';

import App from './App.vue';

// 启用本地mock
import '@/mock';

/// 注入公共组件
import PublicInjector from '@/public-injector';
Vue.use(PublicInjector);

Vue.use(Antd);

/// 其他设置
Vue.config.productionTip = false;
const router = initRouter(store.state.setting.asyncRoutes);
const i18n = initI18n('CN', 'US');
bootstrap({ router, store, i18n, message: Vue.prototype.$message });

new Vue({
  router,
  store,
  i18n,
  render: (h) => h(App),
}).$mount('#app');
