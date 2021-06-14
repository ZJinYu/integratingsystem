<template>
  <el-container>
    <el-header>
      <div>
        <img src="@/assets/img/logo.jpg" class="logo-img">
        <span>联城百货超市</span>
      </div>
      <div style="padding-left: 50%">
        <Menu
        :isShow="isShow"/>
      </div>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <h4>订单状态</h4>
        <el-menu
          default-active="all"
          class="el-menu-vertical-demo"
          @select="filterType">
            <el-menu-item index="all">全部</el-menu-item>
            <el-menu-item index="1">未发货</el-menu-item>
            <el-menu-item index="2">已发货</el-menu-item>
            <el-menu-item index="3">已收货</el-menu-item>
        </el-menu>
      </el-aside>
      <el-container>
        <el-main>
          <el-table
              :data="newOrderData"
              style="width: 100%">
            <el-table-column
                label="订单 ID"
                prop="id">
            </el-table-column>
            <el-table-column
                label="创建时间"
                prop="createTime">
            </el-table-column>
            <el-table-column
                label="总金额"
                prop="totalPrice">
            </el-table-column>
            <el-table-column
                label="订单状态"
                prop="status"
                :formatter="orderStatus">
            </el-table-column>
            <el-table-column
                label="支付方式"
                prop="type"
                :formatter="payType">
            </el-table-column>
            <el-table-column prop="operation" label="操作" width="260px">
              <template slot-scope="scope">
                <el-button @click="detail(scope.row)" type="text">详情</el-button>
                <el-button type="primary" size="mini" @click="handleReceiving(scope.row)">已收货</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-main>
      </el-container>
    </el-container>
    <el-dialog
        title="订单详情"
        :visible.sync="dialogVisible"
        width="80%">
      <el-table :data="orderGoodsList">
        <el-table-column
            label="商品图片"
            prop="image_url">
          <template slot-scope="scope">
            <el-image :src="scope.row.image_url" style="width: 20%;height: 20%"/>
          </template>
        </el-table-column>
        <el-table-column
            label="商品名"
            prop="goodName">
        </el-table-column>
        <el-table-column
            label="数量"
            prop="count">
        </el-table-column>
        <el-table-column
            label="单价"
            prop="price">
        </el-table-column>
      </el-table>
    </el-dialog>
  </el-container>
</template>

<script>
import Menu from '@/components/menu'
import axios from "axios";
export default {
  components: {
    Menu
  },
  data() {
    return {
      isShow: true,
      dialogVisible: false,
      orderData: [],
      orderGoodsList: [],
      newOrderData:[]
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init(){
      const token = localStorage.getItem('token')
      this.getOrderData()
      if(token !== null){
        this.isShow = false
      }else{
        this.$router.push('/index')
      }
    },
    orderStatus(row){
      if (row.status == 1) {
        return '未发货';
      } else if(row.status == 2){
        return '已发货';
      } else if(row.status ==3){
        return '已收货';
      }
    },
    payType(row){
      if (row.type === 0) {
        return '金额支付';
      } else if(row.type === 1){
        return '积分兑换';
      }
    },
    getOrderData(){
      axios({
        method: 'post',
        url: '/order/orderIndividual',
      }).then(res => {
        console.log(res);
        this.orderData = res.data.data
        this.newOrderData = res.data.data
      })
    },
    handleReceiving(val){
      const payLoad = val
      axios({
        method: 'post',
        url:'/order/receiving',
        data:payLoad
      }).then( res=> {
        if(res.data.code ===0){
          this.$message.success(res.data.msg)
          this.getOrderData()
        }else{
          this.$message.error(res.data.msg)
        }
      })
    },
    filterType(val){
      if (val === 'all') {
        this.newOrderData = this.orderData
      } else {
        const value = Number(val)
        const newData = this.orderData.filter(data => {
          return data.status === value
        })
        this.newOrderData = newData
      }

    },
    detail(val){
      this.dialogVisible = true
      this.orderGoodsList = val.children
    }
  }
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
.demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
</style>
