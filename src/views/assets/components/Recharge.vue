<template>
  <div class="nav-rights">
    <div class="nav-right">
      <div class="bill_box">
        <section>
          <div class="table-inner action-box open">
            <div class="action-content">
              <div class="action-body">
                <p class="acb-p1">{{ $t('common.tip') }}</p>
                <p class="acb-p2">•
                  {{ $t('uc.finance.recharge.msg3') }}{{ minRechargeAmount }}{{ coinType }}{{
                    $t('uc.finance.recharge.msg3_1') }}<br>•
                  {{ $t('uc.finance.recharge.msg1') }}<br>• {{ $t('uc.finance.recharge.msg2') }}<br>•
                  {{ $t('uc.finance.recharge.msg4') }}<br>• {{ $t('uc.finance.recharge.msg5') }}</p>
              </div>
            </div>
            <div class="action-content">
              <div class="action-body">
                <p class="acb-p1">{{ $t('uc.finance.recharge.record') }}</p>
                <div class="order-table">
                  <Table :columns="tableColumnsRecharge" :data="tableRecharge" :loading="loading"
                    :no-data-text="$t('common.nodata')"></Table>
                  <div style="margin: 10px;overflow: hidden">
                    <div style="float: right;">
                      <Page :total="dataCount" :current="1" @on-change="changePage" class="recharge_btn"></Page>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>

    <!-- model1 -->
    <Modal v-model="modal1" width="360">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="ios-mail" size="20" color="#00b5f6;" />
        <span>{{ $t('uc.finance.recharge.coderechargetip') }}</span>
      </p>
      <div style="text-align:center">
        <Form ref="formValidate" :label-width="0">
          <FormItem>
            <Input v-model="withdrawCode" :placeholder="$t('uc.finance.recharge.coderechargetip')"></Input>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button type="primary" size="large" long @click="getCodeInfo">{{ $t('uc.finance.withdraw.submit') }}</Button>
      </div>
    </Modal>

    <Modal v-model="modal2" width="360">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="ios-mail" size="20" color="#00b5f6;" />
        <span>{{ $t('uc.finance.recharge.rechargeconfirm') }}</span>
      </p>
      <div style="text-align:center">
        <p><span>{{ $t('uc.finance.recharge.symbol') }}: </span><span>{{ withdrawCodeInfo.coin.unit }}</span></p>

        <p><span>{{ $t('uc.finance.recharge.amount') }}: </span><span>{{ withdrawCodeInfo.withdrawAmount }}</span></p>

      </div>
      <div slot="footer">
        <Button type="primary" size="large" long @click="submitCode">{{ $t('uc.finance.withdraw.submit') }}</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import Vue from "vue";
import VueQriously from "vue-qriously";
Vue.use(VueQriously);

