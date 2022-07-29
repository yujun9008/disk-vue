import Vue from "vue";
import Vuex from "vuex";
import file from './modules/file';
import user from './modules/user';
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        file,
        user,
    },
    strict: process.env.NODE_ENV !== 'production',
    plugins: [createPersistedState({
        storage: window.sessionStorage
    })]
});
