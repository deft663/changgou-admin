<template>
  <div class="app-container">
    <el-form :inline="true"  label-width="120px">
      <div>
        <el-form-item label="名称：">
            <el-input placeholder="请输入名称" v-model="searchMap.name"/>
        </el-form-item>
        <el-form-item label="首字母：">
          <el-input placeholder="请输入首字母" v-model="searchMap.letter"/>
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
      <!--<el-table-column align="center" label="序号" width="65">
        <template slot-scope="scope">
          {{scope.$index+(listQuery.pageNo - 1) * listQuery.limit + 1}}
        </template>
      </el-table-column>-->
      <el-table-column prop="name" align="center" label="品牌名称"></el-table-column>
      <el-table-column prop="letter" align="center" label="首字母"></el-table-column>


      <el-table-column prop="image" align="center" label="图片">
        <template slot-scope="scope">
          <div v-if="scope.row.image">
            <el-image
              style="width: 50px; height: 50px"
              :src="scope.row.image">
            </el-image>
          </div>
          <div v-else>
            <el-image>
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline"></i>
              </div>
            </el-image>
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
    <el-dialog :title="formTitle" :visible.sync="dialogFormVisible" >
        <el-form :rules="rules" ref="brandForm" :model="brand" label-width="100px" >
          <el-form-item label="品牌名称" prop="name">
            <el-input v-model="brand.name"></el-input>
          </el-form-item>
            <el-form-item label="品牌首字母" prop="letter">
              <el-input v-model="brand.letter"></el-input>
            </el-form-item>
            <el-form-item label="上传图片">
              <el-upload
                :file-list="file_list"
                :class="{disabled:uploadDisabled}"
                ref="uploadImage"
                action="uploadAction"
                :beforeUpload="beforeUploadPicture"
                :on-change="imageChange"
                list-type="picture-card"
                name="file"
                :limit="1"
                :multiple="false"
                :auto-upload="false"
                :on-preview="handlePictureCardPreview"
                :on-remove="handleRemovePicture">
                <i class="el-icon-plus"></i>
              </el-upload>
              <el-dialog :visible.sync="dialogVisible">
                <img width="100%" :src="dialogImageUrl" alt="">
              </el-dialog>
            </el-form-item>
        </el-form>
      <div slot="footer" class="dialog-footer" align="center">
        <el-button @click="closeDialog()">取消</el-button>
        <el-button  type="primary" @click="doEdit()">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

   // import optionApi from '@/api/option'
    //import request from '@/utils/request'
    import brandApi from '@/api/brand'
    import fileApi from '@/api/file'
    import {parseTime, resetTemp} from '@/utils'


    export default {

        name: 'brand',

        data() {

            return {
                file_list:[],
                imageList:[],
                dialogImageUrl: '',
                dialogVisible: false,
                brand:{
                    id:'',
                    name:'',
                    letter:'',
                    image:'',
                    seq:''
                },
                formTitle:'',
                dialogFormVisible:false,
                parseTime: parseTime,
                tableLoading: false,
                tableData: [],
                searchMap:{},
                page:1,
                size:10,
                total:0,//总记录数
                rules: {
                    name: [{required: true, message: '必填', trigger: 'blur'}],
                    letter: [{required: true, message: '必填', trigger: 'blur'}]
                },
            }

        },

        created() {
            this.fetchData()
        },
        computed: {
            uploadDisabled:function() {
                return this.imageList.length >0
            },

        },
        methods: {
            closeDialog(){
                this.dialogFormVisible=false
                this.dialogVisible=false
                this.imageList=[]
                this.file_list=[]
            },
            edit(id){
                if(id){
                    brandApi.findBrandById(id).then(res=>{
                        this.imageList=[]
                        this.file_list=[]
                        this.brand=res.data
                        this.dialogFormVisible=true
                        this.dialogVisible=true
                        this.dialogImageUrl=this.brand.image
                        this.imageList.push({'name':'jpg','url':this.dialogImageUrl})
                        this.file_list.push({'name':'jpg','url':this.dialogImageUrl})


                    })
                }else{
                    this.dialogFormVisible=true
                }
            },
            beforeUploadPicture(file){
                const isImage = file.type == 'image/png' || file.type == 'image/jpg' ||  file.type == 'image/jpeg' || file.type == 'image/bmp' || file.type == 'image/gif' || file.type == 'image/webp';
                const isLt2M = file.size <  1024 * 1024 * 2;
                if (!isImage) {
                    this.$message.error('上传只能是png,jpg,jpeg,bmp,gif,webp格式!');
                }
                if (!isLt2M) {
                    this.$message.error('上传图片大小不能超过 2MB!');
                }
                return isImage && isLt2M;
            },
            handlePictureCardPreview(file) {
                this.dialogImageUrl = file.url;
                this.dialogVisible = true;
            },
            handleRemovePicture(file, fileList) {
                console.log(file, fileList);
                this.imageList=[]
            },
            imageChange(file, fileList, name) {
                console.log(file, fileList);
                this.imageList = fileList;
            },

            handleRemoveFile(file, fileList) {
                console.log(file, fileList);
            },
            handlePreviewFile(file) {
                console.log(file);
            },
            handleExceedFile(files, fileList) {
                this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
            },
            beforeRemoveFile(file, fileList) {
                return this.$confirm(`确定移除 ${ file.name }？`);
            },
            fileChange(file,fileList) {

            },

            // 阻止upload的自己上传，进行再操作
            beforeupload (file) {
                this.formData.append('file', file)
                return false
            },
            handleDelete(id){
                brandApi.delete(id).then(res=>{
                    this.$message.success(res.message)
                    this.fetchData()
                }).catch(err=>{
                    this.$message.err(res.message)
                })
            },
            doEdit(){
                this.$refs['brandForm'].validate((valid) => {
                    if (!valid) {
                        this.$message.warning("请填写完整")
                        return
                    }
                    if(this.brand.id){//更新操作
                        if(this.imageList&&this.imageList[0].raw){//上传了新的图片

                        }else{
                            brandApi.update(this.brand,this.brand.id).then(res=>{
                                this.$message.success(res.message)
                                this.dialogFormVisible=false
                                this.dialogVisible=false
                                this.fetchData()
                            })
                        }
                    }else{//添加操作
                        if(this.imageList){
                            let form = new FormData();
                            form.append('file',this.imageList[0].raw)
                            fileApi.upload(form).then(res=>{
                                this.brand.image=res.data[0]
                                brandApi.add(this.brand).then(res=>{
                                    this.$message.success(res.message)
                                    this.dialogFormVisible=false
                                    this.fetchData()
                                    this.brand={}
                                    this.imageList=[]
                                    this.$nextTick(() => this.$refs['brandForm'].clearValidate())
                                })
                            }).catch(err=>{
                                this.$message.error(err)
                            })
                        }else{
                            brandApi.add(this.brand).then(res=>{
                                this.$message.success(res.message)
                                this.dialogFormVisible=false
                                this.fetchData()
                                this.brand={}
                                this.$nextTick(() => this.$refs['brandForm'].clearValidate())
                            })
                        }

                    }
                })
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
                    brandApi.findList(this.searchMap,this.page,this.size).then(res=>{
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

<style rel="stylesheet/scss" lang="scss" >
  .disabled  .el-upload--picture-card {
    display: none;
  }
</style>
