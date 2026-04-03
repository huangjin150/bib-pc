<template>
  <div class="gainers-ranking">
    <div v-if="sortType == 'none'" class="tb_box">
      <div class="tb_title">行情</div>
      <div @click="marketClick" style="display: flex; align-items: center; cursor: pointer;">
        <div style="color: #a0a3a7;">查看更多</div> <img style="width: 15px; height: 15px;"
          src="../assets/svg/arrow_right.svg" alt="">
      </div>
    </div>

    <!-- 表头 -->
    <div class="table-header">
      <div class="header-text">币对</div>
      <div class="header-text">最新价</div>
    </div>

    <!-- 币种列表 -->
    <div class="coin-list">
      <div v-for="(coin, index) in displayedCoinList" :key="index">
        <div v-if="activeState == 1" class="coin-item" @click="selectCoin(coin)">
          <div class="coin-left">
            <div class="coin-icon">
              <img :src="coin.logo" class="icon-img" alt="coin logo" />
            </div>
            <div class="coin-info">
              <div class="coin-symbol">{{ coin.name }}</div>
            </div>
          </div>

          <div class="coin-centers">
            <div class="coin-price">{{ coin.close }}</div>
            <div class="gain-badge" :class="getGainClass(coin.rose)">
              <div v-if="sortType === 'volume'" class="volume-badge">
                <div class="volume-text">{{ formatVolume(coin.turnover) }}</div>
              </div>
              <div v-else class="gain-badge" :class="getGainClass(coin.rose)">
                <div class="gain-text">{{ coin.rose || '--' }}</div>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="coin-item" @click="selectCoin(coin)">
          <div class="coin-left">
            <div class="coin-icon">
              <img :src="coin.logo" class="icon-img" alt="coin logo" />
            </div>
            <div class="coin-info">
              <div class="coin-symbol">{{ coin.symbol }}</div>
            </div>
          </div>
          <div class="coin-price">{{ coin.close }}</div>
          <div class="gain-badge1" :class="getGainClass(coin.rose)">
            <div :class="getGainClass(coin.rose)">
              <div class="">{{ coin.rose || '--' }}</div>
            </div>
          </div>
          <div class="volume-badge">
            <div class="volume-text">{{ formatVolume(coin.turnover) }}</div>
          </div>
          <div style="display: flex; align-items: center; justify-content: center;">
            <div class="transaction_btn">交易</div>
          </div>
        </div>

      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading">
      加载中...
    </div>

    <!-- 空数据状态 -->
    <div v-if="!loading && displayedCoinList.length === 0" class="empty-state">
      暂无数据
    </div>
  </div>
</template>

<script>
var Stomp = require('stompjs')
var SockJS = require('sockjs-client')

