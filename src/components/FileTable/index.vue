<template>
  <div>
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
        <el-table-column
          fit
          prop="fileName"
          show-overflow-tooltip
          label="文件名"
        >
          <template slot-scope="scope">
            <div style="cursor: pointer" @click="clickFileName(scope.row)">
              <span>{{ formatName(scope.row) }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column fit prop="fileType" show-overflow-tooltip label="类型">
          <template slot-scope="scope">
            <span>{{ formatType(scope.row.document_suffix) }}</span>
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
        <el-table-column
          fit
          prop="creator"
          show-overflow-tooltip
          label="创建者"
        >
          <template slot-scope="scope">
            <div>
              <span>{{ scope.row.creator }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column fit prop="creator" show-overflow-tooltip label="操作">
          <template slot-scope="scope">
            <div>
              <div v-if="scope.row.documentSuffix">
                <el-button
                  v-if="!noPreviewList.includes(scope.row.documentType)"
                  @click="
                    () => {
                      handleFile('preview', scope.row);
                    }
                  "
                  type="text"
                  >预览</el-button
                >
                <el-button
                  v-if="
                    officeSuffix.includes(scope.row.documentSuffix) &&
                    scope.row.documentSuffix !== 'pdf'
                  "
                  @click="
                    () => {
                      handleFile('edit', scope.row);
                    }
                  "
                  type="text"
                  >编辑</el-button
                >
                <el-button
                  v-if="isPublicRoute"
                  @click="
                    () => {
                      handleFile('share', scope.row);
                    }
                  "
                  type="text"
                  >分享</el-button
                >
                <el-button
                  @click="
                    () => {
                      handleFile('publish', scope.row);
                    }
                  "
                  type="text"
                  >发布</el-button
                >
              </div>
              <div v-else>
                <el-button
                  v-if="
                    isPublicRoute &&
                    scope.row.collectFlag === 0 &&
                    scope.row.documentFlag === 'folder'
                  "
                  @click="
                    () => {
                      handleFolder('collect', scope.row);
                    }
                  "
                  type="text"
                  >收藏</el-button
                >
                <el-button
                  v-if="isPublicRoute && scope.row.collectFlag === 1"
                  @click="
                    () => {
                      handleFolder('removeCollect', scope.row);
                    }
                  "
                  type="text"
                  >取消收藏</el-button
                >
              </div>

              <!-- <el-dropdown
                v-if="scope.row.documentSuffix"
                @command="handleFile"
              >
                <span class="el-dropdown-link"> ... </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    :command="{ type: 'preview', file: scope.row }"
                    v-if="!noPreviewList.includes(scope.row.documentType)"
                    >预览</el-dropdown-item
                  >
                  <el-dropdown-item
                    :command="{ type: 'edit', file: scope.row }"
                    v-if="
                      officeSuffix.includes(scope.row.documentSuffix) &&
                        scope.row.documentSuffix !== 'pdf'
                    "
                    >编辑</el-dropdown-item
                  >
                  <el-dropdown-item
                    :command="{ type: 'share', file: scope.row }"
                    >分享</el-dropdown-item
                  >
                </el-dropdown-menu>
              </el-dropdown>
              <el-dropdown v-else @command="handleFolder">
                <span class="el-dropdown-link"> ... </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    :command="{ type: 'collect', file: scope.row }"
                    >收藏</el-dropdown-item
                  >
                  <el-dropdown-item
                    :command="{ type: 'preview', file: scope.row }"
                    >取消收藏</el-dropdown-item
                  >
                </el-dropdown-menu>
              </el-dropdown> -->
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
    <el-dialog title="分享" :visible.sync="shareVisible" width="40%">
      分享类型&nbsp;&nbsp;
      <el-radio-group
        v-model="shareType"
        @change="switchShareType"
        style="margin-bottom: 10px"
        v-if="officeSuffix.includes(targetFile.documentSuffix)"
      >
        <el-radio label="view">预览</el-radio>
        <el-radio label="edit">编辑</el-radio>
        <el-radio label="download">下载</el-radio>
      </el-radio-group>
      <div style="margin: 10px 0">
        分享时效&nbsp;&nbsp;
        <el-select
          v-model="aliveDays"
          @change="switchExpDate"
          size="small"
          style="width: 97px"
        >
          <el-option value="3" label="3天"></el-option>
          <el-option value="7" label="7天"></el-option>
          <el-option value="30" label="30天"></el-option>
          <el-option value="9999" label="长期"></el-option>
        </el-select>
      </div>
      <el-input :value="shareValue" size="small" readonly>
        <el-button slot="append" @click="handleCopy">复制</el-button>
      </el-input>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="shareVisible = false">关闭</el-button>
      </span>
    </el-dialog>
    <!-- <div ref="react"></div> -->
    <mainDialog />
  </div>
</template>

<script>
import {
  getPreviewDoc,
  getEditDoc,
  getPreviewImageUrl,
  getPreviewVideoUrl,
  queryShareLink,
  addCollect,
  removeCollect,
  getFileByte,
} from "@/api/file";
import { calculateFileSize } from "@/utils";
import copy from "copy-to-clipboard";
import { convertBase64UrlToFile, TYPE_MAP } from "./constant";

import React from "react";
// import ReactDOM from "react-dom";

import MainDialog from "../../assets/publish-dialog/publish-plugin.min";
import "../../assets/publish-dialog/main.css";

export default {
  name: "FileTable",
  components: {
    mainDialog: MainDialog,
  },
  // mounted() {
  //   ReactDOM.render(React.createElement(MainDialog), this.$refs.react);
  // },
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
      officeSuffix: ["docx", "doc", "xlsx", "xls", "csv", "pptx", "ppt", "pdf"], // doc类型 可
      canEditList: ["word", "docx", "doc", "xlsx", "xls", "csv", "pptx", "ppt"], //能编辑的文件
      noPreviewList: ["txt"], //不能预览的文件
      shareVisible: false,
      shareType: "view",
      targetFile: {},
      aliveDays: "3",
      shareValue: "",
    };
  },

  methods: {
    handleFile(type, file) {
      if (type === "preview") {
        //预览
        if (file.documentType === "picture") {
          this.$emit("imgReviewData", file, true);
        } else if (file.documentType === "video") {
          this.$emit("videoReviewData", file, true);
        } else if (file.documentType === "pack") {
          this.$emit("packReviewData", file, true);
        } else {
          window.open(
            getPreviewDoc(file.shortUrl || file.documentShortUrl, this.userId)
          );
        }
      } else if (type === "edit") {
        //编辑
        window.open(
          getEditDoc(file.shortUrl || file.documentShortUrl, this.userId)
        );
      } else if (type === "share") {
        //分享
        this.targetFile = file;
        this.getShareLink();
      } else if (type === "publish") {
        this.onPublishFile(file);
      }
    },
    handleFolder(type, file) {
      if (type === "collect") {
        addCollect({
          folderId: file.id || file.documentId,
          userId: this.userId,
        }).then((res) => {
          if (res.flag === "SUCCESS") {
            this.$message.success("收藏成功！");
            this.$emit("getTableDataWithPrivilege", this.search);
          } else {
            this.$message.error(res?.message ?? "收藏失败！");
          }
        });
      } else if (type === "removeCollect") {
        removeCollect({
          folderId: file.id || file.documentId,
          userId: this.userId,
        }).then((res) => {
          if (res.flag === "SUCCESS") {
            this.$message.success("取消收藏成功！");
            this.$emit("getTableDataWithPrivilege", this.search);
          } else {
            this.$message.error(res?.message ?? "取消收藏失败！");
          }
        });
      }
    },
    handleCopy(e) {
      if (copy(this.shareValue)) {
        this.$message.success("复制成功！");
      }
    },
    switchShareType(e) {
      this.shareType = e;
      this.getShareLink();
    },
    switchExpDate(e) {
      this.aliveDays = e;
      this.getShareLink();
    },
    getShareLink() {
      const file = this.targetFile;
      queryShareLink({
        fileId: file.id || file.documentId,
        // fileType: file.documentSuffix,
        fileType: file.documentType,
        shortUrl: file.shortUrl || file.documentShortUrl,
        shareType: this.shareType,
        aliveDays: this.aliveDays,
        creator: this.userId,
      }).then((res) => {
        if (res.flag === "SUCCESS") {
          this.shareVisible = true;
          this.shareValue = res?.linkContent;
        } else {
          this.$message.error(res?.message ?? "获取链接失败");
        }
      });
    },

    /**
     * 表格数据获取相关事件
     */
    //  根据文件扩展名设置文件图片
    setFileImg(extendName) {
      if (!extendName) {
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
            folderId: row.id || row.documentId,
            groupType: row.groupType,
          },
        });
      } //  若是文件，则进行相应的预览
      else {
        //  若当前点击项是图片
        const PIC = ["png", "jpg", "jpeg", "gif", "svg", "bmp"];
        if (PIC.includes(row.documentSuffix)) {
          this.$emit("imgReviewData", row, true);
          return;
        }
        if (this.officeSuffix.includes(row.documentSuffix)) {
          window.open(
            getPreviewDoc(row.shortUrl || row.documentShortUrl, this.userId)
          );
          return;
        }
        //  若当前点击项是pdf
        const TEXT = ["pdf"];
        // if (TEXT.includes(row.documentSuffix)) {
        //   console.log("pdfReviewData");
        //   this.$emit("pdfReviewData", row, true);
        //   // window.open(process.env.VUE_APP_BASE_API + "/file/preview?uri=" + row.userId + row.filePath + "&name=" + row.name, '_blank')
        // }
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
    onPublishFile(file) {
      getFileByte({
        shortUrl: file.shortUrl || file.documentShortUrl,
      }).then((res) => {
        const { flag, bytes } = res;
        if (flag === "SUCCESS") {
          const type = TYPE_MAP[file.documentSuffix];
          const achievement = convertBase64UrlToFile(
            bytes,
            file.documentName,
            type
          );
          console.log("achievement", achievement);
          const options = {
            appId: "4902148278edc095f113945c101e",
            userName: this.userId,
            systemName: "database_system",
            // "systemName":"网络拓扑图设计工具",
            // 动态链接成果 链接地址
            // achievementTrendsUrl: type.includes("image")
            //   ? `http://10.254.197.124:9099/workflow/workflow#/topoView/${file.id}`
            //   : null,
            // 静态文件成果片段
            achievement,
            //  动态链接成果 缩略图
            // thumbnail: type.includes("image") ? achievement : null,
            thumbnail: null,
            beforeUpload: (data) => console.info("上报成果参数", data),
            afterUpload: (data) => {
              console.info("上报成果结果 ", data);
              if (data.code === 200) {
                this.$message.success("发布队列上报成功!");
                //onOptionFlag = record => {
                //return async () => {
                // actions.topolaogy.editTopolaogy({
                //   id: file.id,
                //   delFlag: "0",
                // });
                // _this.onSearch();
                //};
                //};
              } else {
                this.$message.error("发布队列上报失败!" + data.msg);
              }
            },
          };
          window.UploadSDK.init(options);
        }
      });
    },
  },
  computed: {
    // shareValue: function() {
    //   const file = this.targetFile;
    //   const expParam = `&aliveDays=${this.aliveDays}`;
    //   if (this.shareType === "edit") {
    //     //可编辑链接 其他都预览链接
    //     return getEditDoc(file?.shortUrl, this.userId) + expParam;
    //   } else if (this.shareType === "download") {
    //   } else {
    //     if (file.documentType === "picture") {
    //       return getPreviewImageUrl(file?.shortUrl, this.userId) + expParam;
    //     } else if (file.documentType === "video") {
    //       return getPreviewVideoUrl(file?.shortUrl, this.userId) + expParam;
    //     } else {
    //       return getPreviewDoc(file.shortUrl, this.userId) + expParam;
    //     }
    //   }
    // },
    search: {
      get() {
        return this.$store.getters.search;
      },
      set(search) {
        this.$store.dispatch("setSearch", search);
      },
    },
    isPublicRoute: function () {
      return this.$route.name === "PublicFile";
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
