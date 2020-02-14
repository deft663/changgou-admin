<template>
  <product-detail :is-edit='true'></product-detail>
</template>
<script>
    import ProductDetail from '@/components/goods/index'
    export default {
        name: 'goodsDetail',
        components: { ProductDetail }
    }
</script>
<style>
</style>
