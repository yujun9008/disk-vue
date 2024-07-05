// gzip压缩
const CompressionWebpackPlugin = require("compression-webpack-plugin");
// 是否为生产环境
const isProduction = process.env.NODE_ENV !== "development";
// 生产环境是否需要使用cdn
const prodNeedCdn = true;

function getVersion(name) {
  const dependencies = require("./package.json").dependencies;
  let version = dependencies[name];
  if (version) {
    version = version.replace("^", "");
  }
  return version;
}
// cdn链接
const cdn = {
  // cdn：模块名称和模块作用域命名（对应window里面挂载的变量名称）
  externals: {
    vue: "Vue",
    vuex: "Vuex",
    "vue-router": "VueRouter",
    axios: "axios",
    "element-ui": "ELEMENT",
    qs: "Qs",
  },
  // cdn的css链接
  css: [
    `https://unpkg.com/element-ui@${getVersion(
      "element-ui"
    )}/lib/theme-chalk/index.css`,
  ],
  // cdn的js链接
  js: [
    `https://unpkg.com/vue@${getVersion("vue")}/dist/vue.min.js`,
    `https://unpkg.com/vuex@${getVersion("vuex")}/dist/vuex.min.js`,
    `https://unpkg.com/vue-router@${getVersion(
      "vue-router"
    )}/dist/vue-router.min.js`,
    `https://unpkg.com/axios@${getVersion("axios")}/dist/axios.min.js`,
    `https://unpkg.com/element-ui@${getVersion("element-ui")}/lib/index.js`,
    `https://unpkg.com/qs@${getVersion("qs")}/dist/qs.js`,
  ],
};

module.exports = {
  // 选项...
  publicPath: "/",
  //是否开启eslint校验
  lintOnSave: true,
  //vue 中文配置文档地址
  //https://cli.vuejs.org/zh/config/#css-loaderoptions
  // 如果你不需要生产环境的 source map，可以将其设置为 false 以加速生产环境构建。
  productionSourceMap: process.env.NODE_ENV === "dev",
  chainWebpack: (config) => {
    config.optimization.minimizer("terser").tap((args) => {
      args[0].terserOptions.compress.drop_console = true;
      args[0].terserOptions.compress.warnings = false;
      args[0].terserOptions.compress.drop_debugger = true;
      args[0].terserOptions.compress.pure_funcs = ["console.*"];
      return args;
    });
    // ============注入cdn start============
    config.plugin("html").tap((args) => {
      // 生产环境或本地需要cdn时，才注入cdn
      if (isProduction && prodNeedCdn) args[0].cdn = cdn;
      return args;
    });
    // ============注入cdn start============
  },

  configureWebpack: (config) => {
    // 生产环境相关配置
    if (isProduction) {
      // 用cdn方式引入，则构建时要忽略相关资源
      if (isProduction && prodNeedCdn) config.externals = cdn.externals;
      // gzip压缩
      const productionGzipExtensions = ["html", "js", "css"];
      config.plugins.push(
        new CompressionWebpackPlugin({
          filename: "[path].gz[query]",
          algorithm: "gzip",
          test: new RegExp("\\.(" + productionGzipExtensions.join("|") + ")$"),
          threshold: 1024, // 只有大小大于该值的资源会被处理 10240
          minRatio: 0.8, // 只有压缩率小于这个值的资源才会被处理
          deleteOriginalAssets: false, // 删除原文件
        })
      );
      config.optimization = {
        splitChunks: {
          cacheGroups: {
            vendor: {
              chunks: "all",
              test: /node_modules/,
              name: "vendor",
              minChunks: 1,
              maxInitialRequests: 5,
              minSize: 0,
              priority: 100,
            },
            common: {
              chunks: "all",
              test: /[\\/]src[\\/]utils[\\/]/,
              name: "common",
              minChunks: 2,
              maxInitialRequests: 5,
              minSize: 0,
              priority: 60,
            },
            styles: {
              name: "styles",
              test: /\.(sa|sc|c)ss$/,
              chunks: "all",
              enforce: true,
            },
            runtimeChunk: {
              name: "manifest",
            },
          },
        },
      };
    } else {
      config.devtool = "cheap-source-map";
    }
  },

  devServer: {
    open: true,
    disableHostCheck: true,
    host: "0.0.0.0",
    port: 80,
    // proxy: "118.195.238.128:9345",
    proxy: {
      //配置代理，解决跨域请求后台数据的问题
      // '/api/resources': {
      //     target: 'http://localhost:8880', //novel后台接口，连接本地服务
      //     ws: true,
      //     //是否跨域
      //     changeOrigin: true,
      //     pathRewrite: {
      //         '^/api': '/'
      //     }
      // },
      "/dbs": {
        // target: "http://129.211.209.226:9345", //novel后台接口，连接本地服务
        //  target: "http://10.254.218.89:9346", //线上
        target: "http://foris.e3.luyouxia.net:10080", //gaojia
        ws: true,
        //是否跨域
        changeOrigin: true,
        pathRewrite: {
          "^/dbs": "/",
        },
      },
      [process.env.VUE_APP_BASE_API]: {
        // target: "http://129.211.209.226:9345", //api后台接口，连接本地服务
        // target: "http://10.254.218.89:9346", //线上
        target: "http://foris.e3.luyouxia.net:10080", //gaojia
        ws: true,
        //是否跨域
        changeOrigin: true,
        pathRewrite: {
          ["^" + process.env.VUE_APP_BASE_API]: "",
        },
      },
    },
  },
};
