<template>
  <div class="nav-rights">
    <div class="nav-right col-xs-12 col-md-10 padding-right-clear">
      <div class="bill_box rightarea padding-right-clear">
      </div>
    </div>
    <Modal v-model="modal" :title="$t('uc.finance.money.match')" @on-ok="matchGCC">
      <P style="font-weight: bold;padding: 10px 0;">{{ $t('uc.finance.money.matchtip1') }}：{{ GCCMatchAmount }}</p>
      <p>
        <span>{{ $t('uc.finance.money.matchtip2') }}：</span>
        <InputNumber style="width: 150px;" type="text" v-model="matchAmount"
          :placeholder="$t('uc.finance.money.matchtip2')"></InputNumber>
      </p>
    </Modal>
    <Modal v-model="modal_msg" :title="$t('uc.finance.money.match')">
      <p>{{ match_msg }}</p>
    </Modal>
    <Modal v-model="transModal" @on-ok="confrimTrans" :title="$t('uc.finance.money.onkeytrans')">
      <p>{{ $t('uc.finance.record.chooseTransCoinUnit') }}：
        <Select v-model="toUnit" style="width: 400px;">
          <Option v-for="item in transList" :value="item" :key="item">{{ item }}</Option>
        </Select>
      </p>
      <p style="margin-top: 15px;">{{ $t('uc.finance.record.inputTransAmount') }}：
        <InputNumber style="width: 400px;" type="text" v-model="transAmount"
          :placeholder="$t('uc.finance.money.matchtip2')"></InputNumber>
      </p>
    </Modal>


    <Modal v-model="quickExchangeModal" @on-ok="confrimExchange" :title="$t('uc.finance.record.quickExchange')">
      <h2 style="text-align:center;">{{ $t('uc.finance.record.currentRate') }}： <span style="color: #45b854">{{
        priceRate |
        fixed2 }} </span></h2>
      <p style="margin-top: 15px;">{{ $t('uc.finance.record.from') }}：
        <Select v-model="fromExchangeCoin" style="width: 450px;">
          <Option v-for="item in fromCoinList" :value="item" :key="item">{{ item }}</Option>
        </Select>
      </p>
      <p style="margin-top: 15px;">{{ $t('uc.finance.record.to') }}：
        <Select v-model="toExchangeCoin" style="width: 450px;">
          <Option v-for="item in toCoinList" :value="item" :key="item">{{ item }}</Option>
        </Select>
      </p>
      <p style="margin-top: 15px;">{{ $t('uc.finance.record.inputexchangeamount') }}:
        <InputNumber style="width: 330px;" type="text" v-model="exchangeAmount"
          :placeholder="$t('uc.finance.record.inputexchangeamount')"></InputNumber>
        <span style="margin-left: 10px;font-weight: bold;">{{ fromExchangeCoin }}</span>
      </p>
      <p style="margin-top: 15px;">{{ $t('uc.finance.record.predictAmount') }}:
        <InputNumber style="width: 330px;" disabled type="text" v-model="predictAmount"></InputNumber>
        <span style="margin-left: 10px;font-weight: bold;">{{ toExchangeCoin }}</span>
      </p>
      <p style="margin-top: 15px;">{{ $t('uc.finance.record.inputexchangepasswd') }}:
        <Input style="width: 400px;" type="password" v-model="exchangePassword"
          :placeholder="$t('uc.finance.record.inputexchangepasswd')"></Input>
      </p>
    </Modal>
    <div class="order-table">
      <Table :no-data-text="$t('common.nodata')" :columns="tableColumnsRecord" :data="filteredRecords"
        :disabled-hover="true" :loading="loading"></Table>
      <div style="margin: 10px;overflow: hidden">
        <div style="float: right;">
          <Page :total="total" :pageSize="pageSize" show-total :current="page" @on-change="changePage"
            id="record_pages"></Page>
        </div>
      </div>
    </div>
  </div>

</template>
<script>

