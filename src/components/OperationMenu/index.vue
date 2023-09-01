<template>
  <div>
    <div class="all-statistics">
      <span v-if="!isRecentFilePage"
        >目录<b>{{ subFoldersNum }}</b></span
      >
      <span
        >文件<b>{{ subFilesNum }}</b></span
      >
    </div>
    <div class="operation-menu-wrapper">
      <div class="operation-menu-inner" v-if="!isRecentFilePage">
      <el-button-group  class="operation-buttons">
        <!-- :file-list="fileList" -->
        <!-- :http-request="uploadBpmn" -->
        <el-upload
          class="upload-demo"
          :show-file-list="false"
          name="file"
          multiple
          :action="action"
          :on-change="handleUploadChange"
          :auto-upload="false"
        >
          <el-button
            type="primary"
            size="small"
            ref="uploadRef"
            icon="el-icon-upload2"
            >上传</el-button
          >
        </el-upload>
      </el-button-group>
      <el-dropdown style="margin-left: 15px" @command="handleCreateDoc">
        <el-button size="small">
          创建文档<i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="word">Word文档</el-dropdown-item>
          <el-dropdown-item command="excel">Excel表格</el-dropdown-item>
          <el-dropdown-item command="ppt">PPT</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-button-group class="operation-buttons">
        <el-button
          class="new-dir"
          size="small"
          @click="newDir"
          icon="el-icon-folder-add"
          >新建文件夹</el-button
        >
      </el-button-group>
      </div>
      <el-button-group class="operation-buttons">
        <el-button
          plain
          size="small"
          icon="el-icon-download"
          :disabled="!isDownload"
          @click="downLoad"
          >下载
        </el-button>
        <el-button
          plain
          size="small"
          @click="deleteSelectedFile"
          :disabled="!isDelete"
          icon="el-icon-delete"
          >删除
        </el-button>
         <el-button
          plain
          size="small"
          v-if="isRecentFilePage"
          @click="singleMoveTo"
          :disabled="!isMove"
          icon="el-icon-guide"
          >移动
        </el-button>
         <el-button
          plain
          size="small"
          v-else
          @click="moveTo"
          :disabled="!isMove"
          icon="el-icon-guide"
          >批量移动
        </el-button>
        <el-button
          style="display: none"
          plain
          size="small"
          @click="rename"
          :disabled="!isReName"
          >设置</el-button
        >
        <!-- <el-button plain size="small" :disabled="!isCopy" @click="copyTo"
        >复制到</el-button
      >
      <el-button plain size="small" @click="moveTo" :disabled="!isMove"
        >移动到</el-button
      > -->
      </el-button-group>
      <!-- <el-button-group class="operation-buttons">
      <el-button
        class="decompression"
        :disabled="!decompression"
        @click="unzip"
        size="small"
        >解压</el-button
      >
      <el-button
        class="compress"
        :disabled="!compress"
        size="small"
        @click="zip"
        >压缩</el-button
      >
    </el-button-group> -->
      <div class="image-model" style="display: none">
        <a><i class="el-icon-menu"></i></a>
      </div>
      <div class="search" v-if="!isRecentFilePage">
        <el-input
          v-model="search"
          :placeholder="searchPlaceholder"
          clearable
          size="small"
          @keyup.enter.native="searchFileByName"
          @clear="searchFileByName"
          ><el-button
            slot="append"
            icon="el-icon-search"
            @click="searchFileByName"
          ></el-button
        ></el-input>
      </div>
      <el-dialog
        title="上传文件"
        :visible.sync="upoadModalVisible"
        :before-close="handleClearFile"
      >
        <div v-if="showProgress">
          <el-progress
            :text-inside="true"
            :stroke-width="26"
            :percentage="progressPercentage"
          ></el-progress>
        </div>
        <div v-for="(file, index) in fileList" :key="index">
          <p
            v-if="fileList.length > 1 && fileSizeLimitArr.includes(file.name)"
            class="limt-file"
          >
            {{ file.name }}(文件大小超过{{
              parseInt(fileMaxLimit / 1024 / 1024)
            }}M阈值，请单独上传！)
          </p>
          <p v-else>{{ file.name }}</p>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button size="small" @click="submitUpload" type="primary" :loading="showProgress"
            >点击上传</el-button
          >
        </span>
      </el-dialog>
      <el-dialog title="文件移动到" :visible.sync="dialogVisible" width="30%">
        <el-tree
          :data="dirData"
          :props="defaultProps"
          accordion
          ref="moveTree"
          highlight-current
          @node-click="selectNodeClick"
          :expand-on-click-node="false"
          node-key="id"
        >
          <span slot-scope="{ data }"
            ><img :src="dir" width="22px" alt="" /><span>
              {{ data.folderName }}</span
            ></span
          >
        </el-tree>
        <span slot="footer" class="dialog-footer">
          <el-button @click="close">取 消</el-button>
          <el-button type="primary" @click="submit">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog
        :title="newDirDialogTitle"
        :visible.sync="newDirDialogVisible"
        width="40%"
      >
        <el-form
          label-width="100px"
          :model="newDirForm"
          ref="newDirForm"
          :rules="newDirFormRules"
        >
          <el-form-item label="文件夹名称" prop="folderName">
            <el-input
              v-model="newDirForm.folderName"
              auto-complete="off"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="封面缩略图"
            v-if="folderType === 'public'"
            prop="pic"
          >
            <p v-if="newDirForm.imageUrl">
              <img :src="newDirForm.imageUrl" alt="" class="img-new-dir" />
            </p>

            <el-upload
              class="upload-demo"
              :show-file-list="false"
              name="file"
              :headers="{ Authorization: token }"
              :action="action2"
              :data="uploadParams2"
              :on-success="uploadSuccess2"
              :on-error="uploadSuccess2"
              :before-upload="beforeUpload2"
            >
              <el-button type="primary" size="small" icon="el-icon-upload2"
                >上传</el-button
              >
            </el-upload>
          </el-form-item>
          <!-- <el-form-item
            label="审核开关"
            prop="auditSwitch"
            v-if="folderType === 'public'"
          >
            <el-switch
              v-model="newDirForm.reviewState"
              active-text="需要审核"
              inactive-text="不需要审核"
              @change="changeReviewState"
            >
            </el-switch>
          </el-form-item> -->
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="closeNewDir">取 消</el-button>
          <el-button type="primary" @click="newDirSubmit">确 定</el-button>
        </span>
      </el-dialog>
      <MoveFolderDialog
      :dialogVisible="moveDialogVisible"
      :selectionFile="selectionFile"
      :isMoveFile="isMoveFile"
      :isRecentFilePage="isRecentFilePage"
      @closeModal="handleCloseModal"
    />
    </div>
  </div>
