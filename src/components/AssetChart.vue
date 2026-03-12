<template>
  <div class="asset-chart">
    <div ref="chartContainer" class="chart-container"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts'

export default {
  name: 'AssetChart',
  props: {
    data: {
      type: Array,
      default: () => []
    },
    height: {
      type: String,
      default: '300px'
    }
  },
  data() {
    return {
      chart: null,
      chartData: [
        { date: '07/15', value: 0 },
        { date: '07/16', value: 0 },
      ]
    }
  },
  mounted() {
    this.initChart()
    window.addEventListener('resize', this.handleResize)
  },
  beforeDestroy() {
    if (this.chart) {
      this.chart.dispose()
    }
    window.removeEventListener('resize', this.handleResize)
  },
  watch: {
    data: {
      handler() {
        this.updateChart()
      },
      deep: true
    }
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$refs.chartContainer)
      this.updateChart()
    },
    updateChart() {
      const data = this.data.length > 0 ? this.data : this.chartData
      const dates = data.map(item => item.date)
      const values = data.map(item => item.value)

      const option = {
        tooltip: {
          trigger: 'axis',
          backgroundColor: 'rgba(50, 50, 50, 0.9)',
          borderColor: '#333',
          textStyle: {
            color: '#fff'
          },
          formatter: function (params) {
            const param = params[0]
            return `${param.name}<br/>${param.value} USDT`
          }
        },
        grid: {
          left: '0%',
          right: '0%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          show: false,
          boundaryGap: false,
          data: dates,
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            color: '#000',
            fontSize: 10
          }
        },
        yAxis: {
          type: 'value',
          show: false
        },
        series: [
          {
            name: '资产价值',
            type: 'line',
            smooth: true,
            symbol: 'none',
            lineStyle: {
              color: '#d0f500',
              width: 2
            },
            areaStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: '#84CC16'
                  },
                  {
                    offset: 1,
                    color: 'rgba(208, 245, 0, 0.2)'
                  }
                ]
              }
            },
            data: values
          }
        ]
      }

      this.chart.setOption(option)
    },
    handleResize() {
      if (this.chart) {
        this.chart.resize()
      }
    }
  }
}
</script>

<style scoped>
.asset-chart {
  width: 100%;
}

.chart-container {
  width: 100%;
  height: 140px;
}
</style>