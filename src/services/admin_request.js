
/**
* @file 数据接口导出模块.
* @copyright Duoxi Network .CO .LTD @2011
*/


import { ADMIN_USER_ADD, ADMIN_USER_UPDATE, ADMIN_USER_DELETE, ADMIN_USER_INFO, ADMIN_USER_LIST, ADMIN_USER_LOGIN, } from '@/services/api' 
import { request, METHOD } from '@/utils/request' 
 
/**
 * 管理后台用户增加
 
* @returns {
  }
 */
export async function post_admin_user_add(params) {
    return request(ADMIN_USER_ADD, METHOD.POST, params ? params : {}, null)
} 

/**
 * 管理后台用户修改
 
* @returns {
  }
 */
export async function post_admin_user_update(params) {
    return request(ADMIN_USER_UPDATE, METHOD.POST, params ? params : {}, null)
} 

/**
 * 管理后台用户删除
 
* @returns {
  }
 */
export async function post_admin_user_delete(params) {
    return request(ADMIN_USER_DELETE, METHOD.POST, params ? params : {}, null)
} 

/**
 * 管理后台用户查询
 
* @returns {
  }
 */
export async function post_admin_user_info(params) {
    return request(ADMIN_USER_INFO, METHOD.POST, params ? params : {}, null)
} 

/**
 * 管理后台用户列表
 
* @returns {
  }
 */
export async function post_admin_user_list(params) {
    return request(ADMIN_USER_LIST, METHOD.POST, params ? params : {}, null)
} 

/**
 * 管理后台登录
 
* @returns {
  }
 */
export async function post_admin_user_login(params) {
    return request(ADMIN_USER_LOGIN, METHOD.POST, params ? params : {}, null)
} 


export default {
    post_admin_user_add, 
    post_admin_user_update, 
    post_admin_user_delete, 
    post_admin_user_info, 
    post_admin_user_list, 
    post_admin_user_login, 
}


// post_admin_user_add({});

// post_admin_user_update({});

// post_admin_user_delete({});

// post_admin_user_info({});

// post_admin_user_list({});

// post_admin_user_login({});

// post_admin_user_add({});

// post_admin_user_update({});

// post_admin_user_delete({});

// post_admin_user_info({});

// post_admin_user_list({});

// post_admin_user_login({});

