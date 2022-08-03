<template>
  <div class="indexWrapper">
    <el-tree
      :data="data"
      node-key="id"
      default-expand-all
      :expand-on-click-node="false"
      :render-content="renderContent"
    >
    </el-tree>
    <el-dialog
      title="编辑权限"
      :visible.sync="dialogVisible"
      width="50%"
      :before-close="handleClose"
    >
      <el-row :gutter="24">
        <el-col :span="6">文件名称</el-col>
        <el-col :span="14">test1</el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="6">创建者</el-col>
        <el-col :span="14">xxx</el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="6">创建时间</el-col>
        <el-col :span="14">xxx</el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="6">
          <i class="el-icon-circle-plus-outline btn-add"></i>
          <el-dropdown>
            <el-button>
              权限维度<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>

            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>人员</el-dropdown-item>
              <el-dropdown-item>角色</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
        <el-col :span="7">
          <el-select
            v-model="value"
            multiple
            filterable
            allow-create
            default-first-option
            placeholder="请选择相关人员"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="7">
          <el-select
            v-model="value"
            multiple
            filterable
            allow-create
            default-first-option
            placeholder="请选择相关权限"
          >
            <el-option
              v-for="item in options1"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option> </el-select
        ></el-col>
      </el-row>

      <!-- <el-button icon="el-icon-circle-plus-outline">增加权限</el-button> -->

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { listDir } from "@/api/file";

export default {
  name: "Index",
  components: {},
  data() {
    const data = [
      {
        id: 1,
        label: "文件一级",
        children: [
          {
            id: 4,
            label: "二级 1-1",
            children: [
              {
                id: 9,
                label: "三级 1-1-1",
              },
              {
                id: 10,
                label: "三级 1-1-2",
              },
            ],
          },
        ],
      },
      {
        id: 2,
        label: "文件test",
        children: [
          {
            id: 5,
            label: "二级 2-1",
          },
          {
            id: 6,
            label: "二级 2-2",
          },
        ],
      },
      {
        id: 3,
        label: "文件test3",
        children: [
          {
            id: 7,
            label: "二级 3-1",
          },
          {
            id: 8,
            label: "二级 3-2",
          },
        ],
      },
    ];
    return {
      data: JSON.parse(JSON.stringify(data)),
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
  width: 500px;
  display: block;
  margin: 0;
}
.btn-add {
  font-size: 18px;
  cursor: pointer;
  margin-right: 5px;
}
</style>
