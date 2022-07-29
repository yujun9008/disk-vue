<template>
  <div class="error-401-wrapper">
    <h2 class="title">您没有访问权限！</h2>
    <img :src="error_401_img" alt/>
    <div>
      <el-link type="primary" :href="href" target="_self" class="backLogin">返回登录</el-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Error_401',
  data() {
    return {
      error_401_img: require('@/assets/images/error/401.png')
    }
  },
  computed: {
    href() {
      this.$store.dispatch("LogOut");
      return process.env.VUE_APP_ROOT + "/login";
    }
  }
}
</script>

<style scoped>
.error-401-wrapper {
  display: block;
  padding: 100px 0;
  text-align: center;
  margin: 0 auto;
}

.title {
  padding-bottom: 20px;
}

.backLogin {
  margin-top: 20px;
  display: inline-block;
}
</style>
