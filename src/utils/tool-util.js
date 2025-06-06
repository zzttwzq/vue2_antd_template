let toolUtil = {
  install(Vue) {
    Vue.prototype.$toolUtil = {
      /**
       * 字符串分割成 select等组件所用的数组
       * @param str 要分隔的字符串
       * @param sep 分隔符
       * @param same 标题和内容是否相同，false：采用0-n计数形式
       * @returns {Promise<AxiosResponse<T>>}
       */
      exportSelectOptions(str, sep, same) {
        let string = str;
        let array = string.split(sep);
        let array2 = {};
        let count = 0;
        array.map((it) => {
          // let item = {
          //     label: it,
          //     value: count + '',
          // }
          // array2.push(item);

          // if (same) {
          //     item.value = it;
          //     item.index = count;
          // }

          // let item = {};
          array2[count] = it;
          // array2.push(item);

          console.log(same);

          count++;
        });
        console.log(JSON.stringify(array2));
        return array2;
      },
    };
  },
};

export default toolUtil;

// import { exportSelectOptions } from "@/utils/tools";
// let data = exportSelectOptions("", ",", true);
// console.log('exportSelectOptions>>>', data);
