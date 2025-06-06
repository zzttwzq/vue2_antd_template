import { message } from 'ant-design-vue';
import axios from 'axios';
import Cookies from 'js-cookie';

// 跨域认证信息 header 名
const xsrfHeaderName = 'Authorization';

// axios.defaults.timeout = 16000
// axios.defaults.withCredentials = false
// axios.defaults.xsrfHeaderName = xsrfHeaderName
// axios.defaults.xsrfCookieName = xsrfHeaderName

// 认证类型
const AUTH_TYPE = {
  BEARER: 'Bearer',
  BASIC: 'basic', 
  AUTH1: 'auth1',
  AUTH2: 'auth2',
};

// http method
const METHOD = {
  GET: 'get',
  POST: 'post',
  PUT: 'put',
  DELETE: 'delete',
};

// 获取操作系统信息
function getOsInfo() {
  var userAgent = navigator.userAgent.toLowerCase();
  var name = 'Unknown';
  var version = 'Unknown';
  if (userAgent.indexOf('win') > -1) {
    name = 'Windows';
    if (userAgent.indexOf('windows nt 5.0') > -1) {
      version = 'Windows 2000';
    } else if (
      userAgent.indexOf('windows nt 5.1') > -1 ||
      userAgent.indexOf('windows nt 5.2') > -1
    ) {
      version = 'Windows XP';
    } else if (userAgent.indexOf('windows nt 6.0') > -1) {
      version = 'Windows Vista';
    } else if (
      userAgent.indexOf('windows nt 6.1') > -1 ||
      userAgent.indexOf('windows 7') > -1
    ) {
      version = 'Windows 7';
    } else if (
      userAgent.indexOf('windows nt 6.2') > -1 ||
      userAgent.indexOf('windows 8') > -1
    ) {
      version = 'Windows 8';
    } else if (userAgent.indexOf('windows nt 6.3') > -1) {
      version = 'Windows 8.1';
    } else if (
      userAgent.indexOf('windows nt 6.2') > -1 ||
      userAgent.indexOf('windows nt 10.0') > -1
    ) {
      version = 'Windows 10';
    } else {
      version = 'Unknown';
    }
  } else if (userAgent.indexOf('iphone') > -1) {
    name = 'Iphone';
  } else if (userAgent.indexOf('mac') > -1) {
    name = 'Mac';
  } else if (
    userAgent.indexOf('x11') > -1 ||
    userAgent.indexOf('unix') > -1 ||
    userAgent.indexOf('sunname') > -1 ||
    userAgent.indexOf('bsd') > -1
  ) {
    name = 'Unix';
  } else if (userAgent.indexOf('linux') > -1) {
    if (userAgent.indexOf('android') > -1) {
      name = 'Android';
    } else {
      name = 'Linux';
    }
  } else {
    name = 'Unknown';
  }
  return { name, version };
}

function getRequestHeader() {
  var { name, version } = getOsInfo();
  var time = new Date().valueOf();
  var headers = {
    "os": name + ' ' + version,
    "App-Version": '1.0.0',
    "Time-Stamp": time,
    "App-Store": 'web',
    'Content-Type': 'application/json',
  };

  if (localStorage.getItem(process.env.VUE_APP_USER_TOKEN_KEY)) {
    headers.Authorization = localStorage.getItem(
      process.env.VUE_APP_USER_TOKEN_KEY
    );
    headers["Site-No"] = localStorage.getItem(
      process.env.VUE_APP_SITE_NO_KEY
    );
  }

  return headers;
}

function handelSuccess(res, resolve, reject) {
  if (res.status == 200) {
    if (res.data.code == 200) {
      resolve(res.data.data ? res.data : res);
    } else {
      handelError(res, reject);
    }
  } else {
    handelError(res, reject);
  }
}

function handelError(err, reject) {
  pringLog(err, false);

  if (err && err.status == 401) {
    message.warning(`登录已失效！`);
    removeAuthorization();
    window.location.href = window.location.href.split('#')[0] + '#/login';
  } else if (err && err.status == 403) {
    message.warning(`登录已失效！`);
    removeAuthorization();
    window.location.href = window.location.href.split('#')[0] + '#/login';
  } else {
    if (err && err.data && err.data.msg && err.data.msg != '') {
      message.error(err.data.msg);
    }
  }

  reject(err);
}

