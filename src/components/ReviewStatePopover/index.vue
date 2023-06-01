<template>
  <div v-if="row.documentFlag === 'folder'">
    <span v-if="row.reviewState === 1">需要审核</span>
    <span v-else>无需审核</span>
    <el-popover placement="top" width="200" trigger="click" v-model="visible">
      <p v-if="row.reviewState === 1">确定开启内容审核？</p>
      <p v-else>确定取消内容审核？</p>
      <div style="text-align: right; margin: 0">
        <el-button size="mini" type="text" @click="visible = false"
          >取消</el-button
        >
        <el-button type="primary" size="mini" @click="changeReviewState()"
          >确定</el-button
        >
      </div>
      <i
        class="el-icon-edit-outline"
        slot="reference"
        style="cursor: pointer"
      ></i>
    </el-popover>
  </div>
  <div v-else>-</div>
</template>

<script>
import { setFolderReviewFlag } from "@/api/file";
export default {
  name: "ReviewStatePopover",
  props: {
    row: Object,
  },
  components: {},
  data() {
    return {
      visible: false,
    };
  },

  created() {},
  methods: {
    changeReviewState() {
      const reviewState = this.row.reviewState === 1 ? 0 : 1; //0需要审核（默认），1表示不需要审核
      const folderId = this.row.id || this.row.documentId;
      setFolderReviewFlag({
        folderId,
        reviewState,
        userId: this.userId,
        groupType: this.groupType,
      }).then((res) => {
        if (res.flag === "SUCCESS") {
          this.$message.success(res.message);
          this.$emit("getTableDataWithPrivilege");
          this.visible = false;
        } else {
          this.$message.error(res.message);
        }
      });
    },
  },
  computed: {
    isPublicRoute: function () {
      return this.$route.name === "PublicFile";
    },
    groupType: function () {
      let groupType = this.$route.query.groupType;
      return groupType || null;
    },
    userId: {
      get() {
        return this.$store.getters.userId;
      },
    },
  },
};
</script>

<style scoped>
</style>
