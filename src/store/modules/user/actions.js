import { getLoginUserInfo, logout, queryPrivileges } from "@/api/user";
import * as storeUtils from "@/utils";
import store from "@/store";
// const actions = {
//   getUserInfo({ commit }) {
//     return new Promise((resolve, reject) => {
//       getLoginUserInfo()
//         .then((res) => {
//           debugger;
//           if (res.flag === "SUCCESS") {
//             if (res.data) {
//               let user = res.data;
//               commit("CHANGE_USER_INFO", user);
//               // commit("CHANGE_AVATAR", process.env.VUE_APP_BASE_API + user.avatar);
//               commit("CHANGE_USER_ID", user.userId);
//               commit("CHANGE_USER_NAME", user.userName);
//               commit("CHANGE_LOGIN", true);
//               return user.userId;
//             }
//             return reject();
//           } else {
//             commit("CHANGE_LOGIN", false);
//             return reject();
//           }
//         })
//         .then((userId) => {
//           queryPrivileges({ userId }).then((res) => {
//             debugger;
//             if (res.flag === "SUCCESS") {
//               if (res.privileges) {
//                 commit("CHANGE_PRIVILEGES", res.true);
//                 commit("CHANGE_USER_PRIVILEGES", res.privileges);
//                 return resolve(true);
//               }
//               return reject(false);
//             } else {
//               // commit("CHANGE_LOGIN", false);
//               return reject(false);
//             }
//           });
//         });
//     });
//   },
//   getUserPrivileges({ commit }) {
//     debugger;
//     return new Promise((resolve, reject) => {
//       queryPrivileges({ userId: store.getters.userId }).then((res) => {
//         debugger;
//         if (res.flag === "SUCCESS") {
//           if (res.privileges) {
//             commit("CHANGE_PRIVILEGES", res.true);
//             commit("CHANGE_USER_PRIVILEGES", res.privileges);
//             return resolve(true);
//           }
//           return reject(false);
//         } else {
//           // commit("CHANGE_LOGIN", false);
//           return reject(false);
//         }
//       });
//     });
//   },
//   LogOut({ commit }) {
//     return new Promise((resolve, reject) => {
//       logout()
//         .then(() => {
//           commit("CHANGE_USER_INFO", null);
//           commit("CHANGE_AVATAR", null);
//           commit("CHANGE_USER_ID", null);
//           commit("CHANGE_USER_NAME", null);
//           commit("CHANGE_LOGIN", false);
//           storeUtils.clearStore();
//           resolve();
//         })
//         .catch((error) => {
//           reject(error);
//         });
//     });
//   },
// };
const actions = {
  getUserInfo({ commit }) {
    return new Promise((resolve, reject) => {
      getLoginUserInfo().then((res) => {
        debugger;
        if (res.flag === "SUCCESS") {
          if (res.data) {
            let user = res.data;
            commit("CHANGE_USER_INFO", user);
            // commit("CHANGE_AVATAR", process.env.VUE_APP_BASE_API + user.avatar);
            commit("CHANGE_USER_ID", user.userId);
            commit("CHANGE_USER_NAME", user.userName);
            commit("CHANGE_LOGIN", true);
            return resolve(true);
          }
          return reject();
        } else {
          commit("CHANGE_LOGIN", false);
          return reject();
        }
      });
    });
  },
  getUserPrivileges({ commit }) {
    debugger;
    return new Promise((resolve, reject) => {
      queryPrivileges({ userId: store.getters.userId }).then((res) => {
        debugger;
        if (res.flag === "SUCCESS") {
          if (res.privileges) {
            commit("CHANGE_PRIVILEGES", true);
            commit("CHANGE_USER_PRIVILEGES", res.privileges);
            return resolve(true);
          }
          return reject(false);
        } else {
          // commit("CHANGE_LOGIN", false);
          return reject(false);
        }
      });
    });
  },
  LogOut({ commit }) {
    return new Promise((resolve, reject) => {
      logout()
        .then(() => {
          commit("CHANGE_USER_INFO", null);
          commit("CHANGE_AVATAR", null);
          commit("CHANGE_USER_ID", null);
          commit("CHANGE_USER_NAME", null);
          commit("CHANGE_LOGIN", false);
          storeUtils.clearStore();
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
};

export default actions;
