<template>
  <section class="role-table">
    <div class="search">
      <el-input
        v-model="roleName"
        placeholder="搜索角色"
        clearable
        size="small"
        @keyup.enter.native="searchRole"
        ><el-button
          slot="append"
          icon="el-icon-search"
          @click="searchRole"
        ></el-button
      ></el-input>
    </div>
    <el-button type="primary" @click="handleNew" size="small" class="btn-new"
      >新增角色</el-button
    >

    <!--列表-->
    <el-table
      :data="roleList"
      highlight-current-row
      v-loading="listLoading"
      @selection-change="selsChange"
      style="width: 100%"
    >
      <!-- <el-table-column type="index" width="60"> </el-table-column> -->

      <el-table-column prop="roleName" label="角色名称" width="280">
      </el-table-column>
      <el-table-column prop="roleType" label="角色类型"> </el-table-column>
      <el-table-column prop="createBy" label="创建人"> </el-table-column>
      <el-table-column prop="createTime" label="创建时间">
        <template slot-scope="scope">
          {{ scope.row.createTime | dateFormat }}
        </template>
      </el-table-column>

      <el-table-column label="操作" width="250">
        <template scope="scope">
          <el-button
            size="small"
            @click="handleUserEdit(scope.$index, scope.row)"
            >人员管理</el-button
          >
          <el-button size="small" @click="handleEdit(scope.$index, scope.row)"
            >编辑</el-button
          >
          <el-button
            size="small"
            style="color: #f3475c"
            @click="handleDel(scope.$index, scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      background
      layout="prev, pager, next"
      :hide-on-single-page="true"
      :total="total"
      :page-size="pageSize"
      @current-change="pageChange"
    ></el-pagination>

    <!--修改表单 编辑界面-->
    <el-dialog
      :title="dialogTitle"
      v-model="editFormVisible"
      :visible.sync="editFormVisible"
      :close-on-click-modal="false"
    >
      <el-form
        :model="editForm"
        label-width="80px"
        :rules="editFormRules"
        ref="editForm"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editForm.roleName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色类型" prop="roleType">
          <el-input v-model="editForm.roleType" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="editFormVisible = false">取消</el-button>
        <el-button
          type="primary"
          @click.native="editSubmit"
          :loading="editLoading"
          >确定</el-button
        >
      </div>
    </el-dialog>

    <el-dialog
      :title="targetRole.roleName"
      v-model="roleUserVisible"
      :visible.sync="roleUserVisible"
      :close-on-click-modal="false"
    >
      <h3>人员管理</h3>
      <el-button
        type="primary"
        @click="bulkImport"
        class="import-btn"
        size="small"
        >批量导入</el-button
      >
      <br />
      <el-select
        v-model="roleUsers"
        multiple
        filterable
        remote
        placeholder="请选择相关人员"
        :remote-method="getUser"
        @focus="
          (e) => {
            getUser(e.target.value);
          }
        "
        key="userIds"
        style="width: 100%"
      >
        <el-option
          v-for="item in userIdList"
          :key="item.userId"
          :label="item.userName"
          :value="item.userId"
        >
          <span>{{ item.userId }}-{{ item.userName }}-{{ item.orgName }}</span>
        </el-option>
      </el-select>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="roleUserVisible = false">取消</el-button>
        <el-button type="primary" @click.native="submitUserMana"
          >确定</el-button
        >
      </div>
    </el-dialog>

    <el-dialog
      title="批量导入"
      v-model="bulkImportVisible"
      :visible.sync="bulkImportVisible"
      :close-on-click-modal="false"
      width="900px"
    >
      <div class="tree-container">
        <p class="tree-pre">全部人员</p>
        <div class="tree-bulk-main">
          <el-input
            placeholder="请输入内容"
            v-model="searchInput"
            class="input-with-select"
            size="small"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="searchTree"
            ></el-button>
          </el-input>
          <el-tree
            ref="orgTree"
            v-if="refreshTree"
            :props="orgProps"
            :data="orgTreeData"
            node-key="user_id"
            show-checkbox
            :default-expand-all="defaultExpandAll"
            @check-change="handleCheckChange"
          >
          </el-tree>
        </div>
      </div>
      <div class="checked-container">
        <p class="tree-pre">
          <i></i>{{ checkedOrgs.length }}项<span class="fr">已选人员</span>
        </p>
        <div class="tree-bulk-main">
          <ul>
            <li v-for="item in checkedOrgs" :key="item.user_id">
              {{ item.user_id }}_{{ item.user_name_en }}_{{ item.user_name_ch }}
            </li>
          </ul>
        </div>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button @click.native="bulkImportVisible = false">取消</el-button>
        <el-button type="primary" @click.native="submitBulkInport"
          >确定</el-button
        >
      </div>
    </el-dialog>
  </section>
