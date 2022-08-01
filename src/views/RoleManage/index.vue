<template>
  <div class="indexWrapper">
    <el-button @click="resetDateFilter">新增角色</el-button>
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
    >
  </div>
</template>

<script>
import { listDir } from "@/api/file";

export default {
  name: "Index",
  components: {},
  data() {
    return {
      dialogVisible: false,
      options: [
        {
          value: "张三",
          label: "张三",
        },
      ],
      options1: [
        {
          value: "目录管理员",
          label: "目录管理员",
        },
      ],
    };
  },
  methods: {
    renderContent(h, { node, data, store }) {
      return (
        <span class="custom-tree-node">
          <span>{node.label}</span>
          <span>
            <el-button
              size="mini"
              type="text"
              style="margin-left:30px"
              on-click={() => this.editModal(data)}
            >
              编辑权限
            </el-button>
          </span>
        </span>
      );
    },
    editModal(data) {
      this.dialogVisible = true;
    },

    /**
     * 表格勾选框事件
     */
    selectionChange(selection) {
      this.selectionFile = selection;
    },
    //  获取查看大图的数据
    imgReviewData(row, visible) {
      if (row) {
        this.imgReview.fileUrl = row.userId + row.filePath;
        this.imgReview.name = row.name;
      }
      this.imgReview.visible = visible;
    },
    pdfReviewData(row, visible) {
      if (row) {
        this.pdfReview.fileUrl = row.userId + row.filePath;
        this.pdfReview.name = row.name;
      }
      this.pdfReview.visible = visible;
    },
    videoReviewData(row, visible) {
      console.log("videoReviewData", visible);
      if (row) {
        this.videoReview.fileUrl = row.userId + row.filePath;
        this.videoReview.name = row.name;
      }
      this.videoReview.visible = visible;
    },
    audioReviewData(row, visible) {
      console.log("audioReviewData", visible);
      if (row) {
        this.audioReview.fileUrl = row.userId + row.filePath;
        this.audioReview.name = row.name;
      }
      this.audioReview.visible = visible;
    },
  },
  created() {
    this.getTableDataByType(this.$store.getters.search);
  },
  computed: {
    fileName: function () {
      return this.$route.query.fileName;
    },
  },
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
