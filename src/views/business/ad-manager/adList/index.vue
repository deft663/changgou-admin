<template>
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" size="small" label-width="140px">
          <el-form-item label="输入搜索：">
            <el-input style="width: 203px" v-model="listQuery.name" placeholder="广告名称"></el-input>
          </el-form-item>

          <el-form-item label="广告位置:">
            <el-select v-model="listQuery.position" placeholder="请选择" style="width: 203px" clearable>
              <el-option v-for="item in positionList" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>

          </el-form-item>

        </el-form>
      </div>
      <el-form :inline="true" label-width="120px">
        <div style="float: right">
          <el-button type="primary" @click="fetchData(listQuery)" size="small">查询</el-button>
           <el-button type="info" @click="add()" size="small">添加</el-button>
          <el-button type="info" @click="reset()" size="small">重置</el-button>
        </div>

      </el-form>
    </el-card>

    <div style="margin-top: 30px"></div>
    <!--列表-->
    <el-table style="width: 100%" :data="tableData" v-loading.body="tableLoading" element-loading-text="加载中" border fit
      highlight-current-row>
      <el-table-column align="center" label="编号" width="65">
        <template slot-scope="scope">
          {{scope.$index+(page - 1) * size + 1}}
        </template>
      </el-table-column>
      <el-table-column prop="name" align="center" label="广告名称"></el-table-column>
      <el-table-column prop="position" align="center" label="广告位置" :formatter="formatPosition"></el-table-column>
      <el-table-column prop="image" align="center" label="广告图片">
        <template slot-scope="scope">
          <el-image lazy style="width: 100px; height: 100px"
            :src="scope.row.image"
            fit="contain"></el-image>
        </template>
      </el-table-column>

      <el-table-column prop="sn" align="center" label="时间" min-width="180">
        <template slot-scope="scope">
          <p>开始时间：{{parseTime(scope.row.startTime)}}</p>
          <p>到期时间：{{parseTime(scope.row.endTime)}}</p>
        </template>
      </el-table-column>
      <el-table-column prop="status" align="center" label="上线/下线">
        <template slot-scope="scope">
          <el-switch active-value="1" inactive-value="0" v-model="scope.row.status"
            @change="marketAbleChange(scope.row.status,scope.row.id)">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="seq" align="center" label="点击次数">1000</el-table-column>
      <el-table-column prop="seq" align="center" label="生成订单">20</el-table-column>
      <el-table-column align="center" label="操作" width="160">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleUpdatAd(scope.$index, scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="margin-bottom: 30px;"></div>
    <!--分页-->
    <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page"
      :page-sizes="[10, 20, 30, 40, 50]" :page-size="size" layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </div>
</template>

<script>
  import adApi from "../../../../api/ad";
  import {
    parseTime,
    resetTemp
  } from '@/utils'

  const defaultListQuery = {
    name: null,
    position: null,
  };
  export default {

    name: 'adList',

    data() {

      return {
        positionList: [{
            'label': '首页轮播',
            'value': 'web_index_lb'
          },
          {
            'label': '有趣区',
            'value': 'web_index_amusing'
          },
          {
            'label': '家用电器楼层轮播图',
            'value': 'web_index_ea_lb'
          },
          {
            'label': '家用电器楼层广告',
            'value': 'web_index_ea'
          },
          {
            'label': '手机通讯楼层轮播图',
            'value': 'web_index_mobile_lb'
          },
        ],
        listQuery: Object.assign({}, defaultListQuery),
        templateOptions: [],
        options: [],
        category: {
          id: '',
          name: '',
          isShow: '',
          isMenu: '',
          parentId: '',
          templateId: ''
        },
        dialogFormVisible: false,
        parseTime: parseTime,
        tableLoading: false,
        tableData: [],
        page: 1,
        size: 10,
        total: 0, //总记录数
        rules: {
          name: [{
            required: true,
            message: '必填',
            trigger: 'blur'
          }],
          seq: [{
            required: true,
            message: '必填',
            trigger: 'blur'
          }]
        },
        skuListDetail: [],
        skuListHeaderArr: [],

      }

    },

    created() {
      this.fetchData()
    },
    computed: {},
    methods: {
      add(){
        this.$router.push({path: '/business/business-manager/addAd'});
      },
      formatPosition(row, column, cellValue, index){
        let val=cellValue
        this.positionList.forEach(e=>{
            if(e.value===cellValue)
            val= e.label
        })
        return val
      },

      dialogClose() {
        this.dialogFormVisible = false
        this.skuListDetail = []
        this.skuListHeaderArr = []
      },
      edit(id) {
        if (id) {
          this.searchMap.id = id
          categoryApi.findList(this.searchMap, 1, 1).then(res => {
            let brand = res.data.list[0]
            this.category.parentId = [parseInt(brand.id)]
            if (brand.secondLevelId) this.category.parentId.unshift(parseInt(brand.secondLevelId))
            if (brand.thirdLevelId) this.category.parentId.unshift(parseInt(brand.thirdLevelId))

          })

          this.dialogFormVisible = true

        } else {
          this.dialogFormVisible = true

        }
      },


      handleDelete(index, row) {
        this.$confirm('此操作将永久删除该Ad, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          adApi.delete(row.id).then(res => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.fetchData()
          })

        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },

      //分页
      handleSizeChange(val) {
        this.size = val;
        this.fetchData();
      },
      handleCurrentChange(val) {
        this.page = val;
        this.fetchData();
      },

      //查询
      fetchData() {
        this.tableLoading = true
        setTimeout(() => {
          adApi.findList(this.listQuery, this.page, this.size).then(res => {
            this.tableData = res.data.list
            this.total = res.data.total
            this.tableLoading = false
          }).catch((err) => {
            this.tableLoading = false
          })

        }, 200)
      },
      reset() {
        this.listQuery = Object.assign({}, defaultListQuery)
        this.fetchData()
      }

    }
  }

</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .role-checkbox {
    margin-left: 0px;
    margin-right: 15px;
  }

  .app-container form div {
    height: 50px
  }

</style>
