//// 全局组件
import AvatarList from '@/components/tool/AvatarList'
import StandardTable from "antdv-fast-table/standard-table";

import SimpleSearchView from "antdv-fast-table/simple-search-view/index";
import CustomFormItem from "antdv-fast-table/custom-form-item/index";
import CustomFormList from "antdv-fast-table/custom-form-list/index";
import FastTable from "antdv-fast-table/fast-table/";

const PublicComponents = {
    install: function(Vue) {
        Vue.component('AvatarList', AvatarList);
        Vue.component('StandardTable', StandardTable);

        Vue.component('SimpleSearchView', SimpleSearchView);
        Vue.component('CustomFormList', CustomFormList);
        Vue.component('CustomFormItem', CustomFormItem);
        Vue.component('FastTable', FastTable);
    }
}
export default PublicComponents