import request from '@/utils/request'

export default{
  upload(data) {
    return request({
      url: '/file/upload',
      method: 'post',
      data
    })
  }
}

