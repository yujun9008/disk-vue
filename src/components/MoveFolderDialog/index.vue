<template>
  <el-dialog
    title="移动目录"
    :visible.sync="dialogVisible"
    width="50%"
    :before-close="handleCancle"
  >
    <div class="movetree">
      <el-tree
        :props="props"
        :data="treeData"
        node-key="folder_id"
        :default-expanded-keys="[-1]"
        show-checkbox
        :check-strictly="true"
        ref="tree"
      >
        <span class="custom-tree-node" slot-scope="{ node, data }">
          <span>{{ node.label }}</span>
        </span>
      </el-tree>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleCancle">取 消</el-button>
      <el-button type="primary" @click="handleSave">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { queryAdminCreateFolderTree, moveFolder,moveFile } from "@/api/file";
export default {
  name: "MoveFolderDialog",
  props: {
    dialogVisible: Boolean,
    isMoveFile: Boolean,
    targetFolder: Object,
    targetFile: Object,
  },
  components: {},
  data() {
    return {
      treeData: [],
      props: {
        label: "folder_name",
        children: "sub_folders",
        groupType: "groupType",
      },
    };
  },

  created() {},
  watch: {
    dialogVisible: {
      handler(val) {
        if (val) {
          this.$nextTick(() => {
            this.getTreeData();
          });
        }
      },
    },
  },
  methods: {
    handleCancle() {
      this.$emit("closeModal");
    },
    
    handleSave() {
      const checkedNodes = this.$refs.tree.getCheckedNodes();
      if (checkedNodes.length > 1) {
        this.$message.error("一次只能移动到一个目录！");
        return;
      }

      const saveCb = (res) => {
        if (res.flag === "SUCCESS") {
            this.$message.success(res.message ?? "移动成功");
            setTimeout(() => {
              window.location.reload();
            }, 300);
          } else {
            this.$message.error(res.message ?? "保存失败");
          }
      }

      if(this.isMoveFile){
        const sourceFolderId = this.$route.query.folderId;
        moveFile({
          sourceFileId: this.targetFile?.id,
          sourceFolderId,
          targetFolderId:  checkedNodes[0]?.folder_id,
          mover: this.userId,
        }).then((res) => {
        saveCb(res)
      })
      }else{
        moveFolder({
          sourceFolderId: this.folderId,
          targetFolderId: checkedNodes[0]?.folder_id,
          mover: this.userId,
        }).then((res) => {
           saveCb(res)
        });
      }
    },

    getTreeData(node, resolve) {
      queryAdminCreateFolderTree({ userId: this.userId })
        .then((res) => {
          const fileList = res.sub_folders ?? [];
          this.treeData = [res];
        })
        .catch((err) => console.log(err));
    },
    getUser(name) {
      if (!name) {
        return;
      }
      queryUser({
        name,
      }).then((res) => {
        if (res.flag === "SUCCESS") {
          this.userIdList = res.users || [];
        }
      });
    },
  },
  created() {},
  computed: {
    fileName: function () {
      return this.$route.query.fileName;
    },
    userId: {
      get() {
        return this.$store.getters.userId;
      },
    },
    folderId: function () {
      return (
        this.targetFolder?.folder_id ||
        this.targetFolder?.documentId ||
        this.targetFolder?.id
      );
    },
  },
};
</script>

<style scoped>
.el-row {
  margin-bottom: 15px;
}
</style>
