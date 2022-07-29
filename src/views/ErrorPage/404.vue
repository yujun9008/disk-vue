<template>
  <div class="error-404-wrapper">
    <h2 class="title">您的页面飞走了……</h2>
    <img :src="error_404_img" alt/>
    <div>
      <el-link type="primary" href="javascript:history.back(-1)" target="_self" class="goBack">返回上一页</el-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Error_404',
  data() {
    return {
      error_404_img: require('@/assets/images/error/404.png')
    }
  }
}
</script>

<style scoped>
.error-404-wrapper {
  display: block;
  padding: 100px 0;
  text-align: center;
  margin: 0 auto;
}

.title {
  padding-bottom: 20px;
}

.goBack {
  margin-top: 20px;
  display: inline-block;
}
</style>
