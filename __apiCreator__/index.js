var request = require('request');
var fs = require('fs');
var pinyin = require('pinyin');

const modeType = {
  yApiMode: 0,
  jsonFileMode: 1,
};

let configs = {
  mode: modeType.yApiMode, // 0 接口json数据  1 yapi url
  /// yapi 配置
  yapiProjectId: 16,
  yapiUserName: 'wuzhiqiang@jianke.cc',
  yapiPassword: 'wzq3778719',
  yapiLoginUrl: 'http://xxx/api/user/login',
  yapiListUrl: 'http://xxx/api/interface/list_menu?project_id=',
  yapiDetailUrl: 'http://xxx/api/interface/get?id=',
  yapiToken: '',
  /// 名称列表
  nameMap: {
    登录: 'login',
    公共分类: 'common',
    结算: 'settlement',
    通告: 'announce',
    项目: 'project',
    账号权限: 'role',
    名单: 'namelist',
    功能角色权限: 'authorization',
    部门账号管理: 'role_department',
    常用词库相关: 'common_words',
  },

  /// 请求方法
  methdoMap: {
    get: 'get',
    post: 'post',
    put: 'put',
    delete: 'delete',
  },

  /// creator 根目录配置
  applicationRootPath: './apiCreator/',

  /// json 配置
  jsonFilePath: '',

  /// 是否缓存json数据，适合多次生成或者调试代码
  cacheJson: false,

  /// 服务文件夹
  servicePath: './src/services/',
  // servicePath: './apiCreator/services/',

  /// mock文件夹
  mockPath: './src/mock/',
  // mockPath: './apiCreator/mocks/',

  /// api文件路径
  apiPath: './src/services/api.js',

  /// mock入口文件
  mockIndexPath: './src/mock/index.js',
};

