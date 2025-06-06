let ImageUtil = {
  install(Vue) {
    Vue.prototype.$imageUtil = {
      /**
       * 处理图片上传以后的内容
       * @param obj
       * @returns {Object}
       */
      handleUploadImage: function (obj, res) {
        // delete obj.originFileObj;
        // delete obj.thumbUrl;
        // delete obj.type;
        // delete obj.percent;
        // delete obj.lastModifiedDate;
        // delete obj.lastModifiedDate;
        obj.url = res;
        obj.status = 'done';
      },
      /**
       * 从接口中获取图片列表
       * @param list
       * @returns {list}
       */
      handleImages: function (list) {
        if (!list || list == '') {
          return [];
        }

        if (typeof list === 'string') {
          // list = [list];
          list = list.split(',');
        }

        let lt = [];
        list.map((it) => {
          let name = it.split('/');
          name = name[name.length - 1];
          let item = {
            uid: new Date().valueOf() + this.randomString(5),
            name: name,
            status: 'done',
            url: it,
          };

          lt.push(item);
        });

        return lt;
      },
      /**
       * 给接口生成图片列表
       * @param list
       * @returns {list}
       */
      getImages: function (list) {
        let lt = [];
        list.map((it) => {
          if (it.url) {
            lt.push(it.url);
          }
        });

        return lt;
      },
      randomString(len) {
        len = len || 32;
        var $chars =
          'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'; /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
        var maxPos = $chars.length;
        var pwd = '';
        for (let i = 0; i < len; i++) {
          pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
        }
        return pwd;
      },
    };
  },
};

export default ImageUtil;
