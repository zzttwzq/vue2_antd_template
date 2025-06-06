let path = require('path');
const webpack = require('webpack');
const ThemeColorReplacer = require('webpack-theme-color-replacer');
const { getThemeColors, modifyVars } = require('./src/utils/themeUtil');
const { resolveCss } = require('./src/utils/theme-color-replacer-extend');
const CompressionWebpackPlugin = require('compression-webpack-plugin');

const productionGzipExtensions = ['js', 'css'];
const isProd = process.env.NODE_ENV === 'production';

const assetsCDN = {
  externals: {
    vue: 'Vue',
    'vue-router': 'VueRouter',
    vuex: 'Vuex',
    axios: 'axios',
    'vue-i18n': 'VueI18n',
    moment: 'moment',
    'ant-design-vue': 'antd',
    axios: 'axios',
    Clipboard: 'Clipboard',
    echarts: 'echarts',
    'js-md5': 'md5',
    nprogress: 'NProgress',
    'js-cookie': 'Cookies',
    jsencrypt: 'jsencrypt',
    xlsx: 'XLSX',
    MavonEditor: 'MavonEditor',
    // 'cos-js-sdk-v5': 'COS',
    // 'v-viewer': 'VueViewer',
  },
  css: [
    'https://unpkg.com/ant-design-vue@1.7.2/dist/antd.min.css',
    'https://unpkg.com/animate.css@4.1.1/animate.min.css',
    'https://app.unpkg.com/nprogress@0.2.0/files/nprogress.css',
  ],
  js: [
    'https://unpkg.com/vue@2.7.16/dist/vue.min.js',
    'https://unpkg.com/vue-router@3.6.5/dist/vue-router.min.js',
    'https://unpkg.com/vuex@3.6.2/dist/vuex.min.js',
    'https://unpkg.com/axios@0.19.2/dist/axios.min.js',
    'https://unpkg.com/vue-i18n@8.28.2/dist/vue-i18n.min.js',
    'https://unpkg.com/moment@2.30.1/moment.js',
    'https://unpkg.com/ant-design-vue@1.7.2/dist/antd.min.js',
    'https://unpkg.com/echarts@5.6.0/dist/echarts.min.js',
    'https://unpkg.com/clipboard@2.0.11/dist/clipboard.min.js',
    'https://unpkg.com/js-md5@0.7.3/build/md5.min.js',
    'https://unpkg.com/nprogress@0.2.0/nprogress.js',
    'https://unpkg.com/js-cookie@2.2.1/src/js.cookie.js',
    'https://unpkg.com/jsencrypt@3.3.2/bin/jsencrypt.min.js',
    'https://unpkg.com/xlsx@0.17.5/dist/xlsx.min.js',
    'https://unpkg.com/mavon-editor@2.10.4/dist/mavon-editor.js',
    'https://cdn.jsdelivr.net/npm/cos-js-sdk-v5/dist/cos-js-sdk-v5.min.js'
    // 'https://unpkg.com/v-viewer@1.7.4/dist/index.umd.js',
  ],
};

const Timestamp = new Date().getTime();
var proxy = process.env.VUE_APP_PROXY;

module.exports = {
  devServer: {
    port: process.env.VUE_APP_SERVER_PORT,
    proxy: {
      ['^/' + proxy]: {
        //此处要与 /services/api.js 中的 API_PROXY_PREFIX 值保持一致
        target: process.env.VUE_APP_API_BASE_URL,
        changeOrigin: true,
        logLevel: 'debug', //显示代理后的地址
        pathRewrite: {
          ['^/' + proxy]: '/',
        },
      },
      '/cos': {  // 自定义代理路径前缀（可替换为任意名称）
        target: 'https://xhsc-1352320440.cos.ap-guangzhou.myqcloud.com', // COS 域名
        changeOrigin: true,  // 开启域名伪装
        pathRewrite: {
          '^/cos': ''  // 移除路径前缀（如不需要可保留）
        }
      }
    },
  },
  css: {
    loaderOptions: {
      less: {
        lessOptions: {
          modifyVars: {
            'primary-color': '#ff0000',
            'link-color': '#0000ff',
            'border-radius-base': '2px',
          },
          javascriptEnabled: true,
        },
      },
    },
  },
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [path.resolve(__dirname, './src/theme/theme.less')],
    },
  },
  configureWebpack: (config) => {
    config.entry.app = ['babel-polyfill', 'whatwg-fetch', './src/main.js'];
    config.output.filename = 'js/[name].' + Timestamp + '.js';
    config.output.chunkFilename = 'js/[name].' + Timestamp + '.js';
    config.performance = {
      hints: false,
    };
    config.plugins.push(
      new ThemeColorReplacer({
        fileName: 'css/theme-colors-[contenthash:8].css',
        matchColors: getThemeColors(),
        injectCss: true,
        resolveCss,
      })
    );
    // Ignore all locale files of moment.js
    config.plugins.push(new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/));
    // 生产环境下将资源压缩成gzip格式
    if (isProd) {
      // add `CompressionWebpack` plugin to webpack plugins
      config.plugins.push(
        new CompressionWebpackPlugin({
          algorithm: 'gzip',
          test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
          threshold: 10240,
          minRatio: 0.8,
        })
      );
    }
    // if prod, add externals
    if (isProd) {
      config.externals = assetsCDN.externals;
    }
  },
  chainWebpack: (config) => {
    // 生产环境下关闭css压缩的 colormin 项，因为此项优化与主题色替换功能冲突
    if (isProd) {
      config.plugin('optimize-css').tap((args) => {
        args[0].cssnanoOptions.preset[1].colormin = false;
        return args;
      });
    }
    // 生产环境下使用CDN
    if (isProd) {
      config.plugin('html').tap((args) => {
        args[0].cdn = assetsCDN;
        return args;
      });
    }
  },
  css: {
    loaderOptions: {
      less: {
        lessOptions: {
          modifyVars: modifyVars(),
          javascriptEnabled: true,
        },
      },
    },
  },
  publicPath: process.env.VUE_APP_PUBLIC_PATH,
  outputDir: `${process.env.VUE_APP_OUTPUT_DIR}`,
  assetsDir: 'static',
  productionSourceMap: false,
  // lintOnSave: false,
};
