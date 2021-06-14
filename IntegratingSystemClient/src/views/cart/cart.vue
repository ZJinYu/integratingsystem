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
        <el-page-header @back="goBackIndex" content="购物车"/>
        <div class="shop-list" style="width:1000px;margin-left: 400px">
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>购物车</el-breadcrumb-item>
          </el-breadcrumb>
          <el-table
            :data="cartList"
            @selection-change="handleSelectionChange"
            :row-key="getRowKeys"
            style="width: 100%" border stripe>
          <el-table-column
              type="selection"
              :reserve-selection="true"
              width="55">
          </el-table-column>
          <el-table-column type="index" label="#"/>
          <el-table-column type="image_url" label="商品图像" width="200%">
            <template slot-scope="scope">
              <el-image :src="scope.row.image_url" style="width: 40%;height: 40%"/>
            </template>
          </el-table-column>
          <el-table-column prop="goodName" label="商品名称"/>
          <el-table-column prop="count" label="数量" width="100%">
          </el-table-column>
          <el-table-column prop="price" label="单价" width="100%"/>
          <el-table-column prop="operation" label="操作" width="260px">
            <template slot-scope="scope">
              <el-button @click="reduceCount(scope.row)">-</el-button>
              <el-button @click="addCount(scope.row)">+</el-button>
              <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="handleDelete(scope.row)"/>
            </template>
          </el-table-column>
        </el-table>
          <div style="margin-top:20px">
            <span>总价：￥{{totalPrice}}</span>
            <span style="margin-left: 700px">所需积分：{{totalPrice*ruleInfo.changeRule}}</span>
          </div>
          <el-button type="primary" plain style="float: right;margin-top:20px;margin-bottom: 100px" @click="submitOrder">提交购物车</el-button>
        </div>
      </el-card>
    </el-main>
    <el-dialog
        title="请选择支付方式"
        :visible.sync="dialogVisible"
        width="30%">
      <el-radio v-model="payType" label="0">金额支付</el-radio>
      <el-radio v-model="payType" label="1">积分兑换</el-radio>
      <div style="margin-top: 50px">
      <span>当前余额：￥{{nowBalance}}</span>
      <span style="margin-left: 230px">现有积分：{{nowScore}}</span>
      </div>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="handleSubmitOrder">确 定</el-button>
  </span>
    </el-dialog>
  </el-container>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      dialogVisible:false,
      cartList: [],
      selectGoods:[],
      ruleInfo:[],
      totalPrice:'0',
      payType:'0',
      nowScore:'',
      nowBalance:''
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.getCartList()
      this.getScore()
      this.getBalance()
      this.getRuleInfo()
    },
    getScore(){
      axios({
        method: 'post',
        url: '/card/cardIndividual',
      }).then(res => {
        this.nowScore = res.data.data.score
        console.log(this.nowScore);
      })
    },
    getBalance(){
      axios({
        method: 'post',
        url: '/user/information',
      }).then(res =>{
        this.nowBalance = res.data.data.balance
        console.log(this.nowBalance);
      })
    },
    getCartList() {
      axios({
        method: 'post',
        url: '/cart/cartIndividual',
      }).then(res => {
        this.cartList = res.data.data
      })
    },
    getRuleInfo(){
      axios({
        method: 'get',
        url: '/rule/ruleInfo',
      }).then(res => {
        this.ruleInfo = res.data.data[0]
      })
    },
    MonetaryBalance(){
      const params={totalPrice:this.totalPrice}
      axios({
        method: 'post',
        url: 'user/monetary',
        data: params
      }).then( res=> {
        if(res.data.code === 0){
          this.scoreAdd()
          this.totalPrice = 0
          this.totalScore = 0
          this.selectGoods.forEach(data => {
            this.deleteCart(data)
          })
        }else{
          this.$message.error(res.data.msg)
        }
      })
    },
    createOrder(){
      const params={totalPrice:this.totalPrice,children:this.selectGoods,type:this.payType}
      if(params.children[0]) {
        if (this.payType == 0) {
          if(this.totalPrice>this.nowBalance)
            return this.$message.error('余额不足请充值')
        } else {
          if(this.nowScore<this.totalPrice*this.ruleInfo.changeRule)
            return this.$message.error('积分不足无法完成支付')
        }
        axios({
          method: 'post',
          url: '/order/create',
          data: params
        }).then(res => {
          if (res.data.code === 0) {
            this.$message.success(res.data.msg)
            if (this.payType == 0) {
              this.MonetaryBalance()
            } else {
              this.socrePay()
            }
            this.getCartList()
          } else {
            this.$message.error(res.data.msg)
          }
        })
      }else{
        this.$message.error('请选择结算商品')
      }
    },
    scoreAdd(){
      const params = {score:this.totalPrice*this.ruleInfo.getRule}
      axios({
        method: 'post',
        url: '/card/scoreAdd',
        data: params
      }).then(res =>{
        this.$message.success(res.data.msg)
        this.totalPrice = 0
        this.totalScore = 0
      })
    },
    socrePay(){
      const params={totalScore:this.totalPrice*this.ruleInfo.changeRule}
      axios({
        method: 'post',
        url: '/card/pay',
        data: params
      }).then(res =>{
        if(res.data.code === 0){
          this.$message.success(res.data.msg)
          this.totalPrice = 0
          this.totalScore = 0
          this.selectGoods.forEach(data => {
            this.deleteCart(data)
          })
        }else{
          this.$message.error(res.data.msg)
        }
      })
    },
    deleteCart(params) {
      axios({
        method: 'delete',
        url: '/cart/deleteCart',
        data:params
      }).then(res => {
        console.log(res);
        this.getCartList()
      })
    },
    handleSelectionChange(val) {//表格数据选择
      this.selectGoods = val
      console.log(val);
      const temp = this.selectGoods.map(data =>{
        return data.price*data.count
      })
      let sum = 0
      temp.forEach(item => {
        sum += item;
        return sum
      })
      this.totalPrice = sum
    },
    getRowKeys(row) {//唯一值，一般都未id
      return row.id;
    },
    // 提交订单
    handleSubmitOrder(){
      this.createOrder()
      this.dialogVisible = false
    },
    submitOrder(){
      this.dialogVisible = true
    },
    handleDelete(val){
      this.deleteCart(val)
    },
    //添加购物车商品数量
    addCount(val){
      let count = val.count
      count++
      const id = val.id
      const params ={count,id}
      axios({
        method: 'put',
        url: '/cart/modifyCart',
        data: params
      }).then(data=> {
        this.getCartList()
        this.totalPrice = Number(this.totalPrice)
        if(this.totalPrice !== 0)
        this.totalPrice = this.totalPrice + val.price
      }).catch(err=>{

      })
    },
    //减少购物车商品数量
    reduceCount(val){
      let count = val.count
      count--
      const id = val.id
      console.log(id);
      if(count === 0){
        this.deleteCart(val)
      }else {
        const params = {count, id}
        axios({
          method: 'put',
          url: '/cart/modifyCart',
          data: params
        }).then(data => {
          this.getCartList()
          this.totalPrice = Number(this.totalPrice)
          if(this.totalPrice !== 0)
          this.totalPrice = this.totalPrice - val.price
        }).catch(err => {

        })
      }
    },
    goBackIndex(){
      this.$router.push({path:'index'})
    }
  }
}
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
</style>
