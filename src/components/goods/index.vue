<template>
  <el-card class="form-container" shadow="never">
    <el-steps :active="active" :space="500"   align-center>
      <el-step title="选择商品分类"></el-step>
      <el-step title="填写商品信息"></el-step>
      <el-step title="填写商品属性"></el-step>
    </el-steps>
    <product-category-detail
      :is-edit="isEdit"
      v-show="showStatus[0]"
      v-model="productParam"
      @nextStep="nextStep">
    </product-category-detail>
    <product-info-detail
      :is-edit="isEdit"
      v-show="showStatus[1]"
      v-model="productParam"
      @nextStep="nextStep"
      @prevStep="prevStep">
    </product-info-detail>
    <product-attr-detail
      :is-edit="isEdit"
      v-show="showStatus[2]"
      v-model="productParam"
      @nextStep="nextStep"
      @prevStep="prevStep">
    </product-attr-detail>
  </el-card>
</template>

<script>
    import ProductCategoryDetail from './productcategorydetail';
    import ProductInfoDetail from './productinfodetail';
    import ProductAttrDetail from './productattrdetail';

    import categoryApi from '@/api/category'
    import spuApi from '@/api/spu'
    const defaultGoodsParam = {
        spu:{
            categoryId:[],
            category1Id:'',
            category2Id:'',
            category3Id:'',
            name: '',
            caption:'',
            brandId: '',
            freightId:'1',//运费模板ID
            sn: '',//货号
            introduction:'',
            image:'',//主图
            images:[],
            templateId:'',//规格模板ID
            specItems:'',
            paraItems:'',
        },
        skus:[],
    };
    export default {
        props: {
            isEdit: {
                type: Boolean,
                default: false
            }
        },
        name: 'goods',
        components:{ProductCategoryDetail,ProductInfoDetail,ProductAttrDetail},
        data() {
            return {
                productParam:Object.assign({}, defaultGoodsParam),
                showStatus: [true, false, false],
                active:0
            }
        },

        created() {
            if(this.isEdit){
                spuApi.findGoodsById(this.$route.query.id).then(response=>{
                    let arr=[]
                    arr.push( response.data.spu.category1Id)
                    arr.push( response.data.spu.category2Id)
                    arr.push( response.data.spu.category3Id)

                    response.data.spu['categoryId']=arr
                    this.productParam=response.data;
                });
            }
        },
        computed: {

        },
        methods: {
            nextStep() {
                if (this.active < this.showStatus.length - 1) {
                    this.active++;
                    this.hideAll();
                    this.showStatus[this.active] = true;
                }
            },
            prevStep() {
                if (this.active > 0 && this.active < this.showStatus.length) {
                    this.active--;
                    this.hideAll();
                    this.showStatus[this.active] = true;
                }
            },
            hideAll() {
                for (let i = 0; i < this.showStatus.length; i++) {
                    this.showStatus[i] = false;
                }
            },
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .form-container {
    margin-left: 100px;
    width: 1000px;
    background-color: #F8F9FC;
  }
</style>

