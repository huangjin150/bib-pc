<template>
    <div class="total-assets-page">
        <!-- 页面标题和操作按钮 -->
        <div class="page-header">
            <div style="display: flex; align-items: center; gap: 10px;">
                <h1 class="page-title">总览</h1>
                <div class="visibility-toggle" @click="toggleVisibility">
                    <img v-if="isVisible" src="../../assets/svg/eye_open.svg" alt="">
                    <img v-else src="../../assets/svg//eye_closed.svg" alt="">
                </div>
            </div>
            <div class="action-buttons">
                <button class="action-btn primary" @click="navigateTo('/recharge')">
                    充值
                </button>
                <button class="action-btn secondary" @click="navigateTo('/withdraw')">
                    提现
                </button>
                <button class="action-btn secondary" @click="navigateTo('/assets/transfer')">
                    划转
                </button>
            </div>
        </div>

        <div class="total-assets-card">
            <div style="flex: 1;">
                <div class="card-header">
                    <div class="title-section">
                    </div>
                </div>
                <div class="asset-amount">
                    <div class="main-amount">{{ displayTotalAssets }}</div>
                    <div class="sub-amount"> {{ displayTotalAssetsUsd }} </div>
                </div>
            </div>

        </div>

        <!-- 账户列表 -->
        <div class="accounts-section">
            <h2 class="section-title">账户</h2>

            <div class="accounts-grid">
                <!-- 现货账户 -->
                <div class="account-card" @click="navigateTo('/assets/spot')">
                    <div class="account-icon">
                        <img style="width: 32px; height: 32px;" src="../../assets/svg/instock.svg" alt="">
                    </div>
                    <div class="account-info">
                        <h3 class="account-title">资金</h3>
                        <div class="account-balance">
                            <div class="balance-amount">{{ contractAssets }}</div>
                            <div class="balance-usd"> {{ contractAssetsUsd }}</div>
                        </div>
                    </div>
                </div>

                <!-- 合约账户 -->
                <div class="account-card" @click="navigateTo('/assets/contract')">
                    <div class="account-icon">
                        <img style="width: 32px; height: 32px;" src="../../assets/svg/contract.svg" alt="">
                    </div>
                    <div class="account-info">
                        <h3 class="account-title">合约</h3>
                        <div class="account-balance">
                            <div class="balance-amount">{{ fundAssets }}</div>
                            <div class="balance-usd">{{ fundAssetsUsd }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="record_title">
            资金流水
        </div>
        <div class="record-box">
            <Record />
        </div>
    </div>
</template>

<script>
import AssetChart from '@/components/AssetChart.vue'
import Record from '@/components/Record.vue'
import BalanceVisibilityManager from '@/utils/balanceVisibility.js'

export default {
    name: 'TotalAssets',
    components: {
        AssetChart,
        Record
    },
    data() {
        return {
            isVisible: BalanceVisibilityManager.getVisibility(),
            selectedPeriod: '1日',
            timePeriods: [
                { label: '1日', value: 'day' },
                { label: '1周', value: 'week' },
                { label: '1月', value: 'month' },
                { label: '3月', value: '3month' },
                { label: '6月', value: '6month' }
            ],
            totalAssets: {
                value: '0.0000',
                currency: 'USDT',
                usdValue: '0'
            },
            spotBalance: {
                value: '0',
                currency: 'USDT',
                usdValue: '0'
            },
            contractBalance: {
                value: '0',
                currency: 'USDT',
                usdValue: '0'
            },

            rawChartData: [
                { time: "2025-07-29", amount: 9628 },
                { time: "2025-07-30", amount: 0 },
                { time: "2025-07-31", amount: 8707.25 },
                { time: "2025-08-01", amount: 8799.25 }
            ],
            contractWallet: {},
            userinfo: {}
        }
    },
    computed: {
        chartData() {
            return this.rawChartData.map(item => {
                const date = new Date(item.time)
                const month = String(date.getMonth() + 1).padStart(2, '0')
                const day = String(date.getDate()).padStart(2, '0')

                return {
                    date: `${month}/${day}`,
                    value: item.amount
                }
            })
        },
        displayTotalAssets() {
            if (!this.isVisible) {
                return '****'
            }
            return `${this.MathFloor(this.userinfo.balance + this.contractWallet.usdtBalance)}USDT`
        },
        displayTotalAssetsUsd() {
            if (!this.isVisible) {
                return '≈ $****'
            }
            return `≈ $ ${this.MathFloor(this.userinfo.balance + this.contractWallet.usdtBalance)} `
        },
        contractAssets() {
            if (!this.isVisible) {
                return '****'
            }
            return `${this.MathFloor(this.contractWallet.usdtBalance)}`

        },
        contractAssetsUsd() {
            if (!this.isVisible) {
                return '≈ $****'
            }
            return `≈ $ ${this.MathFloor(this.contractWallet.usdtBalance)} `
        },
        fundAssets() {
            if (!this.isVisible) {
                return '****'
            }
            return `${this.MathFloor(this.userinfo.balance)}`

        },

        fundAssetsUsd() {
            if (!this.isVisible) {
                return '≈ $****'
            }
            return `≈ $ ${this.MathFloor(this.userinfo.balance)} `
        }
    },
    watch: {
        isVisible: {
            handler(newVal, oldVal) {
                BalanceVisibilityManager.setVisibility(newVal)
            },
            immediate: true
        }
    },
    methods: {
        toggleVisibility() {
            this.isVisible = !this.isVisible
        },
        selectPeriod(period) {
            this.selectedPeriod = period
            var self = this;
            this.$http
                .post(this.host + "/asset/trend", { period: this.selectedPeriod })
                .then(response => {
                    var resp = response.body;
                    this.rawChartData = resp.data
                });
        },
        navigateTo(path) {
            this.$router.push(path)
        },
        getWalletInfo() {
            var self = this;
            this.$http
                .post(this.swapHost + "/wallet/list")
                .then(response => {
                    var resp = response.body;
                    this.contractWallet = resp.data
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
                });
        },

        MathFloor(num) {
            return Math.floor(num * 1000) / 1000;
        },
        init() {
            this.getWalletInfo()
            this.getAssetWallet()
            this.selectPeriod('day')
        }
    },
    mounted() {
        this.init()
    },
}
</script>

<style scoped>
.total-assets-page {
    min-height: 100vh;
    padding: 36px 80px 80px 56px;
}

.page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
}

