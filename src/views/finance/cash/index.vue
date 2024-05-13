
<template>
  <BasicLayout>
    <template #wrapper>
      <el-card class="box-card">
        <el-row :gutter="20">
          <!--类型数据-->
          <el-col :span="4" :xs="24">
            <div class="head-container">
              <el-input
                v-model="name"
                placeholder="请输入收支名称"
                clearable
                size="small"
                prefix-icon="el-icon-search"
                style="margin-bottom: 20px"
              />
            </div>
            <div class="head-container">
              <el-tree
                ref="tree"
                :data="typesOptions"
                :props="defaultProps"
                :expand-on-click-node="false"
                :filter-node-method="filterNode"
                default-expand-all
                @node-click="handleNodeClick"
              />
            </div>
          </el-col>
          <el-col :span="20" :xs="24">
            <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="68px">
              <el-form-item label="货币名称" prop="name"><el-input
                v-model="queryParams.name"
                placeholder="请输入货币名称"
                clearable
                size="small"
                @keyup.enter.native="handleQuery"
              />
              </el-form-item>
              <el-form-item label="备注" prop="memo"><el-input
                v-model="queryParams.memo"
                placeholder="请输入备注"
                clearable
                size="small"
                @keyup.enter.native="handleQuery"
              />
              </el-form-item>
              <el-form-item label="员工名称" prop="employee"><el-input
                v-model="queryParams.employee"
                placeholder="请输入员工名称"
                clearable
                size="small"
                @keyup.enter.native="handleQuery"
              />
              </el-form-item>
              <el-form-item label="账户类型" prop="dictId">
                <el-select
                  v-model="queryParams.dictId"
                  placeholder="账户类型"
                  clearable
                  size="small"
                  style="width: 160px"
                >
                  <el-option
                    v-for="dict in dictIdOptions"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="创建时间">
                <el-date-picker
                  v-model="dateRange"
                  size="small"
                  type="datetimerange"
                  :picker-options="pickerOptions"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  align="right"
                  value-format="yyyy-MM-dd HH:mm:ss"
                />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
              </el-form-item>
            </el-form>

            <el-row :gutter="10" class="mb8">
              <el-col :span="1.5">
                <el-button
                  v-permisaction="['admin:financeCash:add']"
                  type="primary"
                  icon="el-icon-plus"
                  size="mini"
                  @click="handleAdd"
                >新增
                </el-button>
              </el-col>
              <el-col :span="1.5">
                <el-button
                  v-permisaction="['admin:financeCash:edit']"
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
                  v-permisaction="['admin:financeCash:remove']"
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
                  v-permisaction="['admin:financeCash:export']"
                  type="warning"
                  icon="el-icon-download"
                  size="mini"
                  @click="handleExport"
                >导出</el-button>
              </el-col>
            </el-row>

            <el-table v-loading="loading" :data="financeCashList" border @selection-change="handleSelectionChange">
              <el-table-column type="selection" width="55" align="center" /><el-table-column
                label="货币名称"
                align="center"
                prop="name"
                :show-overflow-tooltip="true"
              /><el-table-column
                label="金额"
                align="center"
                prop="amount"
                :show-overflow-tooltip="true"
              /><el-table-column
                label="余额"
                align="center"
                prop="balance"
                :show-overflow-tooltip="true"
              /><el-table-column
                label="收支类型"
                prop="type.name"
                :show-overflow-tooltip="true"
              /><el-table-column
                label="备注"
                align="center"
                prop="memo"
                :show-overflow-tooltip="true"
                width="300"
              /><el-table-column
                label="员工名称"
                align="center"
                prop="employee"
                :show-overflow-tooltip="true"
              /><el-table-column
                label="交易时间"
                align="center"
                prop="publishAt"
                :show-overflow-tooltip="true"
              >
                <template slot-scope="scope">
                  <span>{{ parseTime(scope.row.publishAt) }}</span>
                </template>
              </el-table-column>
              <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                  <el-button
                    v-permisaction="['finance:financeCash:edit']"
                    size="mini"
                    type="text"
                    icon="el-icon-edit"
                    @click="handleUpdate(scope.row)"
                  >修改</el-button>
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
          </el-col>
        </el-row>
      </el-card>
      <!-- 添加或修改对话框 -->
      <el-dialog :title="title" :visible.sync="open" width="500px">
        <el-form ref="form" :model="form" :rules="rules" label-width="80px">

          <el-form-item label="货币名称" prop="name">
            <el-input
              v-model="form.name"
              placeholder="货币名称"
            />
          </el-form-item>
          <el-form-item label="账户类型" prop="dictId">
            <el-select
              v-model="form.dictId"
              placeholder="账户类型"
              clearable
              size="small"
              style="width: 160px"
            >
              <el-option
                v-for="dict in dictIdOptions"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="金额" prop="amount">
            <el-input
              v-model="form.amount"
              placeholder="金额"
            />
          </el-form-item>
          <el-form-item label="收支类型" prop="typeId">
            <treeselect
              v-model="form.typeId"
              :options="typesOptions"
              placeholder="请选择收支类型"
            />
          </el-form-item>
          <el-form-item label="备注" prop="memo">
            <el-input
              v-model="form.memo"
              placeholder="备注"
            />
          </el-form-item>
          <el-form-item label="员工名称" prop="employee">
            <el-input
              v-model="form.employee"
              placeholder="员工名称"
            />
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
          <el-form-item label="交易时间" prop="publishAt">
            <el-date-picker
              v-model="form.publishAt"
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
    </template>
  </BasicLayout>
