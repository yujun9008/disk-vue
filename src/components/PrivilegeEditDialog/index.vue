<template>
   <el-dialog title="编辑权限" :visible.sync="dialogVisible" width="50%" :before-close="handleCancle">
      <el-row :gutter="24">
        <el-col :span="4">文件名称：</el-col>
        <el-col :span="14">{{ targetFolder.folder_name || targetFolder.documentName }}</el-col>
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

      <!-- <el-button icon="el-icon-circle-plus-outline">增加权限</el-button> -->

      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancle">取 消</el-button>
        <el-button type="primary" @click="handleSave">确 定</el-button>
      </span>
    </el-dialog>
</template>

<script>
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
  name: "PrivilegeEditDialog",
  props: {
    dialogVisible: Boolean,
    targetFolder: Object
  },
  components: {},
  data() {
    return {
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
   
      ],
      groupType: "display",
      props: {
        label: "folder_name",
        children: "sub_folders",
        groupType: "groupType",
      },
      activeName: "first",
      userIdList: [],
      userIdsByType: [],
      rolesByType: [],
      roleList: [],
      loading: false,
      theUserId: "",
      theGroupType: "display",
    };
  },

  created() {},
   watch: {
    dialogVisible: {
      handler(val) {
        debugger
        if (val) {
          this.$nextTick(() => {
           this.getGroupUsers();
          })
        }
      },
    }
  },
  methods: {
    handleCancle(){
      this.$emit('closeModal')
    },
    handleSave() {
      if (this.activeName === "first") {
        reportRelation({
          userIdList: this.userIdsByType,
          folderId: this.folderId,
          groupType: this.groupType,
          creator: this.userId,
        }).then((res) => {
          if (res.flag === "SUCCESS") {
            this.$message.success(res.message ?? "设置成功");
            this.$emit('closeModal')
          } else {
            this.$message.error(res.message ?? "保存失败");
          }
        });
      } else {
        debugger;
        reportRoleRelation({
          roleIdList: this.rolesByType,
          folderId: this.folderId,
          groupType: this.theGroupType,
          creator: this.userId,
        }).then((res) => {
          if (res.flag === "SUCCESS") {
            this.$message.success(res.message ?? "设置成功");
            this.$emit('closeModal')
          } else {
            this.$message.error(res.message ?? "保存失败");
          }
        });
      }
    },
  
    getGroupUsers() {
      queryGroupUsers({
        folderId: this.folderId,
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
        folderId: this.folderId,
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
    folderId: function () {
      return this.targetFolder?.folder_id || this.targetFolder?.documentId || this.targetFolder?.id
    }
  },
};
</script>

<style scoped>
.el-row {
  margin-bottom: 15px;
}
</style>
