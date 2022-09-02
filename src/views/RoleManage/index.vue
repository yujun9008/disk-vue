<template>
  <div class="indexWrapper">
    <el-tabs type="border-card">
      <el-tab-pane label="角色管理">
        <RoleTable></RoleTable>
      </el-tab-pane>
    </el-tabs>
    <!-- <el-button @click="resetDateFilter">新增角色</el-button>
    <el-divider></el-divider>
    <table>
      <thead>
        <th>角色</th>
        <th>人员</th>
      </thead>
      <tbody>
        <tr>
          <td>
            <el-select v-model="value" placeholder="请选择">
              <el-option
                v-for="item in options1"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </td>
          <td>
            <el-select v-model="value" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </td>
        </tr>
      </tbody>
    </table>

    <el-button
      icon="el-icon-circle-plus-outline"
      style="margin-top: 20px; margin-left: 80px"
      >新增配置</el-button
    > -->
  </div>
</template>

<script>
import { listDir } from "@/api/file";
import RoleTable from "@/components/RoleTable";

export default {
  name: "Index",
  components: {
    RoleTable,
  },
  data() {
    return {
      dialogVisible: false,
    };
  },
  methods: {},
  created() {},
  computed: {},
};
</script>
<style scoped>
.indexWrapper {
  padding: 20px;
  display: block;
  margin: 0;
}
.btn-add {
  font-size: 18px;
  cursor: pointer;
  margin-right: 5px;
}
table {
  width: 700px;
}
table td {
  text-align: center;
}
</style>
