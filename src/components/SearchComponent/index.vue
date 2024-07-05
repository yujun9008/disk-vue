<template>
  <div>
    <div class="breadcrumb-wrapper">
      <el-breadcrumb
        separator-class="el-icon-arrow-right"
        separator="/"
        class="target-breadcrumb"
      >
        <el-breadcrumb-item
          :to="{ path: isMineFile ? '/minefile' : '/publicfile' }"
          >全部</el-breadcrumb-item
        >
        <el-breadcrumb-item>搜索结果 </el-breadcrumb-item
        ><el-breadcrumb-item
          >{{ $route.query.search }}
        </el-breadcrumb-item> </el-breadcrumb
      ><br />
    </div>
    <div class="totalDiv">
      文件<span>{{ pagination.total }}</span>
    </div>
    <div class="list-container">
      <div v-if="pagination.total == 0">
        <el-empty description="暂无搜索内容"></el-empty>
      </div>

      <div
        class="item"
        v-for="item in dataList"
        :key="item.folderId"
        @click="handleItemClick(item)"
      >
        <img :src="require('@/assets/images/file/file_word.png')" />
        <div>
          <p class="name">{{ item.fileName }}</p>
          <p>{{ item.matchContent }}</p>
          <p class="tips">
            <span>创建人：{{ item.createBy }}</span
            >&nbsp;&nbsp;<span>目录：{{ item.folderName }}</span>
          </p>
        </div>
      </div>
      <el-pagination
        background
        class="pagination"
        layout="prev, pager, next"
        :total="pagination.total"
        :page-size="pagination.size"
        @current-change="pageChange"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { fullTextQuery } from "@/api/file";
export default {
  name: "SearchComponent",
  props: {
    isMineFile: Boolean,
  },
  data() {
    return {
      fileTypeMap: {
        1: "图片",
        2: "文档",
        3: "视频",
        4: "音乐",
        5: "其他",
      },
      dataList: [],
      pagination: {
        total: 0,
        size: 20,
      },
    };
  },
  created() {
    this.fetchListData();
  },
  methods: {
    fetchListData: function (pageNum = 1) {
      fullTextQuery({
        pageNum,
        pageSize: this.pagination.size,
        user: this.userId,
        keyword: this.$route.query.search,
      }).then((res) => {
        const { flag, data } = res;
        if (flag === "SUCCESS") {
          this.dataList = data?.records;
          const total = data?.total || 0;
          this.pagination = { ...this.pagination, total };
        } else {
          this.$message.error("查询失败！");
        }
      });
    },
    pageChange: function (pageNum) {
      this.fetchListData(pageNum);
    },
    handleBack: function (pageNum) {
      this.$emit("back");
    },
    handleItemClick: function (item) {
      this.$router.push({
        path: item.folderType === "mine" ? "/minefile" : "/publicfile",
        query: {
          folderId: item.folderId,
        },
      });
    },
  },
  computed: {
    folderId: function () {
      let folderId = this.$route.query.folderId;
      return folderId ?? "-1";
    },
    visible: function () {
      const pathName = this.$route.name;
      return pathName === "MineFile" || pathName === "PublicFile";
    },
    fileType: function () {
      return Number(this.$route.query.fileType);
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
.pagination {
  text-align: center !important;
  margin: 20px 0;
}
.list-container {
  border-top: 10px solid #f2f3f5;
}
.totalDiv {
  font-size: 16px;
  font-weight: 600;
  padding-left: 20px;
  margin-bottom: 14px;
}
.totalDiv span {
  display: inline-block;
  margin-left: 16px;
  font-size: 24px;
}
.list-container .item {
  cursor: pointer;
  display: flex;
  border-bottom: 1px solid #e8e8e8;
  font-family: PingFang SC, PingFang SC-400;
  font-weight: 400;
  color: #333333;
  margin: 15px 0 5px 24px;
}
.list-container .item img {
  width: 40px;
  height: 40px;
  display: inline-block;
  margin-right: 5px;
}
.list-container .item p {
  margin-bottom: 5px;
}
.list-container .item .name {
  font-size: 16px;
  font-weight: 600;
  text-align: LEFT;
  color: #333333;
  line-height: 24px;
}
.list-container .item .tips {
  color: #999999;
}
.breadcrumb-wrapper {
  padding: 0 20px;
  height: 30px;
  line-height: 30px;
  display: flex;
  color: #3b8cff;
  font-size: 12px;
  font-weight: 500 !important;
  margin-bottom: 10px;
  background-color: #fff;
}

.breadcrumb-wrapper,
>>> .el-breadcrumb {
  height: 30px;
  line-height: 30px;
  font-size: 14px;
  font-weight: 500 !important;
}
.breadcrumb-wrapper,
>>> .el-breadcrumb__inner {
  /* color: #06a7ff; */
  color: rgba(0, 0, 0, 0.45);
  font-weight: 400;
}
.breadcrumb-wrapper,
>>> .el-breadcrumb__item:last-child {
  color: rgba(0, 0, 0, 0.85) !important;
}
</style>
