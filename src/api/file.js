//  文件模块接口
import { axiosDelete, get, post, put } from "@/request/http";

// const host = "http://118.195.238.128:9345";
const host = "http://129.211.209.226:9345";
/**
 * 获取文件列表
 * @param p
 * @returns {Promise | Promise<unknown>}
 */
export const queryMyDir = (p) => post("/dbs/folder/query_init_my_folders", p);
export const queryAdminFolderTree = (p) =>
  post("/dbs/folder/get_admin_folder_tree", p);
export const queryAdminCreateFolderTree = (p) =>
  post("/dbs/folder/get_admin_create_folder_tree", p);
export const queryWithPrivilege = (p) =>
  post("/dbs/folder/query_with_privilege", p);

export const moveFolder = (p) => post("/dbs/folder/move_folder", p);

export const listDir = (p) => post("/dbs/folder/query_sub_folders", p);
export const queryLogs = (p) => post("/dbs/folder/query_logs", p);
export const queryFileList = (p) => post("/dbs/folder/query_sub_files", p);
export const queryFolderAndFiles = (p) => post("/dbs/folder/query", p);
export const queryCrumbs = (p) => post("/dbs/folder/query_crumbs", p);
export const createOffice = (p) => post("/dbs/file/office/create", p);
export const queryShareLink = (p) => post("/dbs/file/share", p);
export const addCollect = (p) => post("/dbs/user/folder/add_collect", p);
export const removeCollect = (p) => post("/dbs/user/folder/remove_collect", p);
export const getDownloadFile = (fileId, shortUrl) => {
  window.open(
    `${host}/dbs/file/download?shortUrl=${shortUrl}&fileId=${fileId}`
  );
};
export const getDownloadFolder = (folderId) => {
  window.open(`${host}/dbs/folder/download?folderId=${folderId}`);
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
export const getEditDoc = (shortUrl, userId, groupType) => {
  return `${host}/dbs/file/edit/document?shortUrl=${shortUrl}&userId=${userId}${
    groupType ? `&groupType=${groupType}` : ""
  }`;
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
    if (p.folderList) {
      return post("/dbs/folder/batch_delete", p);
    }
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
export const listRecentFile = (p) => post("/dbs/file/recent/process", p);
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
export const getFileByte = (p) => get("/dbs/file/bytes/download", p);
export const getFolderStatistics = (p) =>
  post("/dbs/folder/query_folder_statistics", p);
export const getReviewList = (p) => post("/dbs/file/review/list", p);
export const reviewProcess = (p) => post("/dbs/file/review/process", p);
export const uploadFile = (p) =>
  post("/dbs/file/uploadFile", p, { loading: false });
export const appendFile = (p) =>
  post("/dbs/file/appendFile", p, { loading: false });
export const queryFolderShare = (p) => post("/dbs/folder/share", p);
export const searchOrgUsersTree = (p) =>
  post("/dbs/user/search_org_users_tree", p);
export const setFolderReviewFlag = (p) =>
  post("/dbs/folder/set_folder_review_flag", p);
export const moveFile = (p) => post("/dbs/file/move", p);
export const batchMoveFile = (p) => post("/dbs/file/batch_move", p);
export const fullTextQuery = (p) => post("/dbs/file/full_text/query", p);
