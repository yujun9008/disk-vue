import {getLoginUserInfo, logout} from "@/api/user";
import * as storeUtils from "@/utils";

const actions = {
    getUserInfo({commit}) {
        return new Promise((resolve, reject) => {
            getLoginUserInfo().then((res) => {
                if (res.result) {
                    if (res.data) {
                        let user = res.data;
                        commit('CHANGE_USER_INFO', user);
                        commit('CHANGE_AVATAR', process.env.VUE_APP_BASE_API + user.avatar);
                        commit('CHANGE_USER_ID', user.id);
                        commit('CHANGE_USER_NAME', user.name);
                        commit('CHANGE_LOGIN', true);
                        return resolve(true);
                    }
                    return reject(false);
                } else {
                    commit('CHANGE_LOGIN', false);
                    return reject(false);
                }
            });
        });
    },
    LogOut({commit}) {
        return new Promise((resolve, reject) => {
            logout().then(() => {
                commit('CHANGE_USER_INFO', null);
                commit('CHANGE_AVATAR', null);
                commit('CHANGE_USER_ID', null);
                commit('CHANGE_USER_NAME', null);
                commit('CHANGE_LOGIN', false);
                storeUtils.clearStore();
                resolve();
            }).catch((error) => {
                reject(error);
            });
        });
    },
};

export default actions;
