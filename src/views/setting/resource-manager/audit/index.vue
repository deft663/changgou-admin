<template>
  <div class="app-container">
    <el-form :inline="true"  label-width="120px">
      <div>
        <el-form-item label="名称：">
            <el-input placeholder="请输入名称" v-model="searchMap.name"/>
        </el-form-item>
      </div>
      <div style="float: right">
        <el-button type="primary" @click="fetchData(searchMap)">查询</el-button>
        <el-button type="primary" @click="edit()">添加</el-button>
        <el-button type="info" @click="reset()">重置</el-button>
      </div>

    </el-form>
    <div style="margin-bottom: 30px;"></div>
    <!--列表-->
    <el-table style="width: 100%"
              :data="tableData"
              v-loading.body="tableLoading"
              element-loading-text="加载中"
              border fit highlight-current-row>
      <el-table-column align="center" label="序号" width="65">
        <template slot-scope="scope">
          {{scope.$index+(page - 1) * size + 1}}
        </template>
      </el-table-column>
      <el-table-column prop="name" align="center" label="分类名称"></el-table-column>
      <el-table-column prop="goodsNum" align="center" label="商品数量">
        <template slot-scope="scope">
          <a href="#" style="color: #20a0ff">{{scope.row.goodsNum}}</a>
        </template>
      </el-table-column>
      <el-table-column prop="isMenu" align="center" label="导航栏">
        <template slot-scope="scope">
          <el-switch
            active-value="1" inactive-value="0"
            v-model="scope.row.isMenu"
            change=""
            active-color="#13ce66">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="isShow" align="center" label="是否显示">
        <template slot-scope="scope">
          <el-switch
            active-value="1" inactive-value="0"
            v-model="scope.row.isShow"
            change=""
            active-color="#13ce66">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="seq" align="center" label="排序"></el-table-column>

      <el-table-column  align="center" label="设置">
        <template slot-scope="scope">
          <div v-if="!scope.row.thirdLevelId">
             <el-button @click="edit(scope.row.id)" type="text" size="small">新增下级</el-button>
            <el-button type="text" size="small" @click="queryLowerLevel(scope.row.id)">查看下级</el-button>
          </div>
          <div v-if="scope.row.thirdLevelId">
            <el-button  type="text" size="small" :disabled="true">新增下级</el-button>
          </div>

        </template>
      </el-table-column>

      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button @click="handleDelete(scope.row.id)" type="text" size="small">删除</el-button>
          <el-button type="text" size="small" @click="edit(scope.row.id)">编辑</el-button>
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
    <el-dialog :title="formTitle" :visible.sync="dialogFormVisible" align="center" >
        <el-form :rules="rules" ref="categoryForm" :model="category" label-width="100px" >
          <el-form-item label="分类名称:" prop="name" >
            <el-input v-model="category.name" ></el-input>
          </el-form-item>
            <el-form-item label="上级分类:" prop="letter">
             <div style="float: left">
               <el-cascader
                 v-model="category.parentId"
                 :options="options"
                 :props="{ checkStrictly: true }"
                 clearable></el-cascader><span style="color: #97a8be"> 不选默认为顶级分类</span>
             </div>
