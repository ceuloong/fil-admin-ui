
<template>
  <BasicLayout>
    <template #wrapper>
      <el-card class="box-card">
        <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="68px">
          <el-form-item label="节点名称" prop="node"><el-input
            v-model="queryParams.node"
            placeholder="请输入节点名称"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
          </el-form-item>
          <el-form-item label="接收地址" prop="addressTo"><el-input
            v-model="queryParams.addressTo"
            placeholder="请输入接收地址"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
          </el-form-item>
          <el-form-item label="类型" prop="type">
            <el-select
              v-model="queryParams.type"
              placeholder="类型"
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
          <el-form-item label="分币状态" prop="status">
            <el-select
              v-model="queryParams.status"
              placeholder="分币状态"
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

          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              v-permisaction="['admin:filDistribution:add']"
              type="primary"
              icon="el-icon-plus"
              size="mini"
              @click="handleAdd"
            >生成记录
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              v-permisaction="['admin:filDistribution:send']"
              type="success"
              icon="el-icon-edit"
              size="mini"
              :disabled="single"
              @click="handleUpdateStatus"
            >一键分币
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

        <el-table v-loading="loading" :data="filDistributionList" border @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" align="center" /><el-table-column
            label="节点名称"
            align="center"
            prop="node"
            :show-overflow-tooltip="true"
          /><el-table-column
            label="节点类型"
            align="center"
            prop="filNode.type"
            :show-overflow-tooltip="true"
          /><el-table-column
            label="可用余额"
            align="center"
            prop="availableBalance"
            :show-overflow-tooltip="true"
          /><el-table-column
            label="转币数量"
            align="center"
            prop="hasTransfer"
            :show-overflow-tooltip="true"
          /><el-table-column
            label="分成比例"
            align="center"
            prop="distributePoint"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              {{ towNumber(scope.row.distributePoint*100) }}%
            </template>
          </el-table-column>
          <el-table-column
            label="上期质押"
            align="center"
            prop="lastSectorPledge"
            :show-overflow-tooltip="true"
          /><el-table-column
            label="本期质押"
            align="center"
            prop="curSectorPledge"
            :show-overflow-tooltip="true"
          /><el-table-column
            label="参与分币数量=转币数量-(上期质押-本期质押)"
            align="center"
            prop="effectAmount"
            :show-overflow-tooltip="true"
          /><el-table-column
            label="应分币数量"
            align="center"
            prop="distributeAmount"
            :show-overflow-tooltip="true"
          /><el-table-column
            label="接收地址"
            align="center"
            prop="addressTo"
            :show-overflow-tooltip="true"
          /><el-table-column
            label="分币状态"
            align="center"
            prop="status"
            :show-overflow-tooltip="true"
          />
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button
                slot="reference"
                v-permisaction="['admin:filDistribution:edit']"
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleUpdateStatus(scope.row)"
              >分币
              </el-button>
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
        <el-dialog :title="title" :visible.sync="open" width="500px">
          <el-form ref="form" :model="form" :rules="rules" label-width="80px">

            <el-form-item label="节点名称" prop="node">
              <el-input
                v-model="form.node"
                placeholder="节点名称"
              />
            </el-form-item>
            <el-form-item label="总奖励数" prop="totalReward">
              <el-input
                v-model="form.totalReward"
                placeholder="总奖励数"
              />
            </el-form-item>
            <el-form-item label="提供存储锁仓" prop="vestingFunds">
              <el-input
                v-model="form.vestingFunds"
                placeholder="提供存储锁仓"
              />
            </el-form-item>
            <el-form-item label="当前释放数量" prop="curReleaseAmount">
              <el-input
                v-model="form.curReleaseAmount"
                placeholder="当前释放数量"
              />
            </el-form-item>
            <el-form-item label="上期释放数量" prop="lastReleaseAmount">
              <el-input
                v-model="form.lastReleaseAmount"
                placeholder="上期释放数量=(上一次的记录 总奖励数-提供存储锁仓)"
              />
            </el-form-item>
            <el-form-item label="分成比例" prop="rewardPoint">
              <el-input
                v-model="form.rewardPoint"
                placeholder="分成比例"
              />
            </el-form-item>
            <el-form-item label="上期质押数量" prop="lastSectorPledge">
              <el-input
                v-model="form.lastSectorPledge"
                placeholder="上期质押数量"
              />
            </el-form-item>
            <el-form-item label="当前质押数量" prop="curSectorPledge">
              <el-input
                v-model="form.curSectorPledge"
                placeholder="当前质押数量"
              />
            </el-form-item>
            <el-form-item label="参与分币数量=总奖励数-提供存储锁仓-上期释放数量" prop="effectAmount">
              <el-input
                v-model="form.effectAmount"
                placeholder="参与分币数量=总奖励数-提供存储锁仓-上期释放数量"
              />
            </el-form-item>
            <el-form-item label="应该分币数量" prop="distributeAmount">
              <el-input
                v-model="form.distributeAmount"
                placeholder="应该分币数量"
              />
            </el-form-item>
            <el-form-item label="已经分币数量" prop="hasDistributeAmount">
              <el-input
                v-model="form.hasDistributeAmount"
                placeholder="已经分币数量"
              />
            </el-form-item>
            <el-form-item label="实际已经分币数量" prop="hasRealDistributeAmount">
              <el-input
                v-model="form.hasRealDistributeAmount"
                placeholder="实际已经分币数量"
              />
            </el-form-item>
            <el-form-item label="发送地址" prop="addressFrom">
              <el-input
                v-model="form.addressFrom"
                placeholder="发送地址"
              />
            </el-form-item>
            <el-form-item label="接收地址" prop="addressTo">
              <el-input
                v-model="form.addressTo"
                placeholder="接收地址"
              />
            </el-form-item>
            <el-form-item label="分币状态" prop="status">
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
import { addFilDistribution, delFilDistribution, getFilDistribution, listFilDistribution, updateFilDistribution, exportFilDistribution, dealFilDistribution } from '@/api/fil-pool/distribution.js'

