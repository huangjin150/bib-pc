<template>
  <div class="nav-rights">
    <div class="nav-right">
      <div class="bill_box_address">
        <section class="trade-group merchant-tops">
          <h1 class="tips-word1">{{ $t('uc.finance.withdraw.addressmanager') }}</h1>
        </section>
        <section>
          <div class="table-inner">
            <div class="action-inner">
              <div class="inner-left">
                <p class="describe">{{ $t('uc.finance.withdraw.symbol') }}</p>
                <Select v-model="coinType" style="width:60%;" size="large">
                  <Option v-for="item in coinList" :value="item" :key="item">{{ item }}</Option>
                </Select>
              </div>
              <div class="inner-box deposit-address mt25">
                <p class="describe">{{ $t('uc.finance.withdraw.address') }}</p>
                <div style="width: 60%;" class="title">
                  <Input v-model="withdrawAddr" style="width: 100%;margin-top:10px;" size="large"></Input>
                </div>
              </div>
              <div class="inner-box">
                <p class="describe">{{ $t('uc.finance.withdraw.remark') }}</p>
                <div style="width: 60%;" class="title">
                  <Input v-model="remark" style="width:100%;margin-top:10px;" size="large"></Input>
                </div>
              </div>
              <div class="btnbox">
                <Button id="addrSubmit" @click='addAddr' size="large" style="width:86px;color:#fff;background:#000;">{{
                  $t('uc.finance.withdraw.add') }}</Button>
              </div>
            </div>
            <div class="action-content">
              <div class="action-body">
                <p class="acb-p1 ">{{ $t('uc.finance.withdraw.addresslist') }}</p>
                <div class="order-table">
                  <Table :columns="tableColumnsRecharge" :data="dataRecharge" :disabled-hover="true"></Table>
                  <div style="margin: 10px;overflow: hidden">
                    <div style="float: right;">
                      <Page :total="dataCount" :current="1" @on-change="changePage" :loading="loading"
                        class="recharge_btn"></Page>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
    <!-- model -->
    <Modal v-model="modal2" width="360">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="ios-mail" size="20" color="#00b5f6;" />
        <span>{{ $t('uc.finance.withdraw.safevalidate') }}</span>
      </p>
      <div style="text-align:center">
        <Form ref="formValidateAddr" :model="formValidateAddr" :rules="ruleValidate" :label-width="85">

          <!-- 手机验证码 -->
          <FormItem v-show="validPhone" prop="vailCode2">
            <div style="text-align: start;">{{ $t('uc.finance.withdraw.smscode') }}</div>

            <Input v-model="formValidateAddr.vailCode2" size="large">
            <!-- <Button slot="append">点击获取</Button> -->
            <div class="timebox" slot="append">
              <Button @click="send(2)" :disabled="disbtn">
                <!--sendMsgDisabled2为true 时间+秒    sendMsgDisabled2为false为，点击获取 -->
                <span v-if="sendMsgDisabled2">{{ time2 + $t('uc.finance.withdraw.second') }}</span>
                <span v-if="!sendMsgDisabled2">{{ $t('uc.finance.withdraw.clickget') }}</span>
              </Button>
            </div>
            </Input>
          </FormItem>
          <!-- 邮箱验证码 -->
          <FormItem prop="vailCode1" v-show="validEmail">
            <div style="text-align: start;">{{ $t('uc.finance.withdraw.emailcode') }}</div>
            <Input v-model="formValidateAddr.vailCode1" size="large">
            <!-- <Button slot="append">点击获取</Button> -->
            <div class="timebox" slot="append">
              <Button @click="send(1)" :disabled="disbtn">
                <span v-if="sendMsgDisabled1">{{ time1 + $t('uc.finance.withdraw.second') }}</span>
                <span v-if="!sendMsgDisabled1">{{ $t('uc.finance.withdraw.clickget') }}</span>
              </Button>
            </div>
            </Input>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button style="background-color: #000; border-radius: 99999px;" type="primary" size="large" long
          @click="handleSubmit('formValidateAddr')">{{
            $t('uc.finance.withdraw.save') }}</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import gtInit from "../../assets/js/gt.js";

