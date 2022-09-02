<template>
  <section>
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
      <el-table-column type="index" width="60"> </el-table-column>

      <el-table-column prop="roleName" label="角色名称" width="300">
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
            type="danger"
            size="small"
            @click="handleDel(scope.$index, scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

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
          <span>{{ item.userName }}-{{ item.orgName }}</span>
        </el-option>
      </el-select>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="roleUserVisible = false">取消</el-button>
        <el-button type="primary" @click.native="submitUserMana"
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
} from "@/api/user";
import moment from "moment";

export default {
  data() {
    return {
      filters: {
        name: "",
      },
      roleList: [],
      total: 0,
      page: 1,
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
    };
  },
  methods: {
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
      }).then((res) => {
        //打印返回结果
        console.log(res.data);
        this.listLoading = false;
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
      console.log(this.roleUsers);
      reportUsers({
        roleId: this.targetRole.id,
        userIdList: this.roleUsers,
        creator: this.userId,
      }).then((res) => {
        debugger;
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
  float: right;
  margin: 10px 0;
}
</style>
