<template>
  <div class="headerWrapper">
    <div class="header-right">
      <!--右侧下拉框-->
      <el-dropdown @command="handleCommand">
        <div class="avatar user">
          <el-avatar :size="size" :src="avatar" alt="用户头像" :key="avatar">
            <img src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png" alt="失败头像"/>
          </el-avatar>
          <div>
            <small v-text="userName" class="user-name">VUE</small>
          </div>
        </div>
        <!-- 用户名下拉菜单 -->
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="profile" icon="fa fa-user">个人中心</el-dropdown-item>
          <el-dropdown-item command="logout" icon="fa fa-sign-out" divided>退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

  </div>
</template>

<script>

export default {
  name: "Header",
  data() {
    return {
      size: 'large'
    }
  },
  methods: {
    handleCommand(command) {
      if (command === 'logout') {
        this.$confirm('确定退出登录?', '退出登录', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {
          return this.$store.dispatch("LogOut");
        }).then(() => {
          location.reload();
          window.open(process.env.VUE_APP_ROOT + "/login", "_self")
        }).catch((e) => {
          console.log(e);
        });
      } else if (command === 'profile') {
        window.open(process.env.VUE_APP_ROOT + "/user/profile?token=" + this.$store.getters.token, "_blank")
      }
    }
  },
  computed: {
    avatar: {
      get() {
        return this.$store.getters.avatar ? this.$store.getters.avatar : ''
      }
    },
    userName: {
      get() {
        return this.$store.getters.userName
      }
    }
  }
}
</script>

<style scoped>
.headerWrapper {
  width: 100%;
  padding: 0 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  height: 50px;
  line-height: 50px;
  background-color: #4AB7BD;
}

.header-right {
  float: right;
  height: 100%;
  display: flex;
  justify-content: center;
}

.user {
  cursor: pointer;
}

.avatar {
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  margin: auto 20px;
  width: 100px;
}

.user-name {
  margin-left: 10px;
}

</style>
