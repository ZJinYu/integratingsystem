<template>
  <el-container>
    <el-header>
      <div>
        <img src="@/assets/img/logo.jpg" class="logo-img">
        <span>联城百货超市</span>
      </div>
      <div style="padding-left: 50%">
        <Menu
            :isShow=isShow
        />
      </div>
    </el-header>
    <el-container>
      <el-container>
        <el-main>
          <el-card style="width:100%">
            <el-page-header @back="goBackIndex" content="商品详情"/>
            <div class="shop-list" style="width:1000px;margin-left: 400px">
              <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item>商品详情</el-breadcrumb-item>
              </el-breadcrumb>
              <div v-loading="loading" :data="goodInfo">
                <el-row>
                  <el-col :span="15">
                    <el-image :src="$route.query.image_url" style="height: 500px;width: 500px"/>
                  </el-col>
                  <el-col :span="8">
                    <div>
                      <div style="margin-bottom: 20px">
                        <h3>{{ goodInfo.goodName }}</h3>
                        <span style="color: red">{{ goodInfo.smallTitle }}</span>
                      </div>
                      <div style="margin-bottom: 20px">
                        <span style="font-size: 15px">价格</span><span style="margin-left:30px;color: red">￥</span><span
                          style="color: red;font-size: 25px">{{ goodInfo.price }}</span>
                      </div>
                      <div style="margin-bottom: 20px">
                        <span>重量</span><span style="margin-left:30px">1kg</span>
                      </div>
                      <div style="margin-bottom: 20px">
                        <span>供应商</span><span style="margin-left:20px">{{ goodInfo.supplier }}</span>
                      </div>
                      <div>
                        <span>数量</span>
                        <el-button @click="reduceCount" size="mini" style="margin-left:30px;height: 38px">-</el-button>
                        <el-input v-model="count" style="width:50px;"/>
                        <el-button @click="addCount" style="height: 38px" size="mini ">+</el-button>
                        <span style="margin:20px 20px">库存{{ goodInfo.quantity }}件</span>
                      </div>
                      <el-button style="background-color: red;color: #eeeeee;margin: 30px 60px" @click="addCart(goodInfo)">加入购物车</el-button>
                      <div>
                        <span>配送范围：{{goodInfo.delivery}}</span>
                      </div>
                    </div>
                  </el-col>
                </el-row>
                <div>
                  <el-tabs v-model="activeName" type="card">
                    <el-tab-pane label="商品详情" name="first">{{ goodInfo.detail }}</el-tab-pane>
                  </el-tabs>
                </div>
              </div>
            </div>
          </el-card>
        </el-main>
      </el-container>
    </el-container>
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
      count: 1,
      goodInfo: '',
      activeName:'first',
      loading:true
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      const token = localStorage.getItem('token')
      if (token !== null) {
        this.isShow = false
      }
      this.getGoodInfoById()
    },
    getGoodInfoById() {
      const params = {id: Number(this.$route.query.id)}
      axios({
        method: 'post',
        url: '/goods/goodDetail',
        data: params
      }).then(res => {
        this.goodInfo = res.data.data
        this.loading = false
      }).catch(err => {
        console.log(err);
      })
    },
    addCartList(){
      axios({
        method: 'post',
        url:'/cart/create',
        data:this.cartList
      }).then( res =>{
        this.$message.success(res.data.msg)
      })
    },
    reduceCount() {
      if (this.count === 0) {
        return
      } else {
        this.count--
      }
    },
    addCount() {
      this.count++
    },
    addCart(val){
      this.cartList = val
      this.cartList.count = this.count
      console.log(this.cartList)
      this.addCartList()
    },
    goBackIndex() {
      this.$router.push({path: 'index'})
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

.el-header > div {
  display: flex;
  align-items: center;
}

.el-header > div span {
  margin-left: 15px;
}

.logo-img {
  margin-left: 10px;
  height: 45px;
  width: 180px;
}

.el-menu {
  border-right: none;
}

.el-main {
  background-color: #eeeeee;
}

.el-carousel__item h3 {
  color: #475669;
  font-size: 18px;
  opacity: 0.75;
  line-height: 300px;
  margin: 0;
}

.input_warp {
  height: 10px !important;
}

</style>
