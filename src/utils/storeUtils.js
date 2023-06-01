export function setStorageL(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function getStorageL(key) {
  const item = localStorage.getItem(key);
  if (item != null) {
    return JSON.parse(item);
  }
  return null;
}

export function removeStorageL(key) {
  localStorage.removeItem(key);
}

/**
 * localStorage 的基础操作封装
 */
export function setStorageS(key, value) {
  sessionStorage.setItem(key, JSON.stringify(value));
}

export function getStorageS(key) {
  const item = sessionStorage.getItem(key);
  if (item != null) {
    return JSON.parse(item);
  }
  return null;
}

export function removeStorageS(key) {
  sessionStorage.removeItem(key);
}

/**
 * 清空所有
 */
export function clearStore() {
  sessionStorage.clear();
  localStorage.clear();
}

export const CONST = {
  // token key
  token: "token",
  avatar: "avatar",
  collapse: "collapse",
  userInfo: "userInfo",
  isLogin: "isLogin",
  userName: "userName",
  userId: "userId",
  userPrivileges: "userPrivileges",
  hasPrivileges: "hasPrivileges",
  imageModel: "imageModel",
};
