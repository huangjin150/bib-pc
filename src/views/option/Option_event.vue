<template>
  <div class="option dark-skin">
    <div
      style="display:none;background-image: linear-gradient( 135deg, #FD6585 10%, #0D25B9 100%);text-align: center;height:30px;line-height:30px;letter-spacing: 1px;color:#FFF;">
    </div>
    <div class="ctc_container">
      <h1>{{ $t('option.desc') }}</h1>
      <div class="main">
        <div class="ctc-container">
          <div class="trade_wrap">
            <div class="trade_panel">
              <div class="trade_bd_ctc">
                <div class="panel panel_buy">
                  <div class="bd bd_limited">
                    <!-- 选择币种 -->
                    <div style="position: relative;">
                      <div style="position: relative;">
                        <div class="current-period">
                          <div class="animated-image_box">
                            <transition name="image-transition" @after-enter="onAnimationEnd">
                              <img v-if="show" src="../../assets/images/goldcoin2.gif" alt="弹出图片" class="animated-image"
                                :style="imageStyle" />
                            </transition>
                          </div>
                          <div class="NewFlex">
                            <div class="NewFlex_left">
                              <KlineCharts type="candlestick" :autosize="true" :symbol="currentCoinList.symbol"
                                currentResolution="5" ref="kline" id="kline_container" />
                            </div>
                            <div class="NewFlex_right">
                              <div style="height: 100%;">
                                <div class="NewFlex_right_title">时间单位</div>
                                <div
                                  style="display: flex; align-items: center; justify-content: space-between; gap: 20px; margin-top: 20px;">
                                  <div v-for="(item, idx) in timeBtnData" :key="item.id || idx" class="time_btn"
                                    :class="{ active: item.id == activeTimeIndex }" @click="onSelectTime(idx, item)">
                                    {{ item.guessCycle }}分钟
                                  </div>
                                </div>
                                <div class="NewFlex_right_title" style="margin-top: 20px;">数量(USDT)</div>
                                <div class="placeOrder_input_box">
                                  <el-input v-model="buyNumber" @focus="isFocused = true" @input="handleInput"
                                    placeholder="请输入" class="buy_box_input">
                                  </el-input>
                                </div>
                                <div style="width: 94%; margin:  0 auto; padding-top: 20px;">
                                  <el-slider class="slider" :step="0.0001" @input="updatePercentage(value1)"
                                    :marks="marks" :format-tooltip="formatTooltip" v-model="value1"></el-slider>
                                </div>
                                <div>
                                  <div style="text-align: start; color: #666;">快捷下单</div>
                                  <div class="quick-order-btns">
                                    <button v-for="amount in quickNumData" :key="amount" class="quick-btn"
                                      @click="handleQuickOrder(amount)">
                                      {{ amount }}{{ quickOrderCounts[amount] > 0 ? 'X' +
                                        quickOrderCounts[amount] : '' }}
                                    </button>
                                  </div>
                                </div>
                                <div
                                  style="display: flex;align-items: center; justify-content: space-between; margin-top: 14px; padding:  0 10px;">
                                  <div class="available_banner">可用</div>
                                  <div class="available_banner_num">{{ sumBalance.usdt }} USDT</div>
                                </div>

                                <div style="display: flex; align-items: center;">
                                  <div style="flex: 1;">
                                    <div
                                      style="display: flex;align-items: center; justify-content: space-between; margin-top: 7px; padding:  0 10px;">
                                      <div class="available_banner">支付率</div>
                                      <div class="available_banner_num">{{ ((symbolList.upRate - 1) * 100).toFixed(2)
                                      }}%</div>
                                    </div>

                                    <div
                                      style="display: flex;align-items: center; justify-content: space-between; margin-top: 7px; padding:  0 10px;">
                                      <div class="available_banner">支付金额</div>
                                      <div class="available_banner_num">{{ (buyNumber * symbolList.upRate).toFixed(2) ||
                                        0 }} USDT
                                      </div>
                                    </div>
                                  </div>
                                  <div style="flex: 1;">
                                    <div
                                      style="display: flex;align-items: center; justify-content: space-between; margin-top: 7px; padding:  0 10px;">
                                      <div class="available_banner">支付率</div>
                                      <div class="available_banner_num">{{ ((symbolList.downRate - 1) * 100)
                                        .toFixed(2) }}%</div>
                                    </div>

                                    <div
                                      style="display: flex;align-items: center; justify-content: space-between; margin-top: 7px; padding:  0 10px;">
                                      <div class="available_banner">支付金额</div>
                                      <div class="available_banner_num">{{ (buyNumber * symbolList.downRate).toFixed(2)
                                        || 0 }} USDT
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <div class="bet_btn_box">
                                  <div @click="upBetClick" class="up_btn">
                                    上涨
                                  </div>
                                  <div @click="downBetClick" class="down_btn">
                                    下跌
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div class="table_box" style="margin-top: 10px;">
                      <h3 class="table_title">
                        我的订单
                      </h3>
                      <div style="text-align: center;padding: 30px 0 60px 0;" v-if="!isLogin">
                        <router-link to="/login" id="login">{{ $t("common.login") }}</router-link>/<router-link
                          to="/register" id="register">{{ $t("common.register") }}</router-link>
                      </div>
                      <div v-else class="table">
                        <Table :no-data-text="$t('common.nodata')" :columns="columns" :data="historyList"
                          :loading="loading"></Table>
                        <div class="page">
                          <Page :total="total" :pageSize="pageSize" :current="pageNo" @on-change="getHistoryList">
                          </Page>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
var moment = require("moment");
var Stomp = require("stompjs");
var SockJS = require("sockjs-client");
// import SwiperItem from "@/components/uc/Swiper.vue";
// import $ from "@js/jquery.min.js";
import KlineCharts from "./Klinechart.vue";



