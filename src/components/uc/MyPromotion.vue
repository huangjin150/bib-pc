<template>
  <div class="nav-rights">
    <div class="nav-right col-xs-12 col-md-10 padding-right-clear">
      <div class="bill_box rightarea padding-right-clear">
        <div class="shaow">
          <div class="money_table">
            <div style="width: 100%;height: 30px;">
              <div style="float:left;letter-spacing:1px;color: #f15057;">
                节点级别:{{ member.nodeLevel }},返佣比例:{{ member.nodeRate * 100 }}%
              </div>
            </div>
            <div style="width: 100%;height: 50px;">
              <div style="float:left;letter-spacing:1px;">
                邀请链接:{{ linkUrl }}
                <a v-clipboard:copy="linkUrl" v-clipboard:success="onCopy" v-clipboard:error="onError"
                  href="javascript:;" id="copyBtn" class="link-copy">{{ $t('uc.finance.recharge.copy') }}</a>
              </div>
            </div>
            <Table :columns="tableColumnsPromotion" :data="promotionList" :loading="loading" :disabled-hover="true">
            </Table>
            <div class="page">
              <Page :total="total" :pageSize="pageSize" :current="pageNo" @on-change="loadDataPage"></Page>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Modal v-model="showModal" title="手续费返还比例" width="360">
      <p slot="header" style="color:#f60;text-align:left">
        <Icon type="ios-information-circle"></Icon>
        <span>手续费返还比例</span>
      </p>
      <div style="text-align:center">
        <Input v-model="rakeBack" placeholder="请输入返还百分比" />
      </div>
      <div slot="footer">
        <Button type="error" size="large" long :loading="modal_loading" @click="handlerUpdate">确认修改</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import html2canvas from 'html2canvas';

export default {
  components: {},
  data() {
    return {
      loginmsg: this.$t("common.logintip"),
      total: 0,
      pageSize: 10,
      loading: true,
      pageNo: 1,
      promotionList: [],
      promotionTitle: "",
      promotionCode: "",
      linkUrl: '',
      showModal: false,
      rakeBack: "",
      modal_loading: false,
      memberId: '',
      member: null
    };
  },
  methods: {
    getMyPromotionList() {
      let params = {};
      params.pageNo = this.pageNo;
      params.pageSize = this.pageSize;
      this.$http.post(this.host + this.api.uc.mypromotionrecord, params).then(response => {
        var resp = response.body;
        if (resp.code == 0) {
          this.promotionList = resp.data.records;
          this.total = resp.data.total
        } else {
          this.$Message.error(this.loginmsg);
        }
        this.loading = false;
      });
    },
    loadDataPage(data) {
      this.pageNo = data;
      this.getMyPromotionList();
    },
    onCopy(e) {
      this.$Message.success(
        this.$t("uc.finance.recharge.copysuccess") + e.text
      );
    },
    onError(e) {
      this.$Message.error(this.$t("uc.finance.recharge.copysuccess"));
    },
    toSetRakeBack(row) {
      this.showModal = true
      this.memberId = row.memberId
    },
    handlerUpdate() {
      if (this.rakeBack == "" || this.rakeBack == null) {
        this.$Message.error('请输入返还比例');
        return;
      }
      let param = {};
      param["id"] = this.memberId;
      param["value"] = this.rakeBack;
      this.modal_loading = true;
      this.$http.post(this.host + this.api.uc.rakeBack, param).then(response => {
        var resp = response.body;
        if (resp.code == 0) {
          this.showModal = false;
          this.$Notice.success({
            title: "设置成功",
            desc: resp.message,
            duration: 30
          });
          this.getMyPromotionList()
        } else {
          this.$Message.error(resp.message);
        }
        this.modal_loading = false;
      });
    },
    getMember() {
      //获取个人安全信息
      var self = this;
      this.$http
        .post(this.host + "/approve/security/setting")
        .then(response => {
          var resp = response.body;
          if (resp.code == 0) {
            this.member = resp.data;
          }
        });
    },
  },
  created() {
    this.getMyPromotionList();
    let member = JSON.parse(localStorage.getItem("MEMBER") || "{}");
    this.promotionCode = member.promotionCode
    this.linkUrl = this.inviteHost + "?code=" + this.promotionCode
    this.getMember()
  },
  computed: {
    tableColumnsPromotion() {
      let self = this;
      let columns = [];
      columns.push({
        title: this.$t("uc.promotion.my_column0"),
        key: "username",
        align: "center",
        render(h, params) {
          return h(
            "span",
            {
              style: {
                letterSpacing: "2px"
              }
            },
            params.row.username
          );
        }
      });
      columns.push({
        title: this.$t("uc.promotion.my_column1"),
        key: "createTime",
        align: "center"
      });
      // columns.push({
      //   title: this.$t("uc.promotion.my_column2"),
      //   key: "realNameStatus",
      //   align: "center",
      //   render(h, params) {
      //     let text = "未实名";
      //     if(params.row.realNameStatus == 2) {
      //       text = "已实名";
      //       return h(
      //         "span",{style:{
      //             color: "#42b983"
      //           }}, text
      //       );
      //     }
      //     return h(
      //       "span",{style:{
      //             color: "#FF0000"
      //           }}, text
      //     );
      //   }
      // });
      columns.push({
        title: '手续费',
        key: "reward",
        align: "center",
        render(h, params) {
          let text = params.row.reward;
          return h(
            "span", {
            style: {
              color: "#ccccc"
            }
          }, text
          );
        }
      });
      columns.push({
        title: '返还比例',
        key: "rakeBack",
        align: "center",
        render(h, params) {
          let text = "-";
          if (params.row.rakeBack == null) {
            text = "0";
          } else {
            text = params.row.rakeBack + "%"
          }
          return h(
            "span", {
            style: {
              color: "#ccccc"
            }
          }, text
          );
        }
      });
      columns.push({
        title: '操作',
        key: "actions",
        align: "center",
        render(h, params) {
          return h("Button", {
            props: {
              size: "small",
              type: "error"
            },
            style: {
              marginRight: "5px"
            },
            on: {
              click: () => {
                self.toSetRakeBack(params.row);
              }
            }
          }, "设置")
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
      padding: 5px;
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

              .ivu-btn {
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

              .ivu-btn.ivu-btn-info {
                border: 1px solid #f0ac19;

                span {
                  color: #f0ac19;
                }
              }

              .ivu-btn.ivu-btn-error {
                border: 1px solid #f15057;

                span {
                  color: #f15057;
                }
              }

              .ivu-btn.ivu-btn-primary {
                border: 1px solid #00b275;
                border: 1px solid #00b275;

                span {
                  color: #00b275;
                }
              }

              .ivu-btn.ivu-btn-default {
                border: 1px solid #2c384f;
                background: #222c3e;

                span {
                  color: #54637a;
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>

<style scoped lang="scss">
.nav-right {
  height: auto;
  overflow: hidden;
  padding: 0 0 0 15px;

  .rightarea.bill_box {
    padding-left: 15px;
    width: 100%;
    height: auto;
    overflow: hidden;
  }
}

.demo-spin-icon-load {
  animation: ani-demo-spin 1s linear infinite;
}

.header-btn {
  float: right;
  padding: 5px 15px;
  border: 1px solid #f0ac19;
  color: #f0ac19;
  margin-left: 20px;

  &:hover {
    background: #f0ac19;
    color: #000;
    cursor: pointer;
  }
}
</style>
