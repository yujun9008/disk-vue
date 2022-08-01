import Axios from "axios";
import router from "@/router/router.js";
import store from "@/store";
import Qs from "qs";
import { Loading } from "element-ui";

let loadingInstance;
// 创建axios的实例
const axios = Axios.create({
  //   headers: {'Content-Type': 'application/x-www-form-urlencoded'},
  headers: { "Content-Type": "application/json" },
  baseURL: process.env.VUE_APP_BASE_API, // api的base_url
  timeout: 10000 * 5, // 超时时间
  // `paramsSerializer` 是一个负责 `params` 序列化的函数
  // (e.g. https://www.npmjs.com/package/qs, http://api.jquery.com/jquery.param/)
  paramsSerializer(params) {
    return Qs.stringify(params, { arrayFormat: "repeat" }); // 针对get 和 delete 方法参数序列化
  },
  //   transformRequest: [
  //     function(params) {
  //       debugger;
  //       // 对 data 进行任意转换处理
  //       return Qs.stringify(params, { arrayFormat: "repeat" }); // 针对post和put方法参数序列化
  //     },
  //   ],
});

// 请求拦截
axios.interceptors.request.use(
  (config) => {
    if (
      config.params === undefined ||
      (config.params && config.params.loading === undefined) ||
      (config.params &&
        config.params.loading !== undefined &&
        config.params.loading === true)
    ) {
      loadingInstance = Loading.service({
        fullscreen: true,
        background: "rgba(0, 0, 0, 0.7)",
      });
    }
    // 发送请求前添加token信息
    if (store.getters.token) {
      // 每次发送请求之前判断是否存在token，如果存在，则统一在http请求的header都加上token，不用每次请求都手动添加了
      config.headers.Authorization = store.getters.token;
    }
    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);

// 响应拦截器
axios.interceptors.response.use(
  (response) => {
    if (loadingInstance) {
      loadingInstance.close();
    }

    if (response.status === 200) {
      if (response.headers && response.headers.authorization) {
        store.commit("CHANGE_TOKEN", response.headers.authorization);
      }
      if (response.data && response.data.code === 401) {
        router.replace({ name: "Error_401" });
      }
      return Promise.resolve(response);
    }
  },
  // 服务器状态码不是200的情况
  (error) => {
    if (loadingInstance) {
      loadingInstance.close();
    }

    if (error.response.status) {
      switch (error.response.status) {
        case 500:
          router.replace({ name: "Error_500" });
          break;
        case 401:
          router.replace({ name: "Error_401" });
          break;
        case 404:
          router.replace({ name: "Error_404" });
          break;
        default:
          return Promise.reject(error.response);
      }
    }
  }
);

/**
 * get方法，对应get请求
 */
export function get(url, params) {
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        params: params,
      })
      .then((res) => {
        if (
          res.headers["content-type"].indexOf("application/octet-stream") !== -1
        ) {
          resolve(res);
        }
        resolve(res.data);
      })
      .catch((err) => {
        reject(err.data);
      });
  });
}

/**
 * post方法，对应post请求
 * info为 true，formData格式；
 * info为 undefined或false，是json格式
 */
export function post(url, data = {}) {
  return new Promise((resolve, reject) => {
    axios
      .post(url, data)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err.data);
      });
  });
}

/**
 * 封装put请求
 */

export function put(url, params = {}) {
  return new Promise((resolve, reject) => {
    axios.put(url, params).then(
      (res) => {
        resolve(res.data);
      },
      (err) => {
        reject(err.data);
      }
    );
  });
}

/**
 * 封装delete请求
 */
export function axiosDelete(url, params = {}) {
  return new Promise((resolve, reject) => {
    axios
      .delete(url, {
        params: params,
      })
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err.data);
      });
  });
}