export default {
  components: {
    VueQriously
  },
  // inject: ['reload'],
  data() {
    return {
      modal1: false,
      modal2: false,
      withdrawCode: "",
      fundpwd: "",
      accountType: 0,
      netwoker: [],
      selectedNetwoker: '',
      memoCode: "",
      minRechargeAmount: "0.001",
      isShowGetAddress: false,
      isShowEwm: false,
      dataCount: 0,
      loading: true,
      qrcode: {
        value: "",
        size: 220,
        coinName: "",
        unit: ""
      },
      addressData: {
        address: '',
      },
      coinType: "USDT",
      coinList: [],
      tableRecharge: [],
      allTableRecharge: [],
      withdrawCodeInfo: {
        coin: {
          unit: ""
        }
      },
    };
  },
  methods: {
    changePage(index) {
      this.getList(index);
    },
    getCurrentCoinRecharge() {
      this.tableRecharge = this.allTableRecharge;
    },
    showEwm() {
      this.isShowEwm = !this.isShowEwm;
    },
    onCopy(e) {
      this.$Message.success(
        this.$t("uc.finance.recharge.copysuccess") + e.text
      );
    },
    onError(e) {
      this.$Message.error(this.$t("uc.finance.recharge.copysuccess"));
    },
    changeCoin(value) {
      for (var i = 0; i < this.coinList.length; i++) {
        if (this.coinList[i].coinVo.unit == value) {
          this.qrcode.coinName = this.coinList[i].coinVo.name.toLowerCase();
          this.qrcode.unit = this.coinList[i].coinVo.unit;
          this.qrcode.value = this.coinList[i].address
          this.minRechargeAmount = this.coinList[i].coinVo.minRechargeAmount;
          if (this.qrcode.value == "") {
            this.isShowGetAddress = true;
          } else {
            this.isShowGetAddress = false;
          }
        }
      }
      this.getCurrentCoinRecharge();
    },
    getCodeInfo() {
      if (this.withdrawCode == "") {
        this.$Message.warning(this.$t("uc.finance.recharge.coderechargetip"));
        return;
      }
      let param = {};
      param["withdrawCode"] = this.withdrawCode;

      this.$http
        .post(this.host + "/withdrawcode/apply/info", param)
        .then(response => {
          var resp = response.body;
          if (resp.code == 0) {
            this.withdrawCodeInfo = resp.data;
            this.modal1 = false;
          } else {
            this.$Message.error(resp.message);
          }
        });
      this.modal1 = false;
      this.modal2 = true;
    },
    submitCode() {
      if (this.withdrawCode == "") {
        this.$Message.warning(this.$t("uc.finance.recharge.coderechargetip"));
        return;
      }
      let param = {};
      param["withdrawCode"] = this.withdrawCode;

      this.$http
        .post(this.host + "/withdrawcode/apply/recharge", param)
        .then(response => {
          var resp = response.body;
          if (resp.code == 0) {
            this.$Message.success(this.$t("uc.finance.recharge.rechargesuccess"));
            this.modal1 = false;
          } else {
            this.$Message.error(resp.message);
          }
        });
      this.modal2 = false;
    },
    getMoney() {
      //获取
      this.$http.post(this.host + this.api.uc.wallet).then(response => {
        var resp = response.body;
        if (resp.code == 0) {
          for (let i = 0; i < resp.data.length; i++) {
            var coin = resp.data[i];
            console.log(coin)
            if (coin.coinVo.canRecharge == 1) {
              this.coinList.push(coin);
              console.log(coin);
            }
          }
          this.coinType = "USDT"
          this.changeCoin(this.coinType);

          this.$emit('wallet-data-updated', {
            coinList: response.body,
          });
        } else {
          this.$Message.error(resp.message);
        }
      });
    },
    getList(pageN) {
      //获取tableRecharge
      let memberId = 0;
      !this.$store.getters.isLogin && this.$router.push("/login");
      this.$store.getters.isLogin && (memberId = this.$store.getters.member.id);
      let pageNo = pageN,
        pageSize = 10,
        type = 2,
        params = { memberId, pageNo, pageSize, type };
      this.$http.post(this.host + "/asset/recharge/record/address", params).then(response => {
        var resp = response.body;
        if (resp.code == 0) {
          if (resp.data.records) {
            let trueData = resp.data;
            this.allTableRecharge = trueData.records || [];
            this.dataCount = trueData.total || 0;
            this.getCurrentCoinRecharge();
          }
          this.loading = false;
        } else {
          this.$Message.error(resp.message);
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
        } else {
          this.$Message.error(resp.message);
        }
      })
    },
  },
  created() {
    this.getsetting()
    this.coinType = this.$route.query.name || "";
    this.getMoney();
    this.getList(1);
  },
  computed: {
    tableColumnsRecharge() {
      let columns = [];
      columns.push({
        title: this.$t("uc.finance.recharge.amount"),
        align: "center",
        width: 100,
        render: (h, param) => {
          let str = param.row.usdtNum;
          return h("div", {}, str);
        }
      });
      columns.push({
        title: this.$t("uc.finance.recharge.symbol"),
        align: "center",
        width: 120,
        render: (h, param) => {
          let str = "USDT";
          return h("div", {}, str);
        }
      });
      columns.push({
        title: this.$t("uc.finance.recharge.time"),
        align: "center",
        width: 200,
        render: (h, param) => {
          let str = param.row.createTime;
          return h("div", {}, str);
        }
      });
      columns.push({
        title: "hash",
        align: "center",
        render: (h, param) => {
          let str = param.row.chainOrderId;
          let url = `https://bscscan.com/tx/${str}`;
          if (param.row.chainId == 196) {
            url = `https://web3.okx.com/zh-hans/explorer/x-layer/tx/${str}`;
          }
          return h("a", {
            attrs: {
              href: url,
              target: "_blank",
              rel: "noopener noreferrer"
            },
            style: {
              color: "#1890ff", // 设置链接颜色
              textDecoration: "none" // 可选，去掉下划线
            }
          }, str);
        }
      });
      return columns;
    }
  }
};
</script>
<style scoped>
.table-inner {
  position: relative;
  text-align: left;
  border-radius: 3px;
}

