import Vue from 'vue'
import App from './App.vue'
import router from './router/router';
import '@/router/before.js';
import '@/assets/css/base.css';
import 'element-ui/lib/theme-chalk/index.css';
import store from './store';
// fade/zoom 等
// 过渡动画 css
// import 'element-ui/lib/theme-chalk/base.css';
import ElementUI from 'element-ui';
import {download} from "@/utils";

Vue.prototype.$download = download;

Vue.config.productionTip = false;
Vue.use(ElementUI);
new Vue({
    router,
    store,
    render: h => h(App),
}).$mount('#app');