</template>

<script>
import {
  queryRole,
  roleRename,
  roleDelete,
  roleCreate,
  queryUser,
  queryRoles,
  searchUsers,
  reportUsers,
  searchOrgUsers,
  queryOrgTree,
} from "@/api/user";
import { searchOrgUsersTree } from "@/api/file";
import moment from "moment";

function getChildren(data) {
  if (data.org_name && !data.user_name_ch) {
    data.user_id = data.org_id;
    data.user_name_ch = data.org_name;
  }
  if (data.sub_orgs?.length) {
    data.sub_orgs.forEach((org) => {
      data.employees.unshift({
        ...org,
        user_id: org.org_id,
        user_name_ch: org.org_name,
      });
      if (org.sub_orgs?.length) {
        getChildren(org);
      } else {
        data.user_name_ch = data.org_name;
      }
    });
  } else {
  }
}

export default {
  data() {
    return {
      filters: {
        name: "",
      },
      roleList: [],
      total: 0,
      page: 1,
      pageSize: 30,
      listLoading: false,
      sels: [], //列表选中列

      editFormVisible: false, //编辑界面是否显示
      editLoading: false,
      editFormRules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
        ],
      },
      //编辑界面数据
      editForm: {
        id: 0,
        roleName: "",
      },

      addFormVisible: false, //新增界面是否显示
      addLoading: false,
      addFormRules: {
        name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
      },
      dialogTitle: "新增",
      roleUserVisible: false,
      targetRole: {},
      roleUsers: [],
      userIdList: [],
      roleName: "",
      bulkImportVisible: false,
      bulkOrg: [],
      userOrgList: [],
      checkAllFlag: false, //之前是否勾选了全部
      oldOrgOptions: [],
      orgProps: {
        label: "user_name_ch",
        children: "employees",
      },
      orgTreeData: [],
      checkedOrgs: [],
      searchInput: "",
      refreshTree: true,
      defaultExpandAll: false,
    };
  },
  methods: {
    pageChange(page){
      this.getListData(page)
    },
    searchTree() {
      debugger;
      searchOrgUsersTree({
        userId: this.userId,
        orgName: this.searchInput,
      }).then((res) => {
        if (res.flag === "SUCCESS") {
          getChildren(res.orgInfo);
          this.defaultExpandAll = true;
          this.refreshTree = false;
          console.log("res.orgInfo.sub_orgs", res.orgInfo.sub_orgs);
          const resut = [];
          resut.push(res.orgInfo);
          this.orgTreeData = resut;
          this.$nextTick(() => {
            this.refreshTree = true;
          });
        }
      });
    },
    handleCheckChange(e, flag) {
      console.log(this.$refs.orgTree.getCheckedNodes());
      const checkedNodes = this.$refs.orgTree.getCheckedNodes();
      this.checkedOrgs = checkedNodes.filter((e) => !e.employees);
    },
    loadNode(node, resolve) {
      f;
      if (node.level === 0) {
        return resolve([{ name: "全院" }]);
      }
      // if (node.level > 1) return resolve([]);

      queryOrgTree({
        userId: this.userId,
      }).then((res) => {
        debugger;
        if (res.flag === "SUCCESS") {
          resolve(res.orgInfo.sub_orgs);
        }
      });
    },
    getOrgTree: function () {
      queryOrgTree({
        userId: this.userId,
      }).then((res) => {
        debugger;
        this.bulkImportVisible = true;
        if (res.flag === "SUCCESS") {
          const data = [];
          // (res.orgInfo.sub_orgs || []).forEach((org) => {
          //   const arr = org.sub_orgs.concat(org.employees);
          // });
          getChildren(res.orgInfo);
          this.orgTreeData = res.orgInfo.sub_orgs;
          // console.log(this.orgTreeData[0].sub_orgs);
        }
      });
    },
    selectChangeHandle(val) {
      let allValues = [];
      //保留所有值
      for (let item of this.userOrgList) {
        allValues.push(item.value);
      }
      debugger;

      // 用来储存上一次的值，可以进行对比
      const oldVal =
        this.oldOrgOptions.length === 1 ? this.oldOrgOptions[0] : [];

      // 若是全部选择
      if (val.includes(-1)) this.bulkOrg = allValues;

      // 取消全部选中  上次有 当前没有 表示取消全选
      if (oldVal.includes(-1) && !val.includes(-1)) this.bulkOrg = [];

      // 点击非全部选中  需要排除全部选中 以及 当前点击的选项
      // 新老数据都有全部选中
      if (oldVal.includes(-1) && val.includes(-1)) {
        const index = val.indexOf(-1);
        val.splice(index, 1); // 排除全选选项
        this.bulkOrg = val;
      }

      //全选未选 但是其他选项全部选上 则全选选上 上次和当前 都没有全选
      if (!oldVal.includes(-1) && !val.includes(-1)) {
        if (val.length === allValues.length - 1)
          this.bulkOrg = [-1].concat(val);
      }

      //储存当前最后的结果 作为下次的老数据
      this.oldOrgOptions[0] = this.bulkOrg;
    },
    getOrgUsers: function (name) {
      if (!name) {
        return;
      }
      searchOrgUsers({
        name,
      }).then((res) => {
        if (res.flag === "SUCCESS" && res?.users?.length) {
          const list = res.users || [];

          const userOrgList = list.map((item) => {
            return {
              label: `${item.userId}-${item.userName}-${item.orgName}`,
              value: item.userId,
            };
          });
          userOrgList.unshift({
            label: "选择全部",
            value: -1,
          });
          this.userOrgList = userOrgList;
        }
      });
    },
    submitBulkInport: function () {
      // const userIdList = this.checkedOrgs.map((org) => org.user_id);
      const userIdList = this.checkedOrgs.map((org) => org.user_name_en);
      reportUsers({
        roleId: this.targetRole.id,
        userIdList,
        creator: this.userId,
      }).then((res) => {
        debugger;
        if (res.flag === "SUCCESS") {
          this.$message.success(res.message || "保存成功");
          this.bulkImportVisible = false;
          //批量导入成功后
          this.getRoles();
        }
      });
    },
    bulkImport: function () {
      this.getOrgTree();
    },
    searchRole: function (e) {
      // console.log(this.roleName);
      this.getListData();
    },
    //性别显示转换
    formatSex: function (row, column) {
      return row.sex == 1 ? "男" : row.sex == 0 ? "女" : "未知";
    },
    //获取部门列表
    getListData(page = 1) {
      //显示加载中的效果
      this.listLoading = true;

      //发送请求到后台查询数据 axios
      queryRole({
        page,
        size: this.pageSize,
        roleName: this.roleName,
      }).then((res) => {
        //打印返回结果
        // console.log(res.data);
        this.listLoading = false;
        this.page = page;
        this.total = res.pageInfo?.total;
        this.roleList = res?.pageInfo?.records ?? [];
      });
    },
    //删除代码
    handleDel: function (index, row) {
      //删除之前提示 是否要删除
      this.$confirm("确认删除该角色吗?", "提示", {
        type: "warning",
      })
        .then(() => {
          //加载中
          this.listLoading = true;
          //获取行数据的id  /department/123
          //removeUser(para).then((res) => {
          roleDelete({
            roleId: row.id,
            deleter: this.userId,
          }).then((res) => {
            this.listLoading = false;
            const { flag, message } = res;
            if (flag === "SUCCESS") {
              this.$message({
                message: "删除成功",
                type: "success",
              });
              this.getListData();
            } else {
              this.$message({
                message: massage ?? "删除失败",
                type: "error",
              });
            }
          });
        })
        .catch(() => {});
    },
    handleNew: function () {
      this.editFormVisible = true;
      this.dialogTitle = "新增";
      this.editForm = {
        roleName: "",
      };
    },
    handleUserEdit: function (index, row) {
      this.roleUserVisible = true;
      this.targetRole = row;
      this.getRoles();
    },
    //显示编辑界面
    handleEdit: function (index, row) {
      this.editFormVisible = true;
      this.dialogTitle = "编辑";

      this.editForm = Object.assign({}, row);
    },
    //编辑
    editSubmit: function () {
      //验证表单是否填写
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          const { roleName, roleType, id } = this.editForm;
          const isNew = this.dialogTitle === "新增";
          const method = isNew ? roleCreate : roleRename;
          const params = {
            roleId: id,
            roleName,
            roleType,
          };
          if (isNew) {
            params.creator = this.userId;
          } else {
            params.deleter = this.userId;
          }
          // if (this.dialogTitle === "新增") {
          method(params).then((res) => {
            if (res.flag === "SUCCESS") {
              this.$message.success(
                res?.message || `${this.dialogTitle}成功！`
              );
              this.editFormVisible = false;
              this.getListData();
            }
          });
          // }
        }
      });
    },
    getRoles() {
      searchUsers({
        roleId: this.targetRole?.id,
      }).then((res) => {
        if (res.flag === "SUCCESS") {
          this.roleUsers = (res.users || []).map((user) => user.userId);
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
        debugger;
        if (res.flag === "SUCCESS") {
          this.userIdList = res.users || [];
        }
      });
    },
    submitUserMana() {
      // console.log(this.roleUsers);
      reportUsers({
        roleId: this.targetRole.id,
        userIdList: this.roleUsers,
        creator: this.userId,
      }).then((res) => {
        if (res.flag === "SUCCESS") {
          this.$message.success(res.message || "保存成功");
        }
      });
    },
    selsChange: function (sels) {
      this.sels = sels;
    },
  },
  //组件页面渲染完执行改生命周期钩子方法
  mounted() {
    this.getListData();
  },
  computed: {
    userId: {
      get() {
        return this.$store.getters.userId;
      },
    },
  },
  filters: {
    dateFormat: function (date) {
      return moment(date).format("YYYY-MM-DD HH:mm");
    },
  },
};
</script>

