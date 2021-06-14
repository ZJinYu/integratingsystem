<template>
  <el-container>
    <el-header>
      <div>
        <img src="@/assets/img/logo.jpg" class="logo-img">
        <span>联城百货超市</span>
      </div>
    </el-header>
    <el-main>
      <el-card style="width:100%">
        <el-page-header @back="goBackIndex" content="个人信息"/>
        <div class="shop-list" style="width:1000px;margin: 50px 200px ">
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>个人信息</el-breadcrumb-item>
          </el-breadcrumb>
          <el-tabs v-model="activeName">
            <el-tab-pane label="用户个人信息" name="first">
              <el-form label-width="100px">
                <el-form-item label="昵称">
                  <el-input v-model="userInfo.nickName"/>
                </el-form-item>
                <el-form-item label="真实姓名">
                  <el-input  v-model="userInfo.realName"/>
                </el-form-item>
                <el-form-item label="性别">
                  <el-radio-group v-model="userInfo.gender">
                    <el-radio :label="1">男</el-radio>
                    <el-radio :label="2">女</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="年龄">
                  <el-input  v-model="userInfo.age"/>
                </el-form-item>
                <el-form-item label="邮箱">
                  <el-input  v-model="userInfo.email"/>
                </el-form-item>
                <el-form-item label="电话">
                  <el-input  v-model="userInfo.phone" disabled/>
                </el-form-item>
                <el-form-item label="余额">
                  <span style="margin:0 10px">{{userInfo.balance}}元</span>
                  <el-button type="success" size="mini" @click="openAddBalance">充值</el-button>
                </el-form-item>
                <el-form-item label="地址">
                  <el-input  v-model="userInfo.address" type="textarea"/>
                </el-form-item>
              </el-form>
              <el-button style="margin-left: 100px" type="primary" @click="modifyPwd">修改密码</el-button>
              <el-button style="margin-left: 100px" type="primary" @click="submitModify(userInfo)">提交信息修改</el-button>
            </el-tab-pane>
            <el-tab-pane label="用户会员卡信息" name="second">
              <div v-if="!haveCard">
                <span>您暂未办理会员卡，如有需要请联系管理员开通会员卡</span>
              </div>
              <div v-else>
                <el-form label-width="100px">
                  <el-form-item label="会员卡号">
                    <span style="margin:0 10px">{{cardInfo.id}}</span>
                  </el-form-item>
                  <el-form-item label="持卡人">
                    <span style="margin:0 10px">{{cardInfo.username}}  先生/女士</span>
                  </el-form-item>
                  <el-form-item label="会员卡状态">
                    <span style="margin:0 10px">{{cardStatus}}</span>
                  </el-form-item>
                  <el-form-item label="卡内积分">
                    <span style="margin:0 10px">{{cardInfo.score}}</span>
                  </el-form-item>
                  <el-button type="warning" size="mini" @click="loseCard" style="margin-left: 30px">挂失</el-button>
                </el-form>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-card>
    </el-main>
    <el-dialog
        title="提示"
        :visible.sync="recharge"
        width="30%">
      <span></span>
      <el-form status-icon :rules="rules" label-width="100px">
        <el-form-item label="充值金额" prop="blance" style="width: 60%" >
          <el-select v-model="balance" placeholder="选择充值金额">
            <el-option
                v-for="item in balanceList"
                :key="item"
                :label="item"
                :value="item">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="recharge = false">取 消</el-button>
        <el-button type="primary" @click="submitAddBalance(balance)">提交</el-button>
      </span>
    </el-dialog>
    <el-dialog
        title="修改密码"
        :visible.sync="dialogVisible"
        width="30%">
      <el-form :model="pwdForm" status-icon :rules="rules" ref="PwdForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="旧密码" prop="oldPassword" style="width: 60%" >
          <el-input v-model="pwdForm.oldPassword" type="password" clearable></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword" style="width: 60%">
          <el-input v-model="pwdForm.newPassword" type="password" clearable></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPassword" style="width: 60%" >
          <el-input v-model="pwdForm.checkPassword" type="password" clearable></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="submitPwd(pwdForm)">确 定</el-button>
  </span>
    </el-dialog>
  </el-container>
