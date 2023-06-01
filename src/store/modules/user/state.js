const state = () => ({
  isLogin: false, //初始时候给一个 isLogin = false 表示用户未登录
  hasPrivileges: false, //左侧导航
  userName: "",
  userId: 0,
  avatar: "",
  token: "",
  userInfo: {},
});

export default state;
