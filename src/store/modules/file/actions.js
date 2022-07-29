const actions = {
    setSearch({commit}, data) {
        commit('CHANGE_SEARCH', data);
    },
    setStorage({commit}, data) {
        commit('CHANGE_STORAGE', data);
    },
};

export default actions;
