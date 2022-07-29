<template>
  <div class="audio-review-wrapper clearfix" v-if="audioReview.visible">
    <i class="el-icon-circle-close close" :style="floatStyleObj" @click="closeAudioReview"></i>
    <aplayer ref="aplayer" autoplay float
             :music="{
                    title: name,
                    src: src,
                    pic: '',
                    artist:'未知'
                  }"
    />
  </div>
</template>

<script>
import Aplayer from 'vue-aplayer'

Aplayer.disableVersionBadge = true
export default {
  name: "AudioReview",
  components: {
    Aplayer
  },
  props: {
    audioReview: Object
  },
  data() {
    return {
      ap: null,
      floatOffsetLeft: 0,
      floatOffsetTop: 0
    }
  },
  methods: {
    //  关闭预览
    closeAudioReview() {
      this.ap = null
      this.$emit('audioReviewData', null, false);
    },
  },
  watch: {
    audioReview: {
      handler(val) {
        if (val && val.visible && !this.mp) {
          this.$nextTick(() => {
            let aplayer = this.$refs.aplayer;
            this.$watch(
                function () {
                  return aplayer.floatOffsetLeft;
                },
                (val) => {
                  this.floatOffsetLeft = val;
                }
            );

            this.$watch(
                function () {
                  return aplayer.floatOffsetTop;
                },
                (val) => {
                  this.floatOffsetTop = val;
                }
            );
          })
        }
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    this.$nextTick(() => {

    })
  },
  computed: {
    src() {
      return process.env.VUE_APP_BASE_API + "/file/preview?uri=" + this.audioReview.fileUrl + "&name=" + this.audioReview.name
    },
    floatStyleObj() {
      return {
        transform: `translate(${this.floatOffsetLeft}px, ${this.floatOffsetTop}px)`,
        webkitTransform: `translate(${this.floatOffsetLeft}px, ${this.floatOffsetTop}px)`,
      }
    },
    name() {
      const index = this.audioReview.name.lastIndexOf(".");
      return this.audioReview.name.substr(0, index);
    }
  }
}
</script>

<style scoped>

.audio-review-wrapper {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 400px;
  z-index: 9999;
}

.close {
  position: absolute;
  z-index: 5555;
  right: 0;
  top: 0;
  cursor: pointer;
  border-radius: 50%;
  box-shadow: 0 0 6px rgba(0, 0, 0, .12);
}

.close:hover {
  box-shadow: 0 0 6px rgba(0, 0, 0, .3);
  background-color: rgba(0, 0, 0, 0.05);
}
</style>
