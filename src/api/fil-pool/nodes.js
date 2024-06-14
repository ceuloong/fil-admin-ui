import request from '@/utils/request'

// 查询FilNodes列表
export function listFilNodes(query) {
  return request({
    url: '/api/v1/fil-nodes',
    method: 'get',
    params: query
  })
}

// 查询FilNodes列表
export function listFilNodesChart(query) {
  return request({
    url: '/api/v1/nodes-pool',
    method: 'get',
    params: query
  })
}

// 查询FilNodes详细
export function getFilNodes(id) {
  return request({
    url: '/api/v1/fil-nodes/' + id,
    method: 'get'
  })
}

// 新增FilNodes
export function addFilNodes(data) {
  return request({
    url: '/api/v1/fil-nodes',
    method: 'post',
    data: data
  })
}

// 修改FilNodes
export function updateFilNodes(data) {
  return request({
    url: '/api/v1/fil-nodes/' + data.id,
    method: 'put',
    data: data
  })
}

// 删除FilNodes
export function delFilNodes(data) {
  return request({
    url: '/api/v1/fil-nodes',
    method: 'delete',
    data: data
  })
}

// 导出FilDistribution
export function exportFilNodes(query) {
  return request({
    url: '/api/v1/fil-nodes/export',
    method: 'post',
    params: query
  })
}
