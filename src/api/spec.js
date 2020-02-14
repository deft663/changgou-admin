import request from '@/utils/request'

export default{
  findList(data,page,size) {
    return request({
      url: '/spec/search/'+page+'/'+size,
      method: 'post',
      data
    })
  },
  add(data){
    return request({
      url: '/spec',
      method: 'post',
      data
    })
  },
  findSpecById(id){
    return request({
      url: '/spec/'+id,
      method: 'get'
    })
  },
  findByTemplateId(id){
    return request({
      url: '/spec/findByTemplateId/'+id,
      method: 'get'
    })
  },
  delete(id){
    return request({
      url: '/spec/'+id,
      method: 'delete'
    })
  },
  update(data,id){
    return request({
      url: '/spec/'+id,
      method: 'put',
      data
    })
  }
}

