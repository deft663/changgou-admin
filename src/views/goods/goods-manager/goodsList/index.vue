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
            <el-input style="width: 203px" v-model="listQuery.name" placeholder="商品名称"></el-input>
          </el-form-item>
          <el-form-item label="商品货号：">
            <el-input style="width: 203px" v-model="listQuery.sn" placeholder="商品货号"></el-input>
          </el-form-item>
          <el-form-item label="商品分类：">
            <el-cascader
              style="width: 203px"
              clearable
              v-model="listQuery.categoryId"
              :options="options">
            </el-cascader>
          </el-form-item>
          <el-form-item label="商品品牌：">
            <el-autocomplete
              v-model="listQuery.brandName"
              :fetch-suggestions="queryBrandAsync"
              placeholder="请输入品牌"
              clearable style="width: 203px"
              @select="handleBrandSelect"
            ></el-autocomplete>
          </el-form-item>
          <el-form-item label="上架状态：">
            <el-select v-model="listQuery.isMarketable" placeholder="全部" clearable style="width: 203px">
              <el-option label="是" :value="1"></el-option>
              <el-option label="否" :value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="审核状态：">
            <el-select v-model="listQuery.status" placeholder="全部" clearable style="width: 203px">
              <el-option label="是" :value="1"></el-option>
              <el-option label="否" :value="0"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <el-form :inline="true" label-width="120px">
        <div style="float: right">
          <el-button type="primary" @click="fetchData(listQuery)" size="small">查询</el-button>
          <el-button type="info" @click="reset()" size="small">重置</el-button>
        </div>

      </el-form>
    </el-card>

    <div style="margin-top: 30px"></div>
    <!--列表-->
    <el-table style="width: 100%"
              :data="tableData"
              v-loading.body="tableLoading"
              element-loading-text="加载中"
              border fit highlight-current-row>
      <el-table-column align="center" label="编号" width="65">
        <template slot-scope="scope">
          {{scope.$index+(page - 1) * size + 1}}
        </template>
      </el-table-column>
      <el-table-column prop="name" align="center" label="商品图片">
        <template slot-scope="scope">
          <el-image lazy
            style="width: 100px; height: 100px"
            :src="scope.row.image"
            fit="contain"></el-image>
        </template>
      </el-table-column>
      <el-table-column prop="name" align="center" label="商品名称"></el-table-column>
      <el-table-column prop="sn" align="center" label="货号"></el-table-column>
      <el-table-column prop="isMarketable" align="center" label="标签">
        <template slot-scope="scope">
          上架：<el-switch
            active-value="1" inactive-value="0"
            v-model="scope.row.isMarketable"
            @change="marketAbleChange(scope.row.isMarketable,scope.row.id)">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="seq" align="center" label="SKU库存">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" circle @click="showSkuList(scope.row.id)"></el-button>
        </template>
      </el-table-column>
      <el-table-column prop="saleNum" align="center" label="销量"></el-table-column>
      <el-table-column prop="status" align="center" label="审核状态">
        <template slot-scope="scope">
          <span v-if="scope.row.status==1">已审核</span>
          <span v-else>未审核</span>
        </template>
      </el-table-column>


      <el-table-column align="center" label="操作"  width="160">
        <template slot-scope="scope">
          <p>
            <el-button size="mini" @click="handleShowProduct(scope.$index, scope.row)">查看</el-button>
            <el-button size="mini" @click="handleUpdateProduct(scope.$index, scope.row)">编辑</el-button>
          </p>
          <p>
            <el-button size="mini" @click="handleShowLog(scope.$index, scope.row)">日志</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </p>
        </template>
      </el-table-column>
    </el-table>
    <div style="margin-bottom: 30px;"></div>
    <!--分页-->
    <el-pagination
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page"
      :page-sizes="[10, 20, 30, 40, 50]"
      :page-size="size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <el-dialog title="编辑SKU信息" :visible.sync="dialogFormVisible"  width="50%" @close="dialogClose">
      <el-table
        :data="skuListDetail"
        max-height="300"
        border
        style="width: 100%">
        <el-table-column prop="sn" label="SKU编号" width="100" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.sn" disabled></el-input>
          </template>
        </el-table-column>
        <el-table-column :prop="header" v-for="header in skuListHeaderArr" :label="header"  width="110" align="center">
          <template slot="header" slot-scope="scope">
            {{header}}
          </template>
          <template slot-scope="scope">
            <div>{{scope.row[header]}}</div>
          </template>
        </el-table-column>


        <el-table-column width="100" align="center">
          <template slot="header" slot-scope="scope">
            <label style="color: red">* </label>销售价格
          </template>
          <template slot-scope="scope">
              <el-input v-model="scope.row.price"></el-input>
          </template>
        </el-table-column>

        <el-table-column width="100" align="center">
          <template slot="header" slot-scope="scope">
            <label style="color: red">* </label>商品库存
          </template>
          <template slot-scope="scope">
            <el-input v-model="scope.row.num"></el-input>
          </template>
        </el-table-column>
        <el-table-column width="130" align="center">
          <template slot="header" slot-scope="scope">
            <label style="color: red">* </label>库存预警值
          </template>
          <template slot-scope="scope">
            <el-input v-model="scope.row.alertNum"></el-input>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer" align="center">
        <el-button type="primary" @click="dialogClose">取消</el-button>
        <el-button type="primary" @click="doEditSkuList()">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

    // import optionApi from '@/api/option'
    import brandApi from "../../../../api/brand";
    //import request from '@/utils/request'
    import categoryApi from '@/api/category'
    import fileApi from '@/api/file'
    import spuApi from '@/api/spu'
    import skuApi from '@/api/sku'
    import templateApi from '@/api/template'
    import {parseTime, resetTemp} from '@/utils'

    const defaultListQuery = {
        isMarketable: null,
        sn: null,
        categoryId: null,
        brandName: null,
        name:'',
    };
    export default {

        name: 'goodsList',

        data() {

            return {
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
                total: 0,//总记录数
                rules: {
                    name: [{required: true, message: '必填', trigger: 'blur'}],
                    seq: [{required: true, message: '必填', trigger: 'blur'}]
                },
                skuListDetail:[],
                skuListHeaderArr:[],

            }

        },

        created() {
            this.fetchData()
            categoryApi.getCascadeCategory().then(res => {
                this.options = res.data
                // for (let e1 in this.options) {
                //     for (let e2 in this.options[e1].children) {
                //         for (let e3 in this.options[e1].children[e2].children) {
                //             this.options[e1].children[e2].children[e3]['disabled'] = true
                //         }
                //     }
                // }
            })

            templateApi.findList({}, 1, 20).then(res => {
                this.templateOptions = res.data.list
            })
        },
        computed: {
            uploadDisabled: function () {
                return this.imageList.length > 0
            },

        },
        methods: {
            marketAbleChange(val,id){
                spuApi.update({'isMarketable':val},id).then(res=>{
                    this.fetchData()
                })
            },
            queryBrandAsync(queryString, cb) {
                brandApi.findList({name:queryString},1,10).then(res=>{
                    let restaurants=res.data.list
                    restaurants.forEach(e=>{
                        e['value']=e.name
                    })
                    let results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants;
                    cb(results);

                });

            },
            createStateFilter(queryString) {
                return (state) => {
                    return (state.value.indexOf(queryString) != -1);
                };
            },
            handleBrandSelect(item) {
                console.log(item);
            },
            showSkuList(spuId){
                setTimeout(()=>{
                    skuApi.findAllBySpuId(spuId).then(res=>{
                        this.skuListDetail=res.data
                        this.skuListDetail.forEach((e,index)=>{
                            let specObj=JSON.parse(e.spec);
                            for(let i in specObj){
                                e[i]=specObj[i];
                                if(index==0)
                                    this.skuListHeaderArr.push(i);
                            }
                        })
                        this.dialogFormVisible = true;

                    })
                },200)

            },
            handleUpdateProduct(index,row){
                this.$router.push({path:'/goods/goods-manager/updateGoods',query:{id:row.id}});
            },

            dialogClose() {
                this.dialogFormVisible=false
                this.skuListDetail=[]
                this.skuListHeaderArr=[]
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


            handleDelete(index,row) {
                this.$confirm('此操作将永久删除该spu, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    spuApi.delete(row.id).then(res => {
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
            doEditSkuList() {
                this.skuListDetail.forEach(e=>{
                    skuApi.update(e,e.id)
                })
                this.$message.success("更新成功")
                this.dialogClose()
            },
            //分页
            handleSizeChange(val) {
                this.size = val;
                this.searchMap = {}
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
                    spuApi.findList(this.listQuery, this.page, this.size).then(res => {
                        this.tableData = res.data.list
                        this.total = res.data.total
                        this.tableLoading = false
                    }).catch((err) => {
                        this.tableLoading = false
                    })

                }, 200)
            },
            reset() {
                this.listQuery=Object.assign({}, defaultListQuery)
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

