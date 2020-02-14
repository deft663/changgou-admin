<template>
  <div style="margin-top: 50px">
    <el-form :model="value.spu" :rules="rules" ref="productInfoForm" label-width="120px" style="width: 600px" size="small">
      <el-form-item label="商品分类：">
        <el-cascader
          disabled
          clearable
          v-model="value.spu.categoryId"
          :options="options">
        </el-cascader>
        <el-button type="primary" plain @click="handlePrev">编辑</el-button>
      </el-form-item>
      <el-form-item label="商品名称：" prop="name">
        <el-input v-model="value.spu.name"></el-input>
      </el-form-item>
      <el-form-item label="副标题：" prop="caption">
        <el-input v-model="value.spu.caption"></el-input>
      </el-form-item>
      <el-form-item label="商品品牌：" prop="brandId">
        <el-select
          v-model="value.spu.brandId"
          placeholder="请选择品牌">
          <el-option
            clearable
            v-for="item in brandOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="商品货号：">
        <el-input v-model="value.spu.sn"></el-input>
      </el-form-item>


      <el-form-item style="text-align: center">
        <el-button size="medium" @click="handlePrev()">上一步，选择商品分类</el-button>
        <el-button type="primary" size="medium" @click="handleNext()">下一步，填写商品信息</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
    import categoryApi from "../../api/category";
    import brandApi from "../../api/brand";

    export default {
        props: {
            value: Object
        },
        data() {
            return {
                rules: {
                    name: [{required: true, message: '请写商品标题', trigger: 'blur'}],
                    caption: [{required: true, message: '请写商品子标题', trigger: 'blur'}],
                    brandId: [{required: true, message: '请选择商品品牌', trigger: 'blur'}],
                },
                options: [],
                brandOptions: []
            };
        },
        created() {
            this.fetchData()
            categoryApi.getCascadeCategory().then(res => {
                this.options = res.data
            })
        },
        computed: {
            dataNew() {
                return JSON.parse(JSON.stringify(this.value))
            }
        },
        watch: {
            dataNew: {
                //深度监听，可监听到对象、数组的变化
                handler(val, oldVal) {
                    if (this.value.spu.categoryId[2] && this.value.spu.categoryId[2] != oldVal.spu.categoryId[2]) {
                        //重新选择分类后重置品牌   规格参数等
                        this.brandOptions = []
                        //根据分类查出品牌列表
                        brandApi.findByCategoryId(this.value.spu.categoryId[2]).then(res => {
                            this.brandOptions = res.data
                        })
                    }
                },
                deep: true, //true 深度监听
            }
        },
        methods: {
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
            },
            fetchData() {

            }
        }
    };

</script>

<style lang="scss" scoped>

</style>
