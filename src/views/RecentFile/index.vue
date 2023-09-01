<template>
  <div class="tableWrapper">
    <OperationMenu
      :isRecentFilePage="true"
      :recentFileList="fileList"
      @getTableDataByType="getTableDataByType"
      :selectionFile="selectionFile"
      :selectionRenameFile="selectionRenameFile"
    ></OperationMenu>
    <FileTable
      :file-list="fileList"
      :isRecentFilePage="true"
      class="file-table"
      @getTableDataByType="getTableDataByType"
      @getTableDataWithPrivilege="getTableDataWithPrivilege"
      @selectionChange="selectionChange"
      @renameChange="renameChange"
      @imgReviewData="imgReviewData"
      @pdfReviewData="pdfReviewData"
      @videoReviewData="videoReviewData"
      @packReviewData="packReviewData"
      @audioReviewData="audioReviewData"
    ></FileTable>
    <!-- <el-pagination
      background
      layout="prev, pager, next"
      :hide-on-single-page="true"
      :total="pagination.total"
      :page-size="pagination.size"
      @current-change="pageChange"
    >
    </el-pagination> -->
    <ImgReview
      :imgReview="imgReview"
      @imgReviewData="imgReviewData"
    ></ImgReview>
    <PdfReview
      :pdfReview="pdfReview"
      @pdfReviewData="pdfReviewData"
    ></PdfReview>
    <PackReview
      :packReview="packReview"
      @packReviewData="packReviewData"
    ></PackReview>
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
import PackReview from "@/components/PackReview";
import VideoReview from "@/components/VideoReview";
import AudioReview from "@/components/AudioReview";
import {
  listDir,
  queryFileList,
  queryFolderAndFiles,
  queryMyDir,
  getPreviewImageUrl,
  getPreviewVideoUrl,
  getPreviewPackUrl,
  queryWithPrivilege,
  listRecentFile,
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
    PackReview,
  },
  data() {
    return {
      fileList: [], //  表格数据-文件列表
      selectionFile: [],
      selectionRenameFile: {},
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
      packReview: {
        visible: false,
        fileUrl: "",
        name: "",
      },
      audioReview: {
        visible: false,
        fileUrl: "",
        name: "",
      },
      pagination: {},
      currentPage: 1,
    };
  },
  mounted() {
    document.title =  "最近文件";
  },
  methods: {
    /**
     * 表格数据获取相关事件
     */
    getTableDataByType(search) {
      this.fetchListRecentFile(search)
    },
    getTableDataWithPrivilege(search) {
      this.getWithPrivilege(search);
    },


    //  根据文件类型展示文件列表
    fetchListRecentFile(search, page = 1) {
      let params = {
        // page,
        // size: 20,
        // documentName: search,
        userId: this.userId,
      };

      listRecentFile(params)
        .then((res) => {
          this.fileList = res.fileList ?? [];
        })
        .catch((err) => console.log(err));
    },
   
    // pageChange(current) {
    //   this.currentPage = current;
    //   this.fetchListRecentFile(this.$store.getters.search, current);

    // },

    /**
     * 表格勾选框事件
     */
    selectionChange(selection) {
      this.selectionFile = selection;
    },
    renameChange(selection) {
      this.selectionRenameFile = {...selection, tempTime: +new Date()};
    },
    //  获取查看大图的数据
    imgReviewData(row, visible) {
      if (row) {
        this.imgReview.fileUrl = getPreviewImageUrl(
          row.documentShortUrl || row.shortUrl,
          this.userId
        );
        this.imgReview.name = row.name || row.documentName;
      }
      this.imgReview.visible = visible;
    },
    pdfReviewData(row, visible) {
      if (row) {
        this.pdfReview.fileUrl = row.userId + row.filePath;
        this.pdfReview.name = row.name || row.documentName;
      }
      this.pdfReview.visible = visible;
    },
    videoReviewData(row, visible) {
      console.log("videoReviewData", visible);
      if (row) {
        this.videoReview.fileUrl = getPreviewVideoUrl(
          row.documentShortUrl || row.shortUrl,
          this.userId
        );
        this.videoReview.name = row.name || row.documentName;
      }
      this.videoReview.visible = visible;
    },
    packReviewData(row, visible) {

      if (row) {
        this.packReview.fileUrl = getPreviewPackUrl(
          row.documentShortUrl || row.shortUrl,
          this.userId
        );
        debugger;
        this.packReview.name = row.name || row.documentName;
      }
      this.packReview.visible = visible;
    },
    audioReviewData(row, visible) {
      console.log("audioReviewData", visible);
      if (row) {
        this.audioReview.fileUrl = row.userId + row.filePath;
        this.audioReview.name = row.name || row.documentName;
      }
      this.audioReview.visible = visible;
    },
  },
  created() {
    this.getTableDataByType();
  },
  computed: {
    fileType: function () {
      return Number(this.$route.query.fileType);
    },
    fileName: function () {
      return this.$route.query.fileName;
    },
    groupType: function () {
      let groupType = this.$route.query.groupType;
      return groupType || null;
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
  /* height: calc(100vh - 176px); */
}
.el-pagination {
  text-align: center;
  margin: 20px 0;
}
</style>
