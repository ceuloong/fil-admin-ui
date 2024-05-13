
<template>
  <BasicLayout>
    <template #wrapper>
      <el-card class="box-card">
        <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="68px">
          <el-form-item label="MinerID" prop="node"><el-input
            v-model="queryParams.node"
            placeholder="请输入账户名称"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
          </el-form-item>
          <el-form-item label="Owner" prop="msigNode">
            <el-select
              v-model="queryParams.msigNode"
              placeholder="Owner"
              clearable
              size="small"
              style="width: 160px"
            >
              <el-option
                v-for="dict in msigNodeOptions"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="状态" prop="status">
            <el-select
              v-model="queryParams.status"
              placeholder="联合节点"
              clearable
              size="small"
              style="width: 160px"
            >
              <el-option
                v-for="dict in statusOptions"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="联合挖矿" prop="type">
            <el-select
              v-model="queryParams.type"
              placeholder="联合节点"
              clearable
              size="small"
              style="width: 160px"
            >
              <el-option
                v-for="dict in typeOptions"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="算力范围" prop="qualityAdjPower">
            <el-input
              v-model="queryParams.minPower"
              placeholder="算力值"
              clearable
              range-separator="至"
              size="small"
              @keyup.enter.native="handleQuery"
            /> - <el-input
              v-model="queryParams.maxPower"
              placeholder="算力值"
              clearable
              size="small"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item> -->

          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              v-permisaction="['admin:filNodes:add']"
              type="primary"
              icon="el-icon-plus"
              size="mini"
              @click="handleAdd"
            >新增
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              v-permisaction="['admin:filNodes:edit']"
              type="success"
              icon="el-icon-edit"
              size="mini"
              :disabled="single"
              @click="handleUpdate"
            >修改
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              v-permisaction="['admin:filNodes:remove']"
              type="danger"
              icon="el-icon-delete"
              size="mini"
              :disabled="multiple"
              @click="handleDelete"
            >删除
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              v-permisaction="['admin:filDistribution:export']"
              type="warning"
              icon="el-icon-download"
              size="mini"
              @click="handleExport"
            >导出</el-button>
          </el-col>
        </el-row>

        <el-table
          v-loading="loading"
          :data="filNodesList"
          border
          @selection-change="handleSelectionChange"
          @sort-change="handleSortChang"
        >
          <el-table-column type="selection" align="center" />
          <el-table-column label="MinerID" width="100" align="center" prop="node" />
          <el-table-column
            label="有效算力(PiB)"
            align="center"
            prop="qualityAdjPower"
            :show-overflow-tooltip="true"
            sortable="custom"
            width="130"
          />
          <el-table-column
            label="收益比例"
            align="center"
            prop="distributePoint"
            :show-overflow-tooltip="true"
            sortable="custom"
            width="120"
          />
          <el-table-column
            label="收益数量"
            align="center"
            prop="hasRealDistribute"
            :show-overflow-tooltip="true"
            width="120"
            sortable="custom"
          />
          <el-table-column
            label="账户余额"
            align="center"
            prop="balance"
            :show-overflow-tooltip="true"
            width="120"
            sortable="custom"
          />
          <el-table-column
            label="可用余额"
            align="center"
            sortable="custom"
            prop="availableBalance"
            :show-overflow-tooltip="true"
            width="120"
          />
          <el-table-column
            label="扇区质押"
            align="center"
            prop="sectorPledgeBalance"
            :show-overflow-tooltip="true"
            sortable="custom"
            width="120"
          />
          <el-table-column
            label="上期质押"
            align="center"
            prop="lastDisSectorPledgeBalance"
            :show-overflow-tooltip="true"
            sortable="custom"
            width="120"
          />
          <el-table-column
            label="存储锁仓"
            align="center"
            prop="vestingFunds"
            :show-overflow-tooltip="true"
            sortable="custom"
            width="120"
          />
          <el-table-column
            label="24H爆塊數"
            align="center"
            prop="blocksMined24h"
            :show-overflow-tooltip="true"
            sortable="custom"
            width="120"
          />
          <el-table-column
            label="24H獎勵"
            align="center"
            prop="totalRewards24h"
            :show-overflow-tooltip="true"
            sortable="custom"
            width="120"
          />
          <el-table-column
            label="幸運值"
            align="center"
            prop="luckyValue24h"
            :show-overflow-tooltip="true"
            sortable="custom"
            width="120"
          /><el-table-column
            label="总奖励"
            align="center"
            prop="rewardValue"
            :show-overflow-tooltip="true"
            sortable="custom"
            width="120"
          /><el-table-column
            label="最后分币前转出数量"
            align="center"
            prop="hasTransfer"
            :show-overflow-tooltip="true"
            width="120"
          />
          <el-table-column
            label="充值數量"
            align="center"
            prop="receiveAmount"
            :show-overflow-tooltip="true"
            sortable="custom"
            width="120"
          /><el-table-column
            label="销毁數量"
            align="center"
            prop="burnAmount"
            :show-overflow-tooltip="true"
            sortable="custom"
            width="120"
          />
          <el-table-column
            label="提現數量"
            align="center"
            prop="sendAmount"
            :show-overflow-tooltip="true"
            sortable="custom"
            width="120"
          /><el-table-column
            label="創建時間"
            align="center"
            prop="createTime"
            :show-overflow-tooltip="true"
            width="120"
          /><el-table-column
            label="結束時間"
            align="center"
            prop="endTime"
            :show-overflow-tooltip="true"
            sortable="custom"
            width="120"
          />
          <el-table-column label="操作" align="center" width="120" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button
                v-permisaction="['admin:financeType:edit']"
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
              >修改</el-button>
              <el-popconfirm
                class="delete-popconfirm"
                title="确认要删除吗?"
                confirm-button-text="删除"
                @onConfirm="handleDelete(scope.row)"
              >
                <el-button
                  slot="reference"
                  v-permisaction="['admin:filNodes:remove']"
                  size="mini"
                  type="text"
                  icon="el-icon-delete"
                >删除
                </el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>

        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="queryParams.pageIndex"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
        />

        <!-- 添加或修改对话框 -->
        <el-dialog :title="title" :visible.sync="open" width="600px">
          <el-form ref="form" :model="form" :rules="rules" label-width="100px">

            <el-form-item label="账户名称" prop="node">
              <el-input
                v-model="form.node"
                placeholder="账户名称"
              />
            </el-form-item>
            <el-form-item label="所属账户" prop="msigNode">
              <el-select
                v-model="form.msigNode"
                placeholder="请选择"
              >
                <el-option
                  v-for="dict in msigNodeOptions"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="状态" prop="status">
              <el-select
                v-model="form.status"
                placeholder="请选择"
              >
                <el-option
                  v-for="dict in statusOptions"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="类型" prop="type">
              <el-select
                v-model="form.type"
                placeholder="请选择"
              >
                <el-option
                  v-for="dict in typeOptions"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="地址" prop="address">
              <el-input
                v-model="form.address"
                placeholder="地址"
              />
            </el-form-item>
            <el-form-item label="收益比例" prop="distributePoint">
              <el-input
                v-model="form.distributePoint"
                placeholder="收益比例"
              />
            </el-form-item>
            <el-form-item label="转出数量" prop="hasTransfer">
              <el-input
                v-model="form.hasTransfer"
                placeholder="转出数量"
              />
            </el-form-item>
            <el-form-item label="收益数量" prop="hasRealDistribute">
              <el-input
                v-model="form.hasRealDistribute"
                placeholder="收益数量"
              />
            </el-form-item>
            <el-form-item label="上次质押" prop="lastSectorPledgeBalance">
              <el-input
                v-model="form.lastSectorPledgeBalance"
                placeholder="上次质押"
              />
            </el-form-item>
            <el-form-item label="最后分币时间" prop="lastDistributeTime">
              <el-date-picker
                v-model="form.lastDistributeTime"
                size="small"
                type="datetime"
                placeholder="选择日期"
              />
            </el-form-item>
            <el-form-item label="结束时间" prop="endTime">
              <el-date-picker
                v-model="form.endTime"
                size="small"
                type="datetime"
                placeholder="选择日期"
              />
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="submitForm">确 定</el-button>
            <el-button @click="cancel">取 消</el-button>
          </div>
        </el-dialog>
      </el-card>
    </template>
  </BasicLayout>