export default {
  components: { KlineCharts, },
  data() {
    const self = this;
    return {
      value: 0,
      marks: {
        0: '',
        20: '',
        40: '',
        60: '',
        80: '',
        100: ''
      },
      balance: '0',
      isFlipped: false,
      orderLineIds: [],
      isSubmitting: false,
      addedOrderMarkers: [],
      countdown: 0,
      orderLineId: null, // 记录当前横线的ID
      orderLineDirection: null,
      datafeed: null,
      moreOptions: ['1d', '1w', '1M'],
      showMoreOptions: false,
      datafeedK: null,
      stompClient: null,
      placeOrder_num: 0,
      show: false,
      activeTimeIndex: 3,
      selectedGuessCycle: 1,
      progressColor: '#1EC6B6',
      imageStyle: {
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%) scale(0)',
        transition: 'transform 2s ease, left 2s ease, top 2s ease',
      },
      BettingformStatus: null,
      stompClientK: null,
      skin: "night", //皮肤样式day&night
      coinList: [],
      streamList: [],
      currentCoinSymbol: "BTC/USDT",
      isCollecting: false,
      rewardAmount: 0, // 示例奖励金额
      currentBalance: 0,
      targetBalance: 0,
      isLoading: true,
      timeBtnData: [],
      quickOrderCounts: {
        10: 0,
        100: 0,
        500: 0,
        1000: 0
      },
      formattedBalance: '0',
      currentCoin: {},
      currentCoinAmountList: [],
      currentPrice: 10000.00,
      openPrice: 12456.8,
      progressValue: 0,
      currentSelectCount: 0,
      baseCoinUnit: "USDT",
      timeSharing: false,
      isFocused: false,
      tableMoney: [],
      assetUsdt: 0,
      renderOrderMarkersTimer: null,
      chartResizeObserver: null,
      currentTotalBuy: 0,
      currentTotalSell: 0,
      historyList: [],
      progressWidth: '0%',
      progressText: '0%',
      countdownText: '00:00:00',
      timer: null,
      AllData: [],
      openingOption: {
        id: 0,
        optionNo: "-",
        totalBuy: 0,
        totalSell: 0
      },
      startingOption: {
        optionNo: "-",
        totalBuy: 0,
        myBetUp: 0,
        myBetdown: 0,
        totalSell: 0,
        number: 0,
      },
      currentCoinList: {
        symbol: 'BTC/USDT'
      },
      myOpeningOption: {
        betAmount: 0
      },
      myStartingOption: {
        betAmount: 0
      },
      currentPercent: 0,
      orders: [],
      loading: false,
      historyTimer: null,
      buyNumber: 0,
      symbolList: {},
      total: 0,
      pageSize: 10,
      pageNo: 1,
      quickNumData: [10, 100, 500, 1000],
      columns: [
        {
          title: "币种",
          key: "optionNo",
          minWidth: 120,
          render: (h, params) => {
            return h("span", {}, params.row.symbol);
          }
        },
        {
          title: '时间',
          key: "Time",
          minWidth: 65,
          render: (h, params) => {
            return h("span", {}, params.row.guessCycle + '分钟');

          }
        },
        {
          title: "下单金额",
          key: "amount",
          minWidth: 65,
          render: (h, params) => {
            return h("span", {}, params.row.amount);
          }
        },
        {
          title: self.$t("option.col_direction"),
          key: "direction",
          minWidth: 65,
          render: (h, params) => {
            let txt = params.row.direction == 1 ? '涨' : '跌';
            const txtColor = params.row.direction == 1 ? "#2bc287" : "#FF0000";
            return h("div", {
              style: {
                color: txtColor
              }
            }, [
              h("span", {}, txt)
            ]);
          }
        },
        {
          title: self.$t("option.col_result"),
          key: "result",
          minWidth: 65,
          render: (h, params) => {
            let txt = self.$t("option.wait");
            let txtColor = "#fff";
            let bgColor = "transparent"; // 默认灰色，防止未匹配状态看不见
            if (params.row.result == 0) {
              txt = "未开始"
              bgColor = "transparent"; // 蓝色
              txtColor = '#000'
            } else if (params.row.result == 1) {
              txt = self.$t("option.win")
              bgColor = "#2bc287" // 绿色
            } else if (params.row.result == 2) {
              txt = self.$t("option.lose")
              bgColor = "#f74b60" // 红色
            } else if (params.row.result == 3) {
              txt = self.$t("option.prediction")
              bgColor = "#f0a70a" // 橙色
            } else if (params.row.result == 4) {
              txt = "平盘"
              bgColor = "#f0a70a" // 橙色
            }

            let isSettling = false;
            if (params.row.result != 1 && params.row.result != 2 && params.row.result != 4) {
              if (params.row.displayTime) {
                txt = params.row.displayTime;
                if (txt === "结算中") {
                  isSettling = true;
                }
              }
            }
            return h("div", {
              style: {
                color: txtColor,
                backgroundColor: bgColor,
                padding: '2px 8px',
                borderRadius: '2px',
                display: 'inline-block',
                fontSize: '12px',
                minWidth: '60px',
                textAlign: 'center',
                lineHeight: '1.5',
                cursor: isSettling ? 'pointer' : 'default'
              },
              on: {
                click: () => {
                  if (isSettling) {
                    self.getHistory();
                  }
                }
              }
            }, [
              h("span", {}, txt)
            ]);
          }
        },
        {
          title: '支付率',
          key: "rewardAmount",
          minWidth: 65,
          render: (h, params) => {
            let txt = ((params.row.rate - 1) * 100).toFixed(2) + '%';

            return h("span", {}, txt);
          }
        },
        {
          title: self.$t("option.col_rewardAmount"),
          key: "rewardAmount",
          minWidth: 65,
          render: (h, params) => {
            let txt = params.row.profit;
            if (params.row.result == 0) {
              txt = "-";
            } else {
              txt = params.row.profit
            }
            return h("span", {}, txt);
          }
        },
        {
          title: "开仓价格",
          key: "start",
          minWidth: 65,
          render: (h, params) => {
            return h("span", {}, params.row.start ? params.row.start : '--');
          }
        },
        {
          title: "平仓价格",
          key: "end",
          minWidth: 65,
          render: (h, params) => {
            if (params.row.end) {
              return h("span", {}, params.row.end);
            }
            let price = params.row.currentPrice;
            let style = {};
            if (price) {
              if (parseFloat(price) > parseFloat(params.row.start)) {
                style.color = "red";
              } else if (parseFloat(price) < parseFloat(params.row.start)) {
                style.color = "green";
              }
            }
            return h("span", {
              style: style
            }, price ? price : '--');
          }
        },
        {
          title: self.$t("option.col_createTime"),
          key: "createTime",
          minWidth: 65,
          render: (h, params) => {
            return h("span", {}, self.dateFormat(params.row.createTime));
          }
        },
        {
          title: '平仓时间',
          key: "createTime",
          minWidth: 65,
          render: (h, params) => {
            return h("span", {}, self.dateFormat(params.row.endTime));
          }
        }
      ],
      showDropdown: false,
      currency: '', // 货币名称
      value1: 0,
      price: 0,    // 初始价格
      value: "",
      //模拟数据选择当前币种
      cities: [{
        id: 1,
        label: 'BTCUSDT',
        value: '80000'
      }],
      //已过期奖池假数据
      priceData: [

      ],
      newPriceData:
      {
        number: '360461',
        rate: '2.31',
        downRate: '1.77',
        endPrice: '573.6699',
        lockPrice: '572.5739',
        pool: '2.4994',
        changeAmount: '1.0960'

      },
      allWallet: [],
      resolutions: [
        { time: 'Time', size: 97 },//分时
        { time: '1', size: 97 },
        { time: '5', size: 95 },
        { time: '15', size: 93 },
        { time: '30', size: 91 },
        { time: '1h', size: 89 },
        { time: '4h', size: 87 }
      ],
      moreOptions: ['1d', '1w', '1M'],
      localResolution: '5',
      showMoreOptions: false,
      klineData: [],
      chart: null,
      inputMode: 1,//记录输入框和步进条的修改模式
      isUpdatingFromInput: false, // 新增：防止循环更新的标志位
      serverTimeOffset: 0, // 服务器时间偏移量
    };
  },
  watch: {


  },
  created: function () {
    this.init();
  },
  filters: {
    dateFormat: function (tick) {
      return moment(tick).format("YYYY-MM-DD HH:mm");
    },

    fixedScale: function (value, scale) {
      return value.toFixed(scale);
    },
    fixed2: function (value) {
      return value.toFixed(2);
    }
  },
  mounted() {
    this.startWebsock();
    window.addEventListener('focus', this.onWindowFocus);
    window.addEventListener('blur', this.onWindowBlur);
    if (this.isLogin) {
      this.getWalletList()
      this.getEventTime()
    }
    this.initChartResizeObserver()
  },
  beforeDestroy() {
    this.stopWebsock();
    this.destroyChartResizeObserver();
    if (this.historyTimer) clearInterval(this.historyTimer);
    window.removeEventListener('focus', this.onWindowFocus);
    window.removeEventListener('blur', this.onWindowBlur);
  },
  computed: {
    lang() {
      return this.$store.state.lang;
    },
    langPram() {
      if (this.$store.state.lang == "简体中文") {
        return "CN";
      }
      if (this.$store.state.lang == "English") {
        return "EN";
      }
      return "CN";
    },
    sumBalance() {
      return {
        usdt: this.allWallet.reduce((sum, item) => sum + parseFloat(item.balance), 0),
      }
    },
    isLogin: function () {
      return this.$store.getters.isLogin;
    },
    priceChange: function () {
      var chg = this.currentPrice - this.openPrice;
      var percent = chg / this.openPrice * 100;
      if (chg > 0) {
        return "+" + percent.toFixed(3) + "%";
      }
      if (chg < 0) {
        return percent.toFixed(3) + "%";
      }
      return "0.00%";
    },

  },
  methods: {
    onWindowFocus() {
      console.log('/order/holders/history', this.$refs.kline)
      this.$refs.kline.fetchData();
      this.startWebsock();
    },

    onWindowBlur() {
      this.stopWebsock();

    },
    init() {
      this.$store.commit("navigate", "nav-option");
      this.initPageData();
    },

    initPageData() {
      if (this.isLogin) {
      }
      this.getHistory();
    },
    dateFormat: function (tick) {
      return moment(tick).format("YYYY-MM-DD HH:mm:ss");
    },
    updatePrice(item) {
      this.currency = item.name
      this.currentCoin = item
      this.price = item.nowPrice; // 更新价格
      this.showDropdown = false
      this.startWebsock();
    },
    getWalletList() {
      var that = this;
      this.$http.post(this.host + "/asset/wallet").then(response => {
        console.log('getWalletList', response)
        this.allWallet = response.body.data
      });
    },

    getEventTime() {
      var that = this;
      this.$http.get(this.swapHost + "/event-contract/symbol").then(response => {
        this.timeBtnData = response.body
        this.symbolList = response.body[0]
      });
    },


    //清空快捷下单数量
    clearInput() {
      Object.keys(this.quickOrderCounts).forEach(key => {
        this.quickOrderCounts[key] = 0;
      });
    },

    selectCount(count) {
      this.currentSelectCount = count;
    },

    changeCoin(symbol) {
      this.currentCoinSymbol = symbol;
      this.pageNo = 1;
      this.currentPrice = this.openPrice;
      this.initPageData();
    },


    countDown(remainTime) {
      let endTimestamp = new Date(this.openingOption.endTime).getTime();
      let startTimestamp = new Date(this.openingOption.startTime).getTime();
      if (this.timer) {
        clearInterval(this.timer);
      }
      this.timer = setInterval(() => {
        const remain_time = remainTime * 1000; //剩余毫秒数
        const minutes = parseInt(remain_time / 1000 / 60 % 60, 10); //计算剩余的分钟
        const seconds = parseInt(remain_time / 1000 % 60, 10); //计算剩余的秒数
        if (remainTime >= 0) {
          this.countdownText = `${this.checkTime(minutes)}:${this.checkTime(seconds)}`;
          remainTime--;
        } else {
          this.countdownText = '结算中';
          clearInterval(this.timer);
        }
      }, 1000);
    },
    startHistoryCountdown() {
      if (this.historyTimer) clearInterval(this.historyTimer);
      const updateTime = () => {
        // 使用服务器时间偏移量校准当前时间
        const now = Date.now() + this.serverTimeOffset;
        this.historyList = this.historyList.map(item => {
          if (item.result == 1 || item.result == 2 || item.result == 4) return item;
          if (!item.endTime) return item;

          let endTime = new Date(item.endTime).getTime();
          let diff = endTime - now;

          if (diff > 0) {
            let m = Math.floor(diff / 60000);
            let s = Math.floor((diff % 60000) / 1000);
            item.displayTime = `${this.checkTime(m)}:${this.checkTime(s)}`;
          } else {
            item.displayTime = "结算中";
          }
          return item;
        });
      };
      updateTime(); // 立即执行一次
      this.historyTimer = setInterval(updateTime, 1000);
    },
    startCountdown(item) {
      if (item) {
        const endDate = new Date(item.endTime)
        const endDateTime = Math.floor(endDate)
        const newDates = new Date(item.serviceTime)
        const newDatesTime = Math.floor(newDates)
        const Time = Math.floor((endDateTime - newDatesTime) / 1000)
        if (this.openingOption) {
          this.countDown(Time)
        }
      }
    },
    checkTime(i) {
      if (i < 10) {
        i = "0" + i;
      }
      return i;
    },

    getHistoryList(data) {
      this.pageNo = data
      this.getHistory()
    },

    //获取历史数据
    getHistory() {
      var that = this;
      let params = {};
      if (!this.isLogin) {
        return
      }
      params.symbol = this.currentCoinSymbol;
      params.pageNo = that.pageNo;
      params.pageSize = 10;
      this.$http.post(this.swapHost + "/event-contract/record", params).then(response => {
        var resp = response.body;
        console.log('resp', resp)
        this.historyList = resp.records;
        // 计算服务器时间偏移量
        if (this.historyList && this.historyList.length > 0 && this.historyList[0].serviceTime) {
          const serverTime = new Date(this.historyList[0].serviceTime).getTime();
          this.serverTimeOffset = serverTime - Date.now();
        }
        this.startHistoryCountdown();
        this.total = resp.total
        setTimeout(() => {
          this.$nextTick(() => {
            this.Inprogressprice();
          });
          this.updateAllMarkers();
        }, 1000);

      });
    },

    updatePercentage(value1) {
      if (this.isUpdatingFromInput) return;
      console.log('value1', value1)
      let num = this.sumBalance.usdt * (value1 / 100);
      this.buyNumber = (Math.floor(num * 10000) / 10000).toString();
      console.log(' this.buyNumber', this.buyNumber)
      this.clearInput()
      this.styleAdd()
    },
    formatTooltip(val) {
      const safeVal = Number(val);
      if (!Number.isFinite(safeVal)) {
        return '0.00%';
      }
      return safeVal.toFixed(2) + '%';
    },
    //输入下注额度
    handleInput(value) {
      console.log('value', value)
      // 只保留数字和小数点
      let newValue = value.replace(/[^\d.]/g, '');

      // 保证只有一个小数点
      const dotIndex = newValue.indexOf('.');
      if (dotIndex !== -1) {
        newValue = newValue.slice(0, dotIndex + 1) + newValue.slice(dotIndex + 1).replace(/\./g, '');
      }

      // 如果输入值大于可用余额，则使用最大可用余额
      if (newValue !== '' && parseFloat(newValue) > this.sumBalance.usdt) {
        newValue = this.sumBalance.usdt.toString();
      }
      if (this.isFocused) {
        this.clearInput()
      }

      this.buyNumber = newValue;
      this.isUpdatingFromInput = true;

      if (!this.buyNumber || this.buyNumber === '') {
        this.value1 = 0;
        const sliderStops = document.querySelectorAll('.el-slider__stop');
        sliderStops.forEach(stop => {
          stop.classList.remove('color-red');
        });
        this.isUpdatingFromInput = false;
        return;
      }

      if (this.sumBalance.usdt > 0) {
        this.value1 = +(this.buyNumber / this.sumBalance.usdt * 100);
        if (this.value1 > 100) {
          this.value1 = 100;
          this.buyNumber = this.sumBalance.usdt.toString();
          console.log('this.buyNumber', this.buyNumber)
        }

        this.$nextTick(() => {
          this.styleAdd();
          this.isUpdatingFromInput = false;
        });
      } else {
        this.value1 = 0;
        const sliderStops = document.querySelectorAll('.el-slider__stop');
        sliderStops.forEach(stop => {
          stop.classList.remove('color-red');
        });
        this.isUpdatingFromInput = false;
      }

    },
    styleAdd() {
      const sliderStops = document.querySelectorAll('.el-slider__stop');
      sliderStops.forEach(stop => {
        stop.classList.remove('color-red');
      });
      if (this.isFocused) {
        this.clearInput()
      }
      if (this.value1 === 0) return;
      const marks = Object.keys(this.marks).map(Number).sort((a, b) => a - b);

      sliderStops.forEach((stop, index) => {
        if (index < marks.length && marks[index] <= this.value1) {
          stop.classList.add('color-red');
        }
      });
    },

    //检查全部数据进行中的
    getStreamByCoinIdWithCurrent() {
      console.log('this.historyList', this.historyList.length
      )
      const DataList = [];
      const filteredItems = this.historyList.filter(item => item.result == 0);
      DataList.push(filteredItems)
      console.log('filteredItems', filteredItems)
      return DataList;
    },

    //进行中订单
    Inprogressprice() {
      if (!this.isLogin) {
        return
      }
      const data = this.getStreamByCoinIdWithCurrent();
      console.log('getStreamByCoinIdWithCurrent', this.getStreamByCoinIdWithCurrent())
      if (this.orderLineIds && this.orderLineIds.length > 0) {
        this.orderLineIds.forEach(ids => {
          if (this.$refs.kline.chart) {
            this.$refs.kline.chart.removeOverlay({
              name: 'customPriceLine',
              ids
            })
          }
        });
        this.orderLineIds = [];
      }
      if (!data || !data.length) {
        return;
      }
      const drawnPrices = new Set();

      data.forEach((subArray, arrayIndex) => {
        subArray.forEach((item) => {
          const orderLineId = 'order_price_line_' + item.id;
          const lastEndPrice = item.start;
          const myBetUp = item.direction;
          const myBetDown = item.direction;
          const priceKey = `${lastEndPrice}_${myBetUp}_${myBetDown}+${item.id}`;
          if (!drawnPrices.has(priceKey)) {
            this.$refs.kline.addOrderPriceLine(lastEndPrice, myBetUp, myBetDown);
            this.orderLineIds.push(orderLineId);
            drawnPrices.add(priceKey);
          } else {
          }
        });
      });
    },
    getStreamAll(num) {
      for (let i = 0; i < this.streamList.length; i++) {
        if (this.streamList[i]) {
          const filteredItems = this.streamList[i].filter(item => item.number == num);
          if (filteredItems.length !== 0) {
            return filteredItems
          }
        }
      }
    },



    //创建标识
    updateAllMarkers() {
      if (!this.isLogin) {
        return
      }
      if (!this.$refs.kline || !this.$refs.kline.chart) {
        return;
      }
      console.log('1111')
      // 清除所有现有标记
      this.$refs.kline.clearAllMarkers();

      // 重新添加所有标记
      this.historyList.forEach(item => {
        let startTime = item.endTime || item.createTime;
        this.$refs.kline.addOrderMarkerAtStartTime(item, startTime);
      });
    },

    //切换时间方法
    setValue(num) {
      const sliderStops = document.querySelectorAll('.el-slider__stop');
      sliderStops.forEach(stop => {
        stop.classList.remove('color-red');
      });
      this.clearInput()

      // 设置新值
      this.value1 = num;
      this.$nextTick(() => {
        this.styleAdd()
        this.updatePercentage(num);
      });
    },
    //启动websoket
    startWebsock() {
      if (this.stompClient) {
        this.stompClient.ws.close();
      }
      var stompClient = null;
      var that = this;
      var socket = new SockJS(that.swapHost + that.api.swap.ws);
      const member = this.$store.getters.member;
      if (!member) {
        console.log('Member not found, skipping WebSocket subscription for user events');
      }
      stompClient = Stomp.over(socket);
      this.stompClient = stompClient;
      stompClient.debug = false;
      stompClient.connect({}, function (frame) {
        stompClient.subscribe("/topic/swap/kline/" + that.currentCoinList.symbol, function (msg) {
          var resp = JSON.parse(msg.body);
          if (resp["1m"]) {
            that.coinList.filter(item => item.name == that.currentCoinList.symbol).forEach(item => {
              item.nowPrice = resp["1m"].closePrice
            })
            if (that.historyList) {
              that.historyList.forEach(item => {
                if (!item.end) {
                  that.$set(item, 'currentPrice', resp["1m"].closePrice);
                }
              });
            }
          }
          if (that.$refs.kline) {
            that.$refs.kline.refreshKline(resp);
            that.$refs.kline.reloadMarkers()

          }
        });
        if (member && member.id) {
          console.log('Subscribing to /topic/event/change/' + member.id);
          stompClient.subscribe("/topic/event/change/" + member.id, function (msg) {
            that.getHistory()
            that.getWalletList()
          });
        }
      });
    },

    stopWebsock() {
      if (this.stompClient) {
        try {
          if (this.stompClient.ws && this.stompClient.ws.readyState === WebSocket.OPEN) {
            this.stompClient.ws.close();
          }
          if (this.stompClient.connected) {
            this.stompClient.disconnect(() => {
              console.log("WebSocket 已断开");
            });
          }
        } catch (error) {
        } finally {
          this.stompClient = null;
        }
      }
    },
    noticeCLick() {
      this.$router.push(`/announcementItem/51`);

    },
    getCoin(symbol) {
      return this.coinList.find(item => item.name == symbol);
    },
    getCoinById(id) {
      return this.coinList.find(item => item.id == id);
    },
    handlerBets(direction) {//下注
      this.BettingformStatus = direction
      this.isFlipped = !this.isFlipped;
    },
    getsetting() {
      //获取个人安全信息
      let self = this;
      this.$http.post(this.host + "/approve/security/setting").then(response => {
        var resp = response.body;
        if (resp.code == 0) {
          this.user = resp.data;
          // if (resp.data.realName == null || resp.data.realName == "") {
          //   this.$Notice.error({
          //     title: this.$t("common.tip"),
          //     desc: this.$t("otc.publishad.submittip1")
          //   });
          //   // 判断是否实名认证，未认证跳转到实名认证页面；
          //   //this.$Message.success(this.$t("otc.publishad.submittip1"));
          //   self.$router.push("/uc/safe");
          // } else 
          if (resp.data.phoneVerified == 0) {
            this.$Notice.error({
              title: this.$t("common.tip"),
              desc: this.$t("otc.publishad.submittip2")
            });
            // 判断是否是手机号0，1，未认证跳转到实名认证页面；
            //this.$Message.success(this.$t("otc.publishad.submittip2"));
            self.$router.push("/uc/safe");
          } else if (resp.data.fundsVerified == 0) {
            this.$Notice.error({
              title: this.$t("common.tip"),
              desc: this.$t("otc.publishad.submittip3")
            });
            // 判断是否设置交易密码，未认证跳转到实名认证页面；
            //this.$Message.success(this.$t("otc.publishad.submittip3"));
            self.$router.push("/uc/safe");
          } else if (resp.data.emailVerified == 0) {
            this.$Notice.error({
              title: this.$t("common.tip"),
              desc: this.$t("otc.publishad.submittip5")
            });
            // 判断是否绑定邮箱，未认证跳转到实名认证页面；
            //this.$Message.success(this.$t("otc.publishad.submittip3"));
            self.$router.push("/uc/safe");
          }
        } else {
          this.$Message.error(resp.message);
        }
      });
    },
    formatDate(dateStr) {
      const date = new Date(dateStr);
      return String(date.getHours()).padStart(2, "0") + ':' +
        String(date.getMinutes()).padStart(2, "0") + ':' +
        String(date.getSeconds()).padStart(2, "0");
    },
    transactionRetrunClick() {
      this.isFlipped = !this.isFlipped;
    },

    //确定交易
    BettingClick() {
      // 如果正在提交中，直接返回
      if (this.isSubmitting) {
        this.$Notice.warning({
          title: "提示",
          desc: "正在处理下单请求，请稍候..."
        });
        return;
      }

      if (this.buyNumber == 0) {
        this.$Notice.error({
          title: "提示",
          desc: "请输入数量"
        });
        return;
      }
      this.isSubmitting = true;
      let params = {
        guessCoinId: this.currentCoin.id,
        direction: this.BettingformStatus,
        volume: this.buyNumber
      };

      this.$http.post(this.swapHost + "/guess/bets", params).then(response => {
        var resp = response.body;
        if (resp.code == 0) {

          this.isFlipped = !this.isFlipped;
          this.buyNumber = '';
          this.value1 = 0;
          this.$Notice.success({
            title: "提示",
            desc: "预测下单成功"
          });
          this.initPageData();
          this.clearInput();
        } else {
          this.$Notice.error({
            title: this.$t("exchange.tip"),
            desc: resp.message
          });
        }
      }).catch(error => {
        console.error("下单失败:", error);
        this.$Notice.error({
          title: "提示",
          desc: "下单失败，请稍后再试"
        });
      }).finally(() => {
        this.isSubmitting = false;
      });
    },



    TimeClick(time) {
      this.countdownText = '00:00:00'
      this.progressValue = 0
      this.currentCoin = time
    },
    handleVisibilityChange() {
      if (document.hidden) {
        this.stopWebsock();
      } else {
      }
    },

    moveImageToTarget() {
      const targetBox = document.getElementById('balance');
      const targetRect = targetBox.getBoundingClientRect();
      this.rewardAmount = 0;
      this.imageStyle = {
        position: 'absolute',
        left: `${targetRect.left + window.scrollX + 10}px`,
        top: `${-targetRect.bottom + window.scrollY}px`,
        transform: 'scale(1);',
        transition: 'transform 2s ease, left 2s ease, top 2s ease',
      };
    },

    onSelectTime(index, item) {
      this.symbolList = item
      this.activeTimeIndex = item.id
      this.selectedGuessCycle = item.guessCycle
      console.log('activeTimeIndex', this.activeTimeIndex)
    },

    handleQuickOrder(amount) {
      this.isFocused = false
      // 更新点击次数
      this.quickOrderCounts[amount]++;

      // 计算新的金额
      const currentValue = this.buyNumber ? parseFloat(this.buyNumber) : 0;
      const newValue = currentValue + amount;

      // 检查是否超过可用余额
      if (newValue > this.sumBalance.usdt) {
        this.$Notice.error({
          title: "提示",
          desc: "超过可用余额"
        });
        this.quickOrderCounts[amount]--;
        return;
      }

      console.log('newValue', newValue)

      // 更新输入框的值
      this.buyNumber = newValue.toString();
      console.log('buyNumber', this.buyNumber)

      this.handleInput(this.buyNumber);
    },

    //交易下单上涨
    upBetClick() {
      this.betsFn(1)
    },

    //交易下单下跌
    downBetClick() {
      this.betsFn(2)
    },

    betsFn(status) {
      if (this.buyNumber == 0 || this.buyNumber == '') {
        this.$Notice.error({
          title: "提示",
          desc: "请输入数量"
        });
        return;
      }
      const data = {
        coinId: this.activeTimeIndex,
        direction: status,
        volume: this.buyNumber
      }
      this.$http.post(this.swapHost + "/event-contract/bets", data).then(response => {
        if (response.body.code == 0) {
          this.buyNumber = '';
          this.value1 = 0;
          this.getHistory()
          this.getWalletList()
          this.$Notice.success({
            title: "提示",
            desc: "下单成功"
          });
        } else {
          this.$Notice.error({
            title: "提示",
            desc: response.body.message
          });
        }
      })
    },

    onAnimationEnd() {
      this.show = false;
      this.imageStyle = {
        position: 'absolute',
        left: '50%',
        top: '50%',
        // transform: 'translate(-50%, -50%) scale(0)',
        transition: 'transform 2s ease, left 2s ease, top 2s ease'
      }
      if (this.rewardAmount > 0) {
        this.isCollecting = false;
      }
    },


    initChartResizeObserver() {
      const chartBox = document.getElementById('chart_box');
      if (!chartBox) {
        return;
      }
      this.chartResizeObserver = new ResizeObserver(entries => {
        for (let entry of entries) {
          if (this.$refs.kline.chart) {
            this.$refs.kline.ReSize();
          }
        }
      });
      this.chartResizeObserver.observe(chartBox);
    },

    destroyChartResizeObserver() {
      if (this.chartResizeObserver) {
        this.chartResizeObserver.disconnect();
        this.chartResizeObserver = null;
      }
    },

  }

};
</script>