.page-title {
    font-size: 24px;
    font-weight: 600;
    color: #333;
    margin: 0;
}

.action-buttons {
    display: flex;
    gap: 12px;
}

.action-btn {
    min-width: 60px;
    height: 36px;
    padding: 0 16px;
    border-radius: 15px;
    border: none;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
}

.action-btn.primary {
    background-color: #000;
    color: #fff;
}

.action-btn.primary:hover {
    background-color: #D0F500;
    color: #000;
}

.action-btn.secondary {
    background-color: #000;
    color: #fff;
    border: 1px solid #ddd;
}

.action-btn.secondary:hover {
    background-color: #D0F500;
    color: #000;

}

.total-assets-card {
    gap: 30px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #fff;
    border-radius: 12px;
    padding: 0;
    margin-bottom: 24px;
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.title-section {
    display: flex;
    align-items: center;
    gap: 8px;
}

.title {
    font-size: 16px;
    color: #666;
    font-weight: 500;
}

.visibility-toggle {
    cursor: pointer;
    color: #999;
    transition: color 0.2s;
}

.visibility-toggle:hover {
    color: #666;
}

.time-filter {
    gap: 4px;
}

.time-btn {
    padding: 6px 12px;
    border: none;
    background: transparent;
    color: #666;
    font-size: 14px;
    cursor: pointer;
    border-radius: 8px;
    transition: all 0.2s;
    margin-right: 10px;
}

.time-btn.active {
    background-color: #f0f0f0;
    color: #333;
}

.time-btn:hover {
    background-color: #f5f5f5;
}

.asset-amount {
    margin-bottom: 24px;
}

.main-amount {
    font-size: 24px;
    font-weight: 700;
    color: #000;
}

.sub-amount {
    font-size: 16px;
    color: #999;
}

.chart-container {
    height: 140px;
    position: relative;
}

.chart-placeholder {
    width: 100%;
    height: 100%;
    position: relative;
}

.chart-timeline {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    color: #999;
}

/* 账户部分 */
.accounts-section {
    margin-top: 32px;
}

.section-title {
    font-size: 20px;
    font-weight: 600;
    color: #333;
    margin-bottom: 16px;
}

.accounts-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 16px;
}

.account-card {
    background: #fff;
    border-radius: 12px;
    padding: 16px 24px;
    border: 1px solid #eaeaed;
    gap: 16px;
    cursor: pointer;
    transition: all 0.2s;
}



.account-icon {
    width: 48px;
    height: 40px;
    border-radius: 50%;
    color: #666;
}

.account-info {
    flex: 1;
}

.account-title {
    font-size: 16px;
    font-weight: 600;
    color: #333;
    margin: 0 0 8px 0;
}

.account-balance {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.balance-amount {
    font-size: 20px;
    font-weight: 600;
}

.balance-usd {
    font-size: 14px;
    color: #999;
}

@media (max-width: 768px) {
    .total-assets-page {
        padding: 16px;
    }

    .page-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 16px;
    }

    .accounts-grid {
        grid-template-columns: 1fr;
    }

    .card-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 16px;
    }
}

.record-box {
    padding: 16px;
    border-radius: 20px;

}

.record_title {
    color: #000;
    font-size: 24px;
    font-weight: 700;
    padding: 24px 0;
}
</style>