<!--              <el-input v-model="category.parentId"></el-input>-->
            </el-form-item>
          <el-form-item label="排序:" prop="seq">
            <el-input v-model="category.seq"></el-input>
          </el-form-item>
          <el-form-item label="是否显示:" prop="isShow">
            <div style="float: left">
              <el-radio v-model="category.isShow" label="1">是</el-radio>
              <el-radio v-model="category.isShow" label="0">否</el-radio>
            </div>

          </el-form-item>
          <el-form-item label="是否导航:" prop="isMenu">
            <div style="float: left">
              <el-radio v-model="category.isMenu" label="1">是</el-radio>
              <el-radio v-model="category.isMenu" label="0">否</el-radio>
            </div>
          </el-form-item>
          <el-form-item label="选择模板:" prop="templateId">
            <div style="float: left">
              <el-select v-model="category.templateId" placeholder="请选择">
                <el-option
                  v-for="item in templateOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </div>
          </el-form-item>
        </el-form>
      <div slot="footer" class="dialog-footer" align="center">
        <el-button  type="primary" @click="doEdit()">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

   // import optionApi from '@/api/option'
    //import request from '@/utils/request'
    import categoryApi from '@/api/category'
    import fileApi from '@/api/file'
    import templateApi from '@/api/template'
    import {parseTime, resetTemp} from '@/utils'


    export default {

        name: 'audit',

        data() {

            return {
                templateOptions:[],
                options:[],
                category:{
                    id:'',
                    name:'',
                    isShow:'',
                    isMenu:'',
                    parentId:'',
                    templateId:''
                },
                formTitle:'',
                dialogFormVisible:false,
                parseTime: parseTime,
                tableLoading: false,
                tableData: [],
                searchMap:{
                    id:'',
                    parentId:'',
                    name:''
                },
                page:1,
                size:10,
                total:0,//总记录数
                rules: {
                    name: [{required: true, message: '必填', trigger: 'blur'}],
                    seq: [{required: true, message: '必填', trigger: 'blur'}]
                },
            }

        },

        created() {
            this.fetchData()
            categoryApi.getCascadeCategory().then(res=>{
                this.options=res.data
                for(let e1 in this.options){
                    for(let e2 in this.options[e1].children){
                        for(let e3 in this.options[e1].children[e2].children){
                            this.options[e1].children[e2].children[e3]['disabled']=true
                        }
                    }
                }
            })
            templateApi.findList({},1,20).then(res=>{
                this.templateOptions=res.data.list
            })
        },
        computed: {
            uploadDisabled:function() {
                return this.imageList.length >0
            },

        },
        methods: {
            queryLowerLevel(id){
                this.searchMap.parentId=id
                this.fetchData()
            },
            closeDialog(){

            },
            edit(id){
                if(id){
                    this.searchMap.id=id
                    categoryApi.findList(this.searchMap,1,1).then(res=>{
                        let brand=res.data.list[0]
                        this.category.parentId=[parseInt(brand.id)]
                        if(brand.secondLevelId)this.category.parentId.unshift(parseInt(brand.secondLevelId))
                        if(brand.thirdLevelId)this.category.parentId.unshift(parseInt(brand.thirdLevelId))

                    })

                        this.dialogFormVisible=true

                }else{
                    this.dialogFormVisible=true

                }
            },


            handleDelete(id){
                categoryApi.delete(id).then(res=>{
                    this.$message.success(res.message)
                    this.fetchData()
                }).catch(err=>{
                    this.$message.err(res.message)
                })
            },
            doEdit(){
                if(this.category.parentId){
                    this.category.parentId=this.category.parentId[this.category.parentId.length-1]
                }else {
                    this.category.parentId=''
                }
                this.$refs['categoryForm'].validate((valid) => {
                    if (!valid) {
                        this.$message.warning("请填写完整")
                        return
                    }
                    if(this.category.id){//更新操作
                          categoryApi.update(this.category,this.category.id).then(res=>{
                              this.$message.success(res.message)
                              this.dialogFormVisible=false
                              this.fetchData()
                          })
                    }else{//添加操作
                        categoryApi.add(this.category).then(res=>{
                            this.$message.success(res.message)
                            this.dialogFormVisible=false
                            this.fetchData()
                            this.category={}
                            this.$nextTick(() => this.$refs['categoryForm'].clearValidate())
                        })
                    }
                })
            },
            //分页
            handleSizeChange(val) {
                this.size = val;
                this.searchMap={}
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
                    categoryApi.findList(this.searchMap,this.page,this.size).then(res=>{
                        this.tableData = res.data.list
                        this.total=res.data.total
                        this.tableLoading = false
                    }).catch((err) => {
                        this.tableLoading = false
                    })

                }, 200)
            },
            reset(){
                this.searchMap={}
                this.page=1
                this.size=10
                this.fetchData();
            }

        }
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .role-checkbox{
    margin-left: 0px;
    margin-right: 15px;
  }
  .app-container form div{
    height: 50px
  }
</style>