<style scoped>
/* 强制黑色背景布局覆盖 */
.dark-skin {
  background-color: #000 !important;
  color: #fff !important;
  min-height: 100vh;
}

.dark-skin .ctc_container h1 {
  color: #fff !important;
}

.dark-skin .NewFlex_right {
  background-color: #0c0c0c !important;
  border: 1px solid #1a1a1a !important;
  color: #fff !important;
}

.dark-skin .NewFlex_right_title {
  color: #fff !important;
}

.dark-skin .time_btn {
  background-color: #1a1a1a !important;
  color: #888 !important;
  border: 1px solid #333 !important;
}

.dark-skin .time_btn.active {
  background-color: #333 !important;
  color: #d4ff00 !important;
  border-color: #d4ff00 !important;
}

.dark-skin .el-input__inner {
  background-color: #1a1a1a !important;
  border: 1px solid #333 !important;
  color: #fff !important;
}

.dark-skin .quick-btn {
  background-color: #1a1a1a !important;
  color: #888 !important;
  border: 1px solid #333 !important;
}

.dark-skin .quick-btn:hover {
  background-color: #333 !important;
  color: #fff !important;
}

.dark-skin .available_banner {
  color: #888 !important;
}

.dark-skin .available_banner_num {
  color: #fff !important;
}

