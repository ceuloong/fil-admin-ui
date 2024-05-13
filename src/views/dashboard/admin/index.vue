<template>
  <div class="dashboard-editor-container">
    <el-row :gutter="12">
      <el-col :sm="24" :xs="24" :md="6" :xl="6" :lg="6" :style="{ marginBottom: '12px' }">
        <chart-card title="总算力" :total="qualityAdjPower">
          <el-tooltip slot="action" class="item" effect="dark" content="指标说明" placement="top-start">
            <i class="el-icon-warning-outline" />
          </el-tooltip>
          <div>
            <trend :flag="weekTop" style="margin-right: 16px;" :rate="weekIncrease">
              <span slot="term">周同比</span>
            </trend>
            <trend :flag="dayTop" :rate="dayIncrease">
              <span slot="term">日同比</span>
            </trend>
          </div>
          <template slot="footer">日均收益<span>{{ monthAvg }} FIL</span></template>
        </chart-card>
      </el-col>
      <el-col :sm="24" :xs="24" :md="6" :xl="6" :lg="6" :style="{ marginBottom: '12px' }">
        <chart-card title="账户余额" :total="balance">
          <el-tooltip slot="action" class="item" effect="dark" content="指标说明" placement="top-start">
            <i class="el-icon-warning-outline" />
          </el-tooltip>
          <div>
            <mini-area :list="balanceData" />
          </div>
          <template slot="footer">可用余额 <span> {{ availableBalance }} FIL</span></template>
        </chart-card>
      </el-col>
      <el-col :sm="24" :xs="24" :md="6" :xl="6" :lg="6" :style="{ marginBottom: '12px' }">
        <chart-card title="质押数量" :total="sectorPledgeBalance">
          <el-tooltip slot="action" class="item" effect="dark" content="指标说明" placement="top-start">
            <i class="el-icon-warning-outline" />
          </el-tooltip>
          <div>
            <mini-bar :list="sectorPledgeData" />
          </div>
          <template slot="footer">控制地址 <span>{{ controlBalance }} FIL</span></template>
        </chart-card>
      </el-col>
      <el-col :sm="24" :xs="24" :md="6" :xl="6" :lg="6" :style="{ marginBottom: '12px' }">
        <chart-card title="总奖励" :total="rewardValue">
          <el-tooltip slot="action" class="item" effect="dark" content="指标说明" placement="top-start">
            <i class="el-icon-warning-outline" />
          </el-tooltip>
          <div>
            <mini-progress color="rgb(19, 194, 194)" :target="80" :percentage="78" height="8px" />
          </div>
          <template slot="footer">存储锁仓 <span>{{ vestingFunds }} FIL</span></template>
        </chart-card>
      </el-col>
    </el-row>

    <el-card :bordered="false" :body-style="{padding: '0'}">
      <div class="salesCard">
        <el-tabs>
          <el-tab-pane label="算力曲线">
            <el-row>
              <el-col :xl="16" :lg="12" :md="12" :sm="24" :xs="24">
                <bar :list="barData" title="总算力" />
                <pie title="饼图" />
              </el-col>
              <el-col :xl="8" :lg="12" :md="12" :sm="24" :xs="24">
                <rank-list title="节点算力排行榜" :list="rankList" />
              </el-col>
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="控制余额曲线">
            <el-row>
              <el-col :xl="16" :lg="12" :md="12" :sm="24" :xs="24">
                <bar :list="barData2" title="总余额" />
              </el-col>
              <el-col :xl="8" :lg="12" :md="12" :sm="24" :xs="24">
                <rank-list title="控制余额排行榜" :list="controlList" />
              </el-col>
            </el-row>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-card>

  </div>
</template>

<script>
import { listPoolChart, getPoolChart, getRankList } from '@/api/dashboard'

import ChartCard from '@/components/ChartCard'
import Trend from '@/components/Trend'
import MiniArea from '@/components/MiniArea'
import MiniBar from '@/components/MiniBar'
import MiniProgress from '@/components/MiniProgress'
import RankList from '@/components/RankList/index'
import Bar from '@/components/Bar.vue'
import Pie from '@/components/Pie'

const barData = []
const barData2 = []
const balanceData = []
const sectorPledgeData = []
const rewardData = []
for (let i = 0; i < 20; i += 1) {
  barData2.push({
    x: `${i + 1}月`,
    y: Math.floor(Math.random() * 1000) + 200
  })
}

const rankList = []
const controlList = []

export default {
  name: 'DashboardAdmin',
  components: {
    ChartCard,
    Trend,
    MiniArea,
    MiniBar,
    MiniProgress,
    RankList,
    Bar,
    Pie
  },
  data() {
    return {
      barData,
      barData2,
      balanceData,
      sectorPledgeData,
      rewardData,
      rankList,
      controlList,
      qualityAdjPower: '',
      balance: '',
      availableBalance: '',
      sectorPledgeBalance: '',
      vestingFunds: '',
      rewardValue: '',
      weekIncrease: '',
      dayIncrease: '',
      monthAvg: '',
      controlBalance: '',
      weekTop: '',
      dayTop: ''
    }
  },
  created() {
    this.getList()
    getPoolChart().then(response => {
      this.qualityAdjPower = response.data.qualityAdjPower + ' ' + response.data.powerUnit
      this.balance = response.data.balance + ' FIL'
      this.availableBalance = response.data.availableBalance
      this.sectorPledgeBalance = response.data.sectorPledgeBalance + ' FIL'
      this.vestingFunds = response.data.vestingFunds
      this.rewardValue = response.data.rewardValue + ' FIL'
      this.weekIncrease = response.data.weekIncrease
      this.dayIncrease = response.data.dayIncrease
      this.monthAvg = response.data.monthAvg
      this.controlBalance = response.data.controlBalance
      this.weekTop = response.data.weekTop
      this.dayTop = response.data.dayTop

      // ChartCard({ total: response.data.availableBalance })
    })
    getRankList().then(
      response => {
        this.rankList = response.data.rankList
        this.controlList = response.data.controlList
        this.loading = false
      }
    )
  },
  methods: {
    /** 查询矿池图表列表 */
    getList() {
      this.loading = true
      listPoolChart().then(
        response => {
          this.barData = response.data.barData
          this.barData2 = response.data.barData2
          this.balanceData = response.data.balanceData
          this.sectorPledgeData = response.data.sectorPledgeData
          this.rewardValue = response.data.rewardValue
          this.loading = false
        }
      )
    }
  },
  getPoolOne() {
    this.loading = true
    getPoolChart().then(response => {
      this.form = response.data
      this.loading = false
    })
  }

}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 12px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .github-corner {
    position: absolute;
    top: 0;
    border: 0;
    right: 0;
  }

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

::v-deep .el-tabs__item{
   padding-left: 16px!important;
   height: 50px;
   line-height: 50px;
}

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