export default {
  name: 'GainersRanking',
  props: {
    // 排序类型：rise 涨幅榜，fall 跌幅榜, volme 成交量 
    sortType: {
      type: String,
      default: 'rise'
    },
    // 是否允许跳转
    allowNavigation: {
      type: Boolean,
      default: true
    },
    // 显示条数
    defaultLimit: {
      type: Number,
      default: 20
    },
    activeState: {
      type: Number,
      default: 1
    }

  },
  data() {
    return {
      coinList: [],
      loading: false,
      displayLimit: this.defaultLimit,
      stompClient: null
    }
  },
  computed: {
    sortedCoinList() {
      if (this.sortType === 'none') {
        return this.coinList.slice()
      }

      return this.coinList.slice().sort((a, b) => {
        const getRiseValue = (coin) => {
          if (coin.rose && coin.rose !== '--') {
            return parseFloat(coin.rose.replace(/[+%]/g, ''))
          }
          return 0
        }

        const getVolumeValue = (coin) => {
          return parseFloat(coin.turnover) || 0
        }

        if (this.sortType === 'fall') {
          const aValue = getRiseValue(a)
          const bValue = getRiseValue(b)
          return aValue - bValue
        } else if (this.sortType === 'rise') {
          const aValue = getRiseValue(a)
          const bValue = getRiseValue(b)
          return bValue - aValue
        } else if (this.sortType === 'volume') {
          const aValue = getVolumeValue(a)
          const bValue = getVolumeValue(b)
          return bValue - aValue
        } else if (this.sortType === 'none') {
          return coin.turnover
        }
        return 0
      })
    },
    displayedCoinList() {
      if (this.displayLimit === 0) {
        return this.sortedCoinList
      }
      return this.sortedCoinList.slice(0, this.displayLimit)
    }
  },
  mounted() {
    window.addEventListener('focus', this.onWindowFocus);
    window.addEventListener('blur', this.onWindowBlur);
    this.getList()
    this.startWebSocket()
  },
  beforeDestroy() {
    this.stopWebSocket()
    window.removeEventListener('focus', this.onWindowFocus);
    window.removeEventListener('blur', this.onWindowBlur);
  },
  methods: {
    onWindowFocus() {
      this.startWebSocket();
    },

    onWindowBlur() {
      this.stopWebSocket();
    },
    marketClick() {
      this.$router.push("/market");

    },
    formatVolume(value) {
      const num = parseFloat(value)
      if (num >= 100000000) { // 1亿及以上
        return (num / 100000000).toFixed(2) + '亿'
      } else if (num >= 10000) { // 1万及以上
        return (num / 10000).toFixed(2) + '万'
      } else {
        return num.toFixed(2)
      }
    },
    getGainClass(rose) {
      if (!rose || rose === '--') return 'neutral'
      const value = parseFloat(rose.replace(/[+%]/g, ''))
      return value > 0 ? 'positive' : 'negative'
    },
    async getList() {
      try {
        this.loading = true
        this.$http
          .post(this.swapHost + this.api.market.thumbTrend, {})
          .then(response => {
            var resp = response.body;
            this.coinList = resp.data || resp

          });
      } catch (error) {
        console.error('获取数据失败:', error)
      } finally {
        this.loading = false
      }
    },
    selectCoin(coin) {
      this.$emit('coinSelected', coin)
      const symbol = this.convertSymbol(coin.symbol)
      if (this.allowNavigation) {
        this.$router.push(`/swap/${symbol}`);
      }
    },
    convertSymbol(symbol) {
      return symbol.toLowerCase().replace(/\//g, '_');
    },
    getCoin(symbol) {
      return this.coinList.find(coin => coin.symbol === symbol) || {}
    },
    startWebSocket() {
      try {
        var socket = new SockJS(this.swapHost + this.api.market.ws);
        this.stompClient = Stomp.over(socket)
        this.stompClient.debug = null

        this.stompClient.connect({}, () => {
          this.stompClient.subscribe('/topic/swap/thumb', (msg) => {
            if (msg.headers.destination === '/topic/swap/thumb') {
              const resp = JSON.parse(msg.body)
              const coin = this.getCoin(resp.symbol)

              if (coin) {
                this.$set(coin, 'price', resp.close)
                this.$set(coin, 'close', resp.close)
                this.$set(coin, 'rose', resp.chg > 0
                  ? '+' + (resp.chg * 100).toFixed(2) + '%'
                  : (resp.chg * 100).toFixed(2) + '%')
                this.$set(coin, 'high', resp.high)
                this.$set(coin, 'turnover', resp.turnover)
                this.$set(coin, 'volume', resp.volume)
                this.$set(coin, 'usdRate', resp.usdRate)
              }
            }
          })
        })
      } catch (error) {
        console.error('WebSocket连接失败:', error)
      }
    },
    stopWebSocket() {
      if (this.stompClient && this.stompClient.connected) {
        this.stompClient.disconnect()
      }
    }
  }
}
</script>

<style scoped>
.gainers-ranking {
  border-radius: 16px;
  width: 100%;
  background: #000;
  border-radius: 8px;
  overflow: hidden;

  .tb_box {
    padding: 0 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .tb_title {
      font-size: 26px;
      color: #000;
      font-weight: 700;
    }
  }
}

.control-bar {
  padding: 16px 20px;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.limit-selector {
  display: flex;
  align-items: center;
  gap: 8px;
}

.limit-selector label {
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

.limit-selector select {
  padding: 6px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  background: #fff;
  cursor: pointer;
}

.limit-selector select:focus {
  outline: none;
  border-color: #007bff;
}

.table-header {
  padding: 11px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-text {
  font-size: 12px;
  color: #9ca3af;
  text-align: left;
}

.header-text:nth-child(2),
.header-text:nth-child(3) {
  text-align: center;
}



.coin-item {
  z-index: 1000;
  padding: 0 20px;
  display: flex;
  height: 48px;
  justify-content: space-between;
  cursor: pointer;
  transition: background-color 0.2s;
}

.coin-item:hover {
  background-color: #121213;
}

.coin-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.coin-icon {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
}

.icon-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.coin-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.coin-symbol {
  font-size: 16px;
  font-weight: 600;
  color: #fff;
}

.coin-volume {
  font-size: 12px;
  color: #999;
}

.coin-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

.coin-centers {
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
}

.coin-price {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.coin-price-usd {
  font-size: 12px;
  color: #999;
}

.coin-right {
  display: flex;
  align-items: center;
  justify-content: center;
}

.gain-badge {
  width: 100%;
  text-align: end;
  font-size: 12px;
  font-weight: 600;
}

.gain-badge1 {
  text-align: start;
  width: 100%;
  font-size: 12px;
  font-weight: 600;
}

.gain-badge.positive {
  color: #1bb273;
}

.gain-badge.negative {
  color: #f2495e;
}

.gain-badge.neutral {
  color: #6c757d;
}

.gain-badge1.positive {
  color: #1bb273;
}

.gain-badge1.negative {
  color: #f2495e;
}

.gain-badge1.neutral {
  color: #6c757d;
}

.loading,
.empty-state {
  padding: 40px;
  text-align: center;
  color: #999;
  font-size: 14px;
}

/* 响应式设计 */
@media (max-width: 768px) {

  .table-header,
  .coin-item {
    grid-template-columns: 1.5fr 1fr 1fr;
    padding: 12px 16px;
  }

  .coin-left {
    gap: 8px;
  }

  .coin-icon {
    width: 32px;
    height: 32px;
  }

  .coin-symbol {
    font-size: 14px;
  }

  .coin-price {
    font-size: 16px;
  }
}

.gain-text {
  text-align: end;
}

.volume-badge {
  border-radius: 4px;
  font-size: 14px;
  font-weight: 600;
  color: #1976d2;
}

.volume-text {
  font-size: 12px;
  color: #666;
}

.transaction_btn {
  text-align: center;
  padding: 10px 0;
  border-radius: 20px;
  width: 100px;
  --un-bg-opacity: 1;
  background-color: rgba(248, 248, 248, var(--un-bg-opacity));

}
</style>