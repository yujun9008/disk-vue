<template>
  <div class="aside">
    <el-menu
      :default-openeds="[0]"
      @select="handleSelect"
      :router="true"
      :default-active="$route.path"
    >
      <el-menu-item
        v-for="item in menuData"
        :key="item.rightId"
        :index="'/' + item.rightName"
        :title="item.rightDesc"
      >
        <i :class="item.icon"></i>
        <span slot="title">{{ item.rightDesc }}</span>
      </el-menu-item>

      <!-- <el-menu-item :route="{ path: '/index' }" index="/index">
        <i class="el-icon-menu" title="全部"></i>
        <span slot="title">首页</span>
      </el-menu-item>
      <el-menu-item index="/minefile" title="我的文件">
        <i class="el-icon-picture"></i>
        <span slot="title">我的文件</span>
      </el-menu-item>
      <el-menu-item index="/publicfile" title="我的文件">
        <i class="el-icon-document"></i>
        <span slot="title">公共文件</span>
      </el-menu-item>
      <el-menu-item index="/privilegemanage" title="权限管理">
        <i class="el-icon-video-camera-solid"></i>
        <span slot="title">权限管理</span>
      </el-menu-item> 
      <el-menu-item index="/rolemanage" title="角色管理">
        <i class="el-icon-s-custom"></i>
        <span slot="title">角色管理</span>
      </el-menu-item>
      <el-menu-item index="/reviewmanage" title="审核管理">
        <i class="el-icon-s-check"></i>
        <span slot="title">审核管理</span>
      </el-menu-item>-->
    </el-menu>
    <!-- <Storage class="storage"></Storage> -->
  </div>
</template>

<script>
import Storage from "@/components/Storage";
import { queryPrivileges } from "@/api/user";
export default {
  name: "Aside",
  components: { Storage },
  data() {
    return {
      menuData: [],
    };
  },
  computed: {
    //  当前活跃菜单项index，也是当前被选中的文件类型
    activeIndex: function () {
      console.log("this.$route", this.$route);
      return String(this.$route.fullpath);
    },
    userId: {
      get() {
        return this.$store.getters.userId;
      },
    },
    // userPrivileges: {
    //   get() {
    //     return this.$store.getters.userPrivileges;
    //   },
    // },
  },
  created() {
    setTimeout(() => {
      this.getMenu();
    }, 700);
  },
  methods: {
    getMenu() {
      queryPrivileges({ userId: this.userId }).then((res) => {
        debugger;
        if (res.flag === "SUCCESS") {
          if (res.privileges) {
            this.menuData = res.privileges || [];
          }
        } else {
          this.$message.error(res.message);
        }
      });
    },
    //  导航菜单项点击事件
    handleSelect(index) {
      console.log(this.userPrivileges);
      debugger;
      this.$router.push({
        path: index,
        query: {},
      });
    },
  },
};
</script>

<style scoped>
.aside {
  display: flex;
  flex-direction: column;
}
.aside ul {
  padding-top: 15px;
}

.aside /deep/ .el-menu-item i {
  display: block;
  margin: 0 auto;
  font-size: 24px;
}
.aside /deep/ .el-menu-item {
  height: 65px;
  line-height: 24px;
  text-align: center;
  color: #666;
  font-size: 12px;
  font-family: PingFang SC, PingFang SC-Regular;
  font-weight: 400;
  margin: 10px 0 15px 0;
  padding: 10px 0 10px 0 !important;
}
.aside /deep/ .el-menu-item:focus,
.el-menu-item.is-active,
.el-menu-item:hover {
  color: #1ca0eb;
  background: #f4f5f7;
}
.aside /deep/ .el-menu-item:focus i,
.el-menu-item:hover i {
  color: #1ca0eb;
}
.el-menu {
  border-right: solid 0 #e6e6e6 !important;
  flex: 1;
}

.storage {
  margin: 50px 0;
}
</style>
