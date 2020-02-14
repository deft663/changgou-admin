<template>
  <div style="margin-top: 50px">
    <el-form :model="value" :rules="rules" ref="productInfoForm" label-width="100px" style="width: 900px" size="small">
      <el-form-item label="使用模板：">
        <el-select v-model="value.spu.templateId"
                   placeholder="请选择模板类型"
                   disabled>
          <el-option
            v-for="item in productSpecOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="商品规格：">
        <el-card shadow="never" class="cardBg">

          <div v-for="spec in specList">
            <el-form-item :label="spec.name" style="font-size: smaller">
              <el-checkbox-group v-model="selectProductAttr[spec.name]">
                <el-checkbox v-for="item in getInputListArr(spec)" :label="item.v" :key="item.v"
                             class="littleMarginLeft"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </div>


        </el-card>
        <div style="margin-top: 20px"></div>
        <el-card shadow="never" class="cardBg" style="width: 900px;margin-left: -110px">

          <el-table :data="skuList.listArr" size="mini" fit>
            <el-table-column align="center" :prop="header" v-for="header in skuList.headerArr" :label="header">
              <template slot-scope="scope">
                <div v-if="header=='价格'">
                  <el-input size="mini" style="width: 80px" v-model="scope.row[header]"/>
                </div>
                <div v-else-if="header=='库存数量'">
                  <el-input size="mini" style="width: 80px" v-model="scope.row[header]"/>
                </div>
                <div v-else-if="header=='库存预警值'">
                  <el-input size="mini" style="width: 80px" v-model="scope.row[header]"/>
                </div>
                <div v-else-if="header=='SKU编号'">
                  <el-input size="mini" style="width: 80px" v-model="scope.row[header]"/>
                </div>
                <div v-else-if="header=='是否启用'">
                  <el-checkbox v-model="scope.row[header]" size="mini"/>
                </div>
                <div v-else>
                  <el-input size="mini" disabled style="width: 80px;border-color: #F8F9FC" v-model="scope.row[header]"/>
                </div>

              </template>


            </el-table-column>

            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" size="mini">上传图片</el-button>
              </template>
            </el-table-column>
          </el-table>


        </el-card>
      </el-form-item>
      <el-form-item>
        <el-card shadow="never" class="cardBg" style="width: 900px;margin-left: -110px">
          <div slot="header">
            <span style="font-weight: bold">商品参数:</span>
          </div>
          <el-table :data="paraList" size="mini" fit>
            <el-table-column align="center" width="100" prop="name" label="参数类型"></el-table-column>
            <el-table-column align="center" width="300" prop="options" label="录入参数">
              <template slot-scope="scope">
                <el-select placeholder="请选择" v-model="scope.row['v']" @change="paraChange">
                  <el-option
                    v-for="item in scope.row.options.split(',')"
                    :key="item"
                    :label="item"
                    :value="item">
                  </el-option>
                </el-select>
              </template>
            </el-table-column>

          </el-table>
        </el-card>
        <!--        <el-card shadow="never" class="cardBg" style="width: 900px;margin-left: -110px">-->
        <!--          <div slot="header">-->
        <!--            <span style="font-weight: bold">商品相册:</span>-->
        <!--          </div>-->
        <!--          <el-upload-->
        <!--            :class="{disabled:uploadDisabled}"-->
        <!--            ref="uploadImage"-->
        <!--            action="uploadAction"-->
        <!--            :beforeUpload="beforeUploadPicture"-->
        <!--            :on-change="imageChange"-->
        <!--            list-type="picture-card"-->
        <!--            name="file"-->
        <!--            :multiple="true"-->
        <!--            :file-list="fileList"-->
        <!--            :auto-upload="false"-->
        <!--            :on-remove="handleRemovePicture">-->
        <!--            <i class="el-icon-plus"></i>-->
        <!--          </el-upload>-->
        <!--          <el-link type="danger" disabled>默认第一个为主图</el-link>-->
        <!--        </el-card>-->
        <el-card shadow="never" class="cardBg" style="width: 900px;margin-left: -110px;position: relative">
          <div slot="header">
            <span style="font-weight: bold">商品相册:</span>
          </div>

          <div>
            <div style="float: left;position: relative">
              <ul class="imageItem" v-if="imageList[0]">
                <li v-for="(file,i) in imageList" :key="file.name">
                  <div class="defind_img_s">
                    <div style="height: 150px;overflow: hidden"><img :src="file.url" style="width:100%"></div>
                    <div style="width:100%;height: 30px;">
                     <span v-if="i==0" style="color: red">商品主图

                     </span>
                      <span v-else><a href="###" style="color: #20a0ff" @click="setMainImage(i)">设为主图</a>
                     </span>
                      <span><a href="###" style="color: #20a0ff" @click="delImage(i)">删除图片</a></span>
                    </div>
                  </div>
                </li>
              </ul>
              <ul class="imageItem" v-else>
                <li>
                  <div class="defind_img_s">
                    <div style="height: 150px;overflow: hidden"><img src="" style="width:100%"></div>
                    <div style="width:100%;height: 30px;">
                      <span style="color: red">商品主图</span>
                    </div>
                  </div>
                </li>
              </ul>

            </div>
            <div class="upload_btns" style="float: left;">
              <el-upload
                ref="uploadImage2"
                action="uploadAction2"
                list-type="picture"
                :beforeUpload="beforeUploadPicture"
                :on-change="imageChange2"
                :show-file-list="false"
                name="file1"
                :file-list="fileList"
                :http-request="custUpload"
                :multiple="true"
                :auto-upload="false"
                :on-remove="handleRemovePicture">
                <el-button size="small" class="btn" type="primary">点击上传</el-button>
              </el-upload>
            </div>
          </div>


        </el-card>
        <el-card shadow="never" class="cardBg" style="width: 900px;margin-left: -110px">
          <div slot="header">
            <span style="font-weight: bold">详情描述:</span>
          </div>
          <Editor id="tinymce" v-model="value.spu.introduction" :init="editorInit"></Editor>

        </el-card>
      </el-form-item>
      <el-form-item style="text-align: center">
        <el-button size="medium" @click="handlePrev()">上一步，填写商品信息</el-button>
        <el-button type="primary" size="medium" @click="doSubmit()" :loading="submitLoading">提交审核</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
    import categoryApi from "../../api/category";
    import brandApi from "../../api/brand";
    import spuApi from "../../api/spu";
    import templateApi from "../../api/template";
    import specApi from "../../api/spec";
    import paraApi from "../../api/para";
    import fileApi from '@/api/file'
    import tinymce from 'tinymce/tinymce'
    import 'tinymce/themes/silver/theme'
    import Editor from '@tinymce/tinymce-vue'
    import 'tinymce/plugins/image'
    import 'tinymce/plugins/link'
    import 'tinymce/plugins/code'
    import 'tinymce/plugins/table'
    import 'tinymce/plugins/lists'
    import 'tinymce/plugins/contextmenu'
    import 'tinymce/plugins/wordcount'
    import 'tinymce/plugins/colorpicker'
    import 'tinymce/plugins/textcolor'

    export default {
        components: {Editor},
        props: {
            value: Object,
            isEdit: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                submitLoading:false,
                adduploadShow: true,
                uploadShow: true,
                rules: {
                    name: [{required: true, message: '请写商品标题', trigger: 'blur'}],
                    caption: [{required: true, message: '请写商品子标题', trigger: 'blur'}],
                    brandId: [{required: true, message: '请选择商品品牌', trigger: 'blur'}],
                },
                options: [],
                brandOptions: [],
                productSpecOptions: [],
                specList: [],
                paraList: [],
                selectProductAttr: {},
                fileList: [],
                imageList: [],
                imageListLimit: 3,
                editorInit: {
                    language_url: '/tinymce/langs/zh_CN.js',
                    language: 'zh_CN',
                    //skin_url: '/skins/dark',
                    height: 300,
                    plugins: 'link lists image code table colorpicker textcolor wordcount contextmenu',
                    toolbar:
                        'bold italic underline strikethrough | fontsizeselect | forecolor backcolor | alignleft aligncenter alignright alignjustify | link unlink image code | bullist numlist | outdent indent blockquote | undo redo  | removeformat',
                    //menubar: "insert",
                    images_upload_handler: (blobInfo, success, failure) => {
                        this.handleImgUpload(blobInfo, success, failure)
                    }
                },
            };
        },
        created() {
            this.fetchData()
        },
        mounted() {
            tinymce.init({})
        },
        computed: {
            dataNew() {
                return JSON.parse(JSON.stringify(this.value))
            },
            skuList: function () {
                let headerArr = new Array();
                let listArr = new Array()
                let arr = new Array(0)
                for (let attr in this.selectProductAttr) {
                    if (this.selectProductAttr[attr].length > 0) {
                        headerArr.push(attr)
                        arr.push(this.selectProductAttr[attr])
                    }

                }

                let allArr = this.cartesianProductOf(...arr)
                allArr.forEach((e, i) => {
                    let item = {}
                    headerArr.forEach((h, index) => {
                        item[h] = e[index]
                    })
                    listArr.push(item)
                })
                console.log(listArr)
                this.addListDefault(headerArr, listArr);
                return {'headerArr': headerArr, 'listArr': listArr}
            },
            uploadDisabled: function () {
                return this.imageList.length >= this.imageListLimit
            },
        },
        watch: {
            dataNew: {
                //深度监听，可监听到对象、数组的变化
                handler(val, oldVal) {
                    if (this.value.spu.category3Id && this.value.spu.category3Id != oldVal.spu.category3Id) {
                        //根据分类查出模板
                        templateApi.findByCateGoryId(this.value.spu.category3Id).then(res => {
                            //重新选择分类后重置规格参数等
                            //this.$set(this.selectProductAttr,{})
                            this.value.spu.templateId = res.data.id
                            this.productSpecOptions = []
                            this.productSpecOptions.push(res.data)
                            //根据模板查出规格和参数集合
                            specApi.findByTemplateId(res.data.id).then(res => {
                                this.specList = res.data
                                let specItems = {}
                                this.specList.forEach(e => {
                                    specItems[e.name] = e.options.split(',')
                                })
                                //this.value.spu.specItems=JSON.stringify(specItems)
                                res.data.forEach((e => {
                                    this.$set(this.selectProductAttr, e.name, [])
                                    //vue监听不到对象内部的变化
                                    //this.selectProductAttr[e.name]=[]
                                }))

                                //sku
                                if (this.value.spu.specItems) {
                                    let specItemsObj = JSON.parse(this.value.spu.specItems);
                                    for (let item in specItemsObj) {
                                        this.selectProductAttr[item] = specItemsObj[item];
                                    }
                                }

                                this.value.skus.forEach(s => {
                                    this.skuList.listArr.forEach(e => {

                                        let sku = JSON.parse(s.spec)

                                        function allAttrEquals(sku, e) {
                                            for (let attr in sku) {
                                                if (e[attr] != sku[attr]) {
                                                    return false
                                                }
                                            }
                                            return true
                                        }

                                        if (allAttrEquals(sku, e)) {
                                            e['价格'] = s.price
                                            e['SKU编号'] = s.sn
                                            e['库存数量'] = s.num
                                            e['库存预警值'] = s.alertNum
                                            e['是否启用'] = true
                                        }


                                    })
                                })


                            })

                            paraApi.findByTemplateId(res.data.id).then(res => {
                                this.paraList = res.data
                                let paraItems = {}
                                this.paraList.forEach(e => {
                                    paraItems[e.name] = e.options.split(',')
                                })
                                //this.value.spu.paraItems=JSON.stringify(paraItems)
                                if (this.isEdit) {//回显所有数据
                                    //商品主图相册
                                    let images = this.value.spu.images.split(',')
                                    let arr = []
                                    images.forEach((e, i) => {
                                        if (e)
                                            arr.push({'url': e, 'status': 'ready'})
                                    })
                                    this.imageList = arr
                                    //商品参数
                                    let paraItems = JSON.parse(this.value.spu.paraItems)
                                    for (let item in paraItems) {
                                        this.paraList.forEach(e => {
                                            if (e.name == item) {
                                                e['v'] = paraItems[item]
                                            }
                                        })
                                    }

                                }
                            })

                        })

                    }
                },
                deep: true //true 深度监听
            }
        },
        methods: {
            paraChange(val){
              this.paraList.forEach((e,i)=>{
                  this.$set(this.paraList,i,this.paraList[i])
              })
            },
            doSubmit() {//提交审核
                this.submitLoading=true
                if(this.isEdit){
                    console.log(this.imageList)
                    let form = new FormData();
                    let flag={'has':false,'index':[]}
                    this.imageList.forEach((e,i)=>{
                        if(e.url.indexOf('blob')==0){//新添加图片
                            form.append('file', e.raw)
                        }else{
                            flag.has=true
                            flag.index.push(i)
                        }
                    })
                    if(form.has('file')){
                        fileApi.upload(form).then(res=>{
                            if(flag.has){
                                res.data.forEach(e=>{
                                    for(let i=0;i<this.imageList.length;i++){
                                      if(flag.index.indexOf(i)==-1){
                                          this.imageList[i].url=e
                                          break;
                                      }
                                    }
                                })
                                this.value.spu.image = this.imageList[0]['url']
                                let images = '';
                                this.imageList.forEach((e, i) => {
                                    images += e['url']+ ","
                                })
                                this.value.spu.images = images
                                spuApi.editGoods(this.isEdit,this.value).then(res => {
                                    this.$message.success(res.message)
                                    this.$router.push({path: '/goods/goods-manager/goodsList'});
                                }).catch(err => {
                                    this.$message.error(err)
                                })
                            }else{//全部都为新上传图片
                                this.value.spu.image = res.data[0]
                                let images = '';
                                res.data.forEach((e, i) => {
                                    images += e + ","
                                })
                                this.value.spu.images = images
                                spuApi.editGoods(this.isEdit,this.value).then(res => {
                                    this.$message.success(res.message)
                                    this.$router.push({path: '/goods/goods-manager/goodsList'});
                                }).catch(err => {
                                    this.$message.error(err)
                                })
                            }
                        })
                    }else if(this.imageList.length>0){
                        //组装spu字段-----> skus  spu-->specItems paraItems images
                        let specItems = {}
                        let specHearderOptions = this.skuList['headerArr']
                        let specValues = this.skuList['listArr']
                        for (let i = 0; i < specHearderOptions.length - 5; i++) {
                            specItems[specHearderOptions[i]] = new Set()
                        }
                        this.value.skus=[]
                        specValues.forEach(e => {
                            let sku = {}
                            if (e['是否启用']) {
                                for (let item in specItems) {
                                    specItems[item].add(e[item])
                                }
                                sku['price'] = e['价格']
                                sku['sn'] = e['SKU编号']
                                sku['num'] = e['库存数量']
                                sku['alertNum'] = e['库存预警值']
                                let spec = {}
                                let item = Object.entries(e)
                                for (let i in item) {
                                    if (i < item.length - 5) {
                                        spec[item[i][0]] = item[i][1]
                                    }
                                }
                                sku['spec'] = JSON.stringify(spec)
                                this.value.skus.push(sku)
                            }
                        })
                        for (let item in specItems) {
                            specItems[item] = Array.from(specItems[item])
                        }
                        //console.log(specItems)
                        this.value.spu.specItems = JSON.stringify(specItems)
                        this.value.spu.image = this.imageList[0]['url']
                        let images = '';
                        this.imageList.forEach((e, i) => {
                            images += e.url + ","
                        })
                        this.value.spu.images = images
                        let paraItems = {}
                        this.paraList.forEach(e => {
                            if (e['v']) {
                                paraItems[e.name] = e['v']
                            }
                        })
                        this.value.spu.paraItems = JSON.stringify(paraItems)
                        spuApi.editGoods(this.isEdit,this.value).then(res => {
                            this.$message.success(res.message)
                            this.$router.push({path: '/goods/goods-manager/goodsList'});
                        }).catch(err => {
                            this.$message.error(err)
                        })
                    }else{
                        this.value.spu.image=''
                        this.value.spu.images=''
                        spuApi.editGoods(this.isEdit,this.value).then(res => {
                            this.$message.success(res.message)
                            this.$router.push({path: '/goods/goods-manager/goodsList'});
                        }).catch(err => {
                            this.$message.error(err)
                        })
                    }
                }else {
                    //组装spu字段-----> skus  spu-->specItems paraItems images
                    let specItems = {}
                    let specHearderOptions = this.skuList['headerArr']
                    let specValues = this.skuList['listArr']
                    for (let i = 0; i < specHearderOptions.length - 5; i++) {
                        specItems[specHearderOptions[i]] = new Set()
                    }
                    this.value.skus=[]
                    specValues.forEach(e => {
                        let sku = {}
                        if (e['是否启用']) {
                            for (let item in specItems) {
                                specItems[item].add(e[item])
                            }
                            sku['price'] = e['价格']
                            sku['sn'] = e['SKU编号']
                            sku['num'] = e['库存数量']
                            sku['alertNum'] = e['库存预警值']
                            let spec = {}
                            let item = Object.entries(e)
                            for (let i in item) {
                                if (i < item.length - 5) {
                                    spec[item[i][0]] = item[i][1]
                                }
                            }
                            sku['spec'] = JSON.stringify(spec)
                            this.value.skus.push(sku)
                        }
                    })
                    for (let item in specItems) {
                        specItems[item] = Array.from(specItems[item])
                    }
                    //console.log(specItems)
                    this.value.spu.specItems = JSON.stringify(specItems)
                    let paraItems = {}
                    this.paraList.forEach(e => {
                        if (e['v']) {
                            paraItems[e.name] = e['v']
                        }
                    })
                    this.value.spu.paraItems = JSON.stringify(paraItems)

                    if (this.imageList && this.imageList.length > 0) {
                        if(this.isEdit){

                        }else{
                            let form = new FormData();
                            this.imageList.forEach((e, i) => {
                                form.append('file', this.imageList[i].raw)
                            })
                            fileApi.upload(form).then(res => {
                                console.log(res.data)
                                this.value.spu.image = res.data[0]
                                let images = '';
                                res.data.forEach((e, i) => {
                                    images += e + ","
                                })
                                this.value.spu.images = images
                                spuApi.editGoods(this.isEdit,this.value).then(res => {
                                    this.$message.success(res.message)
                                    this.$router.push({path: '/goods/goods-manager/goodsList'});
                                }).catch(err => {
                                    this.$message.error(err)
                                })
                            }).catch(err => {
                                this.$message.error(err)
                            })
                        }
                    }else{
                        this.value.spu.image=''
                        this.value.spu.images=''
                        spuApi.editGoods(this.isEdit,this.value).then(res => {
                            this.$message.success(res.message)
                            this.$router.push({path: '/goods/goods-manager/goodsList'});
                        }).catch(err => {
                            this.$message.error(err)
                        })
                    }
                }

            },
            fileChange() {
                // alert()
            },
            setMainImage(index) {
                //把当前元素移至数组首位
                console.log('当前元素移至数组首位')
                let t1 = this.imageList[index]
                let t2 = this.imageList[0]
                this.$set(this.imageList, '0', t1)
                this.$set(this.imageList, index, t2)
            },
            delImage(index) {
                //splice() 方法向/从数组中添加/删除项目，然后返回被删除的项目。
                this.imageList.splice(index, 1);
            },
            custUpload() {
                alert('自定义上传')
                if (this.imageList && this.imageList.length <= this.imageListLimit) {
                    let form = new FormData();
                    this.imageList.forEach((e, i) => {
                        if(!e.url){//没有上传的才要添加
                            form.append('file', this.imageList[i].raw)
                        }
                    })
                    fileApi.upload(form).then(res => {
                        console.log(res.data)
                        res.data.forEach((e, i) => {
                            //this.imageList[this.imageList.length]['url']=e
                            if(this.isEdit){

                            }else{
                               for(let i in this.imageList){
                                   if(!this.imageList['url']){
                                       //e.url=e
                                       this.$set(this.imageList[i], 'url',e)
                                       break;
                                   }
                               }

                            }
                        })
                    }).catch(err => {
                        this.$message.error(err)
                    })
                } else {
                    this.$message.warning("超出限制了")
                }

            },
            handleImgUpload(blobInfo, success, failure) {//富文本编辑器自定义上传
                let formdata = new FormData()
                formdata.set('file', blobInfo.blob())
                fileApi.upload(formdata).then(res => {
                    success(res.data[0])
                }).catch(err => {
                    failure('error')
                })
            },
            imageChange(file, fileList, name) {//相册上传控制
                this.fileList = fileList.slice(0, this.imageListLimit);
                this.imageList = fileList.slice(0, this.imageListLimit);
            },
            imageChange2(file, fileList) {//相册上传控制

                if(this.isEdit){
                    if(this.imageList&&this.imageList.length<this.imageListLimit){
                        for(let i=this.imageList.length;i--;i>0){
                            fileList.unshift(this.imageList[i])
                        }
                    }else{
                        this.$message.warning("超出限制了")
                        return false
                    }
                }
                let  len = fileList.length;
                this.imageList = fileList.slice(0, this.imageListLimit)


                if (len > this.imageListLimit) {
                    this.$message.warning("超出限制了")
                    return false
                }

            },
            beforeUploadPicture(file) {
                const isImage = file.type == 'image/png' || file.type == 'image/jpg' || file.type == 'image/jpeg' || file.type == 'image/bmp' || file.type == 'image/gif' || file.type == 'image/webp';
                const isLt2M = file.size < 1024 * 1024 * 5;
                if (!isImage) {
                    this.$message.error('上传只能是png,jpg,jpeg,bmp,gif,webp格式!');
                }
                if (!isLt2M) {
                    this.$message.error('上传图片大小不能超过 5MB!');
                }
                return isImage && isLt2M;
            },
            handleRemovePicture(file, fileList) {
                console.log(file, fileList);
                this.imageList = fileList
                this.fileList = fileList
            },
            addListDefault(headerArr, listArr) {
                headerArr.push('价格')
                headerArr.push('库存数量')
                headerArr.push('库存预警值')
                headerArr.push('SKU编号')
                headerArr.push('是否启用')
                listArr.forEach(e => {
                    e['价格'] = ''
                    e['库存数量'] = ''
                    e['库存预警值'] = ''
                    e['SKU编号'] = ''
                    e['是否启用'] = false
                })
            },
            cartesianProductOf() {
                return Array.prototype.reduce.call(arguments, function (a, b) {
                    var ret = [];
                    a.forEach(function (a) {
                        b.forEach(function (b) {
                            ret.push(a.concat([b]));
                        });
                    });
                    return ret;
                }, [[]]);
            },
            getInputListArr(spec) {
                let arr = spec.options.split(',')
                let newArr = new Array();
                arr.forEach((e, v) => {
                    newArr.push({'k': spec.name, 'v': e})
                })
                return newArr
            },
            handleNext() {
                this.$refs['productInfoForm'].validate((valid) => {
                    if (!valid) {
                        this.$message.warning("请填写完整")
                        return false
                    } else {
                        this.$emit('nextStep')
                    }
                })
            },
            handlePrev() {
                this.$emit('prevStep')
                this.selectProductAttr = {}
                this.specList.forEach((e => {
                    this.$set(this.selectProductAttr, e.name, [])
                    //vue监听不到对象内部的变化
                    //this.selectProductAttr[e.name]=[]
                }))
            },
            fetchData() {

            }
        }
    };

