import request from '@/utils/request'

// 查询FilMsig列表
export function listFilMsig(query) {
  return request({
    url: '/api/v1/fil-msig',
    method: 'get',
    params: query
  })
}

// 查询FilMsig详细
export function getFilMsig(id) {
  return request({
    url: '/api/v1/fil-msig/' + id,
    method: 'get'
  })
}

// 新增FilMsig
export function addFilMsig(data) {
  return request({
    url: '/api/v1/fil-msig',
    method: 'post',
    data: data
  })
}

// 修改FilMsig
export function updateFilMsig(data) {
  return request({
    url: '/api/v1/fil-msig/' + data.id,
    method: 'put',
    data: data
  })
}

// 删除FilMsig
export function delFilMsig(data) {
  return request({
    url: '/api/v1/fil-msig',
    method: 'delete',
    data: data
  })
}

