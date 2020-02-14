<template>
  <product-detail :is-edit='false'></product-detail>
</template>
<script>
    import ProductDetail from '@/components/goods/index'
    export default {
        name: 'addGoods',
        components: { ProductDetail }
    }
</script>
<style>
</style>
