import request from '@/utils/request'

export default{
  findList(data,page,size) {
    return request({
      url: '/sku/search/'+page+'/'+size,
      method: 'post',
      data
    })
  },
  findAllBySpuId(spuid) {
    return request({
      url: '/sku/findAllBySpuId/'+spuid,
      method: 'get',
    })
  },
  add(data){
    return request({
      url: '/sku',
      method: 'post',
      data
    })
  },
  findSkuById(id){
    return request({
      url: '/sku/'+id,
      method: 'get'
    })
  },

  delete(id){
    return request({
      url: '/sku/'+id,
      method: 'delete'
    })
  },
  update(data,id){
    return request({
      url: '/sku/'+id,
      method: 'put',
      data
    })
  }
}

