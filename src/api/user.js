import {get} from '@/request/http'

/**
 * 获取登录用户信息
 * @returns {*|Promise<any>}
 */
export function getLoginUserInfo() {
    return get('/user/getUserInfo');
}

/**
 * 退出登录
 * @returns {*|Promise<any>}
 */
export function logout() {
    return get('/user/logout');
}