<style scoped>
.btn-new {
  margin-right: 15px;
  background: #1ca0eb;
  border-radius: 2px;
  margin-bottom: 16px;
}
.search {
  float: right;
}
.import-btn {
  float: right;
  position: relative;
  top: -20px;
}
.tree-container,
.checked-container {
  width: 400px;
  border: 1px solid #e8e8e8;
  height: 350px;
  overflow-y: auto;
  float: left;
  margin-bottom: 10px;
}
.tree-pre {
  height: 39px;
  line-height: 39px;
  padding-left: 12px;
  padding-right: 12px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}
.tree-pre i {
  display: inline-block;
  width: 16px;
  height: 16px;
  background: #ffffff;
  border: 1px solid #d9d9d9;
  border-radius: 2px;
  margin-right: 4px;
  vertical-align: middle;
}

.tree-pre .fr {
  float: right;
}
.tree-bulk-main {
  padding: 12px;
}
.tree-bulk-main li {
  margin: 3px 0;
}
.tree-bulk-main /deep/ .el-tree {
  margin: 12px 0;
}
.checked-container {
  float: left;
  margin-left: 20px;
}
.role-table /deep/ .el-table th.el-table__cell {
  padding: 7px 0;
  color: #fff;
  background: #1ca0eb;
}
.el-pagination {
  text-align: right;
  padding: 20px 0;
}
</style>
