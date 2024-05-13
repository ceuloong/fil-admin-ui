
<template>
  <BasicLayout>
    <template #wrapper>
      <el-card class="box-card">
        <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="68px">
          <el-form-item label="Miner" prop="node"><el-input
            v-model="queryParams.node"
            placeholder="请输入Miner"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
          </el-form-item>
          <el-form-item label="创建时间">
            <el-date-picker
              v-model="queryParams.lastTime"
              size="small"
              type="datetime"
              placeholder="选择日期"
              :picker-options="pickerOptions"
              align="right"
              format="yyyy-MM-dd HH:mm"
              value-format="yyyy-MM-dd HH:mm:ss"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>

        <el-table v-loading="loading" :data="nodesChartList" border @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" align="center" /><el-table-column
            label="MinerID"
            align="center"
            prop="node"
            :show-overflow-tooltip="true"
          /><el-table-column
            label="算力(PiB)"
            align="center"
            prop="qualityAdjPower"
            :show-overflow-tooltip="true"
          /><el-table-column
            label="可用余额"
            align="center"
            prop="availableBalance"
            :show-overflow-tooltip="true"
          /><el-table-column
            label="账户余额"
            align="center"
            prop="balance"
            :show-overflow-tooltip="true"
          /><el-table-column
            label="质押数量"
            align="center"
            prop="sectorPledgeBalance"
            :show-overflow-tooltip="true"
          /><el-table-column
            label="存储锁仓"
            align="center"
            prop="vestingFunds"
            :show-overflow-tooltip="true"
          /><el-table-column
            label="快照时间"
            align="center"
            prop="lastTime"
            :show-overflow-tooltip="false"
            width="120"
          >
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.lastTime) }}</span>
            </template>
          </el-table-column><el-table-column
            label="总奖励"
            align="center"
            prop="rewardValue"
            :show-overflow-tooltip="true"
          /><el-table-column
            label="控制余额"
            align="center"
            prop="controlBalance"
            :show-overflow-tooltip="true"
          />
        </el-table>

        <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="queryParams.pageIndex"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
        />
      </el-card>
    </template>
  </BasicLayout>
</template>

<script>
import { addNodesChart, delNodesChart, getNodesChart, listNodesChart, updateNodesChart } from '@/api/fil-pool/nodes-chart'

export default {
  name: 'NodesChart',
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
      nodesChartList: [],

      // 关系表类型

      // 查询参数
      queryParams: {
        pageIndex: 1,
        pageSize: 50,
        node: undefined,
        lastTime: ''
      },
      // 表单参数
      form: {
      },
      // 表单校验
      rules: {
        node: [{ required: true, message: 'Miner不能为空', trigger: 'blur' }]
      },
      pickerOptions: {
        disabledTime(time) {
          // 这里假设我们只允许选择 10:00, 16:00 这两个时间点
          const hours = time.getHours()
          const minutes = time.getMinutes()

          // 忽略秒数，只比较小时和分钟
          const allowedTimes = [
            { hours: 10, minutes: 0 },
            { hours: 16, minutes: 0 }
          ]

          return !allowedTimes.some(allowedTime => {
            return hours === allowedTime.hours && minutes === allowedTime.minutes
          })
        }
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    /** 查询参数列表 */
    getList() {
      this.loading = true
      listNodesChart(this.queryParams).then(response => {
        this.nodesChartList = response.data.list
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

        id: undefined
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
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.open = true
      this.title = '添加NodesChart'
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
      getNodesChart(id).then(response => {
        this.form = response.data
        this.open = true
        this.title = '修改NodesChart'
        this.isEdit = true
      })
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.id !== undefined) {
            updateNodesChart(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess(response.msg)
                this.open = false
                this.getList()
              } else {
                this.msgError(response.msg)
              }
            })
          } else {
            addNodesChart(this.form).then(response => {
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
        return delNodesChart({ 'ids': Ids })
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
