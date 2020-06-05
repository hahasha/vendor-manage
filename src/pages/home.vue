<template>
  <div class="home-content">
    <section class="data-collection" v-cloak>
      <header class="data-c-title">数据统计</header>
      <el-row class="data-wrap">
        <el-col :span="4">
          <div class="data-list list-head list-head-day">当日数据：</div>
        </el-col>
        <el-col :span="4">
          <div class="data-list">
            <span>{{currentUserCount}}</span> 新增用户
          </div>
        </el-col>
        <el-col :span="4">
          <div class="data-list">
            <span>{{currentOrderCount}}</span> 新增订单
          </div>
        </el-col>
        <el-col :span="4">
          <div class="data-list">
            <span>{{currentAdminCount}}</span> 新增管理员
          </div>
        </el-col>
      </el-row>
      <el-row class="data-wrap">
        <el-col :span="4">
          <div class="data-list list-head list-head-all">总数据：</div>
        </el-col>
        <el-col :span="4">
          <div class="data-list">
            <span>{{userCount}}</span> 注册用户
          </div>
        </el-col>
        <el-col :span="4">
          <div class="data-list">
            <span>{{orderCount}}</span> 订单
          </div>
        </el-col>
        <el-col :span="4">
          <div class="data-list">
            <span>{{adminCount}}</span> 管理员
          </div>
        </el-col>
      </el-row>
    </section>
    <div id="chart"></div>
  </div>
</template>

<script>
import { getUserCount, getAdminCount, getOrderCount, getRecentOrderCount, getRecentUserCount, getRecentAdminCount } from '@/api/api'
import echarts from 'echarts'
// import moment from 'moment'
// import 'echarts/lib/chart/bar'
// import 'echarts/lib/chart/line'
// import 'echarts/lib/component/title'
// import 'echarts/lib/component/legend'
// import 'echarts/lib/component/tooltip'
// import 'echarts/lib/component/toolbox'
// import 'echarts/lib/component/markPoint'
import { getDate } from '@/common/js/date'
const RCENT_NUM = 7 // 获取最近7天的数据
export default {
  data () {
    return {
      userCount: 0, // 总用户数
      currentUserCount: 0, // 当日新增用户数
      adminCount: 0,
      currentAdminCount: 0,
      orderCount: 0,
      currentOrderCount: 0,
      recentUserArr: [], // 最近每天新增用户
      recentAdminArr: [],
      recentOrderArr: [],
      currentDate: getDate(0), // 当天日期
      dateArr: [] // 最近的日期数组
    }
  },
  created () {
    this.setDateArr()
    this.getCount() // 获取当日数据
    this.getCurrentCount() // 获取当日数据
    this.getRecentCount()
  },
  mounted () {
    // this.drawLine()
  },
  methods: {
    setDateArr () {
      for (let i = RCENT_NUM - 1; i >= 0; i--) {
        this.dateArr.push(getDate(-i))
      }
    },
    getCount () {
      getUserCount().then(res => {
        if (res.errcode === 0) {
          this.userCount = res.count
        }
      })
      getOrderCount().then(res => {
        if (res.errcode === 0) {
          this.orderCount = res.count
        }
      })
      getAdminCount().then(res => {
        if (res.errcode === 0) {
          this.adminCount = res.count
        }
      })
    },
    getCurrentCount () {
      getOrderCount({
        date: this.currentDate
      }).then(res => {
        if (res.errcode === 0) {
          this.currentOrderCount = res.count
        }
      })
      getAdminCount({
        date: this.currentDate
      }).then(res => {
        if (res.errcode === 0) {
          this.currentAdminCount = res.count
        }
      })
      getUserCount({
        date: this.currentDate
      }).then(res => {
        if (res.errcode === 0) {
          this.currentUserCount = res.count
        }
      })
    },
    async getRecentCount () {
      const orderRes = await getRecentOrderCount({ dateArr: this.dateArr })
      const userRes = await getRecentUserCount({ dateArr: this.dateArr })
      const adminRes = await getRecentAdminCount({ dateArr: this.dateArr })
      if (orderRes.errcode === 0) {
        this.recentOrderArr = orderRes.countArr
      }
      if (userRes.errcode === 0) {
        this.recentUserArr = userRes.countArr
      }
      if (adminRes.errcode === 0) {
        this.recentAdminArr = adminRes.countArr
      }
      this.drawLine()
    },
    drawLine () {
      const myChart = echarts.init(document.getElementById('chart'))
      myChart.setOption({
        title: { text: '走势图' },
        color: ['#5793f3', '#675bba', '#d14a61'],
        legend: {
          data: ['新注册用户', '新增订单', '新增管理员']
        },
        tooltip: {
          trigger: 'axis'
        },
        toolbox: {
          show: true,
          feature: {
            dataZoom: {},
            dataView: {},
            magicType: {
              type: ['bar', 'line']
            },
            restore: {}
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.dateArr
        },
        yAxis: [
          {
            type: 'value',
            name: '用户',
            min: 0,
            max: 20,
            position: 'left',
            axisLine: {
              lineStyle: {
                color: '#999'
              }
            },
            axisLabel: {
              formatter: '{value}'
            }
          },
          {
            type: 'value',
            name: '订单',
            min: 0,
            max: 20,
            position: 'right',
            axisLine: {
              lineStyle: {
                color: '#999'
              }
            },
            axisLabel: {
              formatter: '{value}'
            }
          }
        ],
        series: [
          {
            name: '新注册用户',
            type: 'line',
            data: this.recentUserArr,
            yAxisIndex: 1,
            markPoint: {
              data: [
                {
                  name: '最大值',
                  type: 'max'
                },
                {
                  name: '最小值',
                  type: 'min'
                }
              ]
            }
          },
          {
            name: '新增订单',
            type: 'line',
            data: this.recentOrderArr,
            yAxisIndex: 1,
            markPoint: {
              data: [
                {
                  name: '最大值',
                  type: 'max'
                },
                {
                  name: '最小值',
                  type: 'min'
                }
              ]
            }
          },
          {
            name: '新增管理员',
            type: 'line',
            data: this.recentAdminArr,
            yAxisIndex: 1,
            markPoint: {
              data: [
                {
                  name: '最大值',
                  type: 'max'
                },
                {
                  name: '最小值',
                  type: 'min'
                }
              ]
            }
          }
        ]
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
[v-cloak]
  display none
.home-content
  .data-collection
    padding: 0 20px
    .data-c-title
      font-size: 30px
      text-align: center
      margin-bottom: 20px
    .data-wrap
      display flex
      justify-content center
    .data-list
      height: 36px
      line-height: 36px
      margin-right: 20px
      margin-bottom: 10px
      border-radius: 6px
      text-align: center
      background: #e5e9f2
      font-size: 14px
      color: #666
    .data-list span
      font-size: 26px
      color: #333
    .list-head
      font-size: 22px
      color: #fff
    .list-head-day
      background: #ff9800
    .list-head-all
      background: #20a0ff
  #chart
    width: 90%
    height: 450px
    margin: 60px auto 0 auto
</style>
