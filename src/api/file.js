//  文件模块接口
import { axiosDelete, get, post, put } from "@/request/http";

const host = "http://118.195.238.128:9345";
/**
 * 获取文件列表
 * @param p
 * @returns {Promise | Promise<unknown>}
 */
export const queryMyDir = (p) => post("/dbs/folder/query_init_my_folders", p);
export const queryAdminFolderTree = (p) =>
  post("/dbs/folder/get_admin_folder_tree", p);
export const queryWithPrivilege = (p) =>
  post("/dbs/folder/query_with_privilege", p);

export const listDir = (p) => post("/dbs/folder/query_sub_folders", p);
export const queryFileList = (p) => post("/dbs/folder/query_sub_files", p);
export const queryFolderAndFiles = (p) => post("/dbs/folder/query", p);
export const queryCrumbs = (p) => post("/dbs/folder/query_crumbs", p);
export const createOffice = (p) => post("/dbs/file/office/create", p);
export const queryShareLink = (p) => post("/dbs/file/share", p);
export const addCollect = (p) => post("/dbs/user/folder/add_collect", p);
export const removeCollect = (p) => post("/dbs/user/folder/remove_collect", p);
export const getDownloadFile = (fileId, shortUrl) => {
  location.href = `${host}/dbs/file/download?shortUrl=${shortUrl}&fileId=${fileId}`;
};

export const getPreviewImageUrl = (shortUrl, userId) => {
  return `${host}/dbs/file/preview/picture?shortUrl=${shortUrl}&userId=${userId}`;
};
export const getPreviewVideoUrl = (shortUrl, userId) => {
  return `${host}/dbs/file/preview/video?shortUrl=${shortUrl}&userId=${userId}`;
};
export const getPreviewPackUrl = (shortUrl, userId) => {
  return `${host}/dbs/file/preview/pack?shortUrl=${shortUrl}&userId=${userId}`;
};
export const getPreviewDoc = (shortUrl, userId) => {
  return `${host}/dbs/file/preview/document?shortUrl=${shortUrl}&userId=${userId}`;
};
export const getEditDoc = (shortUrl, userId) => {
  return `${host}/dbs/file/edit/document?shortUrl=${shortUrl}&userId=${userId}`;
};
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
    return post("/dbs/file/batch_delete", p);
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
