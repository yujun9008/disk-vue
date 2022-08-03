import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);


export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "Home",
      redirect: (to) => {
        return {
          path: "/index",
          query: {
            token: to.query.token,
          },
        };
      },
    },
    {
      path: "/index",
      name: "Index",
      component: () => import(/* webpackChunkName: "index" */ "@/views/Index"),
    },
    {
      path: "/minefile",
      name: "MineFile",
      component: () =>
        import(/* webpackChunkName: "minefile" */ "@/views/File"),
    },
    {
      path: "/publicfile",
      name: "PublicFile",
      component: () =>
        import(/* webpackChunkName: "publicfile" */ "@/views/File"),
    },
    {
      path: "/directorymanage",
      name: "DirectoryManage",
      component: () =>
        import(
          /* webpackChunkName: "directorymanage" */ "@/views/DirectoryManage"
        ),
    },
    {
      path: "/rolemanage",
      name: "RoleManage",
      component: () =>
        import(/* webpackChunkName: "rolemanage" */ "@/views/RoleManage"),
    },
    {
      path: "/500",
      name: "Error_500",
      component: () =>
        import(/* webpackChunkName: "error_500" */ "@/views/ErrorPage/500.vue"),
    },
    {
      path: "/401",
      name: "Error_401",
      component: () =>
        import(/* webpackChunkName: "error_401" */ "@/views/ErrorPage/401.vue"),
    },
    {
      path: "/404",
      name: "Error_404",
      component: () =>
        import(/* webpackChunkName: "error_404" */ "@/views/ErrorPage/404.vue"),
    },
    {
      path: "*",
      redirect: "/404",
    },
  ],
});

const originalPush = Router.prototype.push;
const originalReplace = Router.prototype.replace;
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err);
};
Router.prototype.replace = function push(location) {
  return originalReplace.call(this, location).catch((err) => err);
};
