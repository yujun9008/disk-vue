import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router);

export default new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/',
            name: 'Home',
            redirect: to => {
                return {
                    path: '/file', query: {fileType: 0, fileName: '/', pid: 0, token: to.query.token}
                }
            }
        }, {
            path: '/file',
            name: 'File',
            component: () => import(/* webpackChunkName: "file" */ '@/views/File')
        }, {
            path: '/500',
            name: 'Error_500',
            component: () => import(/* webpackChunkName: "error_500" */ '@/views/ErrorPage/500.vue')
        }, {
            path: '/401',
            name: 'Error_401',
            component: () => import(/* webpackChunkName: "error_401" */ '@/views/ErrorPage/401.vue')
        }, {
            path: '/404',
            name: 'Error_404',
            component: () => import(/* webpackChunkName: "error_404" */ '@/views/ErrorPage/404.vue')
        },
        {
            path: '*',
            redirect: "/404"
        }
    ]
})


const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
};
