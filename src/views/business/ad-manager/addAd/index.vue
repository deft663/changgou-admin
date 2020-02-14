<template>
  <div class="app-container" style="margin:50px 100px 200px 100px">
      <el-form ref="ad" :model="ad" label-width="100px" :rules="rules" :inline-message="true">
  <el-form-item label="广告名称:" prop="name" :inline-message="true">
    <el-input v-model="ad.name" placeholder="广告名称只是作为辨别多个广告条目之用，并不显示在广告中" style="width:400px"></el-input> 
  </el-form-item>
  <el-form-item label="广告位置;" prop="position" :inline-message="true">
    <el-select v-model="ad.position" placeholder="请选择广告位置" style="width:400px">
      <el-option v-for="item in positionList" :key="item.value" :label="item.label" :value="item.value"></el-option>
    </el-select>
  </el-form-item>
  <el-form-item label="时间范围" prop="startTime">
    <el-date-picker
      v-model="timeRange"
      value-format='yyyy-MM-dd HH:mm:ss'	
      type="datetimerange"
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期">
    </el-date-picker>
  </el-form-item>
  <el-form-item label="上线/下线">
    <el-radio v-model="ad.status" label="1">上线</el-radio>
   <el-radio v-model="ad.status" label="0">下线</el-radio>
  </el-form-item>
  <el-form-item label="广告图片" >
      <el-upload
    action="#"
    :http-request='uploadImage'
    :on-change="handleChange"
    :file-list="fileList">
    <el-button size="small" type="primary">点击上传</el-button>
    <div slot="tip" class="el-upload__tip" v-show="!fileTip">只能上传jpg/png文件，且不超过500kb</div>
     <div slot="tip" class="el-upload__tip" v-show="fileTip" style="color:red">请上传jpg/png文件，且不超过500kb</div>
</el-upload>
  </el-form-item>

   <el-form-item label="广告链接" prop="url">
    <el-input  v-model="ad.url"  style="width:400px"></el-input>
  </el-form-item>
  <el-form-item label="广告备注">
    <el-input type="textarea" v-model="ad.remark"  style="width:400px"></el-input>
  </el-form-item>
  <el-form-item>
    <el-button type="primary" @click="onSubmit">提交</el-button>
    <el-button>取消</el-button>
  </el-form-item>
</el-form>
  </div>
</template>

<script>

    import adApi from "../../../../api/ad";
     import fileApi from "../../../../api/file";
    import {parseTime, resetTemp} from '@/utils'

    export default {

        name: 'addAd',

        data() {
            return {
                fileTip:false,
                 fileList: [],
                  timeRange:null,
                  ad:{
                      id: null,
                      name: null,
                      position: null,
                      startTime:null,
                      endTime:null,
                      status:"1",
                      image:null,
                      url:null,
                      remark:null
                  },
                 rules: {
          name: [
            { required: true, message: '请输入广告名称', trigger: 'blur' },
            { min: 5, max: 15, message: '长度在 5到 15 个字符', trigger: 'blur' }
          ],
          position: [
            { required: true, message: '请选择广告位置', trigger: 'change' }
          ],
          startTime: [
            {required: true, message: '请选择日期范围', trigger: 'change' }
          ],
          url: [
            { required: true, message: '请填写广告链接', trigger: 'blur' }
          ]
        },
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
            }

        },

        created() {
            this.fetchData()
        },
        watch: {
            timeRange(val){
              if(val){
                this.ad.startTime=val[0]
                this.ad.endTime=val[1]
              }else{
                 this.ad.startTime=null
                this.ad.endTIme=null
              }
             }
          
        },
        methods: {
            //查询
            fetchData() {
                setTimeout(() => {
                  
                }, 200)
            },
            onSubmit(){
               this.$refs['ad'].validate((valid) => {
                if (valid) {
                  if(!this.fileList[0]){
                    this.fileTip=true
                    return false;
                  }else{//提交
                    let form = new FormData();
                    form.append('file', this.fileList[0].raw)
                    fileApi.upload(form).then(res=>{
                        this.ad.image=res.data[0]
                        adApi.add(this.ad).then(res=>{
                            this.$message.success(res.message)
                            this.$router.push({path: '/business/business-manager/adList'});
                        })
                    })
                  }
                } else {
                  console.log('error submit!!');
                  return false;
                }
              });
            },
            handleChange(file, fileList) {
              this.fileList = fileList.slice(-1);
            },
            uploadImage(){
                console.log('自定义上传')
            }
                

        }
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>

