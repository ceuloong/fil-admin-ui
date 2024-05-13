import request from '@/utils/request'

// 查询FinanceCash列表
export function listFinanceCash(query) {
  return request({
    url: '/api/v1/finance-cash',
    method: 'get',
    params: query
  })
}

// 查询FinanceCash详细
export function getFinanceCash(id) {
  return request({
    url: '/api/v1/finance-cash/' + id,
    method: 'get'
  })
}

// 新增FinanceCash
export function addFinanceCash(data) {
  return request({
    url: '/api/v1/finance-cash',
    method: 'post',
    data: data
  })
}

// 修改FinanceCash
export function updateFinanceCash(data) {
  return request({
    url: '/api/v1/finance-cash/' + data.id,
    method: 'put',
    data: data
  })
}

// 删除FinanceCash
export function delFinanceCash(data) {
  return request({
    url: '/api/v1/finance-cash',
    method: 'delete',
    data: data
  })
}

// 导出FinanceCash
export function exportFinanceCash(query) {
  return request({
    url: '/api/v1/finance-cash/export',
    method: 'post',
    params: query
  })
}

