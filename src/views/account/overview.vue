<template>
    <div class="overview-page">
        <h2>总览</h2>

        <!-- 用户邮箱信息 -->
        <div class="info-card ">

            <div style="flex: 1; border-right: 1px solid #e9ebf0;">
                <div class="lebal">账号</div>
                <div class="value">{{ maskEmail(userData.username) }}</div>
            </div>
            <div style="flex: 1; border-right: 1px solid #e9ebf0;">
                <div class="lebal">UID</div>
                <div class="value">{{ userData.promotionCode }}</div>
            </div>
            <div style="flex: 1; border-right: 1px solid #e9ebf0;">
                <div class="lebal">邮箱</div>
                <div class="value">{{ maskEmail(userData.username) }}</div>
            </div>
            <div style="flex: 1;">
                <div class="lebal">账号状态</div>
                <div class="value">正常</div>
            </div>

        </div>

        <!-- 资产信息 -->
        <div class="asset-card">
            <div class="asset-left-card">
                <div class="flex">
                    <h3>总资产</h3>
                    <div @click="rechangeClick" class="rechangeClick">充值</div>
                </div>
                <div class="asset-amount">
                    <span class="amount">{{ MathFloor(userinfo.balance + contractWallet.usdtBalance) }}</span>
                    <span class="currency">USDT</span>
                </div>
                <div class="asset-equivalent">
                    ≈ $ {{ MathFloor(userinfo.balance + contractWallet.usdtBalance) }}
                </div>
            </div>
        </div>
        <div>
            <Security />
        </div>
    </div>
</template>

<script>
import Security from './security.vue';
export default {
    name: 'Overview',
    components: {
        Security,
    },
    computed: {
        userData() {
            const member = this.$store.getters.member;
            console.log(member)
            return member
        },
        registerTime() {
            return '2025-07-07 18:06:39';
        },
        lastLoginTime() {
            return '2025-07-18 09:27:09';
        }
    },
    data() {
        return {
            userinfo: {},
            contractWallet: {}

        };
    },
    methods: {
        maskEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return email;
            }

            const [username, domain] = email.split('@');

            if (username.length <= 3) {
                return username.charAt(0) + '**@' + domain;
            }

            const maskedUsername = username.substring(0, 2) + '**' + username.substring(username.length - 1);
            return maskedUsername + '@' + domain;
        },
        MathFloor(num) {
            return Math.floor(num * 1000) / 1000;
        },
        getMember() {
            //获取个人安全信息
            var self = this;
            this.$http
                .post(this.host + "/approve/security/setting")
                .then(response => {
                    var resp = response.body;
                    self.$store.commit('setSetting', resp.data);
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
                    console.log(this.contractWallet)
                });
        },
        getAssetWallet() {
            //获取资金账户
            var self = this;
            this.$http
                .post(this.host + "/asset/wallet")
                .then(response => {
                    var resp = response.body;
                    this.userinfo = resp.data[0]
                    console.log(this.userinfo)

                });
        },
        rechangeClick() {
            this.$router.push('/recharge')
        },
        init() {
            this.getMember()
            this.getAssetWallet()
            this.getWalletInfo()

        }
    },
    mounted() {
        this.init()
    }
}

</script>

<style scoped>
.overview-page h2 {
    font-size: 36px;
    font-weight: 700;
    margin-bottom: 10px;
    color: #000;
}

.info-card {
    --un-bg-opacity: 1;
    border: 1px solid #eee;
    border-radius: 16px;
    padding: 24px;
    margin-bottom: 15px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 100px;

    .username {
        font-size: 20px;
        font-weight: 700;
        color: #000;
    }

    .lebal {
        --un-text-opacity: 1;
        color: rgba(142, 142, 146, var(--un-text-opacity));
        font-size: 12px;
        font-weight: 700;
        margin-bottom: 4px;
    }

    .value {
        font-size: 14px;
        color: #000;
        font-weight: 700;
    }
}

.card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
}

.verified-badge {
    background-color: #52c41a;
    color: white;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
}

.info-row {
    padding: 8px 0;
    border-bottom: 1px solid #f5f5f5;
}

.label {
    color: #666;
}

.value {
    color: #333;
    font-weight: 500;
}

.status-active {
    color: #52c41a;
}

.btn-primary {
    background-color: #000;
    color: white;
    border: none;
    padding: 8px 24px;
    border-radius: 20px;
    cursor: pointer;
}

.user-overview-container {
    min-height: 100vh;
}

.layout-wrapper {
    display: flex;
}

.sidebar {
    border-right: 1px solid #eaeaed;
    height: 100vh;
    margin: right 38px;
    width: 280px;
    background: white;
    padding: 36px 0 0 0;
}

.user-info-section {
    text-align: center;
    padding-bottom: 20px;
    border-bottom: 1px solid #eee;
    margin-bottom: 20px;
}

.user-avatar img {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    margin-bottom: 10px;
}

.user-details h3 {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 5px;
    color: #333;
}

.user-details p {
    font-size: 14px;
    color: #666;
}

.nav-menu {
    display: flex;
    flex-direction: column;
}

.nav-item {
    display: flex;
    align-items: center;
    gap: 20px;
    margin-right: 36px;
    padding: 12px 0 12px 16px;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 14px;
    color: #000;
    margin-bottom: 16px;
}

.nav-item:hover {
    background-color: #f0f8ff;
    color: #000;
}

.nav-item.active {
    --un-bg-opacity: 1;
    background-color: rgba(248, 248, 248, var(--un-bg-opacity));
}

.main-content {

    flex: 1;
    background: white;
    border-radius: 8px;
    padding: 30px;
}

.overview-content h1 {
    font-size: 36px;
    font-weight: 600;
    margin-bottom: 30px;
    color: #000;
}

.status-active {
    color: #52c41a;
}

.asset-card {
    display: grid;
    gap: 16px;
    grid-template-columns: repeat(2, minmax(0, 1fr));

    .asset-left-card {
        border-radius: 16px;
        border: 1px solid #eaeaed;
        padding: 24px;

        h3 {
            font-size: 12px;
            --un-text-opacity: 1;
            color: rgba(142, 142, 146, var(--un-text-opacity))
        }

        .asset-amount {
            font-size: 32px;
            font-weight: 600;
            margin-bottom: 5px;
            color: #000;

            .amount {
                font-size: 24px;
            }

            .currency {
                font-size: 24px;

            }
        }

        .asset-equivalent {
            font-size: 12px;
            font-weight: 500;
        }

        .rechangeClick {
            background-color: #000;
            color: #fff;
            padding: 13px 16px;
            border-radius: 99999px;
            width: 110px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
        }
    }
}

.tab-content {
    text-align: center;
    padding: 40px 20px;
}

.tab-content h2 {
    font-size: 24px;
    margin-bottom: 20px;
    color: #333;
}

.tab-content p {
    color: #666;
    font-size: 16px;
}
</style>