</template>

<script>
import {
  copyDir,
  deleteFile,
  download,
  getDownloadFolder,
  getDownloadFile,
  listDir,
  listDirTree,
  mkdir,
  moveDir,
  renameFile,
  unzip,
  zip,
  createOffice,
  getEditDoc,
  getPreviewImageUrl,
  getFolderStatistics,
  uploadFile,
  appendFile,
  setFolderReviewFlag,
} from "@/api/file";
import dir from "@/assets/images/file/dir.png";
import { Loading } from "element-ui";
import { calculateFileSize } from "@/utils";
import MoveFolderDialog from "@/components/MoveFolderDialog";

export default {
  name: "OperationMenu",
  props: {
    isRecentFilePage: Boolean,
    selectionFile: Array,
    recentFileList: Array,
    selectionRenameFile: Object,
  },
  components: {
    MoveFolderDialog,
  },
  
  data() {
    return {
      action: `${process.env.VUE_APP_BASE_API}/dbs/file/uploadFile`,
      action2: `${process.env.VUE_APP_BASE_API}/dbs/file/imageUpload`,
      dialogVisible: false,
      newDirDialogVisible: false,
      newDirDialogTitle: "新建文件夹",
      defaultProps: {
        children: "children",
        label: "label",
      },
      dirData: [],
      treeSelectId: 0,
      dir: dir,
      isMove: false,
      isCopy: false,
      isDelete: false,
      isReName: false,
      isDownload: false,
      compress: false,
      decompression: false,
      options: 0,
      uploadParams: {},
      uploadMultipleParams: [],
      uploadParams2: {},
      newDirFormRules: {
        folderName: [
          { required: true, message: "请输入文件夹名称", trigger: "blur" },
        ],
      },
      newDirForm: {
        folderName: "",
        imageUrl: "",
        folderId: null,
        // reviewState: false,
      },
      subFoldersNum: 0,
      subFilesNum: 0,
      showFileList: true,
      upoadModalVisible: false,
      fileList: [],
      showProgress: false,
      progressPercentage: 0,
      defaultChunkSize: 3 * 1024 * 1024, // 切片大小
      fileMaxLimit: 1 * 1024 * 1024, // 文件大小限制
      fileSizeLimitArr: [],
      moveDialogVisible: false,
      isMoveFile: true,

      // fileList: new FormData(),
    };
  },
  created() {
    if(this.recentFileList){
    }else{
      this.queryStatistics();
    }
    this.$store.dispatch("setSearch", "");
  },
  methods: {
    handleCloseModal() {
      this.moveDialogVisible = false;
    },
    handleClearFile() {
      this.fileList = [];
      this.fileSizeLimitArr = [];
      this.upoadModalVisible = false;
    },
    // changeReviewState(reviewState) {
    //   debugger;
    //   if (this.newDirForm.folderId == -1) {
    //     return;
    //   }
    //   setFolderReviewFlag({
    //     folderId: this.newDirForm.folderId,
    //     reviewState: reviewState ? 0 : 1, //0需要审核（默认），1表示不需要审核
    //     userId: this.userId,
    //     groupType: this.groupType,
    //   }).then((res) => {
    //     if (res.flag === "SUCCESS") {
    //       this.$message.success(res.message);
    //     } else {
    //       this.$message.error(res.message);
    //     }
    //   });
    // },
    handleUploadChange(file, fileList) {
      this.fileList = [...this.fileList, file.raw];
      if (file.size > this.fileMaxLimit) {
        this.fileSizeLimitArr.push(file.name);
      }
      this.upoadModalVisible = true;
    },
    submitUpload() {
      this.showProgress = true;
      if (this.fileList.length > 1) {
        this.multUpload(this.fileList);
      } else {
        const file = this.fileList[0];
        if (file.size <= this.defaultChunkSize) {
          this.multUpload(this.fileList);
        } else {
          this.chunkedUpload(file);
        }
      }
    },
    createFileChunk(file, size) {
      const fileChunkList = [];
      var count = 0;
      while (count < file.size) {
        fileChunkList.push({
          file: file.slice(count, count + size),
        });
        count += size;
      }
      return fileChunkList;
    },
    async chunkedUpload(file) {
      const params = this.getUploadParam(file);

      const fileChunkList = this.createFileChunk(
        params.get("file"),
        this.defaultChunkSize
      );

      const fileChunkLength = fileChunkList.length;

      params.set("file", fileChunkList[0].file);
      const result = await appendFile(params);
      this.progressPercentage = parseInt((1 / fileChunkLength) * 100);
      if (result.flag === "SUCCESS" && result.shorturl) {
        params.set("shortUrl", result.shorturl);
      } else {
        this.showProgress = false;
        this.progressPercentage = 0;
        this.$message.error(result.message);
        return;
      }

      for (let i = 0; i <= fileChunkLength; i++) {
        if (i > 0) {
          params.set("file", fileChunkList[i].file);
          const res = await this.fetchChunkFile(params);
          this.progressPercentage = parseInt((i / fileChunkLength) * 100);
          if (res.flag && i + 1 === fileChunkLength) {
            this.$message.success(res.message);
            this.upoadModalVisible = false;
            this.fileList = [];
            this.fileSizeLimitArr = [];
            this.$emit("getTableDataByType", this.search);

            this.showProgress = false;
            this.progressPercentage = 0;
          }
        }
      }
    },
    fetchChunkFile(params) {
      return new Promise((resolve, reject) => {
        appendFile(params).then((res) => {
          if (res.flag === "SUCCESS") {
            resolve(res);
          } else {
            // this.showProgress = false;
            this.$message.error(res.message);
          }
        });
      });
    },
    multUpload(files) {
      const len = files.length;
      let index = 0;

      files.forEach((file) => {
        // if (file.size > this.fileMaxLimit) {
        //   this.$message.error(
        //     `${file.name}文件大小超过${parseInt(
        //       this.fileMaxLimit / 1024 / 1024
        //     )}M阈值，请单独上传！`
        //   );
        //   index++;
        //   return;
        // }
        if (len > 1 && this.fileSizeLimitArr.includes(file.name)) {
          index++;
          return;
        }

        const params = this.getUploadParam(file);
        uploadFile(params).then((res) => {
          index++;
          this.progressPercentage = parseInt((index / len) * 100);
          if (res.flag === "SUCCESS") {
            if (index === len) {
              this.$message.success(res.message);
              this.upoadModalVisible = false;
              this.fileList = [];
              this.fileSizeLimitArr = [];
              this.$emit("getTableDataByType", this.search);

              this.showProgress = false;
              this.progressPercentage = 0;
            }
          } else {
            this.progressPercentage = 0;
            this.showProgress = false;
            this.$message.error(res.message);
          }
        });
      });
    },
    queryStatistics: function () {
      getFolderStatistics({
        folderId: this.folderId,
        folderType: this.folderType,
        userId: this.userId,
        groupType: this.groupType,
      }).then((res) => {
        if (res.flag === "SUCCESS") {
          this.subFoldersNum = res.subFoldersNum;
          this.subFilesNum = res.subFilesNum;
        }
      });
    },
    handleCreateDoc: function (fileType) {
      this.$prompt("请输入创建文件名称", "创建文件", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputValue: name,
        inputValidator: (value) => {
          if (value.trim().length < 1) {
            return "文件名不能为空";
          }
        },
        inputErrorMessage: "文件名不能为空",
      }).then(({ value }) => {
        if (value && value.trim()) {
          const data = {
            folderId: this.folderId,
            fileName: value,
            fileType,
            creator: this.userId,
            groupType: this.groupType,
          };
          createOffice(data).then((res) => {
            if (res.flag === "SUCCESS") {
              this.$message({
                message: "创建成功，即将打开创建的文件",
                type: "success",
              });
              this.$emit("getTableDataByType", this.search);
              setTimeout(() => {
                window.open(
                  getEditDoc(res.shortUrl, res.creator, this.groupType)
                );
              }, 1000);
            } else {
              this.$message.error("创建失败");
            }
          });
        } else {
          this.$message.error("文件名不能为空");
        }
      });
    },
    uploadDirImg: function () {},
    newDirSubmit: function () {
      console.log(this.newDirForm);
      this.$refs.newDirForm.validate((valid) => {
        if (valid) {
          const { folderName, imageUrl } = this.newDirForm;
          if (this.newDirDialogTitle === "新建文件夹") {
            const mkParams = {
              parentFolderId: this.folderId,
              folderType: this.folderType,
              folderName,
              imageUrl,
              firstRootFolderId: "-1",
              creator: this.userId,
              groupType: this.groupType,
            };

            // if (this.folderType === "public") {
            //   mkParams.reviewState = reviewState ? 0 : 1; //0需要审核，1表示不需要审核
            // }

            mkdir(mkParams).then((res) => {
              if (res.flag === "SUCCESS") {
                this.$message({
                  message: "文件夹创建成功",
                  type: "success",
                });
                this.newDirDialogVisible = false;
                this.$emit("getTableDataByType", this.search);
              } else {
                this.$message.error(res?.message ?? "文件夹创建失败");
              }
            });
          } else {
            renameFile(
              {
                folderName,
                imageUrl,
                folderId: this.newDirForm.folderId,
                updater: this.userId,
                groupType: this.groupType,
              },
              true
            ).then((res) => {
              if (res.flag === "SUCCESS") {
                this.$message({
                  message: "修改成功",
                  type: "success",
                });
                this.newDirDialogVisible = false;
                this.newDirDialogTitle = "新建文件夹";
                this.$emit("getTableDataByType", this.search);
              } else {
                this.$message.error(res?.message ?? "文件夹创建失败");
              }
            });
          }
        }
      });
    },
    newDir: function () {
      this.newDirForm.folderName = "";
      this.newDirForm.imageUrl = "";
      this.newDirDialogVisible = true;
      return;
      // this.$prompt("请输入文件夹名称", "创建文件夹", {
      //   confirmButtonText: "确定",
      //   cancelButtonText: "取消",
      //   inputValidator: (value) => {
      //     if (value.trim().length < 1) {
      //       return "文件夹名称不能为空";
      //     }
      //   },
      //   inputErrorMessage: "文件夹名称不能为空",
      // })
      //   .then(({ value }) => {
      //     if (value && value.trim()) {
      //     } else {
      //       this.$message.error("文件夹名称不能为空");
      //     }
      //   })
      //   .catch(() => {});
    },

    deleteSelectedFile: function () {
      console.log("selectionFile", this.selectionFile);

      let ids = [];
      let canDelete = true;
      let documentFlag = "";
      (this.selectionFile || []).forEach((fi, i) => {
        ids.push(fi.documentId || fi.id);

        if (i === 0) {
          documentFlag = fi.documentFlag;
        } else {
          if (documentFlag !== fi.documentFlag) {
            canDelete = false;
          }
        }
      });

      if (!canDelete) {
        this.$message.error("目录和文件请分开删除！");
        return;
      }

      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          ids = this.selectionFile[0].documentId || this.selectionFile[0].id;
          let data = { deleter: this.userId, groupType: this.groupType };
          const isFolder = this.selectionFile[0].documentFlag === "folder";
          if (isFolder) {
            if (this.selectionFile.length > 1) {
              data.folderList = this.selectionFile.map((item) => {
                return {
                  folderId: item.id,
                  groupType: this.groupType,
                };
              });
            } else {
              data.folderId = ids;
            }
          } else {
            data.fileIds = this.selectionFile.map((i) => i.documentId || i.id);
          }

          deleteFile(data, isFolder).then((res) => {
            if (res.flag === "SUCCESS") {
              this.$message({
                type: "success",
                message: "删除成功!",
              });
              this.$emit("getTableDataByType", this.search);
            } else {
              this.$message.error(res?.message ?? "删除失败");
            }
          });
        })
        .catch(() => {});
    },
    //folder/file/mix
    getSelectionType: function () {
      let documentFlag = "";
      if(this.isRecentFilePage){
        return 'file'
      }
      (this.selectionFile || []).forEach((fi, i) => {
        if (i === 0) {
          documentFlag = fi.documentFlag;
        } else {
          if (documentFlag !== fi.documentFlag) {
            documentFlag = "mix";
          }
        }
      });
      return documentFlag;
    },

    rename: function (targetFile) {
      debugger;
      const data = targetFile || this.selectionFile[0];
      let name = data.documentName.split("/");
      let document_image_url = data.document_image_url;
      name = name[name.length - 1];
      let names = name.split(".");
      let fileSuffix = names[names.length - 1];
      name = name.replace("." + fileSuffix, "");
      if (data.documentFlag === "folder" && this.folderType === "public") {
        //有缩略图
        this.newDirDialogTitle = "编辑文件夹";
        this.newDirDialogVisible = true;
        this.newDirForm.imageUrl = document_image_url;
        this.newDirForm.folderName = name;
        this.newDirForm.folderId = data.documentId || data.id;
        // this.newDirForm.reviewState = !data.reviewState;
      } else {
        this.$prompt("请输入新的名称", "设置", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          inputValue: name,
          inputValidator: (value) => {
            if (value.trim().length < 1) {
              return "文件名不能为空";
            }
          },
          inputErrorMessage: "文件名不能为空",
        })
          .then(({ value }) => {
            if (value && value.trim()) {
              const target = targetFile || this.selectionFile[0];
              let data = { updater: this.userId, groupType: this.groupType };
              const ids = target.documentId || target.id;
              const isFolder = target.documentFlag === "folder";
              if (isFolder) {
                data.folderId = ids;
                data.folderName = value;
              } else {
                data.fileId = ids;
                data.fileName = `${value}.${target.documentSuffix}`;
              }
              renameFile(data, isFolder).then((res) => {
                if (res.flag === "SUCCESS") {
                  this.$message({
                    message: "操作成功",
                    type: "success",
                  });
                  this.$emit("getTableDataByType", this.search);
                } else {
                  this.$message.error(res?.response ?? "重命名失败");
                }
              });
            } else {
              this.$message.error("文件名不能为空");
            }
          })
          .catch(() => {});
      }
    },
    uploadSuccess: function (response) {
      if (response.flag === "SUCCESS") {
        this.$message({
          message: "上传成功",
          type: "success",
        });
      } else {
        this.$message.error(response?.message ?? "上传失败");
      }
      this.$emit("getTableDataByType", this.search);
    },
    uploadSuccess2: function (response) {
      if (response.flag === "SUCCESS") {
        this.$message({
          message: "上传成功",
          type: "success",
        });
        // this.newDirImage = getPreviewImageUrl(response.shorturl, this.userId);
        // this.newDirForm.imageUrl = this.newDirImage;
        this.newDirForm.imageUrl = getPreviewImageUrl(
          response.shorturl,
          this.userId
        );
      } else {
        this.$message.error("上传失败");
      }
    },
    httpRequest: function (file) {
      return file;
    },

    getUploadParam: function (file) {
      const fileType = (type, file) => {
        if (type.indexOf("image") > -1) {
          return "picture";
        } else if (type.indexOf("video") > -1) {
          return "video";
        } else if (type.indexOf("zip") > -1 || type.indexOf("rar") > -1) {
          return "pack";
        } else if (
          type.indexOf("word") > -1 ||
          file?.name.indexOf("doc") > -1 ||
          file?.name.indexOf("docx") > -1
        ) {
          return "word";
        } else if (
          type.indexOf("ppt") > -1 ||
          file?.name.indexOf("ppt") > -1 ||
          file?.name.indexOf("pptx") > -1
        ) {
          return "ppt";
        } else if (type.indexOf("sheet") > -1) {
          return "excel";
        } else {
          // return "document";
          return file.name.split(".")?.reverse()[0];
        }
      };
      const params = {
        fileName: file.name,
        fileType: fileType(file.type, file),
        fileSuffix: file.name?.split(".")?.reverse()[0],
        fileSize: file.size,
        folderId: this.folderId,
        uploader: this.userId,
        groupType: this.groupType,
        file,
      };
      const formData = new FormData();
      Object.keys(params).forEach((key) => {
        formData.append(key, params[key]);
      });
      return formData;
    },

    beforeUpload: function (file, fileList) {
      console.log("file", file);
      debugger;
      return new Promise((resolve, reject) => {
        const fileType = (type, file) => {
          if (type.indexOf("image") > -1) {
            return "picture";
          } else if (type.indexOf("video") > -1) {
            return "video";
          } else if (type.indexOf("zip") > -1 || type.indexOf("rar") > -1) {
            return "pack";
          } else if (
            type.indexOf("word") > -1 ||
            file?.name.indexOf("doc") > -1 ||
            file?.name.indexOf("docx") > -1
          ) {
            return "word";
          } else if (
            type.indexOf("ppt") > -1 ||
            file?.name.indexOf("ppt") > -1 ||
            file?.name.indexOf("pptx") > -1
          ) {
            return "ppt";
          } else if (type.indexOf("sheet") > -1) {
            return "excel";
          } else {
            // return "document";
            return file.name.split(".")[1];
          }
        };
        debugger;
        const ps = {
          fileName: file.name,
          fileType: fileType(file.type, file),
          fileSuffix: file.name?.split(".")[1],
          fileSize: file.size,
          folderId: this.folderId,
          uploader: this.userId,
          groupType: this.groupType,
        };
        this.uploadParams = ps;
        this.uploadMultipleParams.push(ps);
        // const uploadParams = {
        //   fileName: file.name,
        //   fileType: fileType(file.type, file),
        //   fileSuffix: file.name?.split(".")[1],
        //   fileSize: file.size,
        //   folderId: this.folderId,
        //   uploader: this.userId,
        //   groupType: this.groupType,
        // };
        // this.fileList.append("file", uploadParams);
        debugger;
        this.$nextTick(() => resolve());
      });
    },
    beforeUpload2: function (file) {
      const isJPG = file.type.includes("image");
      const isLt2M = file.size / 1024 / 1024 < 50;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }

      return new Promise((resolve, reject) => {
        this.uploadParams2 = {
          fileName: file.name,
          fileSuffix: file.name?.split(".")[1],
          fileSize: file.size,
          uploader: this.userId,
          groupType: this.groupType,
        };
        this.$nextTick(() => resolve());
      });
    },
    searchFileByName: function () {
      this.$emit("getTableDataByType", this.search);
    },
    downLoad: function () {
      if (this.getSelectionType() === "mix") {
        this.$message.error("目录和文件不能同时选择");
        return;
      }else if(this.getSelectionType() === "file"){
         if(this.selectionFile.length > 1){
            const ids = this.selectionFile.map(it => it.id || it.documentId);
            getDownloadFile(ids.join(','), '');
         }else{
          const it = this.selectionFile[0];
           getDownloadFile(it.id || it.documentId, it.shortUrl);
         }
      }else{
        this.selectionFile.forEach((it) => {
          getDownloadFolder(it.id);
        });
      }
      
    },
    moveTo: function () {
      const selectionType = this.getSelectionType();

      if(selectionType === 'mix'){
        this.$message.error("目录和文件不能同时移动");
        return;
      }

      this.isMoveFile = selectionType === 'file';
      this.moveDialogVisible = true;
    },
    singleMoveTo: function () {

      if(this.selectionFile?.length > 1){
        this.$message.error("仅支持一个文件移动");
        return;
      }

      this.isMoveFile = true;
      this.moveDialogVisible = true;
    },
    copyTo: function () {
      this.dialog();
      this.options = 2;
    },
    dialog: function () {
      // localStorage.getItem("MY_FOLDER_ID")
      listDir({
        folderId: localStorage.getItem("MY_FOLDER_ID") ?? "-1",
      }).then((res) => {
        // this.dirData = [res.data];
        this.dirData = res.subFolderList;
      });
      this.dialogVisible = true;
    },
    close: function () {
      this.dialogVisible = false;
      this.showProgress = false;
      this.options = 0;
      this.progressPercentage = 0;
    },
    closeNewDir: function () {
      this.newDirDialogVisible = false;
    },
    submit: function () {
      if (this.options === 1) {
        this.close();
        moveDir({
          sourceListId: this.selectionFile.map((i) => i.fileId),
          targetId: this.treeSelectId,
        }).then((res) => {
          if (res.result) {
            this.$message({
              type: "success",
              message: "移动成功!",
            });
            this.$emit("getTableDataByType", this.search);
          } else {
            this.$message.error("移动失败");
          }
        });
      } else if (this.options === 2) {
        this.close();
        copyDir({
          sourceListId: this.selectionFile.map((i) => i.fileId),
          targetId: this.treeSelectId,
        }).then((res) => {
          if (res.result) {
            this.$message({
              type: "success",
              message: "复制成功!",
            });
            this.$emit("getTableDataByType", this.search);
          } else {
            if (res && res.code === 500 && res.msg) {
              this.$message.error(res.msg);
              return;
            }
            this.$message.error("复制失败");
          }
        });
      }
    },
    //  移动文件模态框：选择目录事件
    selectNodeClick(data) {
      this.treeSelectId = data.id;
    },
    //解压
    unzip() {
      unzip({ fileId: this.selectionFile[0].fileId }).then((res) => {
        if (res.result) {
          this.$message({
            type: "success",
            message: "解压成功!",
          });
          this.$emit("getTableDataByType", this.search);
        } else {
          if (res && res.code === 500 && res.msg) {
            this.$message.error(res.msg);
            return;
          }
          this.$message.error("解压失败");
        }
      });
    },
    //解压
    zip() {
      zip({ fileIds: this.selectionFile.map((i) => i.fileId) }).then((res) => {
        if (res.result) {
          this.$message({
            type: "success",
            message: "压缩成功!",
          });
          this.$emit("getTableDataByType", this.search);
        } else {
          if (res && res.code === 500 && res.msg) {
            this.$message.error(res.msg);
            return;
          }
          this.$message.error("压缩失败");
        }
      });
    },
    getImage(shortUrl) {
      getPreviewImageUrl(shortUrl);
    },
  },
  computed: {
    pid: function () {
      let pids = this.$route.query.pid;
      if (pids && pids.endsWith(",")) {
        pids = pids.substring(0, pids.length - 1);
      }
      let pidList = pids ? pids.split(",") : [pids];
      let pid = pidList[pidList.length - 1];
      if (!pid || pid === "") {
        pid = 0;
      }
      return pid;
    },
    folderId: function () {
      let folderId = this.$route.query.folderId;
      return folderId ?? "-1";
    },
    groupType: function () {
      let groupType = this.$route.query.groupType;
      return groupType || null;
    },
    folderType: function () {
      let name = this.$route.name;
      const mapName = {
        minefile: "mine",
        publicfile: "public",
      };
      return mapName[name.toLowerCase()];
    },
    searchPlaceholder: function () {
      return this.folderType === "mine" ? "搜索我的文件" : "搜索公共文件";
    },

    fileType: function () {
      return Number(this.$route.query.fileType);
    },
    token: {
      get() {
        return this.$store.getters.token;
      },
    },
    userId: {
      get() {
        return this.$store.getters.userId;
      },
    },

    search: {
      get() {
        return this.$store.getters.search;
      },
      set(search) {
        this.$store.dispatch("setSearch", search);
      },
    },
  },
  watch: {
    recentFileList: function(newVal){
      this.subFilesNum = newVal?.length || 0
    },
    selectionFile: function (newVal) {
      //'zip', 'rar', 'gz', '7z'
      const ZIP = ["zip", "rar"];

      this.isMove = newVal !== undefined && newVal.length > 0;
      this.isCopy = newVal !== undefined && newVal.length > 0;
      this.isDelete = newVal !== undefined && newVal.length > 0;
      this.isReName = newVal !== undefined && newVal.length === 1;
      this.isDownload = newVal !== undefined && newVal.length > 0;
      this.decompression =
        newVal !== undefined &&
        newVal.length === 1 &&
        ZIP.includes(newVal[0].extendName);
      this.compress = newVal !== undefined && newVal.length > 0;
    },
    selectionRenameFile: {
      immediate: true,

      handler: function (newVal) {
        console.log(newVal.documentName);
        if (newVal && (newVal.id || newVal.documentId)) {
          this.rename(newVal);
        }
      },
    },
  },
};
</script>

