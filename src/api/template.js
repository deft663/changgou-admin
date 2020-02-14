import request from '@/utils/request'

export default{
  findList(data,page,size) {
    return request({
      url: '/template/search/'+page+'/'+size,
      method: 'post',
      data
    })
  },
  add(data){
    return request({
      url: '/template',
      method: 'post',
      data
    })
  },
  findtemplateById(id){
    return request({
      url: '/template/'+id,
      method: 'get'
    })
  },
  findByCateGoryId(id){
    return request({
      url: '/template/findByCateGoryId/'+id,
      method: 'get'
    })
  },
  delete(id){
    return request({
      url: '/template/'+id,
      method: 'delete'
    })
  },
  update(data,id){
    return request({
      url: '/template/'+id,
      method: 'put',
      data
    })
  }
}

