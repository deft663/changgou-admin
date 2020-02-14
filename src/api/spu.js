import request from '@/utils/request'

export default{
  findList(data,page,size) {
    return request({
      url: '/spu/search/'+page+'/'+size,
      method: 'post',
      data
    })
  },
  add(data){
    return request({
      url: '/spu',
      method: 'post',
      data
    })
  },
  editGoods(isEdit,data){
    if (isEdit) {
       return request({
        url: '/spu/updateGoods',
        method: 'put',
        data
      })

    } else {
      return request({
        url: '/spu/addGoods',
        method: 'post',
        data
      })
    }

  },
  updateGoods(data){

  },
  findGoodsById(id){
    return request({
      url: '/spu/'+id,
      method: 'get'
    })
  },

  delete(id){
    return request({
      url: '/spu/'+id,
      method: 'delete'
    })
  },
  update(data,id){
    return request({
      url: '/spu/'+id,
      method: 'put',
      data
    })
  },
  auditGoods(data){
    return request({
      url: '/spu/auditGoods?ids='+data,
      method: 'put'
    })
  }
}

