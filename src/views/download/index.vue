
<template>
  <BasicLayout>
    <template #wrapper>
      <el-card class="box-card">
        <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="68px">
          <el-form-item label="文件名" prop="fileName"><el-input
            v-model="queryParams.node"
            placeholder="请输入文件名称"
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
          :data="fileList"
          border
          @selection-change="handleSelectionChange"
          @sort-change="handleSortChang"
        >
          <el-table-column type="selection" align="center" />
          <el-table-column label="文件名" width="100" align="center" prop="fileName" />
          <el-table-column
            label="創建時間"
            align="center"
            prop="createTime"
            :show-overflow-tooltip="true"
            width="120"
          />
          <el-table-column label="操作" align="center" width="120" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button
                v-permisaction="['admin:financeType:edit']"
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleDownload(scope.row)"
              >下载</el-button>
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
import { download } from '@/api/download'

export default {
  name: 'Download',
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
      fileList: [
        {
          fileName: 'fil_nodes.xlsx',
          createTime: ''
        }
      ],

      // 查询参数
      queryParams: {
        pageIndex: 1,
        pageSize: 100,
        fileName: undefined
      },
      // 表单参数
      form: {
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

    },
    // 表单重置
    reset() {
      this.form = {

        fileName: undefined

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
    /** 下载按钮操作 */
    handleDownload(row) {
      this.reset()
      const id =
                row.id || this.ids
      download(id).then(response => {
        this.form = response.data
        this.open = true
        this.title = '修改FilNodes'
        this.isEdit = true
      })
    }
  }
}
</script>
