let TimeUtil = {
  install(Vue) {
    Vue.prototype.$timeUtil = {
      searchTimeFormat(moment1, moment2) {
        if (typeof moment1 == 'number' && typeof moment2 == 'number') {
          console.log('111');
        } else {
          return 'test';
        }
      },
    };
  },
};

export default TimeUtil;
