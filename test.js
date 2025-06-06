var request = require('request');
var fs = require('fs');
// 导入内置模块
const { setInterval } = require('timers');

let utils = {
  /**
   * 请求接口
   * options 请求配置
   * @returns promise
   */
  request: async function (options) {
    return new Promise(function (resolve, reject) {
      request(options, function (err, res, body) {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          resolve(body);
        }
      });
    });
  },
  /**
   * 读取文件
   * filePath 文件路径
   * @returns promise
   */
  readFile: async function (filePath) {
    return new Promise(function (resolve, reject) {
      fs.readFile(filePath, function (error, data) {
        if (error) {
          console.log(`读取${filePath} 失败`);
          reject(error);
        } else {
          resolve(data);
        }
      });
    });
  },
  /**
   * 写入文件
   * filePath 文件路径
   * data 文件数据
   * @returns promise
   */
  writeFile: async function (filePath, data) {
    return new Promise(function (resolve, reject) {
      fs.writeFile(filePath, data, function (error, data) {
        if (error) {
          console.log(`写入${filePath} 失败`);
          reject(error);
        } else {
          console.log(`写入${filePath} 成功`);
          resolve();
        }
      });
    });
  },
  /**
   * 文件是否存在
   * filePath 文件路径
   * @returns promise
   */
  existFile: async function (filePath) {
    return fs.existsSync(filePath);
  },
  /**
   * 创建文件夹
   * filePath 文件路径
   * @returns promise
   */
  makeDir: async function (filePath) {
    return fs.mkdirSync(filePath);
  },

  /**
   * 读取文件夹信息
   * filePath 文件路径
   * @returns promise
   */
  readDir: async function (filePath) {
    return fs.readdirSync(filePath);
  },

  /**
   * 获取文件信息
   * filePath 文件路径
   * @returns promise
   */
  getFileInfo: async function (filePath) {
    let status = await fs.statSync(filePath);
    return status;
  },
  /**
   * 判断文件是否是文件
   * filePath 文件路径
   * @returns promise
   */
  isFile: async function (filePath) {
    let status = await fs.statSync(filePath);
    return status.isFile();
  },
  /**
   * 判断文件是否是文件夹
   * filePath 文件路径
   * @returns promise
   */
  isDir: async function (filePath) {
    let status = await fs.statSync(filePath);
    return status.isDirectory();
  },
  /**
   * 删除文件
   * filePath 文件路径
   * @returns promise
   */
  deleteFile: async function (filePath) {
    fs.unlinkSync(filePath);
  },
  getHeaders() {
    return {
      Accept: 'application/json,text/plain,*/*',
      'Accept-Encoding': 'gzip,deflate',
      'Accept-Language': 'zh-CN,zh;q=0.9',
      Connection: 'keep-alive',
      Host: 'xxx',
      Referer: 'http: //xxx/project/16/interface/api/452',
      'User-Agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36',
      Authorization:
        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNzE1NTcwNTY4LCJleHAiOjE3MTgxNjI1Njh9.chAITNmFsKDs5VILnCbMo8jdGAUdjATH1OY5FPJ2l4c',
    };
  },
};

async function timeout(timeout) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('ok');
    }, timeout);
  });
}

