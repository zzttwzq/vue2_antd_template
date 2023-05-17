let path = require('path')
const webpack = require('webpack')
const ThemeColorReplacer = require('webpack-theme-color-replacer')
const { getThemeColors, modifyVars } = require('./src/utils/themeUtil')
const { resolveCss } = require('./src/utils/theme-color-replacer-extend')
const CompressionWebpackPlugin = require('compression-webpack-plugin')

const productionGzipExtensions = ['js', 'css']
const isProd = process.env.NODE_ENV === 'production'

const assetsCDN = {
    // webpack build externals
    externals: {
        vue: 'Vue',
        vuex: 'Vuex',
        axios: 'axios',
        nprogress: 'NProgress',
        clipboard: 'ClipboardJS',
        'vue-router': 'VueRouter',
        '@antv/data-set': 'DataSet',
        'js-cookie': 'Cookies'
    },
    css: [],
    js: [
        '//wodan-idc.oss-cn-hangzhou.aliyuncs.com/wefree/crm/resource/vue.min.js',
        '//wodan-idc.oss-cn-hangzhou.aliyuncs.com/wefree/crm/resource/vue-router.min.js',
        '//wodan-idc.oss-cn-hangzhou.aliyuncs.com/wefree/crm/resource/vuex.min.js',
        '//wodan-idc.oss-cn-hangzhou.aliyuncs.com/wefree/crm/resource/axios.min.js',
        '//wodan-idc.oss-cn-hangzhou.aliyuncs.com/wefree/crm/resource/nprogress.min.js',
        '//wodan-idc.oss-cn-hangzhou.aliyuncs.com/wefree/crm/resource/clipboard.min.js',
        '//wodan-idc.oss-cn-hangzhou.aliyuncs.com/wefree/crm/resource/data-set.js',
        '//wodan-idc.oss-cn-hangzhou.aliyuncs.com/wefree/crm/resource/js.cookie.min.js'
    ]
}

const Timestamp = new Date().getTime();

module.exports = {
    devServer: {
        port: 8900,
        proxy: {
            '^/blog': {
                //此处要与 /services/api.js 中的 API_PROXY_PREFIX 值保持一致
                target: process.env.VUE_APP_API_BASE_URL,
                changeOrigin: true,
                logLevel: 'debug',
            }
        }
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
            patterns: [path.resolve(__dirname, "./src/theme/theme.less")],
        }
    },
    configureWebpack: config => {
        config.entry.app = ["babel-polyfill", "whatwg-fetch", "./src/main.js"];
        config.output.filename = 'js/[name].' + Timestamp + '.js';
        config.output.chunkFilename = 'js/[name].' + Timestamp + '.js';
        config.performance = {
            hints: false
        }
        config.plugins.push(
                new ThemeColorReplacer({
                    fileName: 'css/theme-colors-[contenthash:8].css',
                    matchColors: getThemeColors(),
                    injectCss: true,
                    resolveCss
                })
            )
            // Ignore all locale files of moment.js
        config.plugins.push(new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/))
            // 生产环境下将资源压缩成gzip格式
        if (isProd) {
            // add `CompressionWebpack` plugin to webpack plugins
            config.plugins.push(new CompressionWebpackPlugin({
                algorithm: 'gzip',
                test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
                threshold: 10240,
                minRatio: 0.8
            }))
        }
        // if prod, add externals
        if (isProd) {
            config.externals = assetsCDN.externals
        }
    },
    chainWebpack: config => {
        // 生产环境下关闭css压缩的 colormin 项，因为此项优化与主题色替换功能冲突
        if (isProd) {
            config.plugin('optimize-css')
                .tap(args => {
                    args[0].cssnanoOptions.preset[1].colormin = false
                    return args
                })
        }
        // 生产环境下使用CDN
        if (isProd) {
            config.plugin('html')
                .tap(args => {
                    args[0].cdn = assetsCDN
                    return args
                })
        }
    },
    css: {
        loaderOptions: {
            less: {
                lessOptions: {
                    modifyVars: modifyVars(),
                    javascriptEnabled: true
                }
            }
        }
    },
    publicPath: process.env.VUE_APP_PUBLIC_PATH,
    outputDir: 'dist',
    assetsDir: 'static',
    productionSourceMap: false
}