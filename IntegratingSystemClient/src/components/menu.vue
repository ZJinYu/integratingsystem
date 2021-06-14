<template>
        <el-menu mode="horizontal" :default-active="this.$router.path" router>
          <el-menu-item v-show="!isShow" index="/index">首页</el-menu-item>
          <el-menu-item v-show="isShow" index="/login">登录</el-menu-item>
          <el-menu-item v-show="isShow" index="/register">注册</el-menu-item>
           <el-menu-item v-show="!isShow" index="/order">我的订单</el-menu-item>
          <el-submenu v-show="!isShow" index="##">
            <template slot="title">个人中心</template>
            <el-menu-item index="/information">个人信息详情</el-menu-item>
            <el-menu-item index="##4" @click="logout">退出登录</el-menu-item>
          </el-submenu>
        </el-menu>
</template>

<script>
export default {
  name: 'Menu',
  props: {
    isShow:{
      type: Boolean,
      default: () => true
    }
  },
  methods: {
    logout() {
      //清除token，并且强制返回登录界面
      localStorage.clear()
      location.reload()
      this.$router.push('/index')
      this.$message.success("退出成功")
    },
    register() {
     // 跳转注册页面
      this.$router.push('/register')
    }
  },
}
</script>

<style scoped>
.home-container {
  height: 100%;
}
.el-header {
  background-color: #fff;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #000000;
  font-size: 20px;
}
.el-header>div{
  display: flex;
  align-items: center;
}
.el-header>div span{
  margin-left: 15px;
}
.logo-img{
  margin-left: 10px;
  height: 45px;
  width: 180px;
}

.el-aside {
  background-color: fffff;

}
.el-menu{
  border-right: none;
}
.el-main {
  background-color: #eeeeee;
}
</style>
