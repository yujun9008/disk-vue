<template>
  <div class="operation-menu-wrapper">
    <el-button-group class="operation-buttons">
      <el-upload
          class="upload-demo"
          :show-file-list="false"
          name="file"
          :headers="{Authorization:token}"
          :action="action"
          :data="{
                    pid: this.pid
                }"
          :on-success="uploadSuccess"
          :on-error="uploadSuccess"
          :before-upload="beforeUpload"
      >
        <el-button type="primary" size="small" icon="el-icon-upload2">上传</el-button>
      </el-upload>
    </el-button-group>
    <el-button-group class="operation-buttons">
      <el-button class="new-dir" size="small" @click="newDir" icon="el-icon-folder-add">新建文件夹</el-button>
    </el-button-group>
    <el-button-group class="operation-buttons">
      <el-button plain size="small" icon="el-icon-download" :disabled="!isDownload" @click="downLoad">下载
      </el-button>
      <el-button plain size="small" @click="deleteSelectedFile" :disabled="!isDelete" icon="el-icon-delete">删除
      </el-button>
      <el-button plain size="small" @click="rename" :disabled="!isReName">重命名</el-button>
      <el-button plain size="small" :disabled="!isCopy" @click="copyTo">复制到</el-button>
      <el-button plain size="small" @click="moveTo" :disabled="!isMove">移动到</el-button>
    </el-button-group>
    <el-button-group class="operation-buttons">
      <el-button class="decompression" :disabled="!decompression" @click="unzip" size="small">解压</el-button>
      <el-button class="compress" :disabled="!compress" size="small" @click="zip">压缩</el-button>
    </el-button-group>
    <div class="image-model">
      <a><i class="el-icon-menu"></i></a>
    </div>
    <div class="search">
      <el-input v-model="search" placeholder="搜索您的文件" clearable size="small"
                @keyup.enter.native="searchFileByName"
                @clear="searchFileByName"
                suffix-icon="el-icon-search"></el-input>
    </div>
    <el-dialog
        title="文件移动到"
        :visible.sync="dialogVisible"
        width="30%"
    >
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
        <span slot-scope="{data}"><img :src="dir" width="22px" alt=""><span> {{ data.label }}</span></span>
      </el-tree>
      <span slot="footer" class="dialog-footer">
                <el-button @click="close">取 消</el-button>
                <el-button type="primary" @click="submit">确 定</el-button>
            </span>
    </el-dialog>
  </div>
</template>

<script>
import {copyDir, deleteFile, download, listDirTree, mkdir, moveDir, renameFile, unzip, zip} from "@/api/file";
import dir from '@/assets/images/file/dir.png';
import {Loading} from 'element-ui';
import {calculateFileSize} from "@/utils";

