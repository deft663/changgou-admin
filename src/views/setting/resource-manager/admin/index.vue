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
            <el-input style="width: 203px" v-model="listQuery.loginName" placeholder="登录名"></el-input>
          </el-form-item>

          <el-form-item label="所属角色：">
            <el-select  v-model="listQuery.roleId" placeholder="请选择" clearable>
              <el-option
                v-for="item in options"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <el-form :inline="true" label-width="120px">
        <div style="float: right">
          <el-button type="primary" @click="fetchData(listQuery)" size="small">查询</el-button>
          <el-button type="primary" @click="edit()" size="small">添加</el-button>
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
      <el-table-column prop="loginName" align="center" label="成员账号"/>
      <el-table-column prop="roleName" align="center" label="所属角色"></el-table-column>
      <el-table-column prop="status" align="center" label="是否启用">
        <template slot-scope="scope">
          <el-switch
            active-value="1" inactive-value="0"
            v-model="scope.row.status"
            change="">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作"  width="160">
        <template slot-scope="scope">
            <el-button size="mini" @click="handleUpdateRole(scope.$index, scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
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
    <el-dialog :title="dailogTitle" :visible.sync="dialogFormVisible"  width="50%" @close="dialogClose">
      <el-form :rules="rules" ref="roleForm" :model="role" style="margin-left: 180px">
        <el-form-item label="登录名" prop="loginName">
          <el-input v-model="role.loginName" style="width: 300px" :disabled="loginNameDisabled"></el-input>
        </el-form-item>
        <el-form-item label="登录密码" prop="password">
          <el-input v-model="role.password" style="width: 300px"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="password">
          <el-input v-model="role.password2" style="width: 300px"></el-input>
        </el-form-item>
        <el-form-item label="所属角色" prop="password">
          <el-select  v-model="role.roleId" placeholder="请选择" clearable style="width: 300px">
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer" align="center">
        <el-button type="primary" @click="dialogClose">取消</el-button>
        <el-button type="primary" @click="doEdit()">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

    import brandApi from "../../../../api/brand";
    import adminApi from "../../../../api/admin"
    import roleApi from "../../../../api/role";
    //import request from '@/utils/request'
    import categoryApi from '@/api/category'
    import fileApi from '@/api/file'
    import spuApi from '@/api/spu'
    import skuApi from '@/api/sku'
    import templateApi from '@/api/template'
    import {parseTime, resetTemp} from '@/utils'

    const defaultListQuery = {
        loginName: null,
        roleId: null,
    };
    export default {

        name: 'admin',

        data() {

            return {
                dailogTitle:'',
                listQuery: Object.assign({}, defaultListQuery),
                options: [],
                role: {
                    id: '',
                    loginName: '',
                    roleId: '',
                    password: '',
                    password2: ''
                },
                loginNameDisabled:false,
                dialogFormVisible: false,
                tableLoading: false,
                tableData: [],
                page: 1,
                size: 10,
                total: 0,//总记录数
                rules: {
                    name: [{required: true, message: '必填', trigger: 'blur'}],
                    seq: [{required: true, message: '必填', trigger: 'blur'}]
                },
            }

        },

        created() {
            this.fetchData()
            roleApi.findAll().then(res => {
                this.options = res.data
            })
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
            handleUpdateRole(index,row){
                this.dailogTitle="编辑成员";
                this.loginNameDisabled=true
                adminApi.selectById(row.id).then(res=>{
                    this.role=res.data
                    this.dialogFormVisible=true
                })

            },
            dialogClose() {
                this.dialogFormVisible=false
                this.skuListDetail=[]
                this.skuListHeaderArr=[]
            },
            edit(id) {
                if (id) {
                    this.dailogTitle="编辑成员";
                    this.dialogFormVisible = true
                    this.loginNameDisabled=true

                } else {
                    this.loginNameDisabled=false
                    this.dailogTitle="添加成员";
                    this.dialogFormVisible = true

                }
            },


            handleDelete(index,row) {
                this.$confirm('此操作将永久删除, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    adminApi.delete(row.id).then(res => {
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
            doEdit() {
                if(this.role.id){
                    adminApi.update(this.role,this.role.id).then(res=>{
                        this.$message.success(res.message)
                        this.fetchData()
                    })
                }else{
                    adminApi.add(this.role).then(res=>{
                        this.$message.success(res.message)
                        this.fetchData()
                    })
                }
                console.log(this.role)
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
                    adminApi.findList(this.listQuery, this.page, this.size).then(res => {
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

