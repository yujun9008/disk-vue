<template>
  <div id="app">
    <el-container>
      <el-header v-if="isHeaderShow">
        <Header/>
      </el-header>
      <el-container>
        <el-aside width="200px" class="aside" v-if="isHeaderShow">
          <Aside/>
        </el-aside>
        <el-main>
          <router-view class="mainContent" :key="$route.fullPath"></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import Header from '@/components/Header'
import Aside from '@/components/Aside'

export default {
  name: 'App',
  components: {
    Header,
    Aside
  },
  computed: {
    //  头部是否显示
    isHeaderShow() {
      let routerNameList = ['Error_401', 'Error_404', 'Error_500'];
      return !routerNameList.includes(this.$route.name);
    }
  }
}
</script>

<style>
#app {
  height: 100%;
  overflow-x: hidden;
  -webkit-text-size-adjust: none;
  overflow-y: auto;
}

.mainContent {
  flex: 1;
  width: 90%;
  min-height: calc(100vh - 60px);
  margin: 0 auto;
  display: flex;
}

.el-main {
  padding: 0 !important;
  height: 100%;
}

.el-header {
  padding: 0 !important;
}

.el-aside {
  border-right: solid 1px #e6e6e6 !important;;
}

.aside {
  min-height: calc(100vh - 60px);
}
</style>
