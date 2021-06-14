<template>
  <div class="log_containar">
    <div class="login_box">
      <!--头像-->
      <div class="avatar_box">
        <img src="@/assets/img/sea.png" alt="">
      </div>
      <el-button type="text" @click="goBack" style="margin-left: 20px">返回首页</el-button>
      <!--登录表单-->
      <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" label-width="0px" class="login_form">
        <!--用户名-->
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" prefix-icon="iconfont icon-RectangleCopy"></el-input>
        </el-form-item>
        <!--密码-->
        <el-form-item prop="password">
          <el-input  v-model="loginForm.password" prefix-icon="iconfont icon-RectangleCopy1" type="password"></el-input>
        </el-form-item>
        <!--按钮-->
        <el-form-item class="btns">
        <el-button type="primary" @click="login">登陆</el-button>
        <el-button type="success" @click="register">注册</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data() {
    return {
      //绑定表单数据对象
      loginForm: {
        username:'',
        password:''
      },
      //表单规则
      loginFormRules: {
        username: [ { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 4, max: 18, message: '请输入正确的用户名格式', trigger: 'blur' }
        ],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 18, message: '请按格式输入密码', trigger: 'blur' }]
      }
    }
  },
  methods: {
    //表单预验证
    login() {
      axios({
        method: 'post',
        url:'/user/login',
        headers:{
          'Content-Type': "application/json;charset=UTF-8",
        },
        data:{
          username:this.loginForm.username,
          password:this.loginForm.password
        }
      }).then( res => {
        console.log(res);
        if(res.data.code === 0){
          localStorage.setItem("token",res.data.token)
          this.$message.success(res.data.msg)
          this.$router.push('/index')
        }else{
          this.$message.error(res.data.msg)
        }
      }).catch(err=> {
        console.log(err);
      })
    },
    register() {
      this.$router.push('/register')
    },
    goBack(){
      this.$router.push('/index')
    }
  }
}
</script>

<style scoped>
.log_containar{
  background-color: #19C2A9;
  height: 100%;
}
.login_box{
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.avatar_box{
  height: 130px;
  width: 130px;
  border: 1px solid #eee;
  border-radius: 50%;
  padding: 10px;
  box-shadow: 0 0 10px #ddd;
  position: absolute;
  left: 50%;
  transform: translate(-55%,-50%);
  background-color: #fff;
  }
.avatar_box img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: #eee;
}
.login_form {
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
  position: absolute;
  bottom: 0;
}
.btns {
  display: flex;
  justify-content: flex-end;
}
</style>
