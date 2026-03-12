<template>
  <div class="nav-rights">
    <div class="nav-right">
      <div class="bill_box">
        <!-- <section class="trade-group merchant-top">
                    <i class="merchant-icon tips"></i>
                    <span class="tips-word">{{$t('uc.finance.recharge.recharge')}}</span>
                </section> -->
        <section>
          <div class="table-inner action-box open">
            <!-- <i class="angle" style="right: 71px;"></i> -->
            <div class="action-inner">
              <div class="inner-left">
                <p class="describe">{{ $t('uc.finance.recharge.symbol') }}</p>
                <Select v-model="coinType" style="width:100px;margin-top: 20px;" @on-change="changeCoin">
                  <Option v-for="item in coinList" :value="item.coinVo.unit" :key="item.coinVo.unit">{{ item.coinVo.unit
                  }}</Option>
                </Select>
              </div>
              <div class="inner-left" style="padding: 0 0 0 10px;">
                <p class="describe">选择网络</p>
                <Select @on-change="changeMetwoker" v-model="selectedNetwoker" style="width:200px;margin-top: 20px;">
                  <Option v-for="item in netwoker" :value="item.name" :key="item.id">{{ item.name
                  }}</Option>
                </Select>
              </div>
              <div class="inner-box deposit-address">
                <p class="describe">地址</p>
                <div class="title">
                  <Input v-model="addressData.address" readonly style="width: 400px;color:#8c979f;"></Input>
                  <a v-show="addressData.address == null" class="link-copy" @click="resetAddress">{{
                    $t('uc.finance.recharge.getaddress') }}</a>
                  <a v-clipboard:copy="addressData.address" v-clipboard:success="onCopy" v-clipboard:error="onError"
                    href="javascript:;" id="copyBtn" class="link-copy">{{ $t('uc.finance.recharge.copy') }}</a>
                  <a id="showQRcode" class="link-qrcode" href="javascript:;" @click="showEwm">
                    {{ $t('uc.finance.recharge.qrcode') }}
                    <Modal v-model="isShowEwm" width="280">
                      <!--<div v-show="isShowEwm" class="show-qrcode">-->
                      <p slot="header" style="text-align: center;">{{ $t('uc.finance.recharge.qrcodeaddress') }}</p>
                      <div class="show-qrcode"
                        style="text-align: center;padding: 15px 10px;border-radius:10px;background:#FFF;">
                        <!--<qriously :value="qrcode.coinName+':'+qrcode.value" :size="qrcode.size" />-->
                        <qriously :value="qrcode.value || ''" :size="qrcode.size" foreground="#000" />
                      </div>
                      <div slot="footer"></div>
                    </Modal>
                  </a>
                </div>
                <p v-if="accountType != 0" style="margin-top: 10px;font-size:12px;color:#828ea1;">Memo：<span
                    style="font-size: 20px;color: #F90;font-weight:bold;">{{ memoCode }}</span></p>
                <p v-if="accountType != 0" style="margin-top: 10px;font-size:12px;color:#828ea1;">
                  {{ $t('uc.finance.recharge.memotips') }}
                  <a style="color: #f0a70a;" v-clipboard:copy="memoCode" v-clipboard:success="onCopy"
                    v-clipboard:error="onError" href="javascript:;" id="copyBtn" class="link-copy">{{
                      $t('uc.finance.recharge.copy') }} Memo</a>
                </p>
              </div>
              <!--提币码充值-->
              <div class="inner-right">
                <p class="describe">
                  <!-- <a class="withdrawcoderecharge" @click="openCodeModal">{{$t('uc.finance.recharge.withdrawrecharge')}}</a> -->
                </p>
              </div>
            </div>
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

    <!-- model2 -->
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
  inject: ['reload'],
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
      //根据选择的币中只显示对应充值记录
      // if (this.coinType != "") {
      //   var temp = [];
      //   for (var i = 0; i < this.allTableRecharge.length; i++) {
      //     if (this.allTableRecharge[i].symbol == this.coinType) {
      //       temp.push(this.allTableRecharge[i]);
      //     }
      //   }
      //   this.tableRecharge = temp;
      // } else {
      //   this.tableRecharge = this.allTableRecharge;
      // }
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

    changeMetwoker(value) {
      console.log('change', this.netwoker)
      this.selectedNetwoker = value
      console.log(this.selectedNetwoker)
      for (var i = 0; i < this.netwoker.length; i++) {
        if (this.netwoker[i].name == value) {
          if (this.netwoker[i].rechargeAddress !== null) {
            this.addressData.address = '0x' + this.netwoker[i].rechargeAddress
          } else {
            this.addressData.address = this.netwoker[i].rechargeAddress
          }

          // if (this.qrcode.value == "") {
          //   this.isShowGetAddress = true;
          // } else {
          //   this.isShowGetAddress = false;
          // }
        }
      }
    },

    openCodeModal() {
      this.modal1 = true;
      this.withdrawCode = "";
    },
    async newwokerlistGet() {
      await this.$http
        .get(this.host + "/blockchain", {})
        .then(response => {
          var resp = response.body;
          if (resp.code == 0) {
            this.netwoker = resp.data;
            if (this.selectedNetwoker) {
              this.changeMetwoker(this.selectedNetwoker);
            }
          } else {
            this.$Message.error(resp.message);
          }
        });
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
    async resetAddress() {
      if (this.addressData.address == "" || this.addressData.address == null || this.addressData.address == undefined) {
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
        let params = {};
        params["unit"] = this.qrcode.unit;
        try {
          const response = await this.$http.post(this.host + "/asset/wallet/reset-address", params);
          var resp = response.body;
          if (resp.code == 0) {
            await this.newwokerlistGet();
            this.$Spin.hide();
          } else {
            this.$Message.error(resp.message);
            this.$Spin.hide();
          }
        } catch (error) {
          this.$Spin.hide();
          this.$Message.error(error.message);
        }
      }
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
          // if (resp.data.realName == null || resp.data.realName == "") {
          //   this.$Notice.error({
          //     title: this.$t("common.tip"),
          //     desc: this.$t("otc.publishad.submittip1")
          //   });
          //   // 判断是否实名认证，未认证跳转到实名认证页面；
          //   //this.$Message.success(this.$t("otc.publishad.submittip1"));
          //   self.$router.push("/uc/safe");
          // }
          // else
          //   if (resp.data.phoneVerified == 0) {
          //     this.$Notice.error({
          //       title: this.$t("common.tip"),
          //       desc: this.$t("otc.publishad.submittip2")
          //     });
          //     // 判断是否是手机号0，1，未认证跳转到实名认证页面；
          //     //this.$Message.success(this.$t("otc.publishad.submittip2"));
          //     self.$router.push("/uc/safe");
          //   }
          // if (resp.data.fundsVerified == 0) {
          //   this.$Notice.error({
          //     title: this.$t("common.tip"),
          //     desc: this.$t("otc.publishad.submittip3")
          //   });
          //   // 判断是否设置交易密码，未认证跳转到实名认证页面；
          //   //this.$Message.success(this.$t("otc.publishad.submittip3"));
          //   self.$router.push("/uc/safe");
          // }
          // else if (resp.data.emailVerified == 0) {
          //   this.$Notice.error({
          //     title: this.$t("common.tip"),
          //     desc: this.$t("otc.publishad.submittip5")
          //   });
          //   // 判断是否绑定邮箱，未认证跳转到实名认证页面；
          //   //this.$Message.success(this.$t("otc.publishad.submittip3"));
          //   self.$router.push("/uc/safe");
          //   // }
          // }
        } else {
          this.$Message.error(resp.message);
        }
      })
    },
    getMember() {
      let self = this;
      this.$http.post(this.host + "/approve/security/setting").then(response => {
        var resp = response.body;
        if (resp.code == 0) {
          console.log(resp.data.fundsVerified)

          if (resp.data.realName == null || resp.data.realName == "") {
            // 判断是否实名认证，未认证跳转到实名认证页面；
            this.$Message.success(this.$t("otc.publishad.submittip1"));
            self.$router.push("/uc/safe");
          } else if (resp.data.fundsVerified == 1) {
            // 判断是否设置交易密码，未认证跳转到实名认证页面；
            this.$Message.success(this.$t("otc.publishad.submittip3"));
            self.$router.push("/uc/safe");
          }
          // if (resp.data.phoneVerified == 0) {
          //   // 判断是否是手机号0，1，未认证跳转到实名认证页面；
          //   this.$Message.success(this.$t("otc.publishad.submittip2"));
          //   self.$router.push("/uc/safe");
          // } else
        } else {
          this.$Message.error(resp.message);
        }
      });
    }
  },
  created() {
    this.getsetting()
    this.coinType = this.$route.query.name || "";
    //this.getMember();
    this.getMoney();
    this.getList(1);
    this.newwokerlistGet()
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