function pringLog(res, success = true) {
  console.log(
    `============ ${res.config.url} ${success ? '成功' : '失败'} ============`
  );
  console.log(`[ headers ]`, res.config.headers);
  console.log(`[ timeout ]`, res.config.timeout);
  console.log(`[ method  ]`, res.config.method);
  console.log(`[ params  ]`, res.config.params);
  console.log(`[  data   ]`, res.config.data);
  console.log(`[ status  ]`, res.config.status);
  console.log(`[   res   ]`, res.data);
}

/**
 * axios请求
 * @param url 请求地址
 * @param method {METHOD} http method
 * @param params 请求参数
 * @returns {Promise<AxiosResponse<T>>}
 */
async function request(url, method, params) {
  // 创建axios实例
  const instance = axios.create();

  return new Promise(function (resolve, reject) {
    instance
      .request({
        url: url,
        method: method,
        // baseURL?: process.env.baseURL
        headers: getRequestHeader(),
        params: method == 'get' ? params : {},
        data: method != 'get' ? params : {},
        timeout: 100000,
      })
      .then((res) => {
        handelSuccess(res, resolve, reject);
      })
      .catch((err) => {
        let errCode = 0;
        if (err.message.indexOf('Request failed with status code 401') >= 0) {
          errCode = 401;
        } else if (
          err.message.indexOf('Request failed with status code 403') >= 0
        ) {
          errCode = 403;
        } else if (
          err.message.indexOf('Request failed with status code 50') >= 0
        ) {
          errCode = 500;
        }
        err.status = errCode;

        handelError(err, reject);
      });
  });
}

/**
 * axios上传文件请求
 * @param url 请求地址
 * @param params 请求参数
 * @returns {Promise<AxiosResponse<T>>}
 */
async function uploadFile(url, data) {
  return new Promise(function (resolve, reject) {
    let headers = getRequestHeader();
    headers['Content-Type'] = 'multipart/form-data';

    axios
      .request({
        url: url,
        method: 'POST',
        headers: headers,
        data: data,
        timeout: 16000,
      })
      .then((res) => {
        handelSuccess(res, resolve, reject);
      })
      .catch((err) => {
        handelError(err, reject);
      });
  });
}

/**
 * 设置认证信息
 * @param auth {Object}
 * @param authType {AUTH_TYPE} 认证类型，默认：{AUTH_TYPE.BEARER}
 */
function setAuthorization(auth, authType = AUTH_TYPE.BEARER) {
  switch (authType) {
    case AUTH_TYPE.BEARER:
      Cookies.set(xsrfHeaderName, 'Bearer ' + auth.token, {
        expires: auth.expireAt,
      });
      break;
    case AUTH_TYPE.BASIC:
    case AUTH_TYPE.AUTH1:
    case AUTH_TYPE.AUTH2:
    default:
      break;
  }
}

/**
 * 移出认证信息
 * @param authType {AUTH_TYPE} 认证类型
 */
function removeAuthorization(authType = AUTH_TYPE.BEARER) {
  switch (authType) {
    case AUTH_TYPE.BEARER:
      Cookies.remove(xsrfHeaderName);
      break;
    case AUTH_TYPE.BASIC:
    case AUTH_TYPE.AUTH1:
    case AUTH_TYPE.AUTH2:
    default:
      break;
  }
}

/**
 * 检查认证信息
 * @param authType
 * @returns {boolean}
 */
function checkAuthorization(authType = AUTH_TYPE.BEARER) {
  switch (authType) {
    case AUTH_TYPE.BEARER:
      if (Cookies.get(xsrfHeaderName)) {
        return true;
      }
      break;
    case AUTH_TYPE.BASIC:
    case AUTH_TYPE.AUTH1:
    case AUTH_TYPE.AUTH2:
    default:
      break;
  }
  return false;
}

/**
 * 解析 url 中的参数
 * @param url
 * @returns {Object}
 */
function parseUrlParams(url) {
  const params = {};
  if (!url || url === '' || typeof url !== 'string') {
    return params;
  }
  const paramsStr = url.split('?')[1];
  if (!paramsStr) {
    return params;
  }
  const paramsArr = paramsStr.replace(/&|=/g, ' ').split(' ');
  for (let i = 0; i < paramsArr.length / 2; i++) {
    const value = paramsArr[i * 2 + 1];
    params[paramsArr[i * 2]] =
      value === 'true' ? true : value === 'false' ? false : value;
  }
  return params;
}

export {
  METHOD,
  AUTH_TYPE,
  request,
  uploadFile,
  setAuthorization,
  removeAuthorization,
  checkAuthorization,
  parseUrlParams,
};