</template>

<script>
import { addFilNodes, delFilNodes, getFilNodes, listFilNodes, updateFilNodes, exportFilNodes } from '@/api/fil-pool/nodes'

export default {
  name: 'FilNodes',
  components: {
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      isEdit: false,
      // 类型数据字典
      typeOptions: [],
      filNodesList: [],
      lastDistributeTime: '',
      msigNodeOptions: [
        {
          value: 'f01900855',
          label: 'f01900855'
        },
        {
          value: 'f02088713',
          label: 'f02088713'
        },
        {
          value: 'f02362285',
          label: 'f02362285'
        },
        {
          value: 'f02837885',
          label: 'f02837885'
        }
      ],
      statusOptions: [],

      // 关系表类型

      // 查询参数
      queryParams: {
        pageIndex: 1,
        pageSize: 100,
        node: undefined,
        msigNode: undefined,
        type: undefined,
        sectorSize: undefined

      },
      // 表单参数
      form: {
      },
      // 表单校验
      rules: { node: [{ required: true, message: '账户名称不能为空', trigger: 'blur' }],
        msigNode: [{ required: true, message: '所属地址不能为空', trigger: 'blur' }],
        type: [{ required: true, message: '节点类型不能为空', trigger: 'blur' }],
        sectorSize: [{ required: true, message: '扇区大小不能为空', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getList()
    this.getDicts('fil_node_status').then(response => {
      this.statusOptions = response.data
    })
    this.getDicts('fil_node_type').then(response => {
      this.typeOptions = response.data
    })
  },
  methods: {
    /** 查询参数列表 */
    getList() {
      this.loading = true
      listFilNodes(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
        this.filNodesList = response.data.list
        this.total = response.data.count
        this.loading = false
      }
      )
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    // 表单重置
    reset() {
      this.form = {

        id: undefined,
        node: undefined,
        msigNode: undefined,
        address: undefined
      }
      this.resetForm('form')
    },
    /** 排序回调函数 */
    handleSortChang(column, prop, order) {
      prop = column.prop
      order = column.order
      if (this.order !== '' && this.order !== prop + 'Order') {
        this.queryParams[this.order] = undefined
      }
      if (order === 'descending') {
        this.queryParams[prop + 'Order'] = 'desc'
        this.order = prop + 'Order'
      } else if (order === 'ascending') {
        this.queryParams[prop + 'Order'] = 'asc'
        this.order = prop + 'Order'
      } else {
        this.queryParams[prop + 'Order'] = undefined
      }
      this.getList()
    },
    getImgList: function() {
      this.form[this.fileIndex] = this.$refs['fileChoose'].resultList[0].fullUrl
    },
    fileClose: function() {
      this.fileOpen = false
    },
    // 关系
    // 文件
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageIndex = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = []
      this.resetForm('queryForm')
      this.handleQuery()
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.open = true
      this.title = '添加FilNodes'
      this.isEdit = false
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const id =
                row.id || this.ids
      getFilNodes(id).then(response => {
        this.form = response.data
        this.open = true
        this.title = '修改FilNodes'
        this.isEdit = true
      })
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.id !== undefined) {
            updateFilNodes(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess(response.msg)
                this.open = false
                this.getList()
              } else {
                this.msgError(response.msg)
              }
            })
          } else {
            addFilNodes(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess(response.msg)
                this.open = false
                this.getList()
              } else {
                this.msgError(response.msg)
              }
            })
          }
        }
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      var Ids = (row.id && [row.id]) || this.ids

      this.$confirm('是否确认删除编号为"' + Ids + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return delFilNodes({ 'ids': Ids })
      }).then((response) => {
        if (response.code === 200) {
          this.msgSuccess(response.msg)
          this.open = false
          this.getList()
        } else {
          this.msgError(response.msg)
        }
      }).catch(function() {
      })
    },
    /** 导出按钮操作 */
    handleExport() {
      this.$confirm('是否确认导出当前数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.downloadLoading = true
        return exportFilNodes(this.addDateRange(this.queryParams, this.dateRange))
      }).then((response) => {
        if (response.code === 200) {
          this.msgSuccess(response.msg)
          this.open = false
          this.getList()
        } else {
          this.msgError(response.msg)
        }
      }).catch(function() {
      })
    }
  }
}
</script>
