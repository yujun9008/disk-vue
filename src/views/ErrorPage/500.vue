<template>
  <div class="error-500-wrapper">
    <h2 class="title">服务器出错，请联系管理员！</h2>
    <img :src="error_500_img" alt/>
    <div>
      <el-link type="primary" href="javascript:history.back(-1)" target="_self" class="goBack">返回上一页</el-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Error_500',
  data() {
    return {
      error_500_img: require('@/assets/images/error/500.png')
    }
  }
}
</script>

<style scoped>
.error-500-wrapper {
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