.acb-p1 {
  font-size: 16px;
  font-weight: 400;
  line-height: 50px;
}

.acb-p2 {
  font-size: 13px;
  line-height: 24px;
  color: #8c979f;
}

.action-inner {
  width: 100%;
  display: table;
}

.action-inner .inner-box {
  display: table-cell;
  width: 100%;
}

.action-box .title .copy {
  user-select: text;
}

.action-box .title a.link-copy {
  font-size: 14px;
  margin-left: 20px;
  color: #f0a70a;
}

.hb-night a {
  text-decoration: none;
  color: #7a98f7;
  transition: all 0.2s ease-in-out;
  cursor: pointer;
}

.action-box .title a.link-qrcode {
  margin-left: 20px;
  font-size: 14px;
  position: relative;
  color: #f0a70a;
}

.hb-night a {
  text-decoration: none;
  color: #7a98f7;
  transition: all 0.2s ease-in-out;
  cursor: pointer;
}

.action-box .subtitle {
  font-size: 12px;
  margin-top: 30px;
}

.action-content {
  width: 100%;
  margin-top: 30px;
  /* overflow: hidden; */
  display: table;
  color: #ccc;
}

.action-box .title {
  margin-top: 20px;
  font-size: 20px;
  user-select: none;
}

.inner-left {
  display: table-cell;
}

.action-box .title .show-qrcode {
  position: absolute;
  top: -100px;
  left: 40px;
  padding: 10px;
  background: #FFF;
}

.action-inner .inner-box.deposit-address {
  padding-left: 20px;
}

p.describe {
  font-size: 16px;
  font-weight: 600;
}

.merchant-icon {
  display: inline-block;
  margin-left: 4px;
  background-size: 100% 100%;
}

.merchant-icon.tips {
  width: 4px;
  height: 22px;
  margin-right: 10px;
  background: #f0a70a;
}

.bill_box {
  width: 100%;
  height: auto;
  /* overflow: hidden; */
}

.nav-right {
  height: auto;
  overflow: hidden;
  padding: 0 15px;
}

.order_box {
  width: 100%;
  background: #fff;
  height: 56px;
  line-height: 56px;
  margin-bottom: 20px;
  border-bottom: 2px solid #ccf2ff;
  position: relative;
  text-align: left;
}

.order_box a {
  color: #8994a3;
  font-size: 16px;
  padding: 0 30px;
  cursor: pointer;
  text-decoration: none;
  text-align: center;
  line-height: 54px;
  display: inline-block;
}

.order_box .search {
  position: absolute;
  width: 300px;
  height: 32px;
  top: 12px;
  right: 0;
  display: flex;
  /* border: #c5cdd7 solid 1px; */
}

a.withdrawcoderecharge {
  font-weight: normal;
  line-height: 40px;
  color: #f0a70a;
  width: 160px;
  height: 40px;
  border: 1px solid #f0a70a;
  display: inline-block;
  text-align: center;
}
</style>
