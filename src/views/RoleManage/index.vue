<template>
  <div class="indexWrapper">
    <p class="page-header">角色管理</p>
    <div class="page-main">
      <RoleTable></RoleTable>
    </div>
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
  mounted() {
    document.title = "角色管理";
  },
  methods: {},
  created() {},
  computed: {},
};
</script>
<style scoped>
.indexWrapper {
  display: block;
  margin: 0;
  background: #f2f3f5;
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
.page-main {
  background: #ffffff;
  margin: 16px;
  padding: 16px 24px 0 24px;
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
