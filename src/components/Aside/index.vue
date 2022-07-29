<template>
  <div class="aside">
    <el-menu
      :default-openeds="[0]"
      :default-active="activeIndex"
      @select="handleSelect"
    >
      <el-menu-item index="0">
        <i class="el-icon-menu" title="全部"></i>
        <span slot="title">首页</span>
      </el-menu-item>
      <el-menu-item index="1" title="图片">
        <i class="el-icon-picture"></i>
        <span slot="title">我的文件</span>
      </el-menu-item>
      <el-menu-item index="2" title="文档">
        <i class="el-icon-document"></i>
        <span slot="title">公共文件</span>
      </el-menu-item>
      <el-menu-item index="3" title="视频">
        <i class="el-icon-video-camera-solid"></i>
        <span slot="title">目录管理</span>
      </el-menu-item>
      <el-menu-item index="4" title="音乐">
        <i class="el-icon-headset"></i>
        <span slot="title">角色管理</span>
      </el-menu-item>
    </el-menu>
    <Storage class="storage"></Storage>
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
      return String(this.$route.query.fileType);
    },
  },
  methods: {
    //  导航菜单项点击事件
    handleSelect(index) {
      let pid = 0;
      if (index !== "0") {
        pid = null;
      }
      this.$router.push({
        path: "/file",
        query: { fileType: index, fileName: "/", pid: pid },
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
