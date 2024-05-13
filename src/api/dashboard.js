import request from '@/utils/request'

// 查询FilDistribution列表
export function listPoolChart(query) {
  return request({
    url: '/api/v1/fil-pool',
    method: 'get',
    params: query
  })
}

// 查询FilDistribution详细
export function getPoolChart() {
  return request({
    url: '/api/v1/fil-pool/get',
    method: 'get'
  })
}

// 获取节点排行FilNodes
export function getRankList() {
  return request({
    url: '/api/v1/fil-nodes/rank-list',
    method: 'post'
  })
}