.dark-skin .table_box {
  background-color: #0c0c0c !important;
  border: 1px solid #1a1a1a !important;
}

.dark-skin .table_title {
  color: #fff !important;
  border-bottom: 1px solid #1a1a1a !important;
}

::v-deep(.ivu-table td) {
  color: #fff !important;
  background-color: #000;
}

.dark-skin .ivu-table,
.dark-skin .ivu-table-wrapper,
.dark-skin .ivu-table td,
.dark-skin .ivu-table th {
  background-color: transparent !important;
  border-bottom: 1px solid #1a1a1a !important;
  color: #fff !important;
}

.dark-skin .ivu-table th {
  color: #888 !important;
}

.dark-skin .ivu-table-row:hover td {
  background-color: rgba(255, 255, 255, 0.05) !important;
}

.dark-skin .ivu-table-wrapper {
  border: none !important;
}

.dark-skin .ivu-table::before,
.dark-skin .ivu-table::after {
  display: none !important;
}

.dark-skin .items-container-box {
  border: 1px solid #1a1a1a !important;
  background-color: #0c0c0c !important;
}

.dark-skin .el-slider__runway {
  background-color: #333 !important;
}

.dark-skin .el-slider__bar {
  background-color: #d4ff00 !important;
}

.dark-skin .el-slider__button {
  border-color: #d4ff00 !important;
}

