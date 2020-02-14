import request from '@/utils/request'

export default{
  findList(data,page,size) {
    return request({
      url: '/brand/search/'+page+'/'+size,
      method: 'post',
      data
    })
  },
  add(data){
    return request({
      url: '/brand',
      method: 'post',
      data
    })
  },
  findBrandById(id){
    return request({
      url: '/brand/'+id,
      method: 'get'
    })
  },
  findByCategoryId(id){
    return request({
      url: '/brand/findByCategoryId/'+id,
      method: 'get'
    })
  },
  delete(id){
    return request({
      url: '/brand/'+id,
      method: 'delete'
    })
  },
  update(data,id){
    return request({
      url: '/brand/'+id,
      method: 'put',
      data
    })
  }
}

