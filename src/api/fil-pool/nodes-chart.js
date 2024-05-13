import request from '@/utils/request'

// 查询NodesChart列表
export function listNodesChart(query) {
  return request({
    url: '/api/v1/nodes-chart',
    method: 'get',
    params: query
  })
}

// 查询NodesChart详细
export function getNodesChart(id) {
  return request({
    url: '/api/v1/nodes-chart/' + id,
    method: 'get'
  })
}

// 新增NodesChart
export function addNodesChart(data) {
  return request({
    url: '/api/v1/nodes-chart',
    method: 'post',
    data: data
  })
}

// 修改NodesChart
export function updateNodesChart(data) {
  return request({
    url: '/api/v1/nodes-chart/' + data.id,
    method: 'put',
    data: data
  })
}

// 删除NodesChart
export function delNodesChart(data) {
  return request({
    url: '/api/v1/nodes-chart',
    method: 'delete',
    data: data
  })
}