.dark-skin .up_btn {
  background-color: #d4ff00 !important;
  color: #000 !important;
}

.dark-skin .down_btn {
  background-color: #f43f5e !important;
  color: #fff !important;
}

.dark-skin .ivu-page-item {
  background-color: #1a1a1a !important;
  border-color: #333 !important;
}

::v-deep(.ivu-page-item) {
  background-color: #1a1a1a !important;
}

::v-deep(.ivu-page-disabled) {
  background-color: #1a1a1a !important;
}

.dark-skin .ivu-page-item a {
  color: #888 !important;
}

.dark-skin .ivu-page-item-active {
  background-color: #333 !important;
  border-color: #d4ff00 !important;
}

.dark-skin .ivu-page-item-active a {
  color: #d4ff00 !important;
}

.dark-skin .ivu-page-prev,
.dark-skin .ivu-page-next {
  background-color: #1a1a1a !important;
  border-color: #333 !important;
}

.dark-skin .ivu-page-prev a,
.dark-skin .ivu-page-next a {
  color: #888 !important;
}

.dark-skin .current-period {
  background-color: #0c0c0c !important;
  border: 1px solid #1a1a1a !important;
}

.ctc .item-title {
  font-size: 20px;
  text-align: center;
  font-weight: bold;
  color: rgb(188, 188, 188);
}

.ctc .red {
  color: #f2334f;
}

.ctc .green {
  color: #d0f500;
}

.ctc .item-title .unit {
  font-size: 14px;
}

.option {
  position: relative;
}

.option .item-desc {
  font-size: 12px;
  text-align: center;
  color: #7c7f82;
}

.option .notice-bottom {
  margin-top: 5px;
  height: 55px;
  background-color: #192330;
  padding-top: 12px;
  color: rgb(42, 147, 255);
}

.option .notice-btn-left {
  height: 30px;
  line-height: 30px;
  width: 42%;
  margin-left: 5%;
  float: left;
  border-radius: 3px;
  border: 1px solid rgb(0, 116, 235);
}

.option .notice-btn-left:hover {
  cursor: pointer;
}

.option #sendCode {
  position: absolute;
  border: none;
  background: none;
  top: 6px;
  outline: none;
  right: 0;
  width: 30%;
  color: #f0ac19;
  cursor: pointer;
  height: 20px;
  line-height: 20px;
  border-left: 1px solid #dddee1;
}

.option .notice-btn-right {
  height: 30px;
  line-height: 30px;
  width: 42%;
  margin-right: 5%;
  float: right;
  border-radius: 3px;
  border: 1px solid rgb(0, 116, 235);
}

.option .notice-btn-right:hover {
  cursor: pointer;
}

.option .ivu-tabs-bar {
  border-bottom: 1px solid #323c53;
  font-size: 18px;
}

.option .ivu-tabs-nav .ivu-tabs-tab:hover {
  color: #f0a70a;
}

.option .ivu-tabs-nav .ivu-tabs-tab:hover,
.option .ivu-tabs-nav .ivu-tabs-tab-active {
  color: #f0a70a;
  font-size: 18px;
}

.option .ivu-tabs-ink-bar {
  background-color: #f0a70a;
}

.option .buy_total {
  border-top: 1px solid #323c53;
  padding-top: 30px;
  margin-bottom: 30px;
}

.option .trade_bd_ctc {
  width: 100%;
  min-width: 1160px;

}

.option .trade_bd_ctc .panel {
  position: relative;
  z-index: 2;
  float: left;
  width: 100%;

  margin-top: 0;
  margin-right: 0;
  border: 0 solid transparent;
  padding-top: 15px;
}

.option .trade_panel {
  background: transparent !important;
}

.option .trade_panel .panel .hd {
  line-height: 20px;
  height: 20px;
  border-bottom: 1px solid #1F2943;
  margin-bottom: 5px;
}

.option .trade_panel .panel .hd span {
  padding-left: 0;
  font-size: 12px;
  margin: 0 3px;
  float: right;
}

.ctc-order-status {
  text-align: center;
  margin-bottom: 15px;
  background: #f0a70a;
  padding: 5px 0px;
  border-radius: 2px;
  color: #000000;
}

.option .trade_panel .panel .hd b {
  padding-left: 0;
  font-size: 12px;
  color: #7A98F7;
  float: right;
}

.option .trade_panel .panel .hd.hd_login a {
  float: right;
  text-decoration: none;
  font-size: 12px;
  margin-right: 10px;
}

.option .trade_panel .panel.panel_buy {}

.option .trade_panel .panel.panel_sell {
  padding-right: 15px;
  padding-left: 15px;
  margin-left: 5px;
}

.option .trade_wrap .buy-input .ivu-input {
  color: rgb(220, 142, 0);
  font-weight: bold;
  font-size: 20px;
  height: 35px;
}

.option .trade_wrap .sell-input .ivu-input {
  color: #f2334f;
  font-weight: bold;
  font-size: 20px;
  height: 35px;
}

.option .ivu-tabs {
  color: #a5a5a5;
}

.option .trade_wrap .trade-input .ivu-input {
  border: 1px solid #27313e;
  color: #fff;
  height: 35px;
  border-radius: 0;
}

.option .trade_wrap .ivu-input-wrapper {
  outline: none;
}

.option .trade_wrap .ivu-input:focus,
.option .trade_wrap .ivu-input:hover {
  box-shadow: none;
  outline: none;
}

.option .trade_wrap .ivu-input-number-input:focus,
.option .trade_wrap .ivu-input-number-input:hover {
  box-shadow: none;
  border-color: #41546d;
  outline: none;
}

.option .trade_wrap .ivu-input:hover {
  box-shadow: none;
  outline: none;
}

.option .trade_wrap .ivu-input-number-input:hover {
  box-shadow: none;
  border-color: #41546d;
  outline: none;
}

.option .trade_wrap .ivu-form-item-content input {
  padding-left: 5px;
  text-align: center;
  padding-right: 55px;
  font-size: 16px;
}

.option .trade_wrap .ivu-form-item-content input::-webkit-input-placeholder {
  font-size: 14px;
  margin-bottom: 10px;
  text-align: left;
}

.option .trade_wrap .trade-input input::-webkit-input-placeholder {}

.option .trade_wrap .ivu-form-item-content label.before {
  position: absolute;
  top: 4px;
  left: 10px;
  color: #7c7f82;
  z-index: 2;
  font-size: 14px;
}

.option .trade_wrap .ivu-form-item-content label.after {
  position: absolute;
  top: 4px;
  right: 10px;
  color: #7c7f82;
  font-size: 14px;
}


.trade_bd_ctc Button.bg-red {
  background-color: #f15057;
}

.trade_bd_ctc Button.bg-red:hover {
  background-color: #ff7278;
}

.div_box {
  width: 200px;
  height: 50px;
  background-color: white;
  border-radius: 10px;
  clip-path: polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%);
}


