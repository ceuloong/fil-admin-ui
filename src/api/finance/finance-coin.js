import request from '@/utils/request'

// 查询FinanceCoin列表
export function listFinanceCoin(query) {
  return request({
    url: '/api/v1/finance-coin',
    method: 'get',
    params: query
  })
}

// 查询FinanceCoin详细
export function getFinanceCoin(id) {
  return request({
    url: '/api/v1/finance-coin/' + id,
    method: 'get'
  })
}

// 新增FinanceCoin
export function addFinanceCoin(data) {
  return request({
    url: '/api/v1/finance-coin',
    method: 'post',
    data: data
  })
}

// 修改FinanceCoin
export function updateFinanceCoin(data) {
  return request({
    url: '/api/v1/finance-coin/' + data.id,
    method: 'put',
    data: data
  })
}

// 删除FinanceCoin
export function delFinanceCoin(data) {
  return request({
    url: '/api/v1/finance-coin',
    method: 'delete',
    data: data
  })
}

