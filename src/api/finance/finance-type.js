import request from '@/utils/request'

// 查询FinanceType列表
export function listFinanceType(query) {
  return request({
    url: '/api/v1/finance-type',
    method: 'get',
    params: query
  })
}

// 查询FinanceType详细
export function getFinanceType(typeId) {
  return request({
    url: '/api/v1/finance-type/' + typeId,
    method: 'get'
  })
}

// 查询部门下拉树结构
export function treeselect() {
  return request({
    url: '/api/v1/typeTree',
    method: 'get'
  })
}

// 新增FinanceType
export function addFinanceType(data) {
  return request({
    url: '/api/v1/finance-type',
    method: 'post',
    data: data
  })
}

// 修改FinanceType
export function updateFinanceType(data) {
  return request({
    url: '/api/v1/finance-type/' + data.typeId,
    method: 'put',
    data: data
  })
}

// 删除FinanceType
export function delFinanceType(data) {
  return request({
    url: '/api/v1/finance-type',
    method: 'delete',
    data: data
  })
}

