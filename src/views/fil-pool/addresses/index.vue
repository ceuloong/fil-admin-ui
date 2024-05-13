
<template>
  <BasicLayout>
    <template #wrapper>
      <el-card class="box-card">
        <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="68px">
          <el-form-item label="Node" prop="node"><el-input
            v-model="queryParams.node"
            placeholder="请输入"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
          </el-form-item>
          <el-form-item label="AccountId" prop="accountId"><el-input
            v-model="queryParams.accountId"
            placeholder="请输入"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
          </el-form-item>
          <el-form-item label="地址" prop="address"><el-input
            v-model="queryParams.address"
            placeholder="请输入"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
          </el-form-item>
          <el-form-item label="类型" prop="type"><el-input
            v-model="queryParams.type"
            placeholder="请输入类型"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
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
              v-permisaction="['admin:filAddresses:add']"
              type="primary"
              icon="el-icon-plus"
              size="mini"
              @click="handleAdd"
            >新增
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              v-permisaction="['admin:filAddresses:edit']"
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
              v-permisaction="['admin:filAddresses:remove']"
              type="danger"
              icon="el-icon-delete"
              size="mini"
              :disabled="multiple"
              @click="handleDelete"
            >删除
            </el-button>
          </el-col>
        </el-row>

        <el-table
          v-loading="loading"
          :data="filAddressesList"
          border
          @selection-change="handleSelectionChange"
          @sort-change="handleSortChang"
        >
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column
            label="所属Node"
            align="center"
            prop="node"
            :show-overflow-tooltip="true"
            width="100"
          /><el-table-column
            label="账号ID"
            align="center"
            prop="accountId"
            :show-overflow-tooltip="true"
            width="100"
          /><el-table-column
            label="地址"
            align="center"
            prop="address"
            :show-overflow-tooltip="false"
            width="200"
          /><el-table-column
            label="余额"
            align="center"
            prop="balance"
            :show-overflow-tooltip="true"
            sortable="custom"
            width="120"
          /><el-table-column
            label="类型"
            align="center"
            prop="type"
            :show-overflow-tooltip="true"
            width="100"
          /><el-table-column
            label="创建时间"
            align="center"
            prop="createTime"
            :show-overflow-tooltip="false"
            width="120"
          >
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.createTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="最后交易时间"
            align="center"
            prop="lastTransferTime"
            :show-overflow-tooltip="false"
            width="130"
            sortable="custom"
          >
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.lastTransferTime) }}</span>
            </template>
          </el-table-column><el-table-column
            label="Nonce"
            align="center"
            prop="nonce"
            :show-overflow-tooltip="true"
          /><el-table-column
            label="接收数量"
            align="center"
            prop="receiveAmount"
            :show-overflow-tooltip="true"
            width="120"
          /><el-table-column
            label="销毁数量"
            align="center"
            prop="burnAmount"
            :show-overflow-tooltip="true"
            width="120"
            sortable="custom"
          /><el-table-column
            label="发送数量"
            align="center"
            prop="sendAmount"
            :show-overflow-tooltip="true"
            width="120"
          /><el-table-column
            label="TransferCount"
            align="center"
            prop="transferCount"
            :show-overflow-tooltip="true"
          /><el-table-column
            label="状态"
            align="center"
            prop="status"
            :show-overflow-tooltip="true"
          />
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-popconfirm
                class="delete-popconfirm"
                title="确认要修改吗?"
                confirm-button-text="修改"
                @onConfirm="handleUpdate(scope.row)"
              >
                <el-button
                  slot="reference"
                  v-permisaction="['admin:filAddresses:edit']"
                  size="mini"
                  type="text"
                  icon="el-icon-edit"
                >修改
                </el-button>
              </el-popconfirm>
              <el-popconfirm
                class="delete-popconfirm"
                title="确认要删除吗?"
                confirm-button-text="删除"
                @onConfirm="handleDelete(scope.row)"
              >
                <el-button
                  slot="reference"
                  v-permisaction="['admin:filAddresses:remove']"
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
        <el-dialog :title="title" :visible.sync="open" width="500px">
          <el-form ref="form" :model="form" :rules="rules" label-width="80px">

            <el-form-item label="" prop="node">
              <el-input
                v-model="form.node"
                placeholder=""
              />
            </el-form-item>
            <el-form-item label="" prop="address">
              <el-input
                v-model="form.address"
                placeholder=""
              />
            </el-form-item>
            <el-form-item label="controller, worker, other" prop="type">
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
            <el-form-item label="地址创建时间" prop="createTime">
              <el-date-picker
                v-model="form.createTime"
                type="datetime"
                placeholder="选择日期"
              />
            </el-form-item>
            <el-form-item label="" prop="accountType">
              <el-input
                v-model="form.accountType"
                placeholder=""
              />
            </el-form-item>
            <el-form-item label="最后交易时间" prop="lastTransferTime">
              <el-date-picker
                v-model="form.lastTransferTime"
                type="datetime"
                placeholder="选择日期"
              />
            </el-form-item>
            <el-form-item label="" prop="nonce">
              <el-input
                v-model="form.nonce"
                placeholder=""
              />
            </el-form-item>
            <el-form-item label="总的接收数量" prop="receiveAmount">
              <el-input
                v-model="form.receiveAmount"
                placeholder="总的接收数量"
              />
            </el-form-item>
            <el-form-item label="总的销毁数量" prop="burnAmount">
              <el-input
                v-model="form.burnAmount"
                placeholder="总的销毁数量"
              />
            </el-form-item>
            <el-form-item label="总的发送数量" prop="sendAmount">
              <el-input
                v-model="form.sendAmount"
                placeholder="总的发送数量"
              />
            </el-form-item>
            <el-form-item label="转账交易数量" prop="transferCount">
              <el-input
                v-model="form.transferCount"
                placeholder="转账交易数量"
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
import { addFilAddresses, delFilAddresses, getFilAddresses, listFilAddresses, updateFilAddresses } from '@/api/fil-pool/addresses'

export default {
  name: 'FilAddresses',
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
      filAddressesList: [],

      // 关系表类型

      // 查询参数
      queryParams: {
        pageIndex: 1,
        pageSize: 100,
        node: undefined,
        accountId: undefined,
        address: undefined,
        type: undefined,
        status: undefined

      },
      // 表单参数
      form: {
      },
      // 表单校验
      rules: { node: [{ required: true, message: '不能为空', trigger: 'blur' }],
        accountId: [{ required: true, message: '不能为空', trigger: 'blur' }],
        address: [{ required: true, message: '不能为空', trigger: 'blur' }],
        type: [{ required: true, message: 'controller, worker, other不能为空', trigger: 'blur' }],
        status: [{ required: true, message: '状态不能为空', trigger: 'blur' }]
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
      listFilAddresses(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
        this.filAddressesList = response.data.list
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
        address: undefined,
        type: undefined,
        createTime: undefined,
        accountType: undefined,
        lastTransferTime: undefined,
        nonce: undefined,
        receiveAmount: undefined,
        burnAmount: undefined,
        sendAmount: undefined,
        transferCount: undefined,
        status: undefined
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
      this.title = '添加FilAddresses'
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
      getFilAddresses(id).then(response => {
        this.form = response.data
        this.open = true
        this.title = '修改FilAddresses'
        this.isEdit = true
      })
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.id !== undefined) {
            updateFilAddresses(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess(response.msg)
                this.open = false
                this.getList()
              } else {
                this.msgError(response.msg)
              }
            })
          } else {
            addFilAddresses(this.form).then(response => {
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
        return delFilAddresses({ 'ids': Ids })
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
