import ImageUtil from '@/utils/image-util';
import TimeUtil from '@/utils/time-util';
// import UploadAliOss from '@/utils/upload-ali-oss'
import UploadTencentCos from '@/utils/upload-tencent-cos'
import ToolUtil from '@/utils/tool-util';
import { request } from '@/utils/request';

const PublicUtils = {
  install: function (Vue) {
    Vue.use(ImageUtil);
    Vue.use(TimeUtil);
    // Vue.use(UploadAliOss);
    Vue.use(UploadTencentCos);
    Vue.use(ToolUtil);

    Vue.prototype.$request = request;
  },
};

export default PublicUtils;
