const deepMerge = require('deepmerge');
// const _config = require('./config')
const { setting } = require('./default');
const config = deepMerge(setting, { routes: [] });

module.exports = config;
