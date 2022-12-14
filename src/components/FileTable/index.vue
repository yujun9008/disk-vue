<template>
  <el-scrollbar :native="false" tag="section" :noresize="false">
    <el-table
      class="dataTable"
      :data="fileList"
      width="100%"
      ref="multipleTable"
      stripe
      fit
      tooltip-effect="dark"
      element-loading-text="数据加载中"
      @selection-change="selectionChange"
    >
      <el-table-column type="selection" fixed width="55"> </el-table-column>
      <el-table-column prop="documentFlag" width="60">
        <template slot-scope="scope">
          <img
            :src="setFileImg(scope.row.documentSuffix)"
            style="width: 30px"
            alt=""
          />
        </template>
      </el-table-column>
      <el-table-column fit prop="fileName" show-overflow-tooltip label="文件名">
        <template slot-scope="scope">
          <div style="cursor: pointer" @click="clickFileName(scope.row)">
            <span>{{ formatName(scope.row) }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column fit prop="fileType" show-overflow-tooltip label="类型">
        <template slot-scope="scope">
          <span>{{ formatType(scope.row.documentSuffix) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        fit
        prop="createTime"
        show-overflow-tooltip
        label="创建时间"
      >
        <template slot-scope="scope">
          <div>
            <span>{{ scope.row.createTime }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column fit prop="creator" show-overflow-tooltip label="创建者">
        <template slot-scope="scope">
          <div>
            <span>{{ scope.row.creator }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column fit prop="creator" show-overflow-tooltip label="操作">
        <template slot-scope="scope">
          <div>
            <el-dropdown v-if="scope.row.documentSuffix" @command="handleFile">
              <span class="el-dropdown-link"> ... </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  :command="{ type: 'preview', file: scope.row }"
                  v-if="!noPreviewList.includes(scope.row.documentType)"
                  >预览</el-dropdown-item
                >
                <el-dropdown-item
                  :command="{ type: 'edit', file: scope.row }"
                  v-if="canEditList.includes(scope.row.documentType)"
                  >编辑</el-dropdown-item
                >
                <el-dropdown-item :command="{ type: 'share', file: scope.row }"
                  >分享</el-dropdown-item
                >
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </template>
      </el-table-column>

      <!-- <el-table-column
        label="大小"
        width="80"
        prop="fileSize"
        show-overflow-tooltip
        align="right"
      >
        <template slot-scope="scope">
          <div style="padding: 0 10px">
            {{ calculateSize(scope.row.fileSize) }}
          </div>
        </template>
      </el-table-column> -->
    </el-table>
  </el-scrollbar>
</template>

<script>
import { getPreviewDoc, getEditDoc } from "@/api/file";
import { calculateFileSize } from "@/utils";

export default {
  name: "FileTable",
  props: {
    fileList: Array,
  },
  data() {
    return {
      //  文件图片Map映射
      fileImgMap: {
        dir: require("@/assets/images/file/dir.png"),
        chm: require("@/assets/images/file/file_chm.png"),
        css: require("@/assets/images/file/file_css.png"),
        csv: require("@/assets/images/file/file_csv.png"),
        png: require("@/assets/images/file/file_pic.png"),
        jpg: require("@/assets/images/file/file_pic.png"),
        jpeg: require("@/assets/images/file/file_pic.png"),
        bmp: require("@/assets/images/file/file_pic.png"),
        docx: require("@/assets/images/file/file_word.png"),
        doc: require("@/assets/images/file/file_word.png"),
        ppt: require("@/assets/images/file/file_ppt.png"),
        pptx: require("@/assets/images/file/file_ppt.png"),
        xls: require("@/assets/images/file/file_excel.png"),
        xlsx: require("@/assets/images/file/file_excel.png"),
        mp4: require("@/assets/images/file/file_video.png"),
        avi: require("@/assets/images/file/file_avi.png"),
        rar: require("@/assets/images/file/file_rar.png"),
        zip: require("@/assets/images/file/file_zip.png"),
        dmg: require("@/assets/images/file/file_dmg.png"),
        mp3: require("@/assets/images/file/file_music.png"),
        flac: require("@/assets/images/file/file_music.png"),
        open: require("@/assets/images/file/file_open.png"),
        pdf: require("@/assets/images/file/file_pdf.png"),
        rtf: require("@/assets/images/file/file_rtf.png"),
        txt: require("@/assets/images/file/file_txt.png"),
        log: require("@/assets/images/file/file_txt.png"),
        oa: require("@/assets/images/file/file_oa.png"),
        unknown: require("@/assets/images/file/file_unknown.png"),
        js: require("@/assets/images/file/file_js.png"),
        html: require("@/assets/images/file/file_html.png"),
        img: require("@/assets/images/file/file_img.png"),
        sql: require("@/assets/images/file/file_sql.png"),
        jar: require("@/assets/images/file/file_jar.png"),
        svg: require("@/assets/images/file/file_svg.png"),
        gif: require("@/assets/images/file/file_gif.png"),
        json: require("@/assets/images/file/file_json.png"),
        exe: require("@/assets/images/file/file_exe.png"),
        md: require("@/assets/images/file/file_code.png"),
        yml: require("@/assets/images/file/file_yml.png"),
        xml: require("@/assets/images/file/file_xml.png"),
        apk: require("@/assets/images/file/file_apk.png"),
        iso: require("@/assets/images/file/file_iso.png"),
      },
      //  可以识别的文件类型
      fileImgTypeList: [
        "png",
        "jpg",
        "jpeg",
        "docx",
        "doc",
        "ppt",
        "pptx",
        "xls",
        "xlsx",
        "avi",
        "mp4",
        "css",
        "csv",
        "chm",
        "rar",
        "zip",
        "dmg",
        "mp3",
        "flac",
        "open",
        "pdf",
        "rtf",
        "txt",
        "oa",
        "js",
        "html",
        "img",
        "sql",
        "jar",
        "svg",
        "gif",
        "json",
        "exe",
        "md",
        "yml",
        "xml",
        "apk",
        "iso",
        "bmp",
        "log",
      ],
      canEditList:['docx','doc','xlsx','xls','csv','pptx','ppt'], //能编辑的文件
      noPreviewList: ['txt'],//不能预览的文件
    };
  },
  methods: {
    handleFile(e) {
      const { type, file } = e;
      if (type === "preview") {
        //预览
        if(file.documentType === 'picture'){
          this.$emit("imgReviewData", file, true);
        }else if(file.documentType === 'video'){
          this.$emit("videoReviewData", file, true);
        }else{
            getPreviewDoc(file.shortUrl, this.userId)
        }
      } else if (type === "edit") {
        //编辑
        getEditDoc(file.shortUrl, this.userId)
      } else if (type === "share") {
        //分享
      }
    },
    /**
     * 表格数据获取相关事件
     */
    //  根据文件扩展名设置文件图片
    setFileImg(extendName) {
      if (extendName === null) {
        //  文件夹
        return this.fileImgMap.dir;
      } else if (!this.fileImgTypeList.includes(extendName)) {
        //  无法识别文件类型的文件
        return this.fileImgMap.unknown;
      } else {
        //  可以识别文件类型的文件
        return this.fileImgMap[extendName];
      }
    },

    /**
     * 表格勾选框事件
     */
    //  表格-全选事件, selectoin 勾选的行数据
    selectionChange(selection) {
      this.$emit("selectionChange", selection);
    },
    formatName(row) {
      let name = row.documentName.split(".");
      return name[0];
    },
    formatType(type) {
      if (!type) {
        return "文件夹";
      } else {
        return type;
      }
    },
    formatter(row) {
      let name = row.fileName.split("/");
      return name[name.length - 1];
    },
    calculateSize(size) {
      return calculateFileSize(size);
    },
    //  点击文件名
    clickFileName(row) {
      //  若是目录则进入目录
      if (!row.documentSuffix) {
        this.$router.push({
          query: {
            folderId: row.id,
          },
        });
      } //  若是文件，则进行相应的预览
      else {
        //  若当前点击项是图片
        const PIC = ["png", "jpg", "jpeg", "gif", "svg", "bmp"];
        if (PIC.includes(row.documentSuffix)) {
          this.$emit("imgReviewData", row, true);
        }
        //  若当前点击项是pdf
        const TEXT = ["pdf"];
        if (TEXT.includes(row.documentSuffix)) {
          console.log("pdfReviewData");
          this.$emit("pdfReviewData", row, true);
          // window.open(process.env.VUE_APP_BASE_API + "/file/preview?uri=" + row.userId + row.filePath + "&name=" + row.name, '_blank')
        }
        //  若当前点击项是html、js、css、json
        const CODE = ["html", "js", "css", "json", "md", "txt", "log"];
        if (CODE.includes(row.documentSuffix)) {
          window.open(
            process.env.VUE_APP_BASE_API +
              "/file/preview?uri=" +
              row.userId +
              row.filePath +
              "&name=" +
              row.name,
            "_blank"
          );
        }
        //  若当前点击项是视频mp4格式
        const VIDEO = ["mp4"];
        if (VIDEO.includes(row.documentSuffix)) {
          console.log("videoReviewData");
          this.$emit("videoReviewData", row, true);
          // window.open(process.env.VUE_APP_BASE_API + "/file/preview?uri=" + row.userId + row.filePath + "&name=" + row.name, '_blank')
        }
        //  若当前点击项是视频mp3格式
        const AUDIO = ["mp3", "flac"];
        if (AUDIO.includes(row.documentSuffix)) {
          this.$emit("audioReviewData", row, true);
          // window.open(process.env.VUE_APP_BASE_API + "/file/preview?uri=" + row.userId + row.filePath + "&name=" + row.name, '_blank')
        }
      }
    },
  },
  computed: {
    fileType: function () {
      return Number(this.$route.query.fileType);
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
.table {
  width: calc(100%);
}

.dataTable {
  flex: 1;
}
.el-dropdown-link {
  cursor: pointer;
  color: #409eff;
}
</style>
