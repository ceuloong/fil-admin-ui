
<template>
  <BasicLayout>
    <template #wrapper>
      <el-card class="box-card">
        <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="68px">
          <el-form-item label="账户名称" prop="node"><el-input
            v-model="queryParams.node"
            placeholder="请输入账户名称"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
          </el-form-item>
          <el-form-item v-if="roleId == 1" label="所属账户" prop="msigNode">
            <el-select
              v-model="queryParams.msigNode"
              placeholder="所属账户"
              clearable
              size="small"
              style="width: 160px"
            >
              <el-option
                v-for="dict in searchMsigNodeOptions"
                :key="dict.address"
                :label="dict.address"
                :value="dict.address"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="控制地址" prop="node"><el-input
            v-model="queryParams.controlAddress"
            placeholder="请输入控制地址"
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

        <el-table
          v-loading="loading"
          :data="filNodesList"
          border
          @selection-change="handleSelectionChange"
          @sort-change="handleSortChang"
        >
          <el-table-column type="selection" width="55" align-items="center" />
          <el-table-column label="MinerID" align="center" prop="node" sortable="custom" />
          <el-table-column label="Owner" align="center" prop="msigNode" sortable="custom" />
          <el-table-column
            label="有效算力(PiB)"
            align="center"
            prop="qualityAdjPower"
            :show-overflow-tooltip="true"
            sortable="custom"
          /><el-table-column
            label="扇区大小"
            align="center"
            prop="sectorSize"
            :show-overflow-tooltip="true"
            sortable="custom"
          /><el-table-column
            :el-col="2"
            label="扇区状态"
            prop="sectorStatus"
            :show-overflow-tooltip="true"
            width="400"
          /><el-table-column
            :el-col="2"
            label="算力曲线"
            prop="sectorSize"
            :show-overflow-tooltip="true"
          /><el-table-column
            label="控制余额"
            align="center"
            prop="controlBalance"
            :show-overflow-tooltip="true"
            sortable="custom"
          />
          <el-table-column
            label="结束时间"
            align="center"
            prop="endTime"
            :show-overflow-tooltip="true"
            sortable="custom"
          >
            <template slot-scope="scope">
              <div :style="{ color: scope.row.tag }">
                {{ formatDate(scope.row.endTime) }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button
                slot="reference"
                v-permisaction="['admin:filNodes:edit']"
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleUpdate"
              >修改
              </el-button>
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

      </el-card>
    </template>
  </BasicLayout>
</template>

<script>
import { getFilNodes, listFilNodes } from '@/api/fil-pool/nodes'
import { listFilMsig } from '@/api/fil-pool/fil-msig'

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
      searchMsigNodeOptions: [

      ],
      roleId: '',

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
    if (this.roleId === 1) {
      listFilMsig().then(response => {
        this.searchMsigNodeOptions = response.data.list
      })
    }
  },
  methods: {
    /** 查询参数列表 */
    getList() {
      this.loading = true
      listFilNodes(this.queryParams).then(response => {
        this.filNodesList = response.data.list.nodesList
        this.roleId = response.data.list.roleId
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
    // 方法区
    formatDate(data) {
      // 获取单元格数据
      // const data = row[column.property]
      if (data == null) {
        return 'null'
      }
      const dt = new Date(data)
      return dt.getFullYear() + '/' + (dt.getMonth() + 1) + '/' + dt.getDate() // + ' ' + dt.getHours() + ':' + dt.getMinutes() + ':' + dt.getSeconds()
    }
  }
}
</script>
