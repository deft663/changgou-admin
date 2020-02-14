<template>
  <div style="margin-top: 50px">
    <el-form   :model="value.spu" :rules="rules" ref="productInfoForm" label-width="120px" style="width: 800px" size="small">
      <el-form-item label="选择商品分类" prop="categoryId">
        <el-cascader
          v-model="value.spu.categoryId"
          :options="options"
          clearable
         ></el-cascader>
      </el-form-item>
      <transfer v-model="value1" :data="data" :titles="titles"></transfer>

      <div style="margin-top: 50px"></div>
      <el-form-item style="margin-left: 200px">
        <el-button type="primary" @click="handleNext()">下一步，填写商品信息</el-button>
      </el-form-item>
    </el-form>

  </div>

</template>

<script>
    import categoryApi from "../../api/category";
    import brandApi from "../../api/brand";
    import Transfer from '@/components/transfer';
    export default {
        props: {
            value: Object
        },
        components:{Transfer},
        data() {
            const generateData = _ => {
                const arr = [];
                for (let i = 1; i <= 15; i++) {
                    arr.push({
                        key: i,
                        label: `备选项 ${ i }`,
                        disabled: i % 4 === 0
                    });
                }
                return arr;
            };
            return {
                titles:['选择一级分类','选择二级分类','选择三级分类'],
                rules: {
                    categoryId: [{required: true, message: '请选择商品分类', trigger: 'blur'}]
                },
                options: [],
                data: [],
                value1: [1, 4],
                category:[]
            };
        },
        created(){
            this.fetchData()
        },
        watch: {
            value: {
                //深度监听，可监听到对象、数组的变化
                handler(val, oldVal) {
                    this.value.spu.category1Id=val.spu.categoryId[0]
                    this.value.spu.category2Id=val.spu.categoryId[1]
                    this.value.spu.category3Id=val.spu.categoryId[2]
                },
                deep: true //true 深度监听
            }
        },
        methods: {
            handleNext() {
                this.$refs['productInfoForm'].validate((valid) => {
                    if (!valid) {
                        this.$message.warning("请填写完整")
                        return false
                    }else{
                        this.$emit('nextStep')
                    }
                })

            },
            fetchData(){
                categoryApi.getCascadeCategory().then(res=>{
                    this.options=res.data
                    res.data.forEach(e=>{
                        this.data.push({
                            key: e.value,
                            label: e.label,
                            disabled: false,
                            children:e.children
                        });
                    })

                })
            }
        }
    };

</script>

<style lang="scss" scoped>

</style>
