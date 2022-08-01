//  文件模块接口
import { axiosDelete, get, post, put } from "@/request/http";

/**
 * 获取文件列表
 * @param p
 * @returns {Promise | Promise<unknown>}
 */
export const listDir = (p) => post("/dbs/folder/query_sub_folders", p);
export const queryFileList = (p) => post("/dbs/folder/query_sub_files", p);
export const queryFolderAndFiles = (p) => post("/dbs/folder/query", p);
/**
 * 创建文件夹
 * @param p
 * @returns {Promise | Promise<unknown>}
 */
export const mkdir = (p) => post("/dbs/folder/create", p);
/**
 * 删除文件
 * @param p
 * @returns {Promise<unknown>}
 */
export const deleteFile = (p, isFolder) => {
  if (isFolder) {
    return post("/dbs/folder/delete", p);
  } else {
    return post("/dbs/file/delete", p);
  }
};
/**
 * 重命名
 * @param p
 * @returns {Promise<unknown>}
 */
export const renameFile = (p, isFolder) => {
  if (isFolder) {
    return post("/dbs/folder/rename", p);
  } else {
    return post("/dbs/file/rename", p);
  }
};
/**
 * 移动
 * @param p
 * @returns {Promise | Promise<unknown>}
 */
export const moveDir = (p) => post("/file/moveDir", p);
/**
 * 复制
 * @param p
 * @returns {Promise | Promise<unknown>}
 */
export const copyDir = (p) => post("/file/copyDir", p);
/**
 * 获取目录结构
 * @param p
 * @returns {Promise | Promise<unknown>}
 */
export const listDirTree = (p) => get("/file/listDirTree", p);
/**
 * 下载文件
 * @param p
 * @returns {Promise | Promise<unknown>}
 */
export const download = (p) => post("/dbs/file/download", p);
/**
 * 解压文件
 * @param p
 * @returns {Promise | Promise<unknown>}
 */
export const unzip = (p) => post("/file/unzip/" + p.fileId, p);
/**
 * 解压文件
 * @param p
 * @returns {Promise | Promise<unknown>}
 */
export const zip = (p) => post("/file/zip", p);
