<template>
  <div class="indexWrapper">
    <h3>您是下列目录管理员</h3>
    <div class="folder-card">
      <div class="image">
        <img :src="folderIcon" alt="folder" />
      </div>
      <div class="folder-card-wrapper">
        <p class="title">test1</p>
        <p class="desc">07-27 22:29</p>
      </div>
    </div>
    <el-divider></el-divider>
    <h3>您是下列目录新增者</h3>
    <div class="folder-card">
      <div class="image">
        <img :src="folderIcon" alt="folder" />
      </div>
      <div class="folder-card-wrapper">
        <p class="title">test1</p>
        <p class="desc">07-27 22:29</p>
      </div>
    </div>
    <el-divider></el-divider>
    <h3>您是下列目录浏览者</h3>
    <div class="folder-card">
      <div class="image">
        <img :src="folderIcon" alt="folder" />
      </div>
      <div class="folder-card-wrapper">
        <p class="title">test1</p>
        <p class="desc">07-27 22:29</p>
      </div>
    </div>
    <el-divider></el-divider>
    <h3>您是下列目录删除者</h3>
    <div class="folder-card">
      <div class="image">
        <img :src="folderIcon" alt="folder" />
      </div>
      <div class="folder-card-wrapper">
        <p class="title">test1</p>
        <p class="desc">07-27 22:29</p>
      </div>
    </div>
  </div>
</template>

<script>
import { listDir } from "@/api/file";

