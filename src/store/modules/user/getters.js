const getters = {
    isLogin: state => state.isLogin,
    userName: state => state.userName,
    // userId: state => state.userId,
    userId: state => 'kakaxi',
    avatar: state => state.avatar,
    token: state => state.token,
    userInfo: state => state.userInfo
};

export default getters;
