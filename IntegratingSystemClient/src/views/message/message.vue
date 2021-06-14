<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item >商品管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/goods1' }">商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-table :data="messageInfo" style="width: 100%" border stripe>
        <el-table-column 
        type="index"
        label="#">
        </el-table-column>
        <el-table-column 
        prop="userName"
        label="用户名" width="200%">
        </el-table-column>
        <el-table-column
        prop="message"
        label="留言消息">
        </el-table-column>
        <el-table-column
        prop="createdAt"
        label="留言时间" width="200%">
        </el-table-column>
        <el-table-column
        prop="operation"
        label="操作"
        width="140%">
          <template slot-scope="scope">
            <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
            <el-button type="primary" size="mini">回复</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-size="queryInfo.pagesize"
      layout="prev, pager, next, jumper"
      :total="1">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
  import axios from "axios";

  export default{
    data(){
      return{
        queryInfo:{
            query: '',
            pagenum: 1,
            pagesize: 2
          },
        messageInfo:[],
      }
    },
    created() {

    },
    mounted() {
      this.getMessageInfo()
    },
    methods: {
      getMessageInfo(){
        axios.get('/message').then( response => {
          this.messageInfo = response.data.res;
          console.log(this.messageInfo);
        }).catch( error => {
          console.log(error);
        });
      },
      // 监听pagesize改变的事件
      handleSizeChange(newSize) {
        this.queryInfo.pagesize = newSize
        this.getUserList()
      },
      handleCurrentChange(newPage) {
        this.queryInfo.pagenum = newPage
        this.getUserList()
      }
    }
  }
</script>

<style scoped>

</style>