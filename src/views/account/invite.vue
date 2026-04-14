<template>
    <div>
        <div class="container-box">
            <div class="container">
                <div class="invite-page">
                    <div class="stats-section">
                        <div class="stats-container">
                            <div class="stats-left">
                                <div class="invite-header">
                                    <h1 class="main-title">立即邀请您的朋友！</h1>
                                    <p class="subtitle">
                                        交易奖励来袭！邀请好友注册并交易——交易者与推荐人将共享
                                        <span class="highlight">10% ~ 50%</span> 返佣！
                                    </p>
                                </div>
                                <div class="stat-item flex">
                                    <div>
                                        <div class="stat-label">总佣金</div>
                                        <div class="stat-value">
                                            <span class="amount">{{ truncateToTwoDecimal(totalCommissionRebate)
                                            }}</span>
                                            <span class="currency">USDT</span>
                                        </div>
                                    </div>
                                    <div>
                                        <div class="stat-label">邀请总人数</div>
                                        <div class="stat-value">
                                            <span class="amount">{{ invitationTotal }}</span>
                                            <span class="unit">名邀请用户</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="stats-right">
                                <div class="commission-card">
                                    <div class="commission-header">
                                        <h3 class="commission-title">邀请码</h3>
                                    </div>
                                    <div class="commission-rates">
                                        <div class="rate-item">
                                            <div class="rate-label"><span>邀请返佣比例</span> <img @click="invitationBack"
                                                    style="width: 13px; height: 13px; margin-left: 5px; cursor: pointer;"
                                                    src="../../assets/images/wenhao.png" alt=""></div>
                                            <span class="rate-value">{{ (members?.nodeRate * 100) }}%</span>
                                        </div>
                                        <div class="rate-item">
                                            <div class="rate-label"><span>上级返佣比例</span> <img @click="superiorBack"
                                                    style="width: 13px; height: 13px; margin-left: 5px; cursor: pointer;"
                                                    src="../../assets/images/wenhao.png" alt=""></div>
                                            <span class="rate-value">{{ (members?.rakeBack || 0) }}%</span>
                                        </div>
                                        <div style="cursor: pointer;" @click="toSetRakeBack" class="rate-item">
                                            <span class="rate-label">好友返还比例</span>
                                            <span class="rate-value">{{ (members?.childRate) }}%</span>
                                        </div>
                                    </div>

                                    <div class="flex receive_box">
                                        <div class="">
                                            <div class="flex_label">
                                                待领取(USDT)
                                            </div>
                                            <div class="flex_label_value">
                                                {{ truncateToTwoDecimal(contractWallet?.rakeBack) }}
                                            </div>
                                        </div>

                                        <div @click="receiveClick" class="receive">
                                            领取
                                        </div>
                                    </div>

                                    <div class="invite-info">
                                        <div class="info-item">
                                            <div class="info-value">
                                                <span class="info-label">推荐码</span>
                                                <div class="flex_alicenter">
                                                    <span class="code-text">{{ promotionCode }}</span>
                                                    <button class="copy-btn" @click="copyCode">
                                                        <img src="../../assets/images/copy.svg" alt="">
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="info-item">
                                            <div class="info-value">
                                                <span style="width: 20%;" class="info-label">推荐链接</span>
                                                <div style="width: 70%;" class="flex_alicenter">
                                                    <span style="max-width: 340px;" class="link-text">{{ linkUrl
                                                    }}</span>
                                                    <button class="copy-btn" @click="copyLink">
                                                        <img src="../../assets/images/copy.svg" alt="">
                                                    </button>
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
        <div class="myPromotion-box">
            <MyPromotion @promotion-data-updated="handlePromotionDataUpdated"
                @promotion-data-setting="handlePromotionDataSetting" />
        </div>
        <Modal v-model="showModal" title="手续费返还比例" width="360">
            <p slot="header" style="color:#000;text-align:left">
                <Icon type="ios-information-circle"></Icon>
                <span>手续费返还比例</span>
            </p>
            <div style="text-align:center">
                <div style="font-size: 13px; margin-bottom: 5px;"> 好友返还金额 = 交易手续费 × 返佣比例% × 返还比例% </div>
                <Input v-model="rakeBack" placeholder="请输入返还百分比" />
            </div>
            <div slot="footer">
                <Button type="error" style="background-color: #000; border: none;" size="large" long
                    :loading="modal_loading" @click="handlerUpdate">确认修改</Button>
            </div>
        </Modal>

        <Modal v-model="showModal1" title="邀请返佣比例" width="360">
            <p slot="header" style="color:#000;text-align:left">
                <Icon type="ios-information-circle"></Icon>
                <span>邀请返佣比例</span>
            </p>
            <div style="text-align:center">
                <div style="font-size: 13px; text-align: start; margin-bottom: 5px;"> 下级用户交易手续费返还的比例 </div>
            </div>
            <div slot="footer">
                <Button type="error" style="background-color: #000; border: none;" size="large" long
                    :loading="modal_loading1" @click="invitationClose">确认</Button>
            </div>
        </Modal>

        <Modal v-model="showModal2" title="上级返佣比例" width="360">
            <p slot="header" style="color:#000;text-align:left">
                <Icon type="ios-information-circle"></Icon>
                <span>上级返佣比例</span>
            </p>
            <div style="text-align:center">
                <div style="font-size: 13px; text-align: start; margin-bottom: 5px;"> 上级获得你产生交易的手续费后 返还给你的比例</div>
            </div>
            <div slot="footer">
                <Button type="error" style="background-color: #000; border: none;" size="large" long
                    :loading="modal_loading2" @click="superiorClose">确认</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