export default {
  components: {},

  data() {
    var that = this;
    return {
      interval: function () { },
      disbtn: false,
      dataCount: 10,
      loading: true,
      sendIndex: '',
      //else
      sendMsgDisabled1: false,
      sendMsgDisabled2: false,
      time1: 60, // 发送验证码倒计时
      time2: 60, // 发送验证码倒计时
      modal2: false,
      modal_loading: false,
      withdrawAddr: "",
      remark: "",
      coinType: "",
      captchaObj: null,
      validEmail: false,
      validPhone: false,
      coinList: [],
      VerificationData: {
        geetest_challenge: '',
        geetest_seccode: '',
        geetest_validate: '',
      },
      tableColumnsRecharge: [
        {
          title: this.$t("uc.finance.withdraw.symbol"),
          key: "unit"
        },
        {
          title: this.$t("uc.finance.withdraw.address"),
          key: "address"
        },
        {
          title: this.$t("uc.finance.withdraw.remark"),
          key: "remark"
        },
        {
          title: this.$t("uc.finance.withdraw.operate"),
          key: "action",
          width: 150,
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    size: "small"
                  },
                  style: {
                    border: "none",
                    color: "#ed4014",
                    "line-height": "1.2",
                    "border-radius": "10px"
                  },
                  on: {
                    click: () => {
                      this.del(params.row.id);
                      // this.getList(0, 10);
                    }
                  }
                },
                that.$t("uc.finance.withdraw.delete")
              )
            ]);
          }
        }
      ],
      dataRecharge: [],
      formValidateAddr: {
        mobileNo: "",
        vailCode2: "",
        email: "",
        vailCode1: "",
        fundpwd: ""
      },
      ruleValidate: {
        mobileNo: [
          {
            required: this.validPhone,
            message: this.$t("uc.finance.withdraw.telerr"),
            trigger: "blur"
          }
        ],
        vailCode2: [
          {
            required: this.validPhone,
            message: this.$t("uc.finance.withdraw.codeerr"),
            trigger: "change"
          }
        ],
        email: [
          {
            required: this.validEmail,
            type: "email",
            message: this.$t("uc.finance.withdraw.emailerr"),
            trigger: "blur"
          }
        ],
        vailCode1: [
          {
            required: this.validEmail,
            message: this.$t("uc.finance.withdraw.codeerr"),
            trigger: "change"
          }
        ]
      }
    };
  },

  created() {
    this.initGtCaptchas()
    this.getMember();
    this.coinType = this.$route.query.name;
    this.getCoin();
    this.getList(0, 10, "USDT");
  },
  methods: {
    refresh() {
      (this.withdrawAddr = null), (this.remark = null);
      this.getList(0, 10, "USDT");
    },
    getMember() {
      //获取个人安全信息
      this.$http
        .post(this.host + "/approve/security/setting")
        .then(response => {
          var resp = response.body;
          console.log("resp", resp)
          if (resp.code == 0) {
            if (resp.data.mobilePhone) {
              this.formValidateAddr.mobileNo = resp.data.mobilePhone;
              this.validPhone = true;
              this.validEmail = false;
            } else {
              this.formValidateAddr.email = resp.data.email;
              this.validPhone = false;
              this.validEmail = true;
            }
          } else {
            this.$Message.error(resp.message);
          }
        });
    },
    getCoin() {
      //币种
      this.$http
        .post(this.host + "/withdraw/support/coin")
        .then(response => {
          var resp = response.body;
          if (resp.code == 0) {
            for (let i = 0; i < resp.data.length; i++) {
              this.coinList.push(resp.data[i]);
              this.coinType = resp.data[i]
            }
          } else {
            this.$Message.error(resp.message);
          }
        });
    },
    getList(pageNo, pageSize, type) {
      //获取地址
      let params = {};
      params["pageNo"] = pageNo;
      params["pageSize"] = pageSize;
      params["unit"] = type;
      this.$http
        .post(this.host + "/withdraw/address/page", params)
        .then(response => {
          var resp = response.body;
          if (resp.code == 0 && resp.data.records) {
            this.dataRecharge = resp.data.records;
            this.dataCount = resp.data.total;
          } else {
            this.$Message.error(resp.message);
          }
          this.loading = false;
        });
    },
    remove(index) {
      this.dataRecharge.splice(index, 1);
    },

    initGtCaptchas() {
      var that = this;
      this.$http.get(this.host + this.api.uc.captcha).then(function (res) {
        window.initGeetest(
          {
            // 以下配置参数来自服务端 SDK
            gt: res.body.gt,
            challenge: res.body.challenge,
            offline: !res.body.success, //表示用户后台检测极验服务器是否宕机
            new_captcha: res.body.new_captcha, //用于宕机时表示是新验证码的宕机
            product: "bind",
            width: "100%"
          },
          this.handler
        );
      });
    },
    handler(captchaObj) {
      captchaObj.onReady(() => {
        $("#wait").hide();
      }).onSuccess(() => {
        let result = captchaObj.getValidate();
        if (!result) {
          this.$Message.error("请完成验证");
        } else {
          this.VerificationData = result;
          this.sendCodeAfterCaptcha();
        }
      });
      this.captchaObj = captchaObj;
    },
    sendCodeAfterCaptcha() {
      const index = this.sendIndex;
      console.log(index)
      const geetest = this.VerificationData;
      let me = this;
      if (index == 1) {
        if (this.formValidateAddr.email) {
          //获取邮箱code
          this.$http.post(this.host + "/withdraw/email/code", {
            geetest_challenge: geetest.geetest_challenge,
            geetest_validate: geetest.geetest_validate,
            geetest_seccode: geetest.geetest_seccode
          }).then(response => {
            var resp = response.body;
            if (resp.code == 0) {
              this.$Message.success(resp.message);
              me.sendMsgDisabled1 = true;
              let interval = window.setInterval(function () {
                if (me.time1-- <= 0) {
                  me.time1 = 60;
                  me.sendMsgDisabled1 = false;
                  window.clearInterval(interval);
                  this.disbtn = false;
                }
              }, 1000);
            } else {
              this.$Message.error(resp.message);
              this.disbtn = false;
            }
          });
        } else {
          this.$refs.formValidateAddr.validateField("email");
          this.disbtn = false;
        }
      } else if (index == 2) {
        if (this.formValidateAddr.mobileNo) {
          //获取手机code
          this.$http
            .post(this.host + "/mobile/add/address/code", {
              geetest_challenge: geetest.geetest_challenge,
              geetest_validate: geetest.geetest_validate,
              geetest_seccode: geetest.geetest_seccode
            })
            .then(response => {
              var resp = response.body;
              if (resp.code == 0) {
                this.$Message.success(resp.message);
                me.sendMsgDisabled2 = true;
                this.interval = window.setInterval(() => {
                  if (me.time2-- <= 0) {
                    me.time2 = 60;
                    me.sendMsgDisabled2 = false;
                    window.clearInterval(this.interval);
                    this.disbtn = false;
                  }
                }, 1000);
              } else {
                this.$Message.error(resp.message);
                this.disbtn = false;
              }
            });
        } else {
          this.$refs.formValidateAddr.validateField("mobileNo");
          this.disbtn = false;
        }
      }
    },

    send(index) {
      this.sendIndex = index
      let me = this;
      this.disbtn = true;
      this.captchaObj.verify();
    },
    addAddr() {
      if (this.withdrawAddr.toString().length != 42 || !this.withdrawAddr.toString().startsWith('0x')) {
        this.$Message.error('提现地址有误');
        return
      }
      let interval = setInterval(() => {
        if (this.time2 <= 0) {
          this.sendMsgDisabled2 = false;
          window.clearInterval(interval);
          this.disbtn = false;
        }
      }, 1000);
      if (!this.coinType) {
        this.$Message.warning(this.$t("uc.finance.withdraw.symboltip"));
      } else if (!this.withdrawAddr) {
        this.$Message.warning(this.$t("uc.finance.withdraw.addresstip"));
      } else if (!this.remark) {
        this.$Message.warning(this.$t("uc.finance.withdraw.remarktip"));
      } else if (this.coinType && this.remark && this.withdrawAddr) {
        this.modal2 = true;
        // this.handleSubmit("formValidateAddr")
      }
    },
    changePage(index) {
      this.getList(index, 10, this.coinType);
    },
    del(id) {
      const title = this.$t("common.tip");
      const content = "<p>" + this.$t("common.delete") + "</p>";
      this.$Modal.confirm({
        title: title,
        content: content,
        onOk: () => {
          let params = {};
          params["id"] = id;
          this.$http
            .post(this.host + "/withdraw/address/delete", params)
            .then(response => {
              var resp = response.body;
              if (resp.code == 0) {
                this.$Message.success(resp.message);
                this.refresh();
              } else {
                this.$Message.error(resp.message);
              }
              this.loading = false;
            });
        },
        onCancel: () => { }
      });
    },
    handleSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          this.submit(name);
        } else {
          this.$Message.error(this.$t("uc.finance.withdraw.savemsg1"));
        }
      });
    },
    submit(name) {
      let param = {};
      param["address"] = this.withdrawAddr;
      param["unit"] = this.coinType;
      if (this.validPhone) {
        param["type"] = '2'
        param["code"] = this.formValidateAddr.vailCode2;
      } else {
        param["type"] = '1'
        param["code"] = this.formValidateAddr.vailCode1;
      }
      param["remark"] = this.remark;

      this.$http
        .post(this.host + "/withdraw/address/add", param)
        .then(response => {
          var resp = response.body;
          if (resp.code == 0) {
            this.$Message.success(this.$t("uc.finance.withdraw.savemsg2"));
            this.formValidateAddr.vailCode2 = "";
            this.refresh();
            this.modal2 = false;
          } else {
            this.$Message.error(resp.message);
          }
        });
    }
  },
  computed: {}
};
</script>

