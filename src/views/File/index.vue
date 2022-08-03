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
import {
  listDir,
  queryFileList,
  queryFolderAndFiles,
  queryMyDir,
  getPreviewImageUrl,
  getPreviewVideoUrl,
} from "@/api/file";
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
    },

    //  根据文件类型展示文件列表
    showFileListByType(search) {
      let params = {
        folderId: this.folderId,
        page: 1,
        size: 20,
      };

      queryFolderAndFiles(params)
        .then((res) => {
          this.fileList = res.pageInfo?.records ?? [];
        })
        .catch((err) => console.log(err));
    },
    initMyFile(search) {
      queryMyDir({
        userId: this.userId,
      })
        .then((res) => {
          if (res.flag === "SUCCESS") {
            this.fileList = res.pageInfo?.records ?? [];
            this.$router.replace({
              query: { ...this.$route.query, folderId: res?.folderId },
            });
          } else {
            this.$message.error(res.message || "查询失败！");
          }
        })
        .catch((err) => console.log(err));
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
        console.log("row121212.1", row.shortUrl);
        this.imgReview.fileUrl = getPreviewImageUrl(row.shortUrl, this.userId);
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
        this.videoReview.fileUrl = getPreviewVideoUrl(
          row.shortUrl,
          this.userId
        );
        this.videoReview.name = row.documentName;
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
    if (this.$route.name === "MineFile" && !this.$route.query?.folderId) {
      //我的文件
      this.initMyFile();
    } else {
      this.showFileListByType(this.$store.getters.search);
    }
  },
  computed: {
    folderId: function () {
      let folderIds = this.$route.query.folderId;
      if (folderIds && folderIds.endsWith(",")) {
        folderIds = folderIds.substring(0, folderIds.length - 1);
      }
      let folderIdList = folderIds ? folderIds.split(",") : [folderIds];
      let folderId = folderIdList[folderIdList.length - 1];
      if (!folderId) {
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
    userId: {
      get() {
        return this.$store.getters.userId;
      },
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