import MyPromotion from './myPromotion.vue';
export default {
    components: { MyPromotion },
    name: 'Invite',
    data() {
        return {
            inviteCode: '',
            baseUrl: 'https://www.BIBCEX.pro/register?inviteCode=',
            promotionCode: '',
            linkUrl: '',
            memberData: {},
            members: {},
            totalCommissionRebate: 0,
            invitationTotal: 0,//我的邀请总数量
            contractWallet: {},
            showModal: false,
            showModal1: false,
            showModal2: false,
            modal_loading: false,
            modal_loading1: false,
            modal_loading2: false,
            rakeBack: '',
        };
    },
    computed: {
        inviteLink() {
            return this.baseUrl + this.inviteCode;
        }
    },
    created() {
        let member = JSON.parse(localStorage.getItem("MEMBER") || "{}");
        this.promotionCode = member.promotionCode
        this.linkUrl = this.inviteHost + "?code=" + this.promotionCode
        this.init()
    },
    methods: {
        init() {
            this.totalrewardGet()
            this.getMember()
            this.getWalletInfo()
        },
        async copyCode() {
            try {
                await navigator.clipboard.writeText(this.promotionCode);
                this.$Message.success('推荐码已复制到剪贴板');
            } catch (err) {
                this.fallbackCopy(this.inviteCode);
            }
        },

        async copyLink() {
            await navigator.clipboard.writeText(this.linkUrl);
            this.$Message.success('复制成功');
        },

        truncateToTwoDecimal(value) {
            return Math.trunc(value * 100) / 100;
        },

        fallbackCopy(text) {
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            try {
                document.execCommand('copy');
                this.$Message.success('已复制到剪贴板');
            } catch (err) {
                this.$Message.error('复制失败，请手动复制');
            }
            document.body.removeChild(textArea);
        },

        handlePromotionDataUpdated(data) {
            this.invitationTotal = data.promotionList.total
        },
        handlePromotionDataSetting(data) {
            this.memberData = data
        },

        async totalrewardGet() {
            await this.$http
                .post(this.host + "/asset/transaction/statistics", { type: [9, 33] })
                .then(response => {
                    var resp = response.body;
                    if (resp.code == 0) {
                        this.totalCommissionRebate = resp.data

                    } else {
                        this.$Message.error(resp.message);
                    }
                });
        },

        getWalletInfo() {
            //获取合约账户
            var self = this;
            this.$http
                .post(this.swapHost + "/wallet/list")
                .then(response => {
                    var resp = response.body;
                    this.contractWallet = resp.data
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
                        this.members = resp.data;
                    }
                });
        },
        handlerUpdate() {
            if (this.rakeBack == "" || this.rakeBack == null) {
                this.$Message.error('请输入返还比例');
                return;
            }
            let param = {};
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
                    this.getMember()
                } else {
                    this.$Message.error(resp.message);
                }
                this.modal_loading = false;
            });
        },

        invitationClose() {
            this.showModal1 = false
        },

        superiorClose() {
            this.showModal2 = false
        },


        receiveClick() {
            if (this.contractWallet.rakeBack <= 0) {
                this.$Message.error('暂无可领取奖励');
                return
            }
            this.$http
                .post(this.swapHost + "/wallet/reward-rake-back")
                .then(response => {
                    var resp = response.body;
                    if (resp.code == 0) {
                        this.members = resp.data;
                        this.$Message.success('领取成功');
                        this.totalrewardGet()
                        this.getMember()
                        this.getWalletInfo()
                    }
                });


        },

        toSetRakeBack() {
            this.showModal = true
        },
        invitationBack() {
            this.showModal1 = true
        },
        superiorBack() {
            this.showModal2 = true

        },

        shareInvite() {

        }
    }
};
</script>

<style scoped>
.container-box {
    width: 100%;
    height: 452px;
    background-image: url('../../assets/images/bannerBg.png');
    background-position: center bottom;
    background-repeat: no-repeat;
    background-size: 100%;

}

.invite-page {
    padding: 52px 0;
    min-height: 100vh;
}

.invite-header {
    text-align: center;
    margin-bottom: 48px;
}

.main-title {
    font-size: 44px;
    font-weight: 700;
    color: #333;
    margin: 0 0 16px 0;
    line-height: 1.2;
    text-align: start;
}

