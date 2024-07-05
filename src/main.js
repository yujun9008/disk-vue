import Vue from "vue";
import App from "./App.vue";
import router from "./router/router";
import "@/router/before.js";
import "@/assets/css/base.css";
import "element-ui/lib/theme-chalk/index.css";
import store from "./store";
import moment from "moment";
import waterMark from "./waterMark.js";
import { VuePlugin } from "vuera";
// fade/zoom 等
// 过渡动画 css
// import 'element-ui/lib/theme-chalk/base.css';
import ElementUI from "element-ui";
import { download } from "@/utils";

Vue.prototype.$download = download;

Vue.config.productionTip = false;
Vue.use(ElementUI);
Vue.use(VuePlugin);

waterMark({
  watermark_txt0: `${store?.getters?.userId}`,
  watermark_txt1: moment().format('YYYY-MM-DD HH:mm:ss'),
});

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
