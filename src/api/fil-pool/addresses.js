import request from '@/utils/request'

// 查询FilAddresses列表
export function listFilAddresses(query) {
  return request({
    url: '/api/v1/fil-addresses',
    method: 'get',
    params: query
  })
}

// 查询FilAddresses详细
export function getFilAddresses(id) {
  return request({
    url: '/api/v1/fil-addresses/' + id,
    method: 'get'
  })
}

// 新增FilAddresses
export function addFilAddresses(data) {
  return request({
    url: '/api/v1/fil-addresses',
    method: 'post',
    data: data
  })
}

// 修改FilAddresses
export function updateFilAddresses(data) {
  return request({
    url: '/api/v1/fil-addresses/' + data.id,
    method: 'put',
    data: data
  })
}

// 删除FilAddresses
export function delFilAddresses(data) {
  return request({
    url: '/api/v1/fil-addresses',
    method: 'delete',
    data: data
  })
}