.trade_bd_ctc Button.bg-green {
  background-color: #00b275;
}

.trade_bd_ctc Button.bg-green:hover {
  background-color: #01ce88;
}

.trade_bd_ctc Button.bg-gray {
  background-color: #35475b;
  cursor: not-allowed;
  color: #9fabb5;
}

.trade_bd_ctc Button.bg-gray:hover {
  color: #9fabb5 !important;
}

.trade_bd_ctc Button:hover {
  /* background: #54679F; */
}

.option .trade_wrap .ivu-btn {
  color: #FFF !important;
}

.option .total {
  min-height: 90px;
}

.trade-input .ivu-form-item-content .ivu-radio-group .ivu-radio-wrapper {
  cursor: auto !important;
}

.option .trade_wrap .ivu-btn.ivu-btn-small {
  padding: 2px 5px !important;
}

.option .ivu-progress .ivu-progress-outer .ivu-progress-inner {
  background-color: #5d4920;
  border-radius: 0px;
}

.deposit_flex {
  position: absolute;
  z-index: 100;
  height: 25px;



  .deposit_flex_title {
    white-space: nowrap;
    font-weight: 700;
    color: white;
  }
}

.deposit_flex_now {
  position: absolute;
  z-index: 100;
  height: 25px;
}



.deposit_flex_n {
  width: 89px;
  position: absolute;
  height: 25px;
  top: 4px;
  right: 4px;
}

.deposit_flex_n_down {
  width: 89px;
  position: absolute;
  z-index: 100;
  height: 25px;
  bottom: 16px;
  right: 4px;
}

.deposit_flex_up {
  margin-top: 30px;
  font-size: 14px;
  color: #f0a70a;
}

.deposit_flex_down {
  width: 100%;
  text-align: end;
  font-size: 14px;
  color: #DF484C;
}

.deposit_flex_d {
  margin-left: 10px;
  text-align: end;
  font-size: 14px;
  color: #DF484C;
}

.color_green {
  color: #00b275;
}

.color_red {
  color: #f15057;
}

.color_gold {
  color: #000;
}


.current-period {
  position: relative;
  overflow: hidden;
  background-size: 500% 500%;
  animation: gradientBG 5s ease infinite;
}

.Btn_n.active {
  background-color: #D0F500;
  color: #000;
  border-color: #1EC6B6;
  font-weight: bold;
}

@keyframes span1 {
  0% {
    left: 50%
  }

  100% {
    left: 100%;
  }
}

@keyframes span2 {
  0% {
    top: -70px;
  }

  100% {
    top: 100%;
  }
}


@keyframes span3 {
  0% {
    right: 40%;
  }

  100% {
    right: 100%;
  }
}

@keyframes span4 {
  0% {
    top: -70px;
  }

  100% {
    top: 100%;
  }
}

@keyframes span5 {
  0% {
    left: 40%;
  }

  100% {
    left: 100%;
  }
}

.last-period {
  background-size: 400% 400%;
  animation: gradientBG 5s ease infinite;
}

@keyframes gradientBG {
  0% {
    background-position: 0% 0%;
  }

  50% {
    background-position: 50% 100%;
  }

  100% {
    background-position: 0% 0%;
  }
}

.option .ctc-container {
  width: 100%;
}

.option-tab {
  position: relative;
  width: 100%;
  margin-bottom: 10px;
  border-bottom: 1px solid #323c53;
}

.option-tab:after {
  height: 1px;
  background: #FFF;
  width: 100%;
  position: absolute;
  bottom: 1px;
}

.option-tab-item {
  float: left;
  margin-right: 10px;
  padding: 5px 10px;
  font-size: 17px;
}

.option-tab-item:hover {
  cursor: pointer;
}

.option-tab-current {
  border-bottom: 2px solid #f0a70a !important;
  color: #f0a70a !important;
}

.option .ivu-progress-text-inner {
  display: inline-block;
  width: 40px;
}

.option iframe {
  height: 240px !important;
}
</style>

<style lang="scss" scoped>
.option {
  height: 100%;
  background-size: cover;
  position: relative;
  overflow: hidden;
  padding-bottom: 50px;
  padding-top: 50px;
}

.option .bannerimg {
  display: block;
  width: 100%;
}

.option .ctc_container {
  height: 100%;

  >h1 {
    margin-top: -150px;
    font-size: 32px;
    line-height: 1;
    padding: 50px 0 20px 0;
    letter-spacing: 3px;
  }
}

.option .main {
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  flex-wrap: wrap;
}

.ctc-container {
  min-height: 470px;
}

.bottom-panel {
  border-top: 1px solid rgb(237, 237, 237);
  margin-top: 15px;

  .bottom {
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    span {
      font-size: 12px;
      color: #a7a7a7;
      margin-top: 15px;
    }

    button,
    a {
      margin-top: 11px;
    }

    a.ivu-btn-primary {
      background: #0095ff;
    }

    a.ivu-btn-primary:hover {
      background: #2ba7ff;
    }
  }
}

.right {
  float: right;
}

.left {
  float: left;
}

.gray {
  color: #a7a7a7;
}

.option .quantity-group {
  .quantity-item {
    display: inline-block;
    padding: 0px 15px;
    border-radius: 3px;
    border: 1px solid #515a6e;
    margin-left: 15px;

    &:hover {
      border: 1px solid #f0ac19;
      cursor: pointer;
    }
  }

  .current {
    border: 1px solid #f0ac19;
    color: #f0ac19;
  }
}

.result-panel {
  border-radius: 5px;
  min-height: 310px;
  background: #0b1520;
  width: 100%;
  text-align: left;
  padding: 10px 10px;
  margin-bottom: 10px;

  .title-switch {
    display: inline-block;
    margin: 0 8px;
    padding: 0px 3px 3px 3px;
    border-bottom: 2px solid #0b1520;

    &:hover {
      cursor: pointer;
      color: #f0a70a;
    }
  }

  .switch-current {
    color: #f0a70a !important;
    border-bottom: 2px solid #f0a70a !important;
  }

  .result-item {
    width: 5%;
    display: inline-block;
    margin-bottom: 30px;
    float: left;

    .item-title {
      width: 100%;
      text-align: center;

      span {
        display: inline-block;
        width: 100%;
        line-height: 20px;
        font-size: 13px;
      }
    }

    .item-body {
      width: 100%;
      text-align: center;
      color: #FFF;
      font-weight: bold;
      margin-top: 10px;

      span {
        display: inline-block;
        height: 25px;
        line-height: 25px;
        width: 25px;
        border-radius: 25px;
        font-size: 16px;
        font-weight: bold;

        i {
          margin-top: -4px;
        }
      }

      .tip-item {
        span {
          display: inline-block;
          width: 60px;
          font-size: 10px;
          height: 16px;
          line-height: 16px;
          text-align: right;
          font-size: 8px;
          font-weight: normal;
        }
      }
    }

    &:not(:last-child) {
      border-right: 1px dashed #2c3038;
    }

    &:nth-child(20) {
      border-right: none;
    }
  }
}

.decline_Data {
  align-items: center;
  display: flex;
  flex-direction: column;
  left: 0px;
  justify-content: center;
  position: absolute;
  top: 10px;
  width: 100%;
}

.decline_Data_now {
  align-items: center;
  display: flex;
  flex-direction: column;
  left: 0px;
  justify-content: center;
  position: absolute;
  top: 15%;
  width: 100%;
}

.bg-green {
  background: #00b275;
}

.bg-red {
  background: #f2334f;
}

.bg-gray {
  background: #585858;
}

.price_row {
  display: flex;
  align-items: center;
  justify-content: center;

  .Btn_n {
    white-space: nowrap;
    text-align: center;
    width: 20% !important;
    margin-right: 15px;
  }
}

.content {
  padding: 0 10px;
  box-sizing: border-box;
  position: relative;

  .label_title {
    width: 90px;
    padding: 1px 10px;
    white-space: nowrap;
    font-weight: 700;
    border-radius: 10px;
    border: 1px solid #f0a70a;
    color: #f0a70a;
    position: absolute;
    top: 5px;
    left: 10px;

    .label_title_value {
      text-align: center;
      line-height: 12px;
    }
  }
}

.label_title_now {
  padding: 1px 10px;
  white-space: nowrap;
  font-weight: 700;
  border-radius: 10px;
  border: 1px solid #f0a70a;
  color: #f0a70a;
  position: absolute;
  top: 20px;
  left: 10px;



  .label_title_value {
    text-align: center;
    line-height: 12px;
  }

}

.label_title_now_now {
  padding: 1px 10px;
  white-space: nowrap;
  font-weight: 700;
  border-radius: 10px;
  border: 1px solid #f0a70a;
  color: #f0a70a;

  .label_title_value {
    text-align: center;
    line-height: 12px;
  }
}