let utils = {
  /**
   * 请求接口
   * options 请求配置
   * @returns promise
   */
  request: async function (options) {
    return new Promise(function (resolve, reject) {
      request(options, function (err, res, body) {
        let cookie = res.headers['set-cookie'];
        if (cookie) {
          let c1 = cookie[0];
          c1 = c1.toString().split(';');
          let c2 = cookie[1];
          c2 = c2.toString().split(';');

          configs.yapiToken = c1[0] + '; ' + c2[0];

          let path = configs.applicationRootPath + 'token.json';
          let d = {
            yapiToken: configs.yapiToken,
          };
          utils.writeFile(path, JSON.stringify(d));
        }

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
      Cookie: configs.yapiToken ? configs.yapiToken : '',
      Host: 'xxx',
      Referer: 'http: //xxx/project/16/interface/api/452',
      'User-Agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36',
    };
  },
};

let dataHandler = {
  getData: async function () {
    let dirPath = configs.applicationRootPath + 'json/';
    var flag = await utils.existFile(dirPath);
    /// 文件夹不存在创建文件夹
    if (!flag) {
      await utils.makeDir(dirPath);
    }

    /// 获取数据获取类型
    if (configs.mode == modeType.yApiMode) {
      return await this.checkYapiLogin();
    } else if (configs.mode == modeType.jsonFileMode) {
      return {};
    }
  },
  async yApiDataFetcher() {
    var options = {
      method: 'get',
      url: configs.yapiListUrl + configs.yapiProjectId,
      headers: utils.getHeaders(),
    };

    var filePath = configs.applicationRootPath + 'json/data.json';
    let has = await utils.existFile(filePath);
    let data = [];

    // 判断是否需要缓存，频繁请求太耗费资源
    if (configs.cacheJson) {
      // 文件存在就使用本地的数据
      if (has) {
        console.log(`${filePath}使用本地数据!`);
        data = await utils.readFile(filePath);
      } else {
        data = await utils.request(options);
        await utils.writeFile(filePath, data);
      }
    } else {
      data = await utils.request(options);
    }

    // console.log('>>>', data);

    data = JSON.parse(data);

    if (data.errcode == 0) {
      const glist = data.data;
      let list2 = await this.getApiList(glist);
      return list2;
    } else {
      let path = configs.applicationRootPath + 'token.json';
      await utils.deleteFile(path);
      await this.checkYapiLogin();
    }

    return [];
  },
  async getApiList(list) {
    let list2 = [];
    for (var i = 0; i < list.length; i++) {
      let element = list[i];

      var item = {
        name: element.name,
        fileName: pinyin(element.name),
        list: [],
        desc: element.desc,
        add_time: element.add_time,
        up_time: element.up_time,
      };

      list2.push(item);

      for (var j = 0; j < element.list.length; j++) {
        let element2 = element.list[j];

        var options = {
          method: 'get',
          url: configs.yapiDetailUrl + element2._id,
          headers: utils.getHeaders(),
        };

        var filePath =
          configs.applicationRootPath + 'json/data_' + element2._id + '.json';
        let data2 = [];

        // 判断是否需要缓存，频繁请求太耗费资源
        if (configs.cacheJson) {
          let has = await utils.existFile(filePath);
          // 文件存在就是用本地的数据
          if (!has) {
            data2 = await utils.request(options);
            await utils.writeFile(filePath, data2);
          } else {
            // console.log(`${filePath}使用本地数据!`);
            data2 = await utils.readFile(filePath);
          }
        } else {
          data2 = await utils.request(options);
        }
        data2 = JSON.parse(data2);

        if (data2.errcode == 0) {
          data2 = data2.data;

          let item2 = {
            status: data2.status,
            add_time: data2.add_time,
            up_time: data2.up_time,
            api_opened: data2.api_opened,
            method: data2.method,
            name: data2.title,
            description: data2.title,
            path: data2.path,
            req_params: data2.req_params, /// 路径参数
            req_query: data2.req_query, /// query参数
            req_body: data2.req_body_form, /// post参数
            res_body: data2.res_body, /// 返回结果 需解析
          };

          let req_body_other = {};
          if (data2.req_body_other && data2.req_body_other.length > 0) {
            req_body_other = JSON.parse(data2.req_body_other);
          }

          if (req_body_other && req_body_other.properties) {
            for (let key in req_body_other.properties) {
              let d = req_body_other.properties[key];
              let re = '0';
              if (req_body_other.required) {
                re = req_body_other.required.indexOf(key) > -1 ? '1' : '0';
              }

              let item = {
                required: re,
                name: key,
                type: d.type,
                example: '',
                desc: d.description,
              };

              if (item.type == 'array') {
                if (d.items.type == 'object') {
                  item.type = 'object';
                  item.object = d.items.properties;
                } else {
                  item.items = {
                    type: `${d.items.type}(${d.items.description})`,
                  };
                }
              } else if (item.type == 'object') {
                item.object = d.items.properties;
              }

              item2.req_body.push(item);
            }
          }

          if (data2.path.indexOf('announce/save') > -1) {
            // console.log('>>>11', item2);
            // console.log('>>>11', data2.path);
            // console.log('>>>22', item2.req_body);
            // console.log('>>>33', data2.req_body_other);
          }

          if (item2.res_body && item2.res_body.length > 0) {
            item2.res_body = JSON.parse(item2.res_body);
          } else {
            item2.res_body = {};
          }

          item.list.push(item2);
        }
      }
    }

    return list2;
  },
  async checkYapiLogin() {
    let path = configs.applicationRootPath + 'token.json';
    let tokenFileExist = await utils.existFile(path);

    console.log('tokenFileExist', tokenFileExist);

    if (tokenFileExist) {
      let obj = await utils.readFile(path);
      obj = JSON.parse(obj);
      configs.yapiToken = obj.yapiToken;

      return await this.yApiDataFetcher();
    } else {
      var options = {
        method: 'post',
        url: configs.yapiLoginUrl,
        headers: utils.getHeaders(),
        json: true,
        body: {
          email: configs.yapiUserName,
          password: configs.yapiPassword,
        },
      };
      await utils.request(options);

      return await this.yApiDataFetcher();
    }
  },
};

let fileCreatorUtils = {
  // 处理接口路径名称
  getApiPathName: function (path) {
    let pathname = path.replace(/\//g, '_');
    pathname = pathname.split('{')[0];
    pathname = pathname.replace(/\_api\_/g, '');
    pathname = pathname.replace(/-/g, '_');
    pathname = fileCreatorUtils.formatString(pathname);

    // console.log(pathname);

    return pathname;
  },
  // 处理接口路径
  getApiPath: function (path) {
    let pathname = path.split('/{')[0];
    pathname = pathname.replace(/\/api\//g, '');
    pathname = fileCreatorUtils.formatString(pathname);

    // console.log(pathname);

    return pathname;
  },
  // 删除多余的 / _ 等
  formatString: function (str) {
    let a = str.substr(0, 1);
    let b = str.substr(str.length - 1, str.length);

    if (a == '_') {
      str = str.substr(1, str.length - 1);
    }

    if (b == '_') {
      str = str.substr(0, str.length - 1);
    }

    return str;
  },
  // 获取mock 数据属性
  getMockObjectProperty: function (key, data, le) {
    let params = '';
    let propname = key.toLowerCase();
    if (propname.indexOf('id') > -1) {
      params += `${le}'${key}|+1': 0,\r\n`;
    } else if (propname.indexOf('datetime') > -1) {
      params += `${le}'${key}': '@DATETIME',\r\n`;
    } else if (propname.indexOf('date') > -1) {
      params += `${le}'${key}': '@DATE',\r\n`;
    } else if (propname.indexOf('time') > -1) {
      params += `${le}'${key}': '@TIME',\r\n`;
    } else if (propname.indexOf('logo') > -1) {
      params += `${le}'${key}': '@LOGO',\r\n`;
    } else if (propname.indexOf('desc') > -1) {
      params += `${le}'${key}': '@SAYING',\r\n`;
    } else if (
      data.type.indexOf('string') > -1 ||
      data.type.indexOf('name') > -1
    ) {
      params += `${le}'${key}': '@GOODS',\r\n`;
    } else if (propname.indexOf('integer') > -1) {
      params += `${le}'${key}|1-10000': 0,\r\n`;
    } else if (propname.indexOf('number') > -1) {
      params += `${le}'${key}|1-100.1-10': 0,\r\n`;
    } else if (propname.indexOf('boolean') > -1) {
      params += `${le}'${key}|1-2': true,\r\n`;
    }

    return params;
  },
  // 获取mock 数组数据
  getMockArrayProperty: function (key, data, le) {
    let params = '';
    let propname = key.toLowerCase();
    if (data.type.indexOf('string') > -1 || data.type.indexOf('name') > -1) {
      params += `${le}'@GOODS',\r\n`;
    } else if (propname.indexOf('integer') > -1) {
      params += `${le}@integer(10000),\r\n`;
    } else if (propname.indexOf('number') > -1) {
      params += `${le}@float(60, 100, 3),\r\n`;
    } else if (propname.indexOf('boolean') > -1) {
      params += `${le}@boolean(),\r\n`;
    }

    return params;
  },
  /// 获取params 参数的说明
  getParamsDocText: function (obj) {
    // * @param {string} title - 书本的标题.
    let request_params_string = '';
    let req = obj.required == '1' ? '*必须' : '非必须';

    if (request_params_string.indexOf(` ${obj.name} `) == -1) {
      if (obj.type == 'array') {
        request_params_string = ` * @param { ${obj.type ? obj.type : ''} } ${
          obj.name
        } - [ ${obj.items.type} ] ${req} ${obj.desc}\r\n`;
      } else if (obj.type == 'object') {
        request_params_string = ` * @param { ${obj.type ? obj.type : ''} } ${
          obj.name
        } - ${req} ${obj.desc}\r\n`;
      } else {
        request_params_string = ` * @param { ${obj.type ? obj.type : ''} } ${
          obj.name
        } - ${req} ${obj.desc}\r\n`;
      }
    }

    return request_params_string;
  },
  // 节点解析成service字符串
  objectNodePares: function (objList, level) {
    let le = '';
    let str1 = '';
    let str2 = '';
    for (let index = 0; index < level; index++) {
      le += '    ';
    }

    if (objList.title && objList.title == 'empty object') {
      level++;
    }

    if (objList.type == 'array') {
      for (var key in objList.items) {
        let data = objList.items;

        if (key != 'properties' && key != 'required') {
          if (data.type == 'array' || data.type == 'object') {
            str1 += `${le}${key} <${data.type}> - ${data.description} [\r\n`;
            str2 += `//${le}${key}[\r\n`;

            let res = fileCreatorUtils.objectNodePares(data, level++);
            if (res.str1) {
              str1 += res.str1;
            }
            if (res.str2) {
              str2 += res.str2;
            }

            str1 += `${le}]\r\n`;
            str2 += `//${le}]\r\n`;
          } else {
            str1 += `${le}${key} <${data.type}> - ${data.description}\r\n`;
            str2 += `//${le}${key}: "",\r\n`;
          }
        }
      }
    } else if (objList.type == 'object') {
      for (var key in objList.properties) {
        let data = objList.properties[key];
        if (data.type == 'array' || data.type == 'object') {
          str1 += `${le}${key} <${data.type}> - ${data.description} {\r\n`;
          str2 += `//${le}${key}{\r\n`;

          let res = fileCreatorUtils.objectNodePares(data, level++);
          if (res.str1) {
            str1 += res.str1;
          }
          if (res.str2) {
            str2 += res.str2;
          }

          str1 += `${le}}\r\n`;
          str2 += `//${le}}\r\n`;
        } else {
          str1 += `${le}${key} <${data.type}> - ${data.description}\r\n`;
          str2 += `//${le}${key}: "",\r\n`;
        }
      }
    }

    return {
      str1,
      str2,
    };
  },
  // 节点解析成mock字符串
  mockNodePares: function (objList, level) {
    let le = '';
    let str = '';
    for (let index = 0; index < level; index++) {
      le += '    ';
    }

    if (objList.title && objList.title == 'empty object') {
      level++;
    }

    if (objList.type == 'array' || objList.type == 'object') {
      let list = objList.items;
      if (objList.type == 'array') {
        list = objList.items;
      } else if (objList.type == 'object') {
        list = objList.properties;
      }

      for (var key in list) {
        let data = {};
        if (objList.type == 'array') {
          data = list;
        } else if (objList.type == 'object') {
          data = list[key];
        }

        if (data.type == 'array' || data.type == 'object') {
          if (data.type == 'array') {
            if (data.items.type == 'array') {
              str += `${le}'${key}|1-10': [[\r\n`;
            } else if (data.items.type == 'object') {
              str += `${le}'${key}|1-10': [{\r\n`;
            } else {
              str += `${le}'${key}|1-10': [\r\n`;
            }
          } else if (data.type == 'object') {
            str += `${le}'${key}': {\r\n`;
          }

          let res = fileCreatorUtils.mockNodePares(data, level++);
          if (res) {
            str += res;
          }

          if (data.type == 'array') {
            if (data.items.type == 'array') {
              str += `${le}]], \r\n`;
            } else if (data.items.type == 'object') {
              str += `${le}}], \r\n`;
            } else {
              str += `${le}], \r\n`;
            }
          } else if (data.type == 'object') {
            str += `${le}}, \r\n`;
          }
        } else {
          if (objList.type == 'array') {
            str += fileCreatorUtils.getMockArrayProperty(key, data, le);
          } else if (objList.type == 'object') {
            str += fileCreatorUtils.getMockObjectProperty(key, data, le);
          }
        }
      }
    }

    return str;
  },
  /// 生成/获取文档目录
  async createDirStruct(path, text, space) {
    let b = path.substr(path.length - 1, path.length);
    if (b == '/') {
      path = path.substr(0, path.length - 1);
    }

    path += '/';

    let dir = await utils.readDir(path);
    let spaceText = '';
    for (let index = 0; index < space; index++) {
      spaceText += '--';
    }

    for (let key in dir) {
      let name = dir[key];
      if (name && name.length > 0 && name != '/' && name != '.DS_Store') {
        let stats = await utils.getFileInfo(path + name);
        let isDir = await utils.isDir(stats);

        if (isDir && name != 'node_modules' && name != '.git') {
          console.log('>>>dir', name);
          // let txt = await this.createDirStruct(path + '/' + name, text, space + 1);
          // text += txt;
        } else {
          let isFile = await utils.isFile(stats);
          if (isFile) {
            // let _name = name.split('.')[0];
            console.log(name);
            // console.log(_name);
            // console.log(_name.length);
            text += `${spaceText}${name}'\r\n`;
          }
        }
      }
    }

    return text;
  },
};

let fileCreator = {
  /// 生成apis
  createApis: async function (list) {
    var filePath = configs.apiPath;
    var apiText = '\r\n';
    list.forEach((element) => {
      element.list.map((it) => {
        let pathname = fileCreatorUtils.getApiPathName(it.path);
        let path = fileCreatorUtils.getApiPath(it.path);

        let a = path.substr(0, 1);
        if (a != '/') {
          path = `/${path}`;
        }

        let text =
          '    ' + pathname.toUpperCase() + ': `${BASE_URL}/api' + path;

        if (apiText.indexOf(text) == -1) {
          apiText += text + '`, // ' + it.name + ' \r\n';
        }
      });
    });

    apiText += '    ';

    let data = await utils.readFile(filePath);

    let apidata = data.toString();
    apidata = apidata.split('//// ### 自动生成的代码 #### ////');
    apidata[1] = apiText;
    apidata = apidata.join('//// ### 自动生成的代码 #### ////');

    await utils.writeFile(filePath, apidata);
  },
  /// 生成mock入口
  createMockIndex: async function (list) {
    let filePath = configs.mockIndexPath;
    let text = '\r\n';

    list.forEach((element) => {
      // console.log(element.name);
      let txt = `import '@/mock/${
        configs.nameMap[element.name] + '_mock'
      }'\r\n`;
      if (text.indexOf(txt) == -1) {
        text += txt;
      }
    });

    let data = await utils.readFile(filePath);
    let apidata = data.toString();
    apidata = apidata.split('//// ### 自动生成的代码 #### ////');
    apidata[1] = text;
    apidata = apidata.join('//// ### 自动生成的代码 #### ////');

    await utils.writeFile(filePath, apidata);
  },
  /// 创建mock
  createMocks: async function (list) {
    let dirPath = configs.mockPath;
    var flag = await utils.existFile(dirPath);
    /// 文件夹不存在创建文件夹
    if (!flag) {
      await utils.makeDir(dirPath);
    }

    list.forEach(async (element) => {
      if (configs.mode == modeType.yApiMode) {
        await fileCreator.createYapiMock(element);
      } else if (configs.mode == modeType.jsonFileMode) {
      }
    });
  },
  createYapiMock: async function (data) {
    var filename = configs.nameMap[data.name];

    var text = '';
    var apiPaths = '';

    data.list.map((it) => {
      let params = '';
      let pathname = fileCreatorUtils.getApiPathName(it.path);

      /// request body解析
      let str = fileCreatorUtils.mockNodePares(it.res_body, 2);
      params += str;

      let apiPath = `${pathname.toUpperCase()}, `;
      if (apiPaths.indexOf(apiPath) == -1) {
        apiPaths += apiPath;
      }

      text += `
Mock.mock(${pathname.toUpperCase()}, '${it.method.toLowerCase()}', ({ body }) => {
    console.log(body)
                
    const dataArr = Mock.mock({
    'list|100': [{
${params}        }]
    }).list
            
    return dataArr
})\r\n`;
    });

    apiPaths = apiPaths.substr(0, apiPaths.length - 1);

    var totaltext = `import Mock from 'mockjs'
import { ${apiPaths} } from '@/services/api'
${text}
`;

    var filePath = configs.mockPath + filename + '_mock.js';
    await utils.writeFile(filePath, totaltext);
  },
  /// 创建服务
  createServices: async function (list) {
    let dirPath = configs.servicePath;
    var flag = await utils.existFile(dirPath);
    /// 文件夹不存在创建文件夹
    if (!flag) {
      await utils.makeDir(dirPath);
    }

    list.forEach(async (element) => {
      if (configs.mode == modeType.yApiMode) {
        await fileCreator.createYapiService(element);
      } else if (configs.mode == modeType.jsonFileMode) {
      }
    });
  },
  createYapiService: async function (data) {
    var filename = configs.nameMap[data.name];

    var text = '';
    var useText = '';
    var apiPaths = '';
    data.list.map((it) => {
      let pathname = fileCreatorUtils.getApiPathName(it.path);

      let request_params_string = '';
      let request_params_string2 = '';
      let request_params_string3 = '';

      /// url 请求参数
      it.req_params.map((it2) => {
        request_params_string += fileCreatorUtils.getParamsDocText(it2);
        request_params_string2 += `${it2.name}, `;
        request_params_string3 += ` + '/' + ${it2.name}`;
      });

      /// query 请求参数
      it.req_query
        ? it.req_query.map((it2) => {
            request_params_string += fileCreatorUtils.getParamsDocText(it2);
          })
        : [];

      // body 请求参数
      it.req_body
        ? it.req_body.map((it2) => {
            request_params_string += fileCreatorUtils.getParamsDocText(it2);
          })
        : [];

      /// 返回值解析
      let response_body_string = '';
      let { str1, str2 } = fileCreatorUtils.objectNodePares(it.res_body, 1);

      response_body_string += str1;

      /// 使用api注释
      useText += `\r\n// ${
        it.method.toLowerCase() + '_' + pathname
      }(${request_params_string2}{});\r\n`;

      /// 导入的api url
      let apiPath = `${pathname.toUpperCase()}, `;
      if (apiPaths.indexOf(apiPath) == -1) {
        apiPaths += apiPath;
      }

      /// 请求内容主体
      text += `
/**
 * ${it.description}
${request_params_string} 
 * @returns {
${response_body_string}  }
 */
export async function ${it.method.toLowerCase() + '_' + pathname}(${
        request_params_string2 + 'params'
      }) {
    return request(${
      pathname.toUpperCase() + request_params_string3
    }, METHOD.${it.method.toUpperCase()}, params ? params : {}, null)
} \r\n`;
    });

    apiPaths = apiPaths.substr(0, apiPaths.length - 1);

    text += `\r\n${useText}`;

    var name = '';
    for (let key in configs.nameMap) {
      const element = configs.nameMap[key];
      if (element == filename) {
        name = key;
      }
    }

    /// copyright 权限部分
    var copyright = `
/**
* @file ${name}数据接口导出模块.
* @copyright wzq
*/
\r\n
`;

    var filePath = `${configs.servicePath}${filename}_request.js`;
    var totaltext = `${copyright}import { ${apiPaths} } from '@/services/api' \r\nimport { request, METHOD } from '@/utils/request' \r\n ${text}`;

    await utils.writeFile(filePath, totaltext);
  },
  /// clean
};

const main = async function () {
  /// 获取数据
  let data = await dataHandler.getData();

  /// 生成 service 文件
  fileCreator.createServices(data);

  // / 生成 api 列表
  fileCreator.createApis(data);

  /// 生成本地 mock
  fileCreator.createMocks(data);

  /// 生成本地 mock 入口
  // fileCreator.createMockIndex(data);

  /// 生成 list

  /// 生成 form
};

main();
