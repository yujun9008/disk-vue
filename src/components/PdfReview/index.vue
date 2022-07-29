<template>
  <div
      class="pdf-review-wrapper"
      v-show="pdfReview.visible"
      @click.self="closePdfReview"
  >
    <div class="pdf-large">
      <pdf
          ref="pdf"
          v-if="pdfReview.fileUrl"
          :src="src"
          :page="pageNum"
          :rotate="pageRotate"
          @progress="loadedRatio = $event"
          @page-loaded="pageLoaded($event)"
          @num-pages="pageTotalNum=$event"
          @error="pdfError($event)"
          @link-clicked="pageNum = $event">
      </pdf>
    </div>
    <div class="opera-btn-group">
      <el-button class="opera-btn" @click="prePage" type="primary" size="mini">上一页</el-button>
      <el-button class="opera-btn" @click="nextPage" type="primary" size="mini">下一页</el-button>
      <div class="pages">{{ pageNum }}/{{ pageTotalNum }}</div>
      <el-button class="opera-btn" @click="clock" type="primary" size="mini">顺时针</el-button>
      <el-button class="opera-btn" @click="counterClock" type="primary" size="mini">逆时针</el-button>
    </div>
  </div>
</template>

<script>
import pdf from 'vue-pdf'

export default {
  name: "PdfReview",
  components: {
    pdf
  },
  props: {
    pdfReview: Object
  },
  data() {
    return {
      pageNum: 1,
      pageTotalNum: 1,
      pageRotate: 0,
      // 加载进度
      loadedRatio: 0,
      curPageNum: 0,
    }
  },
  methods: {
    //  关闭预览
    closePdfReview() {
      this.$emit('pdfReviewData', null, false);
    },
    // 上一页函数，
    prePage() {
      let page = this.pageNum;
      page = page > 1 ? page - 1 : this.pageTotalNum;
      this.pageNum = page
    },
    // 下一页函数
    nextPage() {
      let page = this.pageNum;
      page = page < this.pageTotalNum ? page + 1 : 1;
      this.pageNum = page
    },
    // 页面顺时针翻转90度。
    clock() {
      this.pageRotate += 90
    },
    // 页面逆时针翻转90度。
    counterClock() {
      this.pageRotate -= 90
    },
    // 页面加载回调函数，其中e为当前页数
    pageLoaded(e) {
      this.curPageNum = e
    },
    // 其他的一些回调函数。
    pdfError(error) {
      console.error(error)
    },
  },
  computed: {
    src: function () {
      return process.env.VUE_APP_BASE_API + "/file/preview?uri=" + this.pdfReview.fileUrl + "&name=" + this.pdfReview.name
    }
  }
}
</script>

<style scoped>
.pdf-review-wrapper {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: auto;
  width: 100%;
  height: 100%;
  z-index: 2010;
  text-align: center;
  display: flex;
  padding-top: 10px;
  animation: pdfReviewAnimation 0.3s;
  -webkit-animation: pdfReviewAnimation 0.3s; /* Safari and Chrome */
  animation-iteration-count: 0.3;
  -webkit-animation-iteration-count: 0.3;
  animation-fill-mode: forwards;
  -webkit-animation-fill-mode: forwards; /* Safari 和 Chrome */
}

@keyframes pdfReviewAnimation {
  0% {
    background: transparent;
  }
  100% {
    background: rgba(0, 0, 0, 0.8);
  }
}

.pdf-large {
  flex: 1;
  margin: 0 auto;
  max-width: 30%;
  max-height: 80%;
  transition: transform 0.5s;
  -webkit-transition: transform 0.5s; /* Safari */
}

.opera-btn-group {
  background: rgba(0, 0, 0, 0.5);
  position: fixed;
  right: 0;
  bottom: 20px;
  left: 0;
  margin: 0 auto;
  border-radius: 6px;
  width: 600px;
  color: #fff;
  padding: 10px;
}

.opera-btn {

}

.pages {
  display: inline-block;
  font-size: 16px;
  margin: 0 10px;
}
</style>
