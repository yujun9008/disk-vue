<template>
  <div class="aside">
    <el-menu
      :default-openeds="[0]"
      @select="handleSelect"
      :router="true"
      :default-active="$route.path"
    >
      <el-menu-item :route="{ path: '/index' }" index="/index">
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
      <el-menu-item index="/directorymanage" title="目录管理">
        <i class="el-icon-video-camera-solid"></i>
        <span slot="title">目录管理</span>
      </el-menu-item>
      <el-menu-item index="/rolemanage" title="目录管理">
        <i class="el-icon-s-custom"></i>
        <span slot="title">角色管理</span>
      </el-menu-item>
    </el-menu>
    <!-- <Storage class="storage"></Storage> -->
  </div>
</template>

<script>
import Storage from "@/components/Storage";

export default {
  name: "Aside",
  components: { Storage },
  data() {
    return {};
  },
  computed: {
    //  当前活跃菜单项index，也是当前被选中的文件类型
    activeIndex: function () {
      console.log("this.$route", this.$route);
      return String(this.$route.fullpath);
    },
  },
  methods: {
    //  导航菜单项点击事件
    handleSelect(index) {
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

.el-menu {
  border-right: solid 0 #e6e6e6 !important;
  flex: 1;
}

.storage {
  margin: 50px 0;
}
</style>
