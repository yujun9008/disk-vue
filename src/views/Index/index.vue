<template>
  <div class="indexWrapper">
    <div v-if="collectFolders.length">
      <h3>您是下列目录的收藏者</h3>
      <Folders type="collect" :folderList="collectFolders" />
      <el-divider></el-divider>
    </div>
    <div v-if="ownerFolders.length">
      <h3>您是下列目录的所有者</h3>
      <Folders type="owner" :folderList="ownerFolders" @showMore="showMore" />
      <el-divider></el-divider>
    </div>
    <div v-if="adminFolders.length">
      <h3>您是下列目录的管理员</h3>
      <Folders type="admin" :folderList="adminFolders" />
      <el-divider></el-divider>
    </div>
    <div v-if="createFolders.length">
      <h3>您是下列目录的新增者</h3>
      <Folders type="create" :folderList="createFolders" />
      <el-divider></el-divider>
    </div>
    <div v-if="displayFolders.length">
      <h3>您是下列目录的浏览者</h3>
      <Folders type="display" :folderList="displayFolders" />
    </div>
    <div v-if="allEmpty">
      <div class="all-empty">
        <h1>暂无文件内容</h1>
      </div>
    </div>
  </div>
</template>

<script>
import { queryFirstPage } from "@/api/user";
import Folders from "@/components/Folders";

export default {
  name: "Index",
  components: {
    Folders,
  },
  data() {
    return {
      collectFolders: [],
      ownerFolders: [],
      adminFolders: [],
      createFolders: [],
      displayFolders: [],
      allEmpty: false,
    };
  },
  methods: {
    getFirstPage(groupType) {
      const params = {
        userId: this.userId,
      };
      if (groupType) {
        params.groupType = groupType;
      }

      queryFirstPage(params)
        .then((res) => {
          if (res.flag === "SUCCESS") {
            if (res.total?.length) {
              this[`${groupType}Folders`] = res.total;
            } else {
              const {
                collect = [],
                owner = [],
                admin = [],
                create = [],
                display = [],
              } = res;
              this.collectFolders = collect;
              this.ownerFolders = owner;
              this.adminFolders = admin;
              this.createFolders = create;
              this.displayFolders = display;
              if (
                !collect.length &&
                !owner.length &&
                !admin.length &&
                !create.length &&
                !display.length
              ) {
                this.allEmpty = true;
              }
            }
          } else {
            this.$message.error(res?.message || "获取失败");
          }
        })
        .catch((err) => console.log(err));
    },
    showMore(e) {
      this.getFirstPage(e);
    },
  },
  created() {
    this.getFirstPage();
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
<style scoped>
.indexWrapper {
  padding: 20px;
  width: 100%;
  display: block;
}
h3 {
  font-weight: 400;
  color: #1f2f3d;
  margin-bottom: 10px;
}

.title {
  line-height: 18px;
  font-size: 12px;
  margin-top: 8px;
  color: #03081a;
  overflow: hidden;
  max-height: 36px;
  word-break: break-all;
}
.desc {
  font-size: 12px;
  color: #818999;
  line-height: 18px;
  margin-top: 2px;
}
.all-empty {
  text-align: center;
  padding-top: 100px;
}
</style>