.subtitle {
    font-size: 16px;
    text-align: start;
    color: #666;
    line-height: 1.6;
    margin: 0;
    max-width: 600px;
    margin: 0 auto;
}

.highlight {
    color: #84cc16;
    font-weight: 600;
    text-decoration-line: underline;
}

.stats-section {
    max-width: 1270px;
    margin: 0 auto;
}

.stats-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.stats-left {
    max-width: 665px;
    display: flex;
    flex-direction: column;
    gap: 32px;
}

.stat-item {
    border: 1px solid #eaeaed;
    border-radius: 16px;
    padding: 24px 32px;
    width: 512px;
    text-align: center;
}

.stat-label {
    text-align: start;
    font-size: 16px;
    color: #666;
    margin-bottom: 12px;
}

.stat-value {
    display: flex;
    align-items: baseline;
    gap: 8px;
}

.amount {
    font-size: 48px;
    font-weight: 700;
    color: #333;
    line-height: 1;
}

.currency,
.unit {
    font-size: 16px;
    color: #666;
    font-weight: 500;
}

.stats-right {
    display: flex;
    justify-content: center;
}

.commission-card {
    background: #fff;
    border: 1px solid #e8e8e8;
    border-radius: 12px;
    padding: 24px;
    width: 100%;
    max-width: 496px;
}

.commission-header {
    text-align: start;
    margin-bottom: 16px;
}

.commission-title {
    font-size: 18px;
    font-weight: 600;
    margin: 0;
}

.commission-rates {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    padding: 16px 0;
    border-radius: 8px;
}

.rate-item {
    --un-bg-opacity: 1;
    background-color: rgba(248, 248, 248, var(--un-bg-opacity));
    flex: 1;
    line-height: 1.2;
    padding: 15px 0;
    border-radius: 10px;
    text-align: center;
}

.rate-label {
    font-size: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.rate-value {
    font-size: 24px;
    font-weight: 700;
    color: #333;
}

.invite-info {}

.info-item {
    display: flex;
    align-items: center;
    gap: 8px;
}

.info-label {
    font-size: 16px;
    font-weight: 500;
}

.info-value {
    display: flex;
    margin-top: 16px;
    width: 100%;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    padding: 2px 16px;
    border: 1px solid #e9ecef;
    border-radius: 6px;
}

.code-text,
.link-text {
    padding-left: 40px;
    overflow: hidden;
    flex: 1;
    font-size: 14px;
    text-wrap: nowrap;
    white-space: nowrap;
    text-overflow: ellipsis;
}

.copy-btn {
    background: transparent;
    border: none;
    padding: 4px;
    cursor: pointer;
    border-radius: 4px;
    transition: background 0.2s ease;
    flex-shrink: 0;
}

.copy-btn:hover {
    background: #e9ecef;
}

.copy-icon {
    font-size: 16px;
    display: block;
}

.share-btn {
    width: 100%;
    background: #000;
    color: white;
    border: none;
    padding: 13px 24px;
    border-radius: 99999px;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.3s ease;
    margin-top: 15px;
    line-height: 1.2;
}

.share-btn:hover {
    background: #333;
}

/* 响应式设计 */
@media (max-width: 768px) {
    .invite-page {
        padding: 24px 16px;
    }

    .main-title {
        font-size: 24px;
    }

    .subtitle {
        font-size: 14px;
    }

    .stats-container {
        grid-template-columns: 1fr;
        gap: 32px;
    }

    .stats-left {
        order: 2;
    }

    .stats-right {
        order: 1;
    }

    .commission-rates {
        flex-direction: column;
        gap: 16px;
    }

    .amount {
        font-size: 36px;
    }

    .commission-card {
        max-width: none;
    }
}

@media (max-width: 480px) {
    .main-title {
        font-size: 20px;
    }

    .amount {
        font-size: 28px;
    }

    .commission-card {
        padding: 20px;
    }

    .info-value {
        flex-direction: column;
        align-items: stretch;
        gap: 12px;
    }

    .copy-btn {
        align-self: flex-end;
    }
}

.myPromotion-box {
    padding: 70px 0 0 0;
    width: 1270px;
    margin: 0 auto;
}

.receive_box {
    padding: 16px 16px 6px 16px;
    --un-bg-opacity: 1;
    background-color: rgba(248, 248, 248, var(--un-bg-opacity));
    border-radius: 8px;
}

.flex_label {
    font-size: 12px;
}


.flex_label_value {
    font-size: 24px;
    font-weight: 700;
    color: #333;
}

.receive {
    background-color: #D0F500;
    padding: 5px 15px;
    border-radius: 10px;
    cursor: pointer;
}

::v-deep(.ivu-page) {
    display: flex;
    align-items: center;
    justify-content: flex-end;
}

::v-deep(.ivu-page-prev) {
    border: none;
}

::v-deep(.ivu-page-next) {
    border: none;
}

::v-deep(.ivu-page-item) {
    border: none;
}
</style>