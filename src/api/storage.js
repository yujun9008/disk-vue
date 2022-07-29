//  存储模块接口
import {get} from '@/request/http'

/**
 * 获取存储信息
 * @param p
 * @returns {Promise | Promise<unknown>}
 */
export const storageInfo = p => get('/storage', p);
