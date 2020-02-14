import request from '@/utils/request'

export default{
  selectById(id){
    return request({
      url: '/ad/'+id,
      method: 'get'
    })
  },
  findList(data,page,size) {
    return request({
      url: '/ad/search/'+page+'/'+size,
      method: 'post',
      data
    })
  },
  add(data){
    return request({
      url: '/ad',
      method: 'post',
      data
    })
  },


  delete(id){
    return request({
      url: '/ad/'+id,
      method: 'delete'
    })
  },
  update(data,id){
    return request({
      url: '/ad/'+id,
      method: 'put',
      data
    })
  }
}

