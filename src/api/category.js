import request from '@/utils/request'

export default{
  findList(data,page,size) {
    return request({
      url: '/category/search/'+page+'/'+size,
      method: 'post',
      data
    })
  },
  add(data){
    return request({
      url: '/category',
      method: 'post',
      data
    })
  },
  findCategoryById(id){
    return request({
      url: '/category/'+id,
      method: 'get'
    })
  },
  delete(id){
    return request({
      url: '/category/'+id,
      method: 'delete'
    })
  },
  update(data,id){
    return request({
      url: '/category/'+id,
      method: 'put',
      data
    })
  },

  getCascadeCategory(){
    return request({
      url: '/category/getCascadeCategory/0',
      method: 'get'
    })
  }
}

