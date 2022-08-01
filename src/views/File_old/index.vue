<template>
  <div class="tableWrapper">
    <OperationMenu
      @getTableDataByType="getTableDataByType"
      :selectionFile="selectionFile"
    ></OperationMenu>
    <!-- 面包屑导航栏 -->
    <BreadCrumb class="breadcrumb"></BreadCrumb>
    <FileTable
      :file-list="fileList"
      class="file-table"
      @selectionChange="selectionChange"
      @imgReviewData="imgReviewData"
      @pdfReviewData="pdfReviewData"
      @videoReviewData="videoReviewData"
      @audioReviewData="audioReviewData"
    ></FileTable>
    <ImgReview
      :imgReview="imgReview"
      @imgReviewData="imgReviewData"
    ></ImgReview>
    <PdfReview
      :pdfReview="pdfReview"
      @pdfReviewData="pdfReviewData"
    ></PdfReview>
    <VideoReview
      :videoReview="videoReview"
      @videoReviewData="videoReviewData"
    ></VideoReview>
    <AudioReview
      :audioReview="audioReview"
      @audioReviewData="audioReviewData"
    ></AudioReview>
  </div>
</template>

<script>
import FileTable from "@/components/FileTable";
import OperationMenu from "@/components/OperationMenu";
import BreadCrumb from "@/components/BreadCrumb";
import ImgReview from "@/components/ImgReview";
import PdfReview from "@/components/PdfReview";
import VideoReview from "@/components/VideoReview";
import AudioReview from "@/components/AudioReview";
import { listDir } from "@/api/file";
import { storageInfo } from "@/api/storage";

export default {
  name: "File",
  components: {
    FileTable,
    OperationMenu,
    BreadCrumb,
    ImgReview,
    PdfReview,
    VideoReview,
    AudioReview,
  },
  data() {
    return {
      fileList: [], //  表格数据-文件列表
      selectionFile: [],
      //  查看图片模态框数据
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
    folderId: function () {
      let folderIds = this.$route.query.folderId;
      if (folderIds && folderIds.endsWith(",")) {
        folderIds = folderIds.substring(0, folderIds.length - 1);
      }
      let folderIdList = folderIds ? folderIds.split(",") : [folderIds];
      let folderId = folderIdList[folderIdList.length - 1];
      if (folderId === "") {
        folderId = -1;
      }
      return folderId;
    },
    fileType: function () {
      return Number(this.$route.query.fileType);
    },
    fileName: function () {
      return this.$route.query.fileName;
    },
  },
};
</script>
<style scoped>
.tableWrapper {
  padding: 20px;
  width: 100%;
  display: block;
}

.file-table {
  overflow: hidden;
  height: calc(100vh - 176px);
}
</style>
