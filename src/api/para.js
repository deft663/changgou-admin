import request from '@/utils/request'

export default{
  findList(data,page,size) {
    return request({
      url: '/para/search/'+page+'/'+size,
      method: 'post',
      data
    })
  },
  add(data){
    return request({
      url: '/para',
      method: 'post',
      data
    })
  },
  findParaById(id){
    return request({
      url: '/para/'+id,
      method: 'get'
    })
  },
  findByTemplateId(id){
    return request({
      url: '/para/findByTemplateId/'+id,
      method: 'get'
    })
  },
  delete(id){
    return request({
      url: '/para/'+id,
      method: 'delete'
    })
  },
  update(data,id){
    return request({
      url: '/para/'+id,
      method: 'put',
      data
    })
  }
}