export default {
  name: "Index",
  components: {},
  data() {
    return {
      folderIcon:
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAMAAAD04JH5AAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAABRUExURUxpcf/MOv/OP//JNP/DKf+4EP/XUP/CKf+6Ff++Hf/RQ//VS//TR//aVf+3Ef+9FP+5A//DJP/fi//14P/ln/+xDf/dZ//ief/Rcf/pvP/GSpk9oQ4AAAAKdFJOUwD////H4/8in2nKcBCgAAAER0lEQVR42u2ai5LbKgyGCyRO4luabb2393/QY5AAgbEtEtxp5/BjY4Ftfb/Y7Uy64cePqqqqqqqqqqqqqr9Xlx0dC79+gt4TGlDN6XYU/tSgull91xu1s2QrQQJ0jIWbTq2EcnrottBdt/sBDm4u+5zfKxgQXYuv/z1Tp8IGThzoSAfnS/kFGM05Yjgumg3gUtTBFdIHmAVZH+OIgY7Pp+u2bpecnwBwgGARlgpof2XrzPz3ct5Kkk0NdGWtwniQJr0Il+IGJsg8dxPEeMGINt2dcgxMySIcdbKxHs39NFGSmZzspI2mifF7gJmhv38X0IOYOO8bIOa/v34V0df35HRjGLDr9jm/GiZaBMHEF70XPvLpDFx5BqD+Hf3+4sutwZlv4O13Qb25tGwDj7eiemQbUJ9FpdgGrOXNBdXH3Nb0AS2Q/UC5a2CFuAFcwoBozveP6BMtewU2UhPGu2WEnGFu+sOzDgb3Kdpo10AaZCgfEQLbAIyQs6pdAzFk4OcuY2A4WP8nAw02F5hBGQNNENjOAAJc4AGeyTXQBDyM4qqww7DBx+F/l/ioE89AQywTFBwwh7nd/ZSGMBxYBvw6Do09B09LZvfjhZWFs30DmxpY88NGBs4KYIJhP9sTenEF/iEDnTlt37lLIQMddoBoKMK0jj4HT+KdfAPdMj/++YjAuw4ZcC7kJ1kGOsJ1C9hgZQlCE2Gtp5SbXQNYS/DusjCHTNa7Vj3XwGpl26l5yjJQBlnUQIZ6e+11CH/rnMNSBnpPoLzesxAYj5430Ls+lTsWFB4OjXYN9Ijo+o1S/LBbsFJeiBgG4jr6Lq7iFeUZOEB/wkA7N+jshB60oFIGWne2kB55COo9MVKGgTauqsVaTB8AVmCu8j7HQJjSlriufsdD7goE8AWoz4I9a+BFBJF82sCTMAOUUuovt2zgbkkTPG9AuqtNKm2MAxgbrI/d92wotgGbW+e1V4llQU4kShz4aKGWRAwD7pXWv2sv5JtDuYVc166BTfsFxDOAP8AixJdXoJAEdkcbENgLiIWbsN2LBgTphEMIC6Yx3jb3iTgGSIIwuSRTcBHCViuEPROSruMYEIKsIg6EryhKu0Kjo7wViJLIRHoZLKtcdZIUywCumIyrklmoFwwcqT9hQJn9F+ZqAmUvuhUxoHxPIBSjhMcGLyiWAfI8JbrSRFiWOUxoNp74DSjCHjjSEcOAogBPoSQY+7QujnF2zu+J2TdgagCS5TgEzCvCIKWKBU4EliDYNaBUgFCkPEGwIp5WKnhzmQYD3grgUtMlTCBU2um29rdwPJWWrf0dBFd1qPa/vL68injg1q/0BjDGJo5TDiO1x2xFZmsYZ9/XJdjCls94rG87Y+54um0AMP/jzt3v9VM3J+ZWolvWXrZxDCHrGtlb/y7nGMFlbOmUs+Pscj3/LCrmNqqsTa05qluEq6qqqqqqqqqq/mL9B15hMo40ijfcAAAAAElFTkSuQmCC",
      imgReview: {
        visible: false,
        fileUrl: "",
        name: "",
      },
      pdfReview: {
        visible: false,
        fileUrl: "",
        name: "",
      },
      videoReview: {
        visible: false,
        fileUrl: "",
        name: "",
      },
      audioReview: {
        visible: false,
        fileUrl: "",
        name: "",
      },
    };
  },
  methods: {
    /**
     * 表格数据获取相关事件
     */
    getTableDataByType(search) {
      //  分类型
      this.showFileListByType(search);
      // storageInfo().then((res) => {
      //   this.$store.dispatch("setStorage", res.data);
      // });
      this.$store.dispatch("setStorage", {
        storageId: 1,
        totalSize: 10737418240,
        usedSize: 18039003,
        userId: 1,
      });
    },

    //  根据文件类型展示文件列表
    showFileListByType(search) {
      // let data = {
      //   folderId: this.folderId,
      //   type: this.fileType,
      //   fileName: search,
      //   _: new Date().getTime(),
      // };

      let params = {
        folderId: this.folderId,
      };

      listDir(params)
        .then((res) => {
          this.fileList = res.subFolderList;
        })
        .catch((err) => console.log(err));
      // this.fileList = [
      //   {
      //     createTime: "2022-04-24T15:40:36.527+00:00",
      //     downloadNum: 0,
      //     extendName: "jpg",
      //     fileId: 13,
      //     fileName: "/57994_20161202110049/a.jpg",
      //     filePath:
      //       "/6e46623f82c74dd190219123fb7b4932/5c85d0ee1ddcb56e8e8725fc7e966085.jpg",
      //     fileSize: 37955,
      //     hash: "5c85d0ee1ddcb56e8e8725fc7e966085",
      //     isDir: false,
      //     lastModifyTime: "2022-04-24T15:40:36.527+00:00",
      //     name: "a.jpg",
      //     path: "5c85d0ee1ddcb56e8e8725fc7e966085.jpg",
      //     folderId: 2,
      //     type: 1,
      //     typeName: null,
      //     url: null,
      //     userId: 1,
      //   },
      // ];
    },

    /**
     * 表格勾选框事件
     */
    selectionChange(selection) {
      this.selectionFile = selection;
    },
    //  获取查看大图的数据
    imgReviewData(row, visible) {
      if (row) {
        this.imgReview.fileUrl = row.userId + row.filePath;
        this.imgReview.name = row.name;
      }
      this.imgReview.visible = visible;
    },
    pdfReviewData(row, visible) {
      if (row) {
        this.pdfReview.fileUrl = row.userId + row.filePath;
        this.pdfReview.name = row.name;
      }
      this.pdfReview.visible = visible;
    },
    videoReviewData(row, visible) {
      console.log("videoReviewData", visible);
      if (row) {
        this.videoReview.fileUrl = row.userId + row.filePath;
        this.videoReview.name = row.name;
      }
      this.videoReview.visible = visible;
    },
    audioReviewData(row, visible) {
      console.log("audioReviewData", visible);
      if (row) {
        this.audioReview.fileUrl = row.userId + row.filePath;
        this.audioReview.name = row.name;
      }
      this.audioReview.visible = visible;
    },
  },
  created() {
    this.getTableDataByType(this.$store.getters.search);
  },
  computed: {
    fileName: function () {
      return this.$route.query.fileName;
    },
  },
};
</script>
<style scoped>
.indexWrapper {
  padding: 20px;
  width: 100%;
  display: block;
}
h3 {
  font-weight: 400;
  color: #1f2f3d;
  margin-bottom: 10px;
}

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
  background-color: #f7f9fc;
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
</style>
