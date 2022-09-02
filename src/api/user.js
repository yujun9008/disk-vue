import { get, post } from "@/request/http";

/**
 * 获取登录用户信息
 * @returns {*|Promise<any>}
 */
export function getLoginUserInfo() {
  return get("/dbs/auth/userInfo");
}

/**
 * 退出登录
 * @returns {*|Promise<any>}
 */
export function logout() {
  return get("/dbs/auth/logout");
}

export const queryFirstPage = (p) => post("/dbs/folder/get_first_page", p);
export const queryUser = (p) => post("/dbs/user/search_users", p);
export const queryRole = (p) => post("/dbs/role/query_list", p);
export const roleRename = (p) => post("/dbs/role/rename", p);
export const roleDelete = (p) => post("/dbs/role/delete", p);
export const roleCreate = (p) => post("/dbs/role/create", p);
export const createRelation = (p) => post("/dbs/user/group/create_relation", p);
export const queryGroupUsers = (p) =>
  post("/dbs/user/folder/query_group_users", p);
export const reportRelation = (p) => post("/dbs/user/group/report_relation", p);
export const queryRoles = (p) => post("/dbs/role/group/query_roles", p);
export const searchUsers = (p) => post("/dbs/role/search_users", p);
export const reportUsers = (p) => post("/dbs/role/report_users", p);
export const searchRoles = (p) => post("/dbs/role/search_roles", p);
export const reportRoleRelation = (p) =>
  post("/dbs/role/group/report_relation", p);
