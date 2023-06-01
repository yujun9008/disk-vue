const mutations = {
  /**
   * 改变登录状态
   * @param state
   * @param data
   * @constructor
   */
  CHANGE_LOGIN: (state, data) => {
    state.isLogin = data;
  },
  CHANGE_PRIVILEGES: (state, data) => {
    state.hasPrivileges = data;
  },
  /**
   * 改变用户名
   * @param state
   * @param data
   * @constructor
   */
  CHANGE_USER_NAME: (state, data) => {
    state.userName = data;
  },
  /**
   * 改变用户ID
   * @param state
   * @param data
   * @constructor
   */
  CHANGE_USER_ID: (state, data) => {
    state.userId = data;
  },

  /**
   * 改变用户头像
   * @param state
   * @param data
   * @constructor
   */
  CHANGE_AVATAR: (state, data) => {
    state.avatar = data;
  },

  /**
   * 改变用户token
   * @param state
   * @param data
   * @constructor
   */
  CHANGE_TOKEN: (state, data) => {
    state.token = data;
  },
  /**
   * 改变用户全部信息
   * @param state
   * @param data
   * @constructor
   */
  CHANGE_USER_INFO: (state, data) => {
    state.userInfo = data;
  },
  CHANGE_USER_PRIVILEGES: (state, data) => {
    state.userPrivileges = data;
  },
};

export default mutations;
