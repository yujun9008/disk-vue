<template>
  <div class="directoryWrapper">
    <p class="page-header">权限管理</p>
    <div class="mytree">
      <el-tree :props="props" :data="treeData" :expand-on-click-node="false">
        <!-- @node-click="handleClickTree" -->
        <span class="custom-tree-node" slot-scope="{ node, data }">
          <span>{{ node.label }}</span>
          <span>
            <el-button
              size="mini"
              type="text"
              v-if="data.groupType === 'admin'"
              style="margin-left: 30px"
              @click="() => editModal(data)"
            >
              编辑权限
            </el-button>
          </span>
        </span>
      </el-tree>
    </div>
    <PrivilegeEditDialog
      :dialogVisible="dialogVisible"
      :targetFolder="targetFolder"
      @closeModal="handleCloseModal"
    />
    <!-- <el-dialog title="编辑权限" :visible.sync="dialogVisible" width="50%">
      <el-row :gutter="24">
        <el-col :span="4">文件名称：</el-col>
        <el-col :span="14">{{ targetFolder.folder_name }}</el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="4">创建者：</el-col>
        <el-col :span="14">{{ targetFolder.creator }}</el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="4">创建时间</el-col>
        <el-col :span="14">{{ targetFolder.createTime }}</el-col>
      </el-row>
      <el-row :gutter="24">
        <el-tabs v-model="activeName" type="card" @tab-click="tabClick">
          <el-tab-pane label="人员维度" name="first">
            <el-col :span="7">
              <el-select
                v-model="groupType"
                placeholder="请选择相关权限"
                @change="changeGroupType"
                key="first-groupType"
              >
                <el-option
                  v-for="item in groupTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option> </el-select
            ></el-col>
            <el-col :span="16">
              <el-select
                v-model="userIdsByType"
                multiple
                filterable
                remote
                placeholder="请选择相关人员"
                :remote-method="getUser"
                :loading="loading"
                @focus="
                  (e) => {
                    getUser(e.target.value);
                  }
                "
                key="first-userIds"
                style="width: 100%"
              >
                <el-option
                  v-for="item in userIdList"
                  :key="item.userId"
                  :label="item.userId"
                  :value="item.userId"
                >
                  <span
                    >{{ item.userId }}-{{ item.userName }}-{{
                      item.orgName
                    }}</span
                  >
                </el-option>
              </el-select>
            </el-col>
          </el-tab-pane>
          <el-tab-pane label="角色维度" name="second">
            <el-col :span="7">
              <el-select
                v-model="theGroupType"
                placeholder="请选择相关权限"
                @change="changeTheGroupType"
                key="second-groupType"
              >
                <el-option
                  v-for="item in groupTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="16">
              <el-select
                v-model="rolesByType"
                multiple
                filterable
                remote
                placeholder="请选择相关角色"
                :remote-method="getRoles"
                :loading="loading"
                @focus="
                  (e) => {
                    getRoles(e.target.value);
                  }
                "
                key="first-userIds"
                style="width: 100%"
              >
                <el-option
                  v-for="item in roleList"
                  :key="item.roleId"
                  :label="item.roleName"
                  :value="item.roleId"
                >
                </el-option>
              </el-select>
            </el-col>
          </el-tab-pane>
        </el-tabs>
      </el-row>

      <!-- <el-button icon="el-icon-circle-plus-outline">增加权限</el-button> 

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSave">确 定</el-button>
      </span>
    </el-dialog> -->
  </div>
</template>

<script>
import PrivilegeEditDialog from "@/components/PrivilegeEditDialog";
import { listDir, queryAdminFolderTree } from "@/api/file";
import {
  createRelation,
  queryGroupUsers,
  reportRelation,
  queryUser,
  queryRoles,
  searchRoles,
  reportRoleRelation,
} from "@/api/user";

