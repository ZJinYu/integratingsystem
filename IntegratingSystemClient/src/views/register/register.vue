<template>
  <div style="width: 500px;margin:50px auto">
    <div style="margin-top:80px;margin-left: -80px">
    <h2>会员注册</h2>
    <el-form :model="registerForm" :rules="rules" ref="registerForm" label-width="100px" class="demo-ruleForm">
  <el-form-item label="昵称" prop="nickName">
     <el-input v-model="registerForm.nickName" ></el-input>
  </el-form-item>
  <el-form-item label="电话" prop="phone">
     <el-input v-model="registerForm.phone"></el-input>
  </el-form-item>
  <el-form-item label="密码" prop="passWord">
    <el-input v-model="registerForm.password" type="password"></el-input>
  </el-form-item>
  <el-form-item label="确定密码" prop="checkPassWord">
    <el-input v-model="registerForm.checkPassword" type="password"></el-input>
  </el-form-item>
  <el-form-item label="真实姓名" prop="realName">
    <el-input v-model="registerForm.realName"></el-input>
  </el-form-item>
  <el-form-item label="年龄" prop="age">
    <el-input v-model="registerForm.age"></el-input>
  </el-form-item>
  <el-form-item label="出生日期" required>
    <el-col :span="11">
      <el-form-item prop="bornDate">
        <el-date-picker type="date" placeholder="选择日期" v-model="registerForm.bornDate" style="width: 100%;"></el-date-picker>
      </el-form-item>
    </el-col>
  </el-form-item>
  <el-form-item label="性别" prop="gander">
    <el-radio-group v-model="registerForm.gander">
      <el-radio label="1">男</el-radio>
      <el-radio label="2">女</el-radio>
    </el-radio-group>
  </el-form-item>
  <el-form-item label="邮箱" prop="email">
    <el-input type="email" v-model="registerForm.email"></el-input>
  </el-form-item>
  <el-form-item label="地址" prop="address">
    <el-input type="address" v-model="registerForm.address"></el-input>
  </el-form-item>
  <el-form-item>
    <el-button type="primary" @click="submitForm">立即创建</el-button>
    <el-button @click="resetForm('registerForm')">重置</el-button>
  </el-form-item>
</el-form>
      </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
    data() {
      const checkEmail = (rule, value, cb) => {
        // 验证邮箱的正则表达式
        const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
        if (regEmail.test(value)) {
          // 合法的邮箱
          return cb();
        }
        cb(new Error("请输入合法的邮箱"));
      };
      // 验证再次输入密码
       const validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (this.registerForm.checkPassWord !== '') {
            this.$refs.registerForm.validateField('checkPassWord');
          }
          callback();
        }
      };
       const validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.registerForm.passWord) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {
        addLoading : false,
        registerForm: {
          nickName:'',
          password: '',
          checkPassword: '',
          age: '',
          phone: '',
          realName: '',
          email: '',
          bornDate: '',
          gander: '',
          address: ''
        },
        rules: {
          id: [
             { required: true, message: '用户名不能为空', trigger: 'blur' },
             { min: 2, max: 15, message: '输入账号格式不正确', trigger: 'blur' }
          ],
         passWord: [
            { required: true, validator: validatePass, trigger: 'blur' },
            { min: 6, max: 20, message: '输入密码格式不正确', trigger: 'blur' }
          ],
          checkPassWord: [
            { required: true, validator: validatePass2, trigger: 'blur' }
          ],
          userName: [
            { required: true, message: '姓名不能为空', trigger: 'blur' },
            { min: 3, max: 4, message: '输入姓名格式不正确', trigger: 'blur' }
          ],
          age: [
            { message: '请选择年龄', trigger: 'change' }
          ],
          bornDate: [
            { type: 'date', message: '请选择日期', trigger: 'blur' }
          ],
          gander: [
            { required: true, message: '请选择性别', trigger: 'blur' }
          ],
          email: [
            { required: true, message: '邮箱不能为空', trigger: 'change' },
            { validator: checkEmail, message: "输入邮箱格式不正确", trigger: "blur"}
          ],
          number: [
            {required: true, message: '手机号码不能为空', trigger: 'blur' },
            { min: 11, max: 11, message: '输入手机格式不正确', trigger: 'blur' }
          ],
          address: [
            { required: true, message: '请填写详细地址', trigger: 'blur' }
          ]
        }
      };
    },
    methods: {
      submitForm(){
        this.$refs.registerForm.validate((valid) => {
          if (valid) {
            this.$confirm('确认提交？', '提示', {}).then(() => {
              this.addLoading = true;
              let addPara = new URLSearchParams();
              addPara.append("nickName", this.registerForm.nickName);
              addPara.append("realName", this.registerForm.realName);
              addPara.append("password", this.registerForm.password);
              addPara.append("age", this.registerForm.age);
              addPara.append("gander", this.registerForm.gander);
              addPara.append("bornDate", this.registerForm.bornDate);
              addPara.append("phone", this.registerForm.phone);
              addPara.append("address", this.registerForm.address);
              addPara.append("email", this.registerForm.email);
              this.createUser(addPara)
            })
          }
        })
      },
      createUser(payLoad) {
        axios.post('/user/create', payLoad).then( res => {
          console.log(res);
          if(res.data.code === 0){
            this.$message.success(res.data.msg);
            this.$router.push('/login')
          }else{
            this.$message.error(res.data.msg);
          }
        }).catch(err=> {
          console.log(err)
        })
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
  }
</script>

<style scoped>

</style>