export default {
  name: 'FilDistribution',
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
      statusOptions: [],
      filDistributionList: [],

      // 关系表类型

      // 查询参数
      queryParams: {
        pageIndex: 1,
        pageSize: 50,
        node: undefined,
        addressFrom: undefined,
        addressTo: undefined,
        status: undefined,
        nodeIds: undefined
      },
      // 表单参数
      form: {
      },
      // 表单校验
      rules: { node: [{ required: true, message: '节点名称不能为空', trigger: 'blur' }],
        addressFrom: [{ required: true, message: '发送地址不能为空', trigger: 'blur' }],
        addressTo: [{ required: true, message: '接收地址不能为空', trigger: 'blur' }],
        status: [{ required: true, message: '分币状态不能为空', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getList()
    this.getDicts('fil_distribute_status').then(response => {
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
      listFilDistribution(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
        this.filDistributionList = response.data.list
        this.total = response.data.count
        this.loading = false
      }
      )
    },
    towNumber(val) {
      return Number(val).toFixed(0)
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
        rewardPoint: undefined,
        lastSectorPledge: undefined,
        curSectorPledge: undefined,
        effectAmount: undefined,
        distributeAmount: undefined,
        hasDistributeAmount: undefined,
        hasRealDistributeAmount: undefined,
        addressFrom: undefined,
        addressTo: undefined,
        status: undefined
      }
      this.resetForm('form')
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
    /** 生成分币记录 */
    handleAdd() {
      this.loading = true
      addFilDistribution().then(response => {
        if (response.code === 200) {
          this.msgSuccess(response.msg)
          this.open = false
          this.getList()
        } else {
          this.msgError(response.msg)
        }
      })
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.nodeId)
      this.single = selection.length < 1
      this.multiple = !selection.length
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const id =
                row.id || this.ids
      getFilDistribution(id).then(response => {
        this.form = response.data
        this.open = true
        this.title = '修改挖矿收益分币记录'
        this.isEdit = true
      })
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.id !== undefined) {
            updateFilDistribution(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess(response.msg)
                this.open = false
                this.getList()
              } else {
                this.msgError(response.msg)
              }
            })
          } else {
            addFilDistribution(this.form).then(response => {
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
      var Ids = (row.nodeId && [row.nodeId]) || this.ids

      this.$confirm('是否确认删除编号为"' + Ids + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return delFilDistribution({ 'ids': Ids })
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
    /** 一键分币按钮操作 */
    handleUpdateStatus(row) {
      var Ids = (row.nodeId && [row.nodeId]) || this.ids

      this.$confirm('是否确认执行矿工编号为"' + Ids + '"的分币操作?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.downloadLoading = true
        return dealFilDistribution({ 'ids': Ids })
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
      this.$confirm('是否确认导出所有数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.downloadLoading = true
        return exportFilDistribution(this.addDateRange(this.queryParams, this.dateRange))
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