.last-period {
  width: 100%;
  border-radius: 5px;
  margin-bottom: 10px;
  min-height: 40px;
  padding: 0 20px;

  .period-content {
    width: 100%;
    display: flex;
    justify-content: space-between;
    width: 560px;
    float: left;
    height: 40px;
    line-height: 40px;
    font-size: 12px;

    .content-item {
      float: left;
      width: 33%;
      text-align: center;

      span:nth-child(1) {
        display: inline-block;
        height: 20px;
        line-height: 20px;
        padding: 0px 8px;
        border-radius: 3px;
      }

      .direction {
        display: inline-block;
        height: 20px;
        line-height: 20px;
        background: #FFF;
        padding: 0px 8px;
        border-radius: 3px;
        box-shadow: 2px 2px 5px 0px #00000047;
      }
    }
  }
}

.current-period {
  min-height: 170px;
  width: 100%;
  padding: 10px 10px;
  border-radius: 5px;

  .period-title {
    display: inline-block;
    width: 100%;
    text-align: center;
    font-size: 24px;
    font-weight: bold;
  }

  .period-time {
    display: inline-block;
    width: 100%;
    text-align: center;
    font-size: 14px;
    margin-bottom: 20px;
    letter-spacing: 1px;
  }

  .period-reward {
    width: 33.3%;
    float: left;
    padding: 10px 0px;
    background: #111a25;

    &:not(:last-child) {
      border-right: 2px dashed #0b1520;
    }

    &:first-child {
      border-top-left-radius: 10px;
      border-bottom-left-radius: 10px;
    }

    &:last-child {
      border-top-right-radius: 10px;
      border-bottom-right-radius: 10px;
    }
  }

}

.dropdown {
  position: relative;
  display: inline-flex;
  align-items: center;
  background-color: #24313c;
  /* 背景颜色 */
  padding: 10px;
  border-radius: 10px;
  cursor: pointer;

}

.relative {
  position: relative;
}

.currency {
  margin-right: 30px;
  font-size: 20px;
  color: white;

}

.price {
  font-size: 20px;
  color: #a3a3a4;
  margin-right: 5px;

}

.arrow {
  font-size: 16px;
  color: #000;
  /* 箭头颜色 */
}

.dropdown-content {
  width: 100%;
  display: block;
  position: absolute;
  background-color: #22313C;
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  z-index: 1;
}

.dropdown {
  margin: 0 auto;
}

.dropdown-item_left {
  color: #6a0dad;

}

.dropdown-item_right {
  color: #a3a3a4;
}


.dropdown-item {
  cursor: pointer;
  color: black;
  text-decoration: none;
  display: block;
}

.padding {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
}

.dropdown-item:hover {
  background-color: #5e5b5b;
}

.dropdown_box {
  margin-bottom: 20px;
}

.dropdown_box_center {
  display: flex;
  align-items: center;
  justify-content: center;
}

.dropdown-item_left {
  margin-right: 30px;
}

.flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.f_a_c {
  display: flex;
  align-items: center;

}

.box-card {
  border-radius: 20px;
  // width: 300px;
  margin: 10px;
  border: none;
}


.indicator_top {
  font-size: 18px;
  font-weight: 700;
}

.indicator_down {
  font-size: 16px;
  font-weight: 700;
}

.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
}

::v-deep(.el-carousel__mask) {
  background-color: transparent;
}

::v-deep(.el-slider__button) {
  border: 2px solid #000;
}

::v-deep(.el-slider__bar) {
  background-color: #fff;
}


// .el-carousel__item:nth-child(2n+1) {
//   background-color: #d3dce6;
// }

.black {
  color: black;
}

.white {
  color: white;
}


.indicator {
  margin-bottom: -1px;
  font-weight: 700;
  border-radius: 8px;
  position: relative;
  text-align: center;
}

.indicator_b {
  margin-top: 20px;
  text-align: center;
  position: relative;
  width: 100%;
  font-weight: 700;
  border-radius: 8px;
}

.indicator_bottom {
  text-align: center;
  position: relative;
  width: 100%;
  font-weight: 700;
  border-radius: 8px;
}

.up {
  background-color: #1EC6B6;
}

.down {
  border-radius: 7px;
  background-color: #DF484C;
  color: white;
  font-size: 15px;
  padding: 4px 10px;
  font-weight: 700;

}

.rate {
  font-size: 14px;
}

.price-info {
  border-radius: 8px;
  padding: 12px;
}

.price-info_b {
  border-radius: 8px;
  padding: 12px
}

.price-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.label {
  color: #666;
  font-size: 14px;
  font-weight: 600;
  text-align: start;
}

.value {
  color: #767676;
  font-weight: 500;
}

::v-deep(.el-card__header) {
  background-color: #27313D;
  border: none !important;
  color: #BEC5D0;
  font-weight: bold;
  padding: 7px;
}

::v-deep(.el-card__body) {}

.box-Newcard {
  border: none;
  border-radius: 20px;
  flex: 1;
}