</template>

<script>
import { addFinanceCash, delFinanceCash, getFinanceCash, listFinanceCash, updateFinanceCash, exportFinanceCash } from '@/api/finance/finance-cash'
import { treeselect } from '@/api/finance/finance-type'

import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

export default {
  name: 'FinanceCash',
  components: { Treeselect },
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
      typesOptions: [],
      // 日期范围
      dateRange: [],
      statusOptions: [
        {
          value: '1',
          label: '未支付'
        },
        {
          value: '2',
          label: '已支付'
        }
      ],
      dictIdOptions: [],
      financeCashList: [],

      // 查询参数
      queryParams: {
        pageIndex: 1,
        pageSize: 20,
        name: undefined,
        amount: undefined,
        type: undefined,
        memo: undefined,
        employee: undefined,
        status: undefined

      },
      // 表单参数
      form: {
      },
      // 表单校验
      rules: { name: [{ required: true, message: '货币名称不能为空', trigger: 'blur' }],
        amount: [{ required: true, message: '金额不能为空', trigger: 'blur' }],
        type: [{ required: true, message: '收支类型不能为空', trigger: 'blur' }],
        dictId: [{ required: true, message: '账户类型不能为空', trigger: 'blur' }],
        memo: [{ required: true, message: '备注不能为空', trigger: 'blur' }],
        employee: [{ required: false, message: '员工名称不能为空', trigger: 'blur' }],
        status: [{ required: true, message: '状态不能为空', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getList()
    this.getTreeselect()
    this.getDicts('finance_account_type').then(response => {
      this.dictIdOptions = response.data
    })
  },
  methods: {
    /** 查询参数列表 */
    getList() {
      this.loading = true
      listFinanceCash(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
        this.financeCashList = response.data.list
        this.total = response.data.count
        this.loading = false
      }
      )
    },
    /** 查询收支类型树结构 */
    getTreeselect() {
      treeselect().then(response => {
        this.typesOptions = response.data
      })
    },
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    // 节点单击事件
    handleNodeClick(data) {
      this.queryParams.typeId = '/' + data.id + '/'
      this.getList()
    },
    /** 转换菜单数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children
      }
      return {
        id: node.id,
        label: node.label,
        children: node.children
      }
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
        name: undefined,
        amount: undefined,
        typeId: undefined,
        memo: undefined,
        employee: undefined,
        status: undefined,
        publishAt: undefined
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
      this.queryParams.typeId = ''
      this.handleQuery()
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.open = true
      this.title = '添加现金收支明细'
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
      getFinanceCash(id).then(response => {
        this.form = response.data
        this.open = true
        this.title = '修改现金收支明细'
        this.isEdit = true
      })
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.id !== undefined) {
            updateFinanceCash(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess(response.msg)
                this.open = false
                this.getList()
              } else {
                this.msgError(response.msg)
              }
            })
          } else {
            addFinanceCash(this.form).then(response => {
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
        return delFinanceCash({ 'ids': Ids })
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
        return exportFinanceCash(this.addDateRange(this.queryParams, this.dateRange))
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
