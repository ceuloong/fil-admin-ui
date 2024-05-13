import request from '@/utils/request'

// 查询FilDistribution列表
export function listFilDistribution(query) {
  return request({
    url: '/api/v1/fil-distribution',
    method: 'get',
    params: query
  })
}

// 查询FilDistribution详细
export function getFilDistribution(id) {
  return request({
    url: '/api/v1/fil-distribution/' + id,
    method: 'get'
  })
}

// 新增FilDistribution
export function addFilDistribution(data) {
  return request({
    url: '/api/v1/fil-distribution',
    method: 'post',
    data: data
  })
}

// 修改FilDistribution
export function updateFilDistribution(data) {
  return request({
    url: '/api/v1/fil-distribution/' + data.id,
    method: 'put',
    data: data
  })
}

// 删除FilDistribution
export function delFilDistribution(data) {
  return request({
    url: '/api/v1/fil-distribution',
    method: 'delete',
    data: data
  })
}

// 分币FilDistribution
export function dealFilDistribution(data) {
  return request({
    url: '/api/v1/fil-distribution/deal',
    method: 'post',
    data: data
  })
}

// 导出FilDistribution
export function exportFilDistribution(query) {
  return request({
    url: '/api/v1/fil-distribution/export',
    method: 'post',
    params: query
  })
}