.NewFlex {
  height: 600px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

::v-deep(.el-card__header) {
  background-color: #27313D;
  color: #c7acfa;
  font-weight: bold;
  border: none;
  padding: 7px;
}

::v-deep(.el-card__body) {
  display: flex;
  flex-direction: column;
  border: none;
  justify-content: space-between;
  padding: 0 10px 10px 10px;
}


.green {
  color: #d0f500;
  font-weight: 700;
}

.greenBg {
  color: white;
  background-color: #d0f500;
  border-radius: 7px;
  padding: 4px 10px;
  font-size: 15px;
  font-weight: 700;
}

.purpleBg {
  color: white;
  background-color: #ed4014;
  border-radius: 7px;
  padding: 4px 10px;
  font-size: 15px;
  font-weight: 700;
}

.price-flat {
  color: white;
  background-color: rgb(136, 136, 136);
  border-radius: 7px;
  padding: 4px 10px;
  font-size: 15px;
  font-weight: 700;
}

.purple {
  color: #DF484C !important;
  font-weight: 700;
}

.pentagon {
  position: relative;
  width: 100px;
  border-bottom: 70px solid #f00;
  border-left: 35px solid transparent;
  border-right: 35px solid transparent;
  height: 0;
  margin: 50px auto;
}

.pentagon:after {
  content: "";
  position: absolute;
  left: -35px;
  top: 70px;
  width: 0;
  border-left: 70px solid transparent;
  border-right: 70px solid transparent;
  border-top: 40px solid #f00;
}

.rate {
  font-size: 14px;
  font-weight: 700;
}

.label_ovo {
  color: #7a7a7d;
  font-size: 14px;
  font-weight: 700;
  text-align: start;
}

.color_box {
  margin-top: 5px;
  margin-bottom: 13px;
}

.buy_box {
  height: 100%;
  border: none;
  border-radius: 20px;
  background-color: #15232F;
}

::v-deep(.el-card__header) {
  background-color: #7746D5;
  color: white;
  font-weight: bold;
  border: none;
  padding: 7px;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
}

::v-deep(.el-card__body) {
  height: 90%;
  display: flex;
  flex-direction: column;
  border: none;
  justify-content: space-between;
  padding: 0 20px 20px 20px;

}

.buy_box_top {}

.buy_box_input {
  width: 100%;
}

::v-deep(.el-input__inner) {
  border: 1px solid #eaeaed;
  border-radius: 10px;
}

.t_left {
  text-align: left;
}

.balance {
  text-align: end;
  margin-top: 4px;
  font-size: 14px;
  color: #A098C1;
}

.Options_bottom_title {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 5px;
}

.Options_bottom {
  margin-bottom: 20px;
}

.Btn_n {
  width: 18% !important;
  padding: 4px 15px;
  cursor: pointer;
  border: none;
  border-radius: 5px;
  --un-text-opacity: 1;
  color: rgba(142, 142, 146, var(--un-text-opacity));
  text-align: center;
  background-color: #f8f8f8;
  font-weight: 700;
}

.margin {
  padding: 10px 0;

  .Btn_n {
    &:hover {
      color: #000;
      background-color: #D0F500;
    }
  }
}

.rise {
  position: relative;
  cursor: pointer;
  padding: 15px 0;
  border-radius: 10px;
  width: 49%;
  border: none;
  font-size: 18px;
  font-weight: 700;
  background-color: #D0F500;
}

.decline {
  cursor: pointer;
  padding: 15px 0;
  border-radius: 10px;
  width: 49%;
  border: none;
  font-size: 18px;
  font-weight: 700;
  background-color: #ed4014;
}

.buy_box_bottom {
  color: #A69EC4;
  margin-top: 20px;
  font-size: 14px;
  font-size: 700;
}

.magin {
  margin-top: 15px;
}

.buy_box_info_top {
  padding: 10px 0;

  div {
    color: white;
    font-size: 16px;
    font-weight: 700;
  }
}

.buy_box_info_top_box {
  display: flex;
  align-items: center;
  background-color: #D0F500;
  padding: 4px 10px;
  border-radius: 6px;
}

.buy_box_info_down_box {
  display: flex;
  align-items: center;
  background-color: #DF484C;
  padding: 4px 10px;
  border-radius: 6px;
}

::v-deep(.Options_bottom th) {
  background-color: #28313D;
  border: none !important;
}

::v-deep(.Options_bottom td) {
  background-color: #0d141e;
  border: none !important;
  color: white;
}

::v-deep(.Options_bottom .el-table) {
  border: none !important;
}

::v-deep(.Options_bottom .el-table::before) {
  background-color: #0d141e !important;
}

::v-deep(.Options_bottom .el-table tbody tr:hover>td) {
  background-color: #17202b !important
}

.row {
  background-color: #17232F;
}

.demonstration_color {
  color: #a5a5a5;
}

::v-deep(.block .el-slider .el-slider__runway .el-slider__bar) {
  background-color: #000;
}

::v-deep(.block .el-slider .el-slider__runway) {
  background-color: #28292a !important;
  height: 4px;
}

::v-deep(.el-slider__runway) {
  background-color: #28292a !important;
}

.items-container-box {
  border: 1px solid #eaeaed;
  padding: 10px;
  border-radius: 12px;
  margin: 0 10px;
}


.items-container {
  display: flex;
  flex-direction: row-reverse;
  overflow-x: auto;
  gap: 10px;
  padding: 10px 0;
}


.item {
  opacity: 0.5;
  flex: 0 0 auto;
  width: 300px;
  min-width: 200px;
  border: 1px solid rgb(75, 75, 75);
  border-radius: 10px;
  box-sizing: border-box;

}

.item:hover {
  opacity: 1;
}

.box-card {
  height: 100%;
}

.clearfix {
  display: flex;
  justify-content: space-between;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
}

.clearfix1 {
  display: flex;
  justify-content: space-between;
}


.Card_box {
  border: 1px solid #4b4b4b;
  border-radius: 19px;
}

.upData {
  align-items: center;
  display: flex;
  flex-direction: column;
  left: 0px;
  height: 100%;
  justify-content: center;
  position: absolute;
  top: 0;
  width: 100%;
}

.card_info_box {
  position: relative;

  .card_info_box_svg {}
}

.indicator_info {
  height: 65px;
}

.transaction_head {
  background-color: #7746D5;
  color: white;
  font-weight: bold;
  border: none;
  padding: 10px;
  border-radius: 10px 10px 0 0;
}

.transaction_info {
  border-radius: 10px;

  .rise {
    width: 100%;
    height: 100px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  }

  .decline {
    margin-top: 10px;
    width: 100%;
    height: 100px;
    box-shadow: 0 7px 10px rgba(0, 0, 0, 0.3);

  }
}

.card-info {
  padding: 50px 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.Betting_form {
  padding: 30px 20px;
}

.Betting_btn {
  margin-top: 20px;

  .Betting_btn_up {
    cursor: pointer;
    width: 60%;
    font-size: 18px;
    font-weight: 700;
    border: none;
    border-radius: 10px;
    background-color: #D0F500;
    color: white;
    padding: 12px 20px;
  }

  .Betting_btn_down {
    cursor: pointer;
    width: 60%;
    font-size: 18px;
    font-weight: 700;
    border: none;
    border-radius: 10px;
    background-color: #DF484C;
    color: white;
    padding: 12px 20px;
  }
}

.Time_label_select {
  padding: 5px 20px;

  .Time_label {
    margin-top: 3px;
    text-align: start;
    color: #666;
  }
}

.reward_box {
  margin-left: 30px;
  height: 40px;
  line-height: 40px;
  font-size: 12px;
  float: right;
  display: flex;
  align-items: center;
  position: relative;

  .Noreward {
    color: #000;
  }

  button {
    padding: 0px 15px;
    height: 28px;
    line-height: 28px;
    background: #7746D5;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }

  .flex {
    display: flex;
  }
}

.Time_Icon {
  color: white;
  font-size: 17px;
  margin-top: -2px;
}

.coin-animation {
  position: fixed;
  pointer-events: none;
  z-index: 9999;
}

#app {
  position: relative;
  text-align: center;
}

.target-box {
  position: absolute;
  top: 200px;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 20px;
  background-color: lightgray;
  text-align: center;
  line-height: 150px;
}

.animated-image_box {
  height: 100%;
  width: 100%;
}

.animated-image {
  width: 550px;
  height: 500px;
  z-index: 100000;
  left: 50%;
  position: absolute;
  animation: moveToTarget 2s forwards;
}

@keyframes moveToTarget {
  0% {
    transform: translateX(-50%) translateY(-50%) scale(0);
    opacity: 0;
  }

  50% {
    transform: translateX(-50%) translateY(0) scale(1.2);
    opacity: 1;
  }

  100% {
    transform: translateX(0) translateY(0) scale(1);
    opacity: 1;
  }
}

.dropdown {
  position: absolute;
  top: 100%;
  background: #0b1520;
  padding: 5px;
  z-index: 10;
}

.dropdown {
  position: absolute;
  top: 100%;
  background-color: #0D151F;
  border: 1px solid #333;
  border-radius: 5px;
  z-index: 1000;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  display: none;
  min-width: 100px;
}

.dropdown button {
  display: block;
  width: 100%;
  text-align: left;
  padding: 8px 12px;
  border: none;
  background-color: transparent;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s;
}

.more-wrapper .dropdown {
  display: block;
}

.table_box {
  border: 1px solid #eaeaed;
  border-radius: 12px;
  padding: 0 10px;
  margin: 0 10px;
}

.table_title {
  padding: 10px 0;

}

::v-deep(.page) {
  padding: 10px 0;
  display: flex;
  justify-content: flex-end;
}

.dropdown button:hover {
  border-radius: 5px;
  background-color: #292B31;
}

.dropdown button.active {
  background-color: #292B31;
  border-radius: 5px;
  color: white;
}

.slider {
  // background-color: ;
}

::v-deep(.slider .el-slider__stop) {
  width: 12px;
  height: 12px;
  border: 2px solid #28292a;
  background-color: #070808;
  margin-top: -3px;
}

::v-deep(.slider .color-red) {
  background-color: #000;
  border: 2px solid #fff !important;
}

::v-deep(.el-tooltip) {
  border: 2px solid #fff !important;
  background-color: #000 !important;
}

.stop-active {}

.deposit_flex_down {
  position: absolute;
  top: 20px;
}

.quick-order-btns {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.quick-btn {
  z-index: 100;
  padding: 5px 15px;
  border-radius: 5px;
  background-color: #f8f8f8;
  --un-text-opacity: 1;
  border: none;
  color: rgba(142, 142, 146, var(--un-text-opacity));
  cursor: pointer;
  font-weight: 700;
  min-width: 80px;
}

.quick-btn:hover {
  color: #000;
  background-color: #d0f500;
}

.UnderMaintenance {
  width: 230px;
  height: 300px;
}

.UnderMaintenance_text {
  color: #666;
  font-size: 28px;
  font-weight: 700;
  margin-top: 180px;
}

.NewFlex_left {
  width: 76%;
  height: 600px;
  border: 1px solid #292929;
  border-radius: 12px;
  padding: 10px;
}

.NewFlex_right {
  height: 100%;
  width: 23%;
  min-width: 380px;
  border: 1px solid #292929;
  border-radius: 20px;
  padding: 15px 20px;
  box-sizing: border-box;

  .NewFlex_right_title {
    font-size: 20px;
    font-weight: 700;
    color: #000;


  }
}

.time_btn {
  flex: 1;
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  color: #374151;
  cursor: pointer;
  transition: all .2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.time_btn:hover {
  background: #f3f4f6;
}

.time_btn.active {
  border-color: #111827;
}

.placeOrder_input_box {
  margin-top: 20px;
  height: 40px;
  border-radius: 30px;
  display: flex;
  align-items: center;

  .placeOrder_input {
    padding: 0 20px;
    border: none;
    width: 100%;
    outline: none;
    background-color: #f5f6f7;
  }
}

.available_banner {
  font-size: 14px;
  color: #84888c;
}

.available_banner_num {
  font-size: 14px;
  color: #000;
}

.bet_btn_box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 30px;
  gap: 20px;

  .up_btn {
    cursor: pointer;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f74b60;
    height: 50px;
    color: #fff;
    border-radius: 30px;
  }

  .down_btn {
    cursor: pointer;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #2bc287;
    height: 50px;
    color: #fff;
    border-radius: 30px;

  }
}

::v-deep(.ivu-table-header th) {
  background-color: #000 !important;
  border-bottom: 1px solid #1a1a1a;
  color: #8e8e92;
}

::v-deep(.ivu-table-tip td) {
  background-color: #000 !important;
  border-bottom: 1px solid #1a1a1a;

}

::v-deep(.ivu-table:before) {
  background-color: #1a1a1a;
}

::v-deep(.ivu-table:after) {
  background-color: #1a1a1a;
}

::v-deep(.el-input__inner) {
  border: 1px solid #28292A;
  background-color: #28292A !important;
}
</style>
