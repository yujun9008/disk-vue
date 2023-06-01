<template>
  <el-dialog
    :title="name"
    :visible.sync="packReview.visible"
    destroy-on-close
    width="50%"
    :modal="false"
    class="video-review-wrapper"
    v-loading="loading"
  >
    <div ref="pack-player" class="pack-large">
      <p v-for="zip in zipFileList" :key="zip.name">{{ zip.name }}</p>
    </div>
  </el-dialog>
</template>

<script>
import JsZip from "jszip";
import JSZipUtils from "jszip-utils";

function bufToBlob(buf, mimeType = "") {
  return new Blob([buf], { type: mimeType });
}

function readFile2Text(file) {
  const fileReader = new FileReader();
  debugger;
  fileReader.readAsArrayBuffer(bufToBlob(file, "text/html"));
  return new Promise((resolve) => {
    fileReader.onload = function () {
      const buf = this.result;
      const textDecoder = new TextDecoder("utf8");
      resolve(textDecoder.decode(buf));
    };
  });
}

export default {
  name: "PackReview",
  props: {
    packReview: Object,
  },
  data() {
    return {
      zipFileList: [],
      loading: false,
    };
  },
  methods: {
    //  关闭预览
    closeVideoReview() {
      console.log("closeVideoReview");
      if (this.mp && this.mp.destory) {
        this.mp.destory();
      }
      this.mp = null;
      this.$emit("videoReviewData", null, false);
    },

    // 用于获取url地址对应的文件内容
    getBinaryContent(url, progressFn = () => {}) {
      return new Promise((resolve, reject) => {
        if (typeof url !== "string" || !/https?:/.test(url))
          reject(new Error("url 参数不合法"));
        console.log("test", JSZipUtils.getBinaryContent);
        JSZipUtils.getBinaryContent(url, {
          // JSZipUtils来自于jszip-utils这个库
          progress: progressFn,
          callback: (err, data) => {
            if (err) {
              reject(err);
            } else {
              resolve(data);
            }
          },
        });
      });
    },
    async getZip(data) {},
  },
  watch: {
    packReview: {
      async handler(val) {
        console.log("init MuiPlayer", val && val.visible);
        if (val && val.visible) {
          this.loading = true;
          const data = await this.getBinaryContent(this.src, (progressData) => {
            const { percent, loaded, total } = progressData;
            // if (loaded === total) {
            // statusEle.innerText = "文件已下载，努力解压中";
            // }
            console.log("loaded", loaded);
          }).then(async (data) => {
            const zip = await JsZip.loadAsync(data);
            console.log("zip", zip.files);
            this.loading = false;
            this.zipFileList = zip.files;
          });
        }
      },
      deep: true,
      immediate: true,
    },
  },
  computed: {
    src() {
      return this.packReview.fileUrl;
      // return process.env.VUE_APP_BASE_API + "/file/preview?uri=" + this.packReview.fileUrl + "&name=" + this.packReview.name
    },
    name() {
      debugger;
      const index = this.packReview.name.lastIndexOf(".");
      return this.packReview.name.substr(0, index);
    },
  },
};
</script>

<style scoped>
.pack-review-wrapper {
}

.pack-large {
  width: 100%;
  height: 450px !important;
  max-height: 300px;
  overflow-y: auto;
}
</style>