export default {
  name: "OperationMenu",
  props: {
    selectionFile: Array,
  },
  data() {
    return {
      action: `${process.env.VUE_APP_BASE_API}/file/upLoad`,
      dialogVisible: false,
      defaultProps: {
        children: 'children',
        label: 'label'
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
      options: 0
    }
  },
  methods: {
    newDir: function () {
      this.$prompt('请输入文件夹名称', '创建文件夹', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValidator: (value) => {
          if (value.trim().length < 1) {
            return '文件夹名称不能为空'
          }
        },
        inputErrorMessage: '文件夹名称不能为空'
      }).then(({value}) => {
        if (value && value.trim()) {
          mkdir({pid: this.pid, dirName: value}).then(res => {
            if (res.result) {
              this.$message({
                message: '文件夹创建成功',
                type: 'success'
              });
              this.$emit('getTableDataByType', this.search)
            } else {
              this.$message.error('文件夹创建失败');
            }
          });
        } else {
          this.$message.error('文件夹名称不能为空');
        }
      }).catch(() => {
      });
    },

    deleteSelectedFile: function () {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let ids = this.selectionFile.map(it => it.fileId);
        let data = {
          sourceListId: ids
        };
        deleteFile(data).then(res => {
          if (res.result) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.$emit('getTableDataByType', this.search)
          } else {
            this.$message.error('删除失败');
          }
        });
      }).catch(() => {
      });
    },

    rename: function () {
      let name = this.selectionFile[0].fileName.split("/");
      name = name[name.length - 1];
      let names = name.split(".");
      let fileSuffix = names[names.length - 1];
      name = name.replace("." + fileSuffix, "");
      this.$prompt('请输入新的名称', '重命名', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValue: name,
        inputValidator: (value) => {
          if (value.trim().length < 1) {
            return '文件名不能为空'
          }
        },
        inputErrorMessage: '文件名不能为空'
      }).then(({value}) => {
            if (value && value.trim()) {
              renameFile({id: this.selectionFile[0].fileId, name: value}).then(res => {
                if (res.result) {
                  this.$message({
                    message: '重命名成功',
                    type: 'success'
                  });
                  this.$emit('getTableDataByType', this.search)
                } else {
                  this.$message.error('重命名失败');
                }
              });
            } else {
              this.$message.error('文件名不能为空');
            }
          }
      ).catch(() => {
      });
    },
    uploadSuccess: function (response) {
      if (response.result) {
        this.$message({
          message: '上传成功',
          type: 'success'
        });
      } else {
        this.$message.error('上传失败');
      }
      this.$emit('getTableDataByType', this.search)
    },
    beforeUpload: function (file) {
      if (process.env.VUE_APP_TEST) {
        if (file.size > process.env.VUE_APP_FILE_SIZE) {
          this.$message.error(`测试环境，只允许上传${calculateFileSize(process.env.VUE_APP_FILE_SIZE)}以内的文件！`);
          return false;
        }
      }

      let storage = this.$store.getters.storage;
      let surplusSize = storage.totalSize - storage.usedSize;
      if (surplusSize > file.size) {
        Loading.service({fullscreen: true, background: 'rgba(0, 0, 0, 0.7)'});
        return true;
      } else {
        this.$message.error('可用空间不足！');
        return false;
      }
    },
    searchFileByName: function () {
      this.$emit('getTableDataByType', this.search)
    },
    downLoad: function () {
      this.selectionFile.forEach(it => {
        download({fileId: it.fileId}).then(res => {
          this.$download(res.data.url, it.fileName);
        });
      });
    },
    moveTo: function () {
      this.dialog();
      this.options = 1;
    },
    copyTo: function () {
      this.dialog();
      this.options = 2;
    },
    dialog: function () {
      listDirTree().then(res => {
        this.dirData = [res.data];
      });
      this.dialogVisible = true;
    },
    close: function () {
      this.dialogVisible = false;
      this.options = 0;
    },
    submit: function () {
      if (this.options === 1) {
        this.close();
        moveDir({
          "sourceListId": this.selectionFile.map(i => i.fileId),
          "targetId": this.treeSelectId
        }).then((res) => {
          if (res.result) {
            this.$message({
              type: 'success',
              message: '移动成功!'
            });
            this.$emit('getTableDataByType', this.search)
          } else {
            this.$message.error('移动失败');
          }
        })
      } else if (this.options === 2) {
        this.close();
        copyDir({
          "sourceListId": this.selectionFile.map(i => i.fileId),
          "targetId": this.treeSelectId
        }).then((res) => {
          if (res.result) {
            this.$message({
              type: 'success',
              message: '复制成功!'
            });
            this.$emit('getTableDataByType', this.search)
          } else {
            if (res && res.code === 500 && res.msg) {
              this.$message.error(res.msg);
              return;
            }
            this.$message.error('复制失败');
          }
        })
      }
    },
    //  移动文件模态框：选择目录事件
    selectNodeClick(data) {
      this.treeSelectId = data.id;
    },
    //解压
    unzip() {
      unzip({fileId: this.selectionFile[0].fileId}).then(res => {
        if (res.result) {
          this.$message({
            type: 'success',
            message: '解压成功!'
          });
          this.$emit('getTableDataByType', this.search)
        } else {
          if (res && res.code === 500 && res.msg) {
            this.$message.error(res.msg);
            return;
          }
          this.$message.error('解压失败');
        }
      })
    },
    //解压
    zip() {
      zip({fileIds: this.selectionFile.map(i => i.fileId)}).then(res => {
        if (res.result) {
          this.$message({
            type: 'success',
            message: '压缩成功!'
          });
          this.$emit('getTableDataByType', this.search)
        } else {
          if (res && res.code === 500 && res.msg) {
            this.$message.error(res.msg);
            return;
          }
          this.$message.error('压缩失败');
        }
      })
    },
  },
  computed: {
    pid: function () {
      let pids = this.$route.query.pid;
      if (pids && pids.endsWith(",")) {
        pids = pids.substring(0, pids.length - 1);
      }
      let pidList = pids ? pids.split(',') : [pids];
      let pid = pidList[pidList.length - 1];
      if (!pid || pid === '') {
        pid = 0;
      }
      return pid
    },
    fileType: function () {
      return Number(this.$route.query.fileType)
    },
    token: {
      get() {
        return this.$store.getters.token
      }
    },

    search: {
      get() {
        return this.$store.getters.search
      },
      set(search) {
        this.$store.dispatch("setSearch", search);
      }
    }
  },
  watch: {
    'selectionFile': function (newVal) {
      //'zip', 'rar', 'gz', '7z'
      const ZIP = ['zip', 'rar'];

      this.isMove = newVal !== undefined && newVal.length > 0;
      this.isCopy = newVal !== undefined && newVal.length > 0;
      this.isDelete = newVal !== undefined && newVal.length > 0;
      this.isReName = newVal !== undefined && newVal.length === 1;
      this.isDownload = newVal !== undefined && newVal.length > 0;
      this.decompression = newVal !== undefined && newVal.length === 1 && ZIP.includes(newVal[0].extendName);
      this.compress = newVal !== undefined && newVal.length > 0;
    }
  }
}
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
</style>