</template>

<script>
import axios from "axios";
export default {
  data() {
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        if (this.pwdForm.checkPassword !== '') {
          this.$refs.pwdForm.validateField('checkPassword');
        }
        callback();
      }
    };
    const validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.pwdForm.newPassword) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      activeName: 'first',
      recharge: false,
      dialogVisible: false,
      haveCard:false,
      userInfo:{},
      cardInfo:{
        id:'',
        username:'',
        score:''
      },
      cardStatus:'',
      balance:'',
      balanceList:[20,50,100,200,500,1000],
      pwdForm:{
        oldPassword:'',
        newPassword:'',
        checkPassword:''
      },
      rules: {
        oldPassword: [
          { required: true, message: '密码不能为空', trigger: 'blur' }
        ],
        newPassword: [
          { required: true, validator: validatePass, trigger: 'blur' },
          { min: 5, max: 20, message: '输入密码格式不正确', trigger: 'blur' }
        ],
        checkPassword: [
          { required: true, validator: validatePass2, trigger: 'blur' }
        ],
      }
    };
  },
  mounted() {
    this.getUserInfo()
    this.getCardInfo()
  },
  methods: {
    getUserInfo(){
      axios({
        method: 'post',
        url: 'user/information',
      }).then(res => {
        this.userInfo = res.data.data
      })
    },
    getCardInfo(){
      axios({
        method: 'post',
        url: 'card/cardIndividual',
      }).then(res => {
        if(res.data.data !== null){
          this.haveCard = true
          this.cardInfo = res.data.data
          if(this.cardInfo.status === 1)
            this.cardStatus = '正常'
          if(this.cardInfo.status === 0)
            this.cardStatus = '停用'
          if(this.cardInfo.status === 2)
            this.cardStatus = '挂失'
        }
      })
    },
    modifyUserInfo(val){
      axios({
        method: 'put',
        url: 'user/modify',
        data:val
      }).then(res => {
        if(res.data.code === 0){
          this.$message.success(res.data.msg)
          this.getUserInfo()
        }else{
          this.$message.error(res.data.msg)
        }
      }).catch(err => {
        this.$message.error(err.msg)
      })
    },
    modifyPassword(val){
      axios({
        method: 'put',
        url: 'user/modify',
        data:val
      }).then(res => {
        if(res.data.code === 0){
          this.$message.success(res.data.msg)
          localStorage.clear()
          this.$router.push('/login')
        }else{
          this.$message.error(res.data.msg)
        }
      }).catch(err => {
        this.$message.error(err.msg)
      })
    },
    addBalance(val){
      console.log(typeof val);
      const data = {balance:val}
      axios({
        method: 'post',
        url: 'user/balanceAdd',
        data:data
      }).then(res => {
        if(res.data.code === 0){
          this.$message.success(res.data.msg)
          this.getUserInfo()
        }else{
          this.$message.error(res.data.msg)
        }
      }).catch(err => {
        this.$message.error(err.msg)
      })
    },
    loseCard(){
      axios({
        method: 'post',
        url: 'card/lose',
      }).then(res => {
        if(res.data.code === 0){
          this.$message.success(res.data.msg)
          this.getCardInfo()
        }else{
          this.$message.error(res.data.msg)
        }
      }).catch(err => {
        this.$message.error(err.msg)
      })
    },
    openAddBalance(){
      this.recharge = true
    },
    submitAddBalance(val){
      this.addBalance(val)
      this.recharge = false
    },
    modifyPwd(){
      this.dialogVisible = true
    },
    submitModify(val){
      this.$confirm('确认提交修改？', '提示', {}).then(() => {
        this.modifyUserInfo(val)
      })
    },
    submitPwd(val){
      this.$confirm('确认提交修改？', '提示', {}).then(() => {
        this.modifyPassword(val)
      })
    },
    goBackIndex(){
      this.$router.push({path:'index'})
    }
  }
};
</script>

<style scoped>
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
.el-input{
  width: 300px;
}
</style>