</script>

<style lang="scss" scoped>
  .littleMarginLeft {
    margin-left: 10px;
  }

  .littleMarginTop {
    margin-top: 10px;
  }

  .paramInput {
    width: 250px;
  }

  .paramInputLabel {
    display: inline-block;
    width: 100px;
    text-align: right;
    padding-right: 10px
  }

  .cardBg {
    background: #F8F9FC;
  }

  .el-form-item .el-form-item--small {
    margin-bottom: 0;
  }

  .image-class {
    overflow: hidden;
    background-color: #fff;
    border: 1px solid #c0ccda;
    border-radius: 6px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    width: 148px;
    height: 148px;
    display: inline-block;
  }

  .defind_img_s {
    border-radius: 5px 5px 5px 5px;
    width: 150px;
    height: 180px;
    overflow: hidden;
    text-align: center;
    border: 1px solid black;
  }

  .imageItem {
    position: relative;
  }

  .imageItem li {
    position: relative;
    float: left;
    margin-left: 5px;
    border-radius: 12px;
    list-style: none;
  }

  .upload_btns {
    position: relative;
    margin: 30px 820px 20px 30px;
  }
</style>
<style rel="stylesheet/scss" lang="scss">
  .disabled .el-upload--picture-card {
    display: none;
  }

</style>
