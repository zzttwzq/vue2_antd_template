## apicreator

#### 功能

    1. 自动生成请求接口 *_request.js 文件
    2. 自动生成api api.js 文件中url会自动生成
    3. 自动生成mock *_mock.js 文件
    4. 自动导入到 mock/index.js 中，使得本地mock生效

#### 使用

    npm run createApi

#### 注意事项

    1. 如果出现重新登陆，请删除 ./apiCreator/token.json 文件，并重新运行
    2. 目前只支持 yapi上的文档数据，而且项目指定为 wefree/管理后台