<style scoped>
.operation-menu-wrapper {
  height: 60px;
  line-height: 60px;
  display: block;
}
.operation-menu-inner{
  display: inline-block;
}

.upload-demo {
  display: inline-block;
}

.new-dir {
}

.operation-buttons {
  margin-left: 20px;
}

.search {
  float: right;
  display: inline-block;
}

.image-model {
  margin-left: 10px;
  float: right;
  display: inline-block;
}

.image-model a {
  display: inline-block;
  cursor: pointer;
  font-size: 20px;
}
.img-new-dir {
  width: 150px;
  height: 150px;
}
/deep/ .el-switch__label {
  color: #dcdfe6;
}
/deep/ .el-switch__label.is-active {
  color: #409eff;
}
.all-statistics {
  height: 64px;
  line-height: 64px;
  font-size: 14px;
  font-family: PingFang SC, PingFang SC-Semibold;
  font-weight: 600;
  border-bottom: 1px solid #e8e8e8;
  position: relative;
  left: -20px;
  padding-left: 13px;
}
.all-statistics span {
  display: inline-block;
  width: 115px;
  position: relative;
  text-align: center;
}
.all-statistics span b {
  display: inline-block;
  font-size: 24px;
  margin-left: 16px;
  vertical-align: top;
}
.all-statistics span:first-child:after {
  content: "";
  width: 1px;
  height: 16px;
  background-color: #e8e8e8;
  position: absolute;
  top: 24px;
  right: 0;
}
.limt-file {
  color: red;
}
</style>
