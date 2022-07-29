//  文件模块接口
import {axiosDelete, get, post, put} from '@/request/http'

/**
 * 获取文件列表
 * @param p
 * @returns {Promise | Promise<unknown>}
 */
export const listDir = p => get('/file/listDir', p);
/**
 * 创建文件夹
 * @param p
 * @returns {Promise | Promise<unknown>}
 */
export const mkdir = p => post('/file/mkdir', p);
/**
 * 删除文件
 * @param p
 * @returns {Promise<unknown>}
 */
export const deleteFile = p => axiosDelete('/file/remove', p);
/**
 * 重命名
 * @param p
 * @returns {Promise<unknown>}
 */
export const renameFile = p => put('/file/rename', p);
/**
 * 移动
 * @param p
 * @returns {Promise | Promise<unknown>}
 */
export const moveDir = p => post('/file/moveDir', p);
/**
 * 复制
 * @param p
 * @returns {Promise | Promise<unknown>}
 */
export const copyDir = p => post('/file/copyDir', p);
/**
 * 获取目录结构
 * @param p
 * @returns {Promise | Promise<unknown>}
 */
export const listDirTree = p => get('/file/listDirTree', p);
/**
 * 下载文件
 * @param p
 * @returns {Promise | Promise<unknown>}
 */
export const download = p => post('/file/getDownloadUrl', p);
/**
 * 解压文件
 * @param p
 * @returns {Promise | Promise<unknown>}
 */
export const unzip = p => post('/file/unzip/' + p.fileId, p);
/**
 * 解压文件
 * @param p
 * @returns {Promise | Promise<unknown>}
 */
export const zip = p => post('/file/zip' , p);
