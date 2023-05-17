//跨域代理前缀
const BASE_URL = process.env.NODE_ENV === 'development' ? '' : process.env.VUE_APP_blog_BASE_URL

module.exports = {
    ROUTES: `${BASE_URL}/routes`,
    ADMIN_USER_LOGIN: `${BASE_URL}/blog/admin_user_login`, // admin账号登陆 

    //### 自动生成的Apis
    //### 自动生成的Apis
}