export default {
  name: "Index",
  components: {
    PrivilegeEditDialog,
  },
  data() {
    return {
      treeData: [],
      dialogVisible: false,
      groupTypeOptions: [
        {
          value: "reviewer",
          label: "审核者",
        },
        {
          value: "display",
          label: "查看者",
        },
        {
          value: "create",
          label: "新增者",
        },
        {
          value: "admin",
          label: "管理员",
        },
        // {
        //   value: "click",
        //   label: "点击者",
        // },
        // {
        //   value: "delete",
        //   label: "删除者",
        // },
      ],
      groupType: "display",
      props: {
        label: "folder_name",
        children: "sub_folders",
        groupType: "groupType",
      },
      activeName: "first",
      targetFolder: {},
      userIdList: [],
      userIdsByType: [],
      rolesByType: [],
      roleList: [],
      loading: false,
      theUserId: "",
      theGroupType: "display",
    };
  },
  mounted() {
    document.title = "权限管理";
  },
  methods: {
    handleCloseModal() {
      this.dialogVisible = false;
    },
    handleSave() {
      if (this.activeName === "first") {
        debugger;
        reportRelation({
          userIdList: this.userIdsByType,
          folderId: this.targetFolder?.folder_id,
          groupType: this.groupType,
          creator: this.userId,
        }).then((res) => {
          if (res.flag === "SUCCESS") {
            this.$message.success(res.message ?? "设置成功");
            this.dialogVisible = false;
          } else {
            this.$message.error(res.message ?? "保存失败");
          }
        });
      } else {
        debugger;
        reportRoleRelation({
          roleIdList: this.rolesByType,
          folderId: this.targetFolder?.folder_id,
          groupType: this.theGroupType,
          creator: this.userId,
        }).then((res) => {
          if (res.flag === "SUCCESS") {
            this.$message.success(res.message ?? "设置成功");
            this.dialogVisible = false;
          } else {
            this.$message.error(res.message ?? "保存失败");
          }
        });
      }
    },

    handleClickTree(node, resolve) {
      if (node.level === 0) {
        return resolve([{ folder_name: "权限管理" }]);
      }
      const folderId = node?.data?.folderId;
      // if (node.level > 1) return resolve([]);
      // listDir({ folderId: folderId ?? -1 })
      queryAdminFolderTree({ userId: this.userId })
        .then((res) => {
          const fileList = res.sub_folders ?? [];
          if (fileList.length === 0) {
            // this.$message.warning("该目录下没有其他文件夹");
          }
          resolve(fileList);
        })
        .catch((err) => console.log(err));
    },
    getTreeData(node, resolve) {
      queryAdminFolderTree({ userId: this.userId })
        .then((res) => {
          const fileList = res.sub_folders ?? [];
          this.treeData = [res];
        })
        .catch((err) => console.log(err));
    },
    editModal(data) {
      this.dialogVisible = true;
      this.targetFolder = data;
      this.getGroupUsers();
    },
    getGroupUsers() {
      queryGroupUsers({
        folderId: this.targetFolder?.folder_id,
        groupType: this.groupType,
      }).then((res) => {
        if (res.flag === "SUCCESS") {
          const { users } = res;
          this.userIdsByType = (users || []).map((user) => user.userId);
        }
      });
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
    tabClick(e) {
      debugger;
      if (e?.index === "1") {
        this.getGroupRoles();
      }
    },
    getGroupRoles() {
      queryRoles({
        folderId: this.targetFolder?.folder_id,
        groupType: this.theGroupType,
      }).then((res) => {
        if (res.flag === "SUCCESS") {
          const { roles } = res;
          this.rolesByType = (roles || []).map((role) => role.roleName);
        }
      });
    },
    getRoles(roleName) {
      searchRoles({
        roleName,
        userId: this.userId,
      }).then((res) => {
        if (res.flag === "SUCCESS") {
          this.roleList = res.roleList || [];
        }
      });
    },
    changeGroupType(e) {
      this.groupType = e;
      this.getGroupUsers();
    },
    changeTheGroupType(e) {
      this.theGroupType = e;
      this.getGroupRoles();
    },
  },
  created() {
    this.getTreeData();
    setTimeout(() => {
      const node = document.querySelector(
        ".el-tree-node__content .el-tree-node__expand-icon"
      );
      if (node) {
        node.click();
      }
    }, 1000);
  },
  computed: {
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
<style>
.directoryWrapper {
  display: block;
  margin: 0;
}

.el-row {
  margin-bottom: 15px;
}
.mytree {
  padding: 40px 0 0 25px;
  background: #fafafa;
}
.mytree /deep/ {
  overflow-y: auto;
}
.mytree .el-tree {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.85);
  background: none;
}
.mytree .el-tree > .el-tree-node:after {
  border-top: none;
}
.mytree .el-tree-node {
  position: relative;
  padding-left: 10px;
}
.mytree .el-tree-node__expand-icon.is-leaf {
  display: none;
}
.mytree .el-tree-node__children {
  padding-left: 6px;
}

.mytree .el-tree-node :last-child:before {
  height: 38px;
}

.mytree .el-tree > .el-tree-node:before {
  border-left: none;
}

.mytree .el-tree > .el-tree-node:after {
  border-top: none;
}

.mytree .el-tree-node:before {
  content: "";
  left: -4px;
  position: absolute;
  right: auto;
  border-width: 1px;
}

.mytree .el-tree-node:after {
  content: "";
  left: -4px;
  position: absolute;
  right: auto;
  border-width: 1px;
}

.mytree .el-tree-node:before {
  border-left: 1px dashed #e8e8e8;
  bottom: 0px;
  height: 100%;
  top: -26px;
  width: 1px;
}

.mytree .el-tree-node:after {
  border-top: 1px dashed #e8e8e8;
  height: 20px;
  top: 12px;
  width: 10px;
}
.mytree .el-tree .el-tree-node__expand-icon.expanded {
  -webkit-transform: rotate(0deg);
  transform: rotate(0deg);
}
.mytree .el-tree .el-icon-caret-right:before {
  /* content: "\e723"; */
  /* content: "\e6d9"; */
  content: "+";
  font-size: 12px;
  color: #1ca0eb;
  border: 1px solid #1ca0eb;
  position: absolute;
  left: -20px;
  top: -8px;
  padding: 0px 2px 2px 2px;
}
.mytree
  .el-tree
  .el-tree-node__expand-icon.expanded.el-icon-caret-right:before {
  /* content: "\e6d8"; */
  content: "-";
  font-size: 12px;
  color: #1ca0eb;
  border: 1px solid #1ca0eb;
  position: absolute;
  left: -20px;
  top: -8px;
  padding: 0px 2px 2px 2px;
}
.mytree .el-tree-node__content > .el-tree-node__expand-icon {
  padding: 0;
}
.page-header {
  height: 48px;
  line-height: 48px;
  background: #ffffff;
  box-shadow: 0px -1px 0px 0px #e8e8e8 inset;
  font-size: 16px;
  font-family: PingFang SC, PingFang SC-Semibold;
  font-weight: 600;
  color: #333333;
  padding-left: 24px;
}
</style>
