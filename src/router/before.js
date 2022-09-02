import router from "@/router/router";
import store from "@/store";

const whiteList = ["/login", "/401", "/404", "/500"];
// 路由全局前置守卫
router.beforeEach((to, from, next) => {
  debugger;
  if (!store.getters.userId) {
    store.dispatch("getUserInfo").then(() => {
      console.log("store", store.getters.userId);
      debugger;
      if (!store.getters.userId) {
        next({
          path: "/401",
        });
      } else {
        next({ ...to, replace: true });
      }
    });
  }

  //   if (to.query.token) {
  //     store.commit("CHANGE_TOKEN", to.query.token);
  //     store.dispatch("getUserInfo").then(() => {
  //       if (!store.getters.isLogin) {
  //         next({
  //           path: "/401",
  //         });
  //       } else {
  //         delete to.query.token;
  //         next({ ...to, replace: true });
  //       }
  //     });
  //   }
  if (
    !store.getters.isLogin &&
    !whiteList.includes(to.path) &&
    store.getters.token
  ) {
    // 没有登录
    store.dispatch("getUserInfo").then(() => {
      if (!store.getters.isLogin) {
        next({
          path: "/401",
        });
      } else {
        next({ ...to, replace: true });
      }
    });
  } else {
    next();
  }
});
