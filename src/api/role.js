import request from '@/utils/request'

export default{
  findList(data,page,size) {
    return request({
      url: '/role/search/'+page+'/'+size,
      method: 'post',
      data
    })
  },
  findAll() {
    return request({
      url: '/role',
      method: 'get',
    })
  },
  add(data){
    return request({
      url: '/role',
      method: 'post',
      data
    })
  },
  findBrandById(id){
    return request({
      url: '/role/'+id,
      method: 'get'
    })
  },

  delete(id){
    return request({
      url: '/role/'+id,
      method: 'delete'
    })
  },
  update(data,id){
    return request({
      url: '/role/'+id,
      method: 'put',
      data
    })
  }
}

