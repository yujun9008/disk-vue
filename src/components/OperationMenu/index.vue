<template>
  <div class="operation-menu-wrapper">
    <el-button-group class="operation-buttons">
      <el-upload
        class="upload-demo"
        :show-file-list="false"
        name="file"
        :headers="{ Authorization: token }"
        :action="action"
        :data="uploadParams"
        :on-success="uploadSuccess"
        :on-error="uploadSuccess"
        :before-upload="beforeUpload"
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
      <el-button plain size="small" @click="rename" :disabled="!isReName"
        >重命名</el-button
      >
      <el-button plain size="small" :disabled="!isCopy" @click="copyTo"
        >复制到</el-button
      >
      <el-button plain size="small" @click="moveTo" :disabled="!isMove"
        >移动到</el-button
      >
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
    <div class="search" style="display: none">
      <el-input
        v-model="search"
        placeholder="搜索您的文件"
        clearable
        size="small"
        @keyup.enter.native="searchFileByName"
        @clear="searchFileByName"
        suffix-icon="el-icon-search"
      ></el-input>
    </div>
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
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeNewDir">取 消</el-button>
        <el-button type="primary" @click="newDirSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  copyDir,
  deleteFile,
  download,
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
} from "@/api/file";
import dir from "@/assets/images/file/dir.png";
import { Loading } from "element-ui";
import { calculateFileSize } from "@/utils";

export default {
  name: "OperationMenu",
  props: {
    selectionFile: Array,
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
      },
    };
  },
  methods: {
    handleCreateDoc: function(fileType) {
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
          };
          createOffice(data).then((res) => {
            if (res.flag === "SUCCESS") {
              this.$message({
                message: "创建成功，即将打开创建的文件",
                type: "success",
              });
              this.$emit("getTableDataByType", this.search);
              setTimeout(() => {
                window.open(getEditDoc(res.shortUrl, res.creator));
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
    uploadDirImg: function() {},
    newDirSubmit: function() {
      console.log(this.newDirForm);
      this.$refs.newDirForm.validate((valid) => {
        if (valid) {
          const { folderName, imageUrl } = this.newDirForm;
          if (this.newDirDialogTitle === "新建文件夹") {
            mkdir({
              parentFolderId: this.folderId,
              folderType: this.folderType,
              folderName,
              imageUrl,
              firstRootFolderId: "-1",
              creator: this.userId,
              groupType: this.groupType,
            }).then((res) => {
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
    newDir: function() {
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

    deleteSelectedFile: function() {
      console.log("selectionFile", this.selectionFile);

      let ids = [];
      let canDelete = true;
      let documentFlag = "";
      (this.selectionFile || []).forEach((fi, i) => {
        ids.push(fi.documentId);

        if (i === 0) {
          documentFlag = fi.documentFlag;
        } else {
          if (documentFlag !== fi.documentFlag) {
            this.$message.error("目录和文件请分开删除！");
            canDelete = false;
          }
        }
      });

      if (!canDelete) {
        return;
      }

      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          ids = this.selectionFile[0].documentId;
          let data = { deleter: this.userId, groupType: this.groupType };
          const isFolder = this.selectionFile[0].documentFlag === "folder";
          if (isFolder) {
            data.folderId = ids;
          } else {
            data.fileIds = this.selectionFile.map((i) => i.documentId);
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

    rename: function() {
      debugger;
      const data = this.selectionFile[0];
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
        this.newDirForm.folderId = data.documentId;
      } else {
        this.$prompt("请输入新的名称", "重命名", {
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
              let data = { updater: this.userId, groupType: this.groupType };
              const ids = this.selectionFile[0].documentId;
              const isFolder = this.selectionFile[0].documentFlag === "folder";
              if (isFolder) {
                data.folderId = ids;
                data.folderName = value;
              } else {
                data.fileId = ids;
                data.fileName = value;
              }
              renameFile(data, isFolder).then((res) => {
                if (res.flag === "SUCCESS") {
                  this.$message({
                    message: "重命名成功",
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
    uploadSuccess: function(response) {
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
    uploadSuccess2: function(response) {
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
    httpRequest: function(file) {
      return file;
    },
    beforeUpload: function(file) {
      console.log("file", file);
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
        this.uploadParams = {
          fileName: file.name,
          fileType: fileType(file.type, file),
          fileSuffix: file.name?.split(".")[1],
          fileSize: file.size,
          folderId: this.folderId,
          uploader: this.userId,
          groupType: this.groupType,
        };
        this.$nextTick(() => resolve());
      });
    },
    beforeUpload2: function(file) {
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
    searchFileByName: function() {
      this.$emit("getTableDataByType", this.search);
    },
    downLoad: function() {
      this.selectionFile.forEach((it) => {
        getDownloadFile(it.id, it.shortUrl);
        // getDownloadFile({ fileId: it.id, shortUrl: it.shortUrl }).then(
        //   (res) => {
        //     this.$download(res);
        //   }
        // );
      });
    },
    moveTo: function() {
      this.dialog();
      this.options = 1;
    },
    copyTo: function() {
      this.dialog();
      this.options = 2;
    },
    dialog: function() {
      // localStorage.getItem("MY_FOLDER_ID")
      listDir({
        folderId: localStorage.getItem("MY_FOLDER_ID") ?? "-1",
      }).then((res) => {
        // this.dirData = [res.data];
        this.dirData = res.subFolderList;
      });
      this.dialogVisible = true;
    },
    close: function() {
      this.dialogVisible = false;
      this.options = 0;
    },
    closeNewDir: function() {
      this.newDirDialogVisible = false;
    },
    submit: function() {
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
    pid: function() {
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
    folderId: function() {
      let folderId = this.$route.query.folderId;
      return folderId ?? "-1";
    },
    groupType: function() {
      let groupType = this.$route.query.groupType;
      return groupType || null;
    },
    folderType: function() {
      let name = this.$route.name;
      const mapName = {
        minefile: "mine",
        publicfile: "public",
      };
      return mapName[name.toLowerCase()];
    },
    fileType: function() {
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
    selectionFile: function(newVal) {
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
  },
};
</script>

<style scoped>
.operation-menu-wrapper {
  height: 60px;
  line-height: 60px;
  display: block;
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
</style>