<style scoped lang="scss">
.nav-rights {
  max-width: 1260px;
  margin: 0 auto;

  .nav-right {
    .bill_box_address {
      section.trade-group.merchant-tops {
        .tips-word1 {
          padding: 48px 0;
          font-size: 36px;
          font-weight: 700;
          text-align: left;
        }
      }

      .table-inner {
        .action-inner {
          border: 1px solid #eaeaed;
          padding: 24px;
          border-radius: 12px;
          width: 100%;

          .inner-left {
            display: flex;
            align-items: center;
          }
        }
      }
    }
  }
}

.inner-box {
  display: flex;
  align-items: center;
}

.btnbox {
  padding: 25px 0 0 0;
}

p.describe {
  font-size: 16px;
}

.describe {
  width: 80px;
}

.order-table {
  margin-top: 20px;
}

.content-wrap {
  min-height: 750px;
}

.container {
  padding-top: 30px;
  margin: 0 auto;
}
</style>
<style lang="scss" scoped>
.nav-rights {
  .nav-right {
    .bill_box_address {
      .table-inner {
        .action-inner {
          .inner-left {
            .ivu-select-dropdown .ivu-select-item {
              padding: 6px 16px;
            }
          }
        }

        .btnbox .ivu-btn {
          &:focus {
            -moz-box-shadow: 2px 2px 5px transparent, -2px -2px 4px transparent;
            -webkit-box-shadow: 2px 2px 5px transparent,
              -2px -2px 4px transparent;
            box-shadow: 2px 2px 5px transparent, -2px -2px 4px transparent;
          }
        }
      }
    }
  }
}

.acb-p1 {
  font-size: 36px !important;
  padding: 48px 0;
  font-weight: 700;
}

::v-deep(.ivu-btn-primary) {
  background-color: #000 !important;
}

::v-deep(.ivu-form-item-content) {
  margin: 0 !important;
}
</style>
