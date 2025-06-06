// import { request, METHOD } from '@/utils/request';
import { getStoreConfig, getObjectUrl, uploadVideoShow } from '@/api/CustomRequest.js';
import COS from 'cos-js-sdk-v5'

const ExpireTime = "ExpireTime";
const COSConfig = "COSConfig";
const FILE_DIR = {
  avatar: "avatar",
  videoShow: "videoShow",
}

let TencentCos = {
  install(Vue) {
    Vue.prototype.$tencentCos = {
      FILE_DIR,
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
      //字符串转base64
      encodeBase64: function (str) {
        // 对字符串进行编码
        var encode = encodeURI(str);
        // 对编码的字符串转化base64
        var base64 = Buffer.toString(encode);
        return base64;
      },
      decodeBase64: function (str) {
        // 对字符串进行编码
        var encode = encodeURI(str);
        // 对编码的字符串转化base64
        var base64 = Buffer.toString(encode);
        return base64;
      },
      getCos: async function () {

        let config = await this.getLocalStoreConfig();
        if (config == null) {
          return;
        }

        const cos = new COS({
          // Protocol: 'http://localhost:' + process.env.VUE_APP_SERVER_PORT + '/cos',
          // Domain: 'xhsc-1352320440.cos.ap-guangzhou.myqcloud.com',
          SecretId: config.secretId, // sts服务下发的临时 secretId
          SecretKey: config.secretKey, // sts服务下发的临时 secretKey
          SecurityToken: config.securityToken, // sts服务下发的临时 SessionToken
          StartTime: config.startTime, // 建议传入服务端时间，可避免客户端时间不准导致的签名错误
          ExpiredTime: config.SecurityToken, // 临时密钥过期时间
          // ForceSignHost: false, // 关闭 Host 签名验证
          // Debug: true, // 打印请求日志
        });

        return {
          config,
          cos
        };
      },
      getFileUrl: async function (key, expire) {
        try {

          const {
            cos,
            config
          } = await this.getCos();

          console.log(">>>>> ", config);

          const url = cos.getObjectUrl({
            Bucket: config.bucketName, // 填入您自己的存储桶，必须字段
            Region: config.region, // 存储桶所在地域，例如 ap-beijing，必须字段
            Key: key, // 存储在桶里的对象键（例如1.jpg，a/b/test.txt），支持中文，必须字段
            Sign: true,
            Expires: expire,
            Query: {
              'x-cos-security-token': config.securityToken, // 临时密钥需显式传递
            },
          });
          // return await getStoreFileWithKey(key, expire);
          console.log(key, expire)
          console.log(">>> url", url)

          return url
        } catch (error) {
          console.log(error);

          return null;
        }
      },
      getOnlineStoreConfig: async function () {
        let config = null;
        try {
          let res = await getStoreConfig();
          config = res.data;
          window.localStorage.setItem(ExpireTime, config.expiredTime);
          window.localStorage.setItem(COSConfig, JSON.stringify(config));

          console.log(">>> 请求配置信息", config)
        } catch (error) {
          console.log(">>> 请求配置信息出错", error)
        }

        return config;
      },
      getLocalStoreConfig: async function () {
        console.log(">>> 开始获取腾讯云配置信息")

        let config = null;
        try {
          let expire = window.localStorage.getItem(ExpireTime);
          let t = Date.now().valueOf() / 1000;

          console.log(">>> 本地当前时间", t)
          console.log(">>> 配置过期时间", expire)
          if (expire || expire > t) {
            let conf = window.localStorage.getItem(COSConfig);
            if (!conf) {
              config = await this.getOnlineStoreConfig();
            }
            else {
              config = JSON.parse(conf);
              console.log(">>> 获取本地配置信息", config)
            }
          }
          else {
            config = await this.getOnlineStoreConfig();
          }
        } catch (error) {
          console.log(">>> 获取配置失败", error)
        }

        return config;
      },
      /**
       * 上传文件到oss
       * @param file
       * @returns {Object}
       */
      uploadFile: async function (file, fileDir, progress) {
        console.log(file);

        try {
          const {
            cos,
            config
          } = await this.getCos();

          let fileKey = "xhsc/" + "fileDir" + "/" + "1.jpg";

          console.log(">>>> fileKey", fileKey);

          const data = await cos.uploadFile({
            Bucket: config.bucketName, // 填入您自己的存储桶，必须字段
            Region: config.region,  // 存储桶所在地域，例如 ap-beijing，必须字段
            Key: fileKey,  // 存储在桶里的对象键（例如1.jpg，a/b/test.txt），必须字段
            Body: file, // 必须，上传文件对象，可以是 input[type="file"]标签选择本地文件后得到的 file 对象
            SliceSize: 1024 * 1024 * 5,     // 触发分块上传的阈值，超过5MB使用分块上传，默认 1MB，非必须
            ChunkSize: 1024 * 1024, // 分块大小，默认 1MB，非必须
            onTaskReady: function (taskId) {  // 非必须
              console.log(taskId);
            },
            onProgress: function (progressData) { // 非必须
              console.log(JSON.stringify(progressData));
              progress();
            },
            // 支持自定义 headers 非必须
            Headers: {
              'x-cos-meta-test': 123
            },
          });

          console.log('上传成功', data);
        } catch (err) {

          console.log('上传失败', err);
        }
      },

      // 上传
      // uploadChange(file, res) {
      //   const Bucket = 'xhsc-1352320440';  /* 存储桶 */
      //   const Region = 'ap-guangzhou';  /* 存储桶所在地域，必须字段 */

      //   // SecretId 和 SecretKey请登录 https://console.cloud.tencent.com/cam/capi 进行查看和管理
      //   const cos = new COS({
      //     SecretId: '',
      //     SecretKey: '',
      //   });

      //   const Prefix = "avatar/"; // 文件夹前缀
      //   const files = [file];
      //   const uploadFileList = [...files].map((file) => {
      //     const path = file.webkitRelativePath || file.name;
      //     return {
      //       Bucket,
      //       Region,
      //       Key: Prefix + path,
      //       Body: file,
      //     }
      //   });
      //   cos.uploadFiles({
      //     files: uploadFileList,
      //     SliceSize: 1024 * 1024 * 10,    /* 设置大于10MB采用分块上传 */
      //     onProgress: function (info) {
      //       var percent = parseInt(info.percent * 10000) / 100;
      //       var speed = parseInt(info.speed / 1024 / 1024 * 100) / 100;
      //       console.log('进度：' + percent + '%; 速度：' + speed + 'Mb/s;');
      //     },
      //     onFileFinish: function (err, data, options) {
      //       console.log(options.Key + '上传' + (err ? '失败' : '完成'));
      //     },
      //   }, (err, data) => {
      //     if (err) {
      //       console.log('上传失败', err);
      //       return;
      //     }
      //     // // 刷新列表前初始化
      //     // this.hasMore = false;
      //     // this.Marker = '';
      //     // this.getFileList();
      //   });
      // },
      uploadVideo: async function (file) {
        let res = await uploadVideoShow(file);
        console.log(res);
      },
      getFileUrl2: async function () {
        let res = await getObjectUrl();
        console.log(res);
      },
    };
  },
};

export default TencentCos;