// import RechargeBsc from "./RechargeBsc.vue";
// import WithdrawBsc from "./WithdrawBsc.vue";
export default {
  components: {
    // RechargeBsc,WithdrawBsc

  },
  data() {
    return {
      GCCMatchAmount: 0,
      matchAmount: 0,
      modal: false,
      loginmsg: this.$t("common.logintip"),
      loading: true,
      ordKeyword: "",
      tableMoney: [],
      tableMoneyShow: [],
      filteredRecords: [],
      canMatch: true,
      modal_msg: false,
      match_msg: "",
      searchKey: "",
      transModal: false,
      pageSize: 10,
      page: 1,
      total: 0,
      tableRecord: [],
      toUnit: "",
      fromUnit: "",
      transAmount: 0,
      transList: ["USDT", "EUSDT", "TUSDT"],
      quickExchangeModal: false,
      rechargeBsc: false,
      withdrawBsc: false,
      fromExchangeCoin: "CCASH",
      toExchangeCoin: "USDT",
      fromCoinList: ["CCASH"],
      toCoinList: ["USDT"],
      exchangeAmount: 0,
      exchangePassword: "",
      predictAmount: 0,
      priceRate: 7.0,
      rechargeToken: null,
      withdrawToken: null,
      balance: 0
    };
  },
  filters: {
    fixed2: function (value) {
      return value.toFixed(2);
    }
  },
  methods: {
    confirmRecharge() {
      this.$refs.rechargeModel.rechargeHandler()
    },
    confirmWithdraw() {
      this.$refs.withdrawModel.withdrawHandler()
    },
    overWithdraw() {
      this.withdrawBsc = false
      this.getMoney()
    },
    seachInputChange() {
      this.tableMoneyShow = this.tableMoney.filter(item => item["coinType"].indexOf(this.searchKey) == 0);
    },
    toQuickExchange() {
      this.quickExchangeModal = true;
    },
    changePage(pageindex) {
      this.page = pageindex;
      this.getList(this.page);
    },
    confrimExchange() {
      let params = {};
      params["toUnit"] = this.toExchangeCoin;
      params["fromUnit"] = this.fromExchangeCoin;
      params["amount"] = this.transAmount;
      params["jyPassword"] = this.exchangePassword;
      this.$http
        .post(this.host + "/asset/wallet/quick-exchange", params)
        .then(response => {
          var resp = response.body;
          if (resp.code == 0) {
            this.$Message.success(resp.message);
          } else {
            this.$Message.error(resp.message);
          }
          this.quickExchangeModal = false;
        });
      return false;
    },
    getList(pageNo) {
      let memberId = 0;
      // !this.$store.getters.isLogin && this.$router.push("/login");
      this.$store.getters.isLogin && (memberId = this.$store.getters.member.id);
      let startTime = "";
      let endTime = "";
      let symbol = "";
      let type = "";
      let params = {
        pageNo: pageNo,
        pageSize: this.pageSize,
        startTime,
        endTime,
        memberId,
        symbol,
        type,
        assetType: 0,
      };
      this.$http.post(this.host + "/asset/transaction/all", params).then(response => {
        var resp = response.body;
        console.log(resp)
        if (resp.code == 0) {
          this.loading = false;
          if (resp.data) {
            // this.tableRecord = trueData.records;
            this.total = resp.data.total;
            this.filteredRecords = resp.data.records;
          }
        } else {
          this.$Message.error(resp.message);
        }
        this.loading = false;
      });
    },
    getMoney() {
      //获取
      this.$http.post(this.host + "/asset/wallet").then(response => {
        var resp = response.body;

        if (resp.code == 0) {
          this.tableMoney = resp.data;
          for (let i = 0; i < this.tableMoney.length; i++) {
            this.tableMoney[i]["coinType"] = this.tableMoney[i].coinVo.unit;
          }
          this.loading = false;
          this.tableMoneyShow = this.tableMoney;
          this.$emit('update-total-assets', {
            value: this.totalUSDT,
            currency: 'USDT',
            usdValue: this.totalCny
          });
        } else {
          this.$Message.error(this.loginmsg);
        }
      });
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

    getGCCMatchAmount() {
      //获取
      this.$http
        .post(this.host + "/asset/wallet/match-check")
        .then(response => {
          var resp = response.body;
          if (resp.code == 0) {
            this.canMatch = true;
            this.GCCMatchAmount = resp.data;
          } else {
            this.canMatch = false;
            this.match_msg = resp.message;
            // this.$Message.error(this.loginmsg);
          }
          this.showMatchDailog();
        });
    },
    getRate() {
      this.$http
        .post(this.host + "/market/ctc-usdt")
        .then(response => {
          var resp = response.body;
          this.priceRate = resp.data.buy;
        });
    },
    showMatchDailog() {
      if (this.canMatch) this.modal = true;
      else this.modal_msg = true;
    },
    matchGCC() {
      if (this.matchAmount <= 0) {
        this.$Message.warning(this.$t("uc.finance.money.matcherr1"));
      } else if (this.matchAmount > this.GCCMatchAmount) {
        this.$Message.warning(this.$t("uc.finance.money.matcherr2"));
      } else {
        //配对
        let params = {};
        params["amount"] = this.matchAmount;
        this.$http
          .post(this.host + "/asset/wallet/match", params)
          .then(response => {
            var resp = response.body;
            if (resp.code == 0) {
              this.$Message.success(this.$t("uc.finance.money.matchsuccess"));
              this.GCCMatchAmount = this.GCCMatchAmount - this.matchAmount;
            } else {
              this.$Message.error(resp.message);
            }
          });
      }
    },
    resetAddress(unit) {
      this.$Spin.show({
        render: (h) => {
          return h('div', [
            h('Icon', {
              'class': 'demo-spin-icon-load',
              props: {
                type: 'ios-loading',
                size: 18
              }
            }),
            h('div', {
              style: {
                fontSize: "12px",
                marginTop: "8px"
              }
            }, this.$t('uc.finance.recharge.gettingaddress'))
          ])
        }
      });
      var self = this;
      let params = {};
      params["unit"] = unit;
      this.$http
        .post(this.host + "/asset/wallet/reset-address", params)
        .then(response => {
          var resp = response.body;
          if (resp.code == 0) {
            //this.$Message.success(this.$t("uc.finance.money.resetsuccess"));

            setTimeout(function () {
              self.$Spin.hide();
              self.$router.push(
                "/uc/recharge?name=" + unit
              );
            }, 3000);
          } else {
            this.$Message.error(resp.message);
            this.$Spin.hide();
          }
        });
    },
    confrimTrans: function () {
      let params = {};
      params["toUnit"] = this.toUnit;
      params["fromUnit"] = this.fromUnit;
      params["amount"] = this.transAmount;
      this.$http
        .post(this.host + "/asset/wallet/trans-usd", params)
        .then(response => {
          var resp = response.body;
          if (resp.code == 0) {
            this.$Message.success(resp.message);
          } else {
            this.$Message.error(resp.message);
          }
          this.transModal = false;
        });
      return false;
    }
  },
  created() {
    this.getMoney();
    this.getList(this.page);

  },
  computed: {
    totalUSDT() {
      let usdtTotal = 0;
      console.log("this.tableMoney", this.tableMoney)
      for (let i = 0; i < this.tableMoney.length; i++) {
        usdtTotal += (this.tableMoney[i].balance + this.tableMoney[i].frozenBalance) * this.tableMoney[i].coinVo.usdRate;
      }
      return usdtTotal.toFixed(2);
    },
    totalCny() {
      let cnyTotal = 0;
      for (let i = 0; i < this.tableMoney.length; i++) {
        cnyTotal += (this.tableMoney[i].balance + this.tableMoney[i].frozenBalance) * this.tableMoney[i].coinVo.cnyRate;
      }
      return cnyTotal.toFixed(2);
    },
    tableColumnsMoney() {
      let self = this;
      let columns = [];
      columns.push({
        title: this.$t("uc.finance.money.cointype"),
        key: "coinType",
        width: 100,
        align: "center"
      });
      columns.push({
        title: this.$t("uc.finance.money.balance"),
        key: "balance",
        align: "center",
        render(h, params) {
          return h(
            "span",
            {
              attrs: {
                title: params.row.balance
              }
            },
            self.toFloor(params.row.balance || "0")
          );
        }
      });
      columns.push({
        title: this.$t("uc.finance.money.frozen"),
        key: "frozenBalance",
        align: "center",
        render(h, params) {
          return h(
            "span",
            {
              attrs: {
                title: params.row.frozenBalance
              }
            },
            self.toFloor(params.row.frozenBalance || "0")
          );
        }
      });
      columns.push({
        title: this.$t("uc.finance.money.needreleased"),
        align: "center",
        render(h, params) {
          return h(
            "span",
            {
              attrs: {
                title: params.row.toReleased
              }
            },
            self.toFloor(params.row.toReleased || "0")
          );
        }
      });
      columns.push({
        title: this.$t("uc.finance.money.operate"),
        key: "price1",
        align: "center",
        render: function (h, params) {
          var actions = [];
          if (params.row.coinVo.canRecharge == 1) {
            //if ( (params.row.address != null && params.row.address != "") || (params.row.coin.accountType == 1)) {
            // 充币
            actions.push(
              h(
                "Button",
                {
                  // 充币;
                  props: {
                    type: "info",
                    size: "small"
                  },
                  on: {
                    click: function () {
                      self.$router.push(
                        "/uc/recharge?name=" + params.row.coin.unit
                      );
                      // self.rechargeToken=params.row.coinVo
                      // self.rechargeBsc=true
                      // self.$refs.rechargeModel.initializeWeb3()  
                    }
                  },
                  style: {
                    marginRight: "8px"
                  }
                },
                self.$t("uc.finance.money.charge")
              )
            );
            // } else {
            //   //   获取地址按钮;
            //   actions.push(
            //     h(
            //       "Button",
            //       {
            //         props: {
            //           type: "info",
            //           size: "small"
            //         },
            //         on: {
            //           click: function() {
            //             self.resetAddress(params.row.coin.unit);
            //           }
            //         },
            //         style: {
            //           marginRight: "8px"
            //         }
            //       },
            //       self.$t("uc.finance.money.charge")
            //     )
            //   );
            // }
          } else {
            actions.push(
              h(
                "Button",
                {
                  props: {
                    size: "small",
                    disabled: true
                  },
                  on: {
                    click: function () {
                    }
                  },
                  style: {
                    marginRight: "8px"
                  }
                },
                //self.$t("uc.finance.money.charge")
              )
            );
          }
          if (params.row.coinVo.canWithdraw == 1) {
            // 提币;
            actions.push(
              h(
                "Button",
                {
                  props: {
                    type: "error",
                    size: "small"
                  },
                  on: {
                    click: function () {
                      self.$router.push(
                        "/uc/withdraw?name=" + params.row.coin.unit
                      );
                      // self.withdrawToken=params.row.coinVo
                      // self.withdrawBsc=true
                      // self.$refs.withdrawModel.initializeWeb3()  
                      // self.balance=params.row.balance
                    }
                  },
                  style: {
                    marginRight: "8px"
                  }
                },
                self.$t("uc.finance.money.pickup")
              )
            );
          } else {
            actions.push(
              h(
                "Button",
                {
                  props: {
                    size: "small",
                    disabled: true
                  },
                  on: {
                    click: function () {

                    }
                  },
                  style: {
                    marginRight: "8px"
                  }
                },
                self.$t("uc.finance.money.pickup")
              )
            );
          }
          if (params.row.coin.unit == "USDT" || params.row.coin.unit == "EUSDT" || params.row.coin.unit == "TUSDT") {
            actions.push(
              h(
                "Button",
                {
                  props: {
                    type: "success",
                    size: "small",
                    disabled: false
                  },
                  on: {
                    click: function () {
                      self.fromUnit = params.row.coin.unit;
                      self.transModal = true;
                    }
                  },
                  style: {
                    marginRight: "8px"
                  }
                },
                self.$t("uc.finance.money.onkeytrans")
              )
            );
          }
          return h("p", actions);
        }
      });
      return columns;
    },


    tableColumnsRecord() {
      let columns = [];
      var that = this;
      columns.push({
        title: this.$t("uc.finance.record.chargetime"),
        align: "center",
        width: 190,
        key: "createTime"
      });
      columns.push({
        title: this.$t("uc.finance.record.type"),
        render: function (h, params) {
          let str = "";
          let type = params.row.type;
          if (type == 0) {
            str = that.$t("uc.finance.record.charge");
          } else if (type == 1) {
            str = that.$t("uc.finance.record.pickup");
          } else if (type == 2) {
            str = that.$t("uc.finance.record.transMessage2");
          } else if (type == 3) {
            str = that.$t("uc.finance.record.transMessage3");
          } else if (type == 4) {
            str = that.$t("uc.finance.record.transMessage4");
          } else if (type == 5) {
            str = that.$t("uc.finance.record.transMessage5");
          } else if (type == 6) {
            str = that.$t("uc.finance.record.transMessage6");
          } else if (type == 7) {
            str = that.$t("uc.finance.record.transMessage7");
          } else if (type == 8) {
            str = that.$t("uc.finance.record.transMessage8");
          } else if (type == 9) {
            str = that.$t("uc.finance.record.transMessage9");
          } else if (type == 10) {
            str = that.$t("uc.finance.record.transMessage10");
          } else if (type == 11) {
            str = that.$t("uc.finance.record.transMessage11");
          } else if (type == 12) {
            str = that.$t("uc.finance.record.transMessage12");
          } else if (type == 13) {
            str = that.$t("uc.finance.record.transMessage13");
          } else if (type == 14) {
            str = that.$t("uc.finance.record.transMessage14");
          } else if (type == 15) {
            str = that.$t("uc.finance.record.transMessage15");
          } else if (type == 16) {
            str = that.$t("uc.finance.record.transMessage16");
          } else if (type == 17) {
            str = that.$t("uc.finance.record.transMessage17");
          } else if (type == 18) {
            str = that.$t("uc.finance.record.transMessage18");
          } else if (type == 19) {
            str = that.$t("uc.finance.record.transMessage19");
          } else if (type == 20) {
            str = that.$t("uc.finance.record.transMessage20");
          } else if (type == 21) {
            str = that.$t("uc.finance.record.transMessage21");
          } else if (type == 22) {
            str = that.$t("uc.finance.record.transMessage22");
          } else if (type == 23) {
            str = that.$t("uc.finance.record.transMessage23");
          } else if (type == 24) {
            str = that.$t("uc.finance.record.transMessage24");
          } else if (type == 25) {
            str = that.$t("uc.finance.record.transMessage25");
          } else if (type == 26) {
            str = that.$t("uc.finance.record.transMessage26");
          } else if (type == 27) {
            str = that.$t("uc.finance.record.transMessage27");
          } else if (type == 28) {
            str = that.$t("uc.finance.record.transMessage28");
          } else if (type == 29) {
            str = that.$t("uc.finance.record.transMessage29");
          } else if (type == 30) {
            str = that.$t("uc.finance.record.transMessage30");
          } else if (type == 31) {
            str = that.$t("uc.finance.record.transMessage31");
          } else if (type == 32) {
            str = that.$t("uc.finance.record.transMessage32");
          } else if (type == 33) {
            str = that.$t("uc.finance.record.transMessage33");
          } else if (type == 34) {
            str = that.$t("uc.finance.record.transMessage34");
          } else if (type == 35) {
            str = that.$t("uc.finance.record.transMessage35");
          } else if (type == 36) {
            str = that.$t("uc.finance.record.transMessage36");
          } else if (type == 37) {
            str = that.$t("uc.finance.record.transMessage37");
          } else {
            str = that.$t("uc.finance.record.other");
          }
          return h("div", str, "");
        }
      });
      columns.push({
        title: this.$t("uc.finance.record.symbol"),
        align: "center",
        key: "symbol"
        // render: (h, param) => {
        //   return h("div", {}, param.row._source.symbol);
        // }
      });
      columns.push({
        // title: this.$t("uc.finance.record.num"),
        title: this.$t("uc.finance.record.num"), //到账数量
        align: "center",
        render(h, params) {
          return h(
            "span",
            {
              attrs: {
                title: params.row.amount
              }
            },
            that.toFloor(params.row.amount || "0")
          );
        }
      });
      columns.push({
        title: "当前余额", //"抵扣手续费"
        align: "center",
        render(h, params) {
          return h(
            "span",
            {
              attrs: {
                title: params.row.balance
              }
            },
            that.toFloor(params.row.balance || "0")
          );
        }
      });
      columns.push({
        title: "账户类型",
        align: "assetType",
        render(h, params) {
          let str = "";
          let type = params.row.assetType;
          if (type == 0) {
            str = "资金账户";
          } else if (type == 1) {
            str = "合约账户";
          }
          return h("div", str, "");
        }
      });
      columns.push({
        title: this.$t("uc.finance.record.status"),
        // key: "status",
        align: "center",
        render: (h, params) => {
          return h("div", that.$t("uc.finance.record.finish"), "");
        }
      });
      return columns;
    }
  }
};
</script>
<style lang="scss">
.nav-right {
  .rightarea.bill_box {
    .shaow {
      padding-bottom: 20px;
    }

    .money_table {
      .search {
        width: 200px;
        margin-bottom: 10px;
      }

      .ivu-table-wrapper {
        .ivu-table-header {
          background: #27313e;

          th {
            color: #fff;
          }
        }

        .ivu-table-body {
          td {
            color: #fff;

            .ivu-table-cell {
              padding: 10px 10px;

              p .ivu-btn {
                background: transparent;
                height: 25px;
                padding: 0 0px;
                border-radius: 0;

                span {
                  display: inline-block;
                  line-height: 20px;
                  font-size: 12px;
                  padding: 0 15px;
                  letter-spacing: 1px;
                }
              }

              p .ivu-btn.ivu-btn-info {
                border: 1px solid #f0ac19;

                span {
                  color: #f0ac19;
                }
              }

              p .ivu-btn.ivu-btn-error {
                border: 1px solid #f15057;

                span {
                  color: #f15057;

                }
              }

              p .ivu-btn.ivu-btn-primary {
                border: 1px solid #00b275;
                border: 1px solid #00b275;

                span {
                  color: #00b275;
                }
              }

              p .ivu-btn.ivu-btn-default {
                border: 1px solid #2c384f;
                background: #222c3e;

                span {
                  color: #54637a;
                }
              }

              p .ivu-btn.ivu-btn-success {
                border: 1px solid #32ad00;

                span {
                  color: #32ad00;
                }
              }
            }
          }
        }
      }
    }
  }
}

.ivu-input-number-disabled .ivu-input-number-input {
  background: transparent !important;
}
</style>

<style scoped lang="scss">
.nav-right {
  height: auto;
  overflow: hidden;

  .rightarea.bill_box {
    width: 100%;
    height: auto;
    overflow: hidden;
  }
}

.demo-spin-icon-load {
  animation: ani-demo-spin 1s linear infinite;
}

.nav-rights-b {
  width: 100%;
  float: left;
}

.order-table {}

@media screen and (max-width:768px) {
  .search {
    display: none;
  }
}
</style>
