import { request, METHOD } from "@/utils/request";
import { CONFIG_OSS } from '@/services/api'

let UploadAliOss = {
    install(Vue) {
        Vue.prototype.$uploadAliOss = {
            randomString(len) {
                len = len || 32;
                var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'; /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
                var maxPos = $chars.length;
                var pwd = '';
                for (let i = 0; i < len; i++) {
                    pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
                }
                return pwd;
            },
            //字符串转base64
            encode: function(str) {
                // 对字符串进行编码
                var encode = encodeURI(str);
                // 对编码的字符串转化base64
                var base64 = Buffer.toString(encode);
                return base64;
            },
            /**
             * 上传文件到oss
             * @param file
             * @returns {Object}
             */
            uploadFile: function(file, success) {
                request(CONFIG_OSS, METHOD.GET, {})
                    .then(ossInfo => {

                        console.log('1>>>>', ossInfo);

                        let path = ossInfo.bucket + "/";
                        let expires = 100000;
                        let policyText = `{"expiration": "${expires}","conditions": [["content-length-range", 0, 1048576000]]}`;

                        let OSS = require('ali-oss');
                        // sdk提供的创建客户端实例方法
                        const client = new OSS({
                            'key': ossInfo.bucket + file.name,
                            'region': 'oss-cn-hangzhou', // 创建Bucket时会选择不同地区，根据自己的选择填入对应名称
                            'policy': this.encode(policyText),
                            'bucket': 'wodan-idc', // 填入你的bucket名
                            'accessKeyId': ossInfo.accessKeyId, // 填入你的accessKeyId
                            'accessKeySecret': ossInfo.accessKeySecret, // 填入你的accessKeySecret
                            'stsToken': ossInfo.securityToken,
                            'domain': ossInfo.domain,
                        });

                        // console.log('3>>>>', client);

                        let Name = file.name;
                        const suffix = Name.substr(Name.indexOf('.')) // 文件后缀

                        const filename = path + this.randomString(4) + Date.parse(new Date()) + suffix; // 组成新文件名

                        client.multipartUpload(filename, file).then(res => { // 上传

                            let signUrl = client.signatureUrl(res.name, {
                                expires: expires,
                            });

                            signUrl = signUrl.split('?')[0];

                            console.log('图片地址', signUrl);

                            success(signUrl);

                        }).catch(err => {

                            console.log('上传失败：', err)
                        })
                    })
                    .catch(err => {
                        console.log(err);
                    });
            }
        }
    },
}

export default UploadAliOss