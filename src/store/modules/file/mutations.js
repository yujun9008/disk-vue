const mutations = {
    /**
     * 改变菜单状态
     * @param state
     * @param data
     * @constructor
     */
    CHANGE_COLLAPSE: (state, data) => {
        state.collapse = data;
    },
    /**
     * 改变数据展示模式
     * @param state
     * @param data
     * @constructor
     */
    CHANGE_IMAGE_MODEL: (state, data) => {
        state.imageModel = data;
    },
    /**
     * 改变文件搜索值
     * @param state
     * @param data
     * @constructor
     */
    CHANGE_SEARCH: (state, data) => {
        state.search = data;
    },
    /**
     * 改变存储信息
     * @param state
     * @param data
     * @constructor
     */
    CHANGE_STORAGE: (state, data) => {
        state.storage = data;
    },
};

export default mutations;
