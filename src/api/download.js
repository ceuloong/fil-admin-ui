import request from '@/utils/request'

// 查询FilNodes列表
export function listFilNodes(query) {
  return request({
    url: '/api/v1/fil-nodes',
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

// 修改FilNodes
export function download(data) {
  return request({
    url: '/api/v1/fil-nodes/' + data.id,
    method: 'put',
    data: data
  })
}