async function handleData(page, errorMap, list) {
  var cc = 0;
  for (var index = 0; index < list.length; index++) {
    let e = list[index];
    console.log(`< 处理 > Tag：${e['appVersion']} (${index}/100 * ${page}页) `);

    if (e['appVersion'].indexOf('NearHub') > -1) {
      // 计数要处理自己的数据，如果没有自己要处理的数据，则认为已经没有数据;

      console.log(
        `< 处理 > ID：${e['id']} 版本：${e['appVersion']} 时间：${e['createdAt']}`
      );

      let message = e['content']['message'];
      // console.log(`数据：${message}`);

      let info = '';
      let error = '';
      let errorTag = '';
      let count = 0;
      let count2 = 0;
      let dataType = '';
      let mesList = message.split('\n');
      // console.log(`数据11：${mesList[0]}`);

      /// 老版本数据上报
      if (message.indexOf('dateTime') > -1) {
        dataType = '新数据';
        mesList.map((it) => {
          if (it != '') {
            if (count < 8) {
              info += it + '\n';
            } else {
              // console.log(`< ... > ${it}`);
              if (it.indexOf('#0') > -1) {
                error += it.replace('#0', '\n#0') + '\n';
              } else {
                error += it + '\n';
              }
              if (count2 < 3) {
                errorTag += it;
              }

              count2++;
            }
          }
          count++;
        });
      }
      /// 新版本数据上报
      else {
        dataType = '老数据';
        info = mesList[0].split('errorString')[0];
        error = mesList[0].split('errorString')[1];
        errorTag = mesList[0].split('errorString')[1];
      }

      // console.log(`info：${info}`);
      // console.log(`error：${error}`);
      // console.log(`errorTag：${errorTag}`);

      let solved = false;
      if (
        (errorTag.indexOf("type '_Double' is not a subtype of type 'int'") >
          -1 &&
          errorTag.indexOf(
            ' RoomDataManager.handleMessage (package:nearhub/services/room_data_manager/room_data_manager.dart'
          ) > -1) ||
        errorTag.indexOf(
          'DrawEngineFuntionExtension.createThumbImgList (package:nearhub/services/draw/extensions/draw_engine_function_extension.dart:1978)'
        ) > -1 ||
        errorTag.indexOf(
          'new MessageModel.fromJson (package:nearhub/model/mess'
        ) > -1 ||
        errorTag.indexOf(
          '_UploadLoadingWidgetState.initState.<anonymous closure> (package:near'
        ) > -1 ||
        errorTag.indexOf('') > -1 ||
        errorTag.indexOf('') > -1 ||
        errorTag.indexOf('') > -1 ||
        errorTag.indexOf('') > -1 ||
        errorTag.indexOf('') > -1
      ) {
        solved = true;
      }

      if (errorMap[errorTag] == null || errorMap[errorTag] == undefined) {
        errorMap[errorTag] = {
          time: 1,
          solved: solved,
          info: info,
          error: message,
        };
      } else {
        errorMap[errorTag]['time'] += 1;
      }

      var s = await timeout(500);
      var optionDelete = {
        method: 'delete',
        url: `http://mosapi.auditoryworks.co:1339/content-manager/collection-types/api::error-report.error-report/${e['id']}`,
        headers: utils.getHeaders(),
      };
      var dataDelete = await utils.request(optionDelete);
      console.log(
        `< 删除 > ID：${e['id']} ${dataDelete != undefined} ${dataType}`
      );
      console.log(` `);

      cc++;
    }
  }

  return cc;
}

const main = async function () {
  var page = 1; // 起始页
  var pageSize = 100; // 每页多少条数据
  var pageLimit = 100; // 截止页
  var inLoop = 1; // 是否在循环中
  var zeroCount = 0; // 数据为0计数，大于两次就结束循环
  var errorMap = {};
  var timerCount = 0;

  while (inLoop) {
    console.log(`=============== 处理第${page}页`);

    var url = `http://mosapi.auditoryworks.co:1339/content-manager/collection-types/api::error-report.error-report?page=${page}&pageSize=${pageSize}&sort=id:DESC`;

    console.log(`url: ${url}`);

    var options = {
      method: 'get',
      url: url,
      headers: utils.getHeaders(),
    };

    var data2 = await utils.request(options);
    try {
      var list = JSON.parse(data2);
      list = list['results'];
      // console.log(">>> ", list);

      if (list != undefined) {
        if (list.length == 0) {
          zeroCount++;
        }

        if (zeroCount > 1) {
          inLoop == 0;
        }

        var count = await handleData(page, errorMap, list);
        if (count == 0) {
          inLoop = 0;
        }

        if (page >= pageLimit) {
          inLoop = 0;
        }

        console.log('>>>> ', page, count, inLoop);
      } else {
        console.log('[ error ] ', 'token过期.');
      }

      // page++;
    } catch (e) {
      console.log('>>>>error ', e);
    }
  }

  // console.log(`\n*************** 总用时：${timerCount}`);

  var contents = '';
  for (var key in errorMap) {
    // if (errorMap[key]["solved"]) {
    //     contents += `================================ 出现${errorMap[key]["time"]}次 < 已解决 > \n`;
    // } else {
    //     contents += `================================ 出现${errorMap[key]["time"]}次 \n`;
    // }
    contents += `================================ 出现${errorMap[key]['time']}次 \n`;
    // contents += errorMap[key]["info"];
    // contents += `\r\n  \r\n`;
    contents += errorMap[key]['error'];
    contents += '\n================================ \n\n';
  }

  utils.writeFile('error/' + Date.now().toString() + '.txt', contents);
};

main();
