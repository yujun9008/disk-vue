<template>
  <el-dialog
    :title="name"
    :visible.sync="videoReview.visible"
    destroy-on-close
    width="50%"
    :modal="false"
    class="video-review-wrapper"
    :before-close="closeVideoReview"
  >
    <div ref="mui-player" class="video-large"></div>
  </el-dialog>
</template>

<script>
import "mui-player/dist/mui-player.min.css";
import MuiPlayerDesktopPlugin from "mui-player-desktop-plugin";
import MuiPlayer from "mui-player";

export default {
  name: "VideoReview",
  props: {
    videoReview: Object,
  },
  data() {
    return {
      mp: null,
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
  },
  watch: {
    videoReview: {
      handler(val) {
        console.log("init MuiPlayer", val && val.visible && !this.mp);
        if (val && val.visible && !this.mp) {
          this.$nextTick(() => {
            const muiPlayer = this.$refs["mui-player"];
            this.mp = new MuiPlayer({
              container: muiPlayer,
              src: this.src,
              plugins: [new MuiPlayerDesktopPlugin()],
            });
          });
        }
      },
      deep: true,
      immediate: true,
    },
  },
  computed: {
    src() {
      return this.videoReview.fileUrl;
      // return process.env.VUE_APP_BASE_API + "/file/preview?uri=" + this.videoReview.fileUrl + "&name=" + this.videoReview.name
    },
    name() {
      const index = this.videoReview.name.lastIndexOf(".");
      return this.videoReview.name.substr(0, index);
    },
  },
};
</script>

<style scoped>
.video-review-wrapper {
}

.video-large {
  width: 100%;
  height: 450px !important;
}

</style>
