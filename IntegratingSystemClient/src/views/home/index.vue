<template>
  <el-container>
    <el-header>
      <div>
        <img src="@/assets/img/logo.jpg" class="logo-img" />
        <span>联城百货超市</span>
      </div>
      <div style="padding-left: 50%">
        <Menu :isShow="isShow" @showCart="showCart" />
      </div>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <h4 style="margin-left: 15px">商品类别</h4>
        <el-menu
          default-active="2"
          class="el-menu-vertical-demo"
          @select="selectType"
          @open="openType"
        >
          <el-menu-item index="all">
            <i class="el-icon-menu"></i>
            <span slot="title">全部</span>
          </el-menu-item>
          <el-submenu
            :index="item.name"
            v-for="item in classList"
            :key="item.name"
            style=""
          >
            <template slot="title">
              <i class="el-icon-menu"></i>
              <span>{{ item.name }}</span>
            </template>
            <el-menu-item-group>
              <el-menu-item
                :index="item1.name"
                v-for="item1 in item.children"
                >{{ item1.name }}</el-menu-item
              >
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-container>
        <el-main style="padding-left: 200px">
          <div style="margin: 0 0 50px 20%">
            <el-input
              placeholder="请输入内容"
              v-model="searchInfo"
              class="input-with-select"
              style="width: 50%"
            >
              <el-button
                slot="append"
                icon="el-icon-search"
                @click="searchSubmit"
              ></el-button>
            </el-input>
          </div>
          <el-carousel
            indicator-position="outside"
            style="width: 1152px; margin-left: 60px"
          >
            <el-carousel-item v-for="item in bannerList">
              <img :src="item.image_url" />
            </el-carousel-item>
          </el-carousel>
          <div style="width: 1300px">
            <ul style="display: flex; flex-wrap: wrap">
              <li
                style="display: inline; margin: 20px"
                v-for="item in goodsNewList"
                :key="item.id"
                @click="goodDetail(item.id, item.image_url)"
              >
                <el-image
                  :src="item.image_url"
                  style="width: 240px; height: 240px"
                />
                <div style="padding: 14px; width: 240px">
                  <span>{{ item.goodName }}</span>
                  <div class="bottom clearfix" style="padding-top: 20px">
                    <span style="font-size: 25px; color: red"
                      >￥{{ item.price }}</span
                    >
                    <span
                      style="float: right; margin-top: 10px; font-size: 10px"
                      >供应商：{{ item.supplier }}</span
                    >
                    <h2 style="border-top: 1px solid #c0c4cc" />
                    <span style="float: left; font-size: 10px"
                      >质量：{{ item.weight }}kg</span
                    >
                    <span style="float: right; font-size: 10px"
                      >库存：{{ item.quantity }}</span
                    >
                    <!--                    <el-button type="text" style="float: left;margin-top: -10px" @click=addCart(item)>加入购物车</el-button>-->
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <el-button
            style="
              position: fixed;
              left: 1700px;
              top: 850px;
              width: 80px;
              height: 80px;
            "
            type="primary"
            icon="el-icon-shopping-cart-2"
            circle
            @click="showCart"
          ></el-button>
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
  data () {
    return {
      isShow: true,
      drawer: false,
      searchInfo: '',
      classList: {},
      goodsList: [],
      goodsNewList: [],
      cartList: [],
      bannerList: []
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      const token = localStorage.getItem('token')
      if (token !== null) {
        this.isShow = false
      }
      this.getGoodsClassList()
      this.getGoodsList()
      this.getBannerList()
    },
    getGoodsClassList () {
      axios.get('/category/List').then(res => {
        this.classList = this.listToTree(res.data.data)
        console.log(this.classList);
      }).catch(error => {
        console.log(error);
      });
    },
    getGoodsList () {
      axios.get('/goods/list').then(res => {
        this.goodsList = res.data.data.filter(data => {
          if (data.status === true)
            return data
        })
        this.goodsNewList = this.goodsList
      }).catch(error => {
        this.$message.error(error.msg)
      });
    },
    getBannerList () {
      axios.get('/banner/bannerList').then(res => {
        this.bannerList = res.data.data
      }).catch(error => {
        this.$message.error(error.msg)
      });
    },
    showCart () {
      this.$router.push({ path: 'cart' })
    },
    addCartList () {
      axios({
        method: 'post',
        url: '/cart/create',
        data: this.cartList
      }).then(res => {
        this.$message.success(res.data.msg)
      })
    },
    addCart (val) {
      this.cartList = val
      this.addCartList()
    },
    searchSubmit () {
      this.searchGood(this.searchInfo)
    },
    selectType (val) {
      if (val === 'all') {
        this.goodsNewList = this.goodsList
      } else {
        this.goodsNewList = this.goodsList.filter(data => {
          if (data.type === val)
            return data
        })
      }
    },
    openType (val) {
      this.goodsNewList = this.goodsList.filter(data => {
        if (data.class === val)
          return data
      })
    },
    searchGood (payLoad) {
      const data = { goodName: payLoad }
      axios({
        method: 'post',
        url: 'goods/search',
        data: data
      }).then(res => {
        if (res.data.code === 0) {
          this.$message.success(res.data.msg)
          this.goodsList = res.data.data
        } else {
          this.$message.error(res.data.msg)
          this.goodsList = res.data.data
        }
      }).catch(err => {
        this.$message.success(err.msg)
      })
    },
    listToTree (data) {
      let res = {};
      for (let i = 0; i < data.length; i++) {
        let row = data[i];
        // 此行代码用以统一根节点的paren_id, 跟节点的parent_id 可以为 0 或 null
        row.parentId = row.parentId ? row.parentId : 0
        if (res[row.id]) {
          Object.assign(res[row.id], { id: row.id, name: row.name });
        } else {
          res[row.id] = { id: row.id, name: row.name, children: [] };
        }
        if (res[row.parentId]) {
          res[row.parentId].children.push(res[row.id]);
        } else {
          res[row.parentId] = { children: [res[row.id]] };
        }
      }
      return res[1].children
    },
    goodDetail (val, url) {
      this.$router.push({
        path: '/detail',
        query: {
          id: val,
          image_url: url
        }
      });
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

.el-aside {
  background-color: #fff;
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
.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}
.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>
