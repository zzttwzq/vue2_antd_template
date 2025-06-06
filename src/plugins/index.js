import VueI18nPlugin from './i18n-extend';
import AuthorityPlugin from './authority-plugin';
import TabsPagePlugin from './tabs-page-plugin';

// import ElementUI from 'element-ui';
// import 'element-ui/lib/theme-chalk/index.css';
// 导入预览插件
import 'viewerjs/dist/viewer.css';
import VueViewer from 'v-viewer';
// import MavonEditor from "mavon-editor";
// import Viser from 'viser-vue'

const Plugins = {
  install: function (Vue) {
    Vue.use(VueI18nPlugin);
    Vue.use(AuthorityPlugin);
    Vue.use(TabsPagePlugin);

    // Vue.use(ElementUI);
    Vue.use(VueViewer);
    // Vue.use(Viser);
    // Vue.use(MavonEditor);
  },
};
export default Plugins;
