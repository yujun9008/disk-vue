<template>
  <div>
    <div
      v-for="folder in folderList"
      :key="folder.folderId"
      class="folder-card"
      @click="
        () => {
          toInfo(folder.folderId);
        }
      "
    >
      <div class="image">
        <img v-if="folder.imageUrl" :src="folder.imageUrl" alt="folder" />
        <img v-else :src="folderIcon" alt="folder" />
      </div>
      <div class="folder-card-wrapper">
        <p class="title">{{ folder.folderName }}</p>
        <p class="desc"></p>
      </div>
    </div>
    <div
      v-if="folderList.length > 10 && !isShowTotal"
      class="folder-card more"
      @click="showMore"
    >
      <p class="">更多</p>
      <!-- <p class="el-icon-caret-bottom"></p> -->
      <p class="desc el-icon-more"></p>
    </div>
  </div>
</template>

<script>
import { getPreviewImageUrl } from "@/api/file";
import { queryFirstPage } from "@/api/user";
export default {
  name: "Folders",
  props: {
    folderList: Array,
    type: String,
  },
  data() {
    return {
      folderIcon:
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAMAAAD04JH5AAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAABRUExURUxpcf/MOv/OP//JNP/DKf+4EP/XUP/CKf+6Ff++Hf/RQ//VS//TR//aVf+3Ef+9FP+5A//DJP/fi//14P/ln/+xDf/dZ//ief/Rcf/pvP/GSpk9oQ4AAAAKdFJOUwD////H4/8in2nKcBCgAAAER0lEQVR42u2ai5LbKgyGCyRO4luabb2393/QY5AAgbEtEtxp5/BjY4Ftfb/Y7Uy64cePqqqqqqqqqqqqqr9Xlx0dC79+gt4TGlDN6XYU/tSgull91xu1s2QrQQJ0jIWbTq2EcnrottBdt/sBDm4u+5zfKxgQXYuv/z1Tp8IGThzoSAfnS/kFGM05Yjgumg3gUtTBFdIHmAVZH+OIgY7Pp+u2bpecnwBwgGARlgpof2XrzPz3ct5Kkk0NdGWtwniQJr0Il+IGJsg8dxPEeMGINt2dcgxMySIcdbKxHs39NFGSmZzspI2mifF7gJmhv38X0IOYOO8bIOa/v34V0df35HRjGLDr9jm/GiZaBMHEF70XPvLpDFx5BqD+Hf3+4sutwZlv4O13Qb25tGwDj7eiemQbUJ9FpdgGrOXNBdXH3Nb0AS2Q/UC5a2CFuAFcwoBozveP6BMtewU2UhPGu2WEnGFu+sOzDgb3Kdpo10AaZCgfEQLbAIyQs6pdAzFk4OcuY2A4WP8nAw02F5hBGQNNENjOAAJc4AGeyTXQBDyM4qqww7DBx+F/l/ioE89AQywTFBwwh7nd/ZSGMBxYBvw6Do09B09LZvfjhZWFs30DmxpY88NGBs4KYIJhP9sTenEF/iEDnTlt37lLIQMddoBoKMK0jj4HT+KdfAPdMj/++YjAuw4ZcC7kJ1kGOsJ1C9hgZQlCE2Gtp5SbXQNYS/DusjCHTNa7Vj3XwGpl26l5yjJQBlnUQIZ6e+11CH/rnMNSBnpPoLzesxAYj5430Ls+lTsWFB4OjXYN9Ijo+o1S/LBbsFJeiBgG4jr6Lq7iFeUZOEB/wkA7N+jshB60oFIGWne2kB55COo9MVKGgTauqsVaTB8AVmCu8j7HQJjSlriufsdD7goE8AWoz4I9a+BFBJF82sCTMAOUUuovt2zgbkkTPG9AuqtNKm2MAxgbrI/d92wotgGbW+e1V4llQU4kShz4aKGWRAwD7pXWv2sv5JtDuYVc166BTfsFxDOAP8AixJdXoJAEdkcbENgLiIWbsN2LBgTphEMIC6Yx3jb3iTgGSIIwuSRTcBHCViuEPROSruMYEIKsIg6EryhKu0Kjo7wViJLIRHoZLKtcdZIUywCumIyrklmoFwwcqT9hQJn9F+ZqAmUvuhUxoHxPIBSjhMcGLyiWAfI8JbrSRFiWOUxoNp74DSjCHjjSEcOAogBPoSQY+7QujnF2zu+J2TdgagCS5TgEzCvCIKWKBU4EliDYNaBUgFCkPEGwIp5WKnhzmQYD3grgUtMlTCBU2um29rdwPJWWrf0dBFd1qPa/vL68injg1q/0BjDGJo5TDiO1x2xFZmsYZ9/XJdjCls94rG87Y+54um0AMP/jzt3v9VM3J+ZWolvWXrZxDCHrGtlb/y7nGMFlbOmUs+Pscj3/LCrmNqqsTa05qluEq6qqqqqqqqqq/mL9B15hMo40ijfcAAAAAElFTkSuQmCC",
      isShowTotal: false,
    };
  },
  methods: {
    toInfo(folderId) {
      // http://localhost/publicfile?folderId=21
      this.$router.push({
        path: "/publicfile",
        query: {
          folderId,
        },
      });
    },
    getImageUrl(shortUrl) {
      return getPreviewImageUrl(shortUrl, ths.userId);
    },
    showMore() {
      this.isShowTotal = true;
      this.$emit("showMore", this.type);
    },
  },
  computed: {
    userId: {
      get() {
        return this.$store.getters.userId;
      },
    },
  },
};
</script>

<style scoped>
.folder-card {
  display: inline-block;
  width: 128px;
  margin: 0 24px 24px 0;
  padding: 4px;
  border-radius: 8px;
  vertical-align: top;
  text-align: center;
  cursor: pointer;
  transition: all 0.25s;
}
.folder-card:hover {
  /* background-color: #f7f9fc; */
  background-color: #edefff;
}
.folder-card img {
  width: 60px;
  height: 60px;
}
.title {
  line-height: 18px;
  font-size: 12px;
  margin-top: 8px;
  color: #03081a;
  overflow: hidden;
  max-height: 36px;
  word-break: break-all;
}
.desc {
  font-size: 12px;
  color: #818999;
  line-height: 18px;
  margin-top: 2px;
}
.more {
  font-size: 15px;
  padding-top: 30px;
  padding-bottom: 22px;
}
</style>
