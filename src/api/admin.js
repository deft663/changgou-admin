import request from '@/utils/request'

export default{
  selectById(id){
    return request({
      url: '/admin/'+id,
      method: 'get'
    })
  },
  findList(data,page,size) {
    return request({
      url: '/admin/search/'+page+'/'+size,
      method: 'post',
      data
    })
  },
  add(data){
    return request({
      url: '/admin',
      method: 'post',
      data
    })
  },


  delete(id){
    return request({
      url: '/admin/'+id,
      method: 'delete'
    })
  },
  update(data,id){
    return request({
      url: '/admin/'+id,
      method: 'put',
      data
    })
  }
}

