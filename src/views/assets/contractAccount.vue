<template>
    <div class="total-assets-page">
        <div class="page-header">
            <div style="display: flex;align-items: center;gap: 10px;">
                <h1 class="page-title">合约</h1>
                <div class="visibility-toggle" @click="toggleVisibility">
                    <img v-if="isVisible" src="../../assets/svg/eye_open.svg" alt="">
                    <img v-else src="../../assets/svg//eye_closed.svg" alt="">
                </div>
            </div>
            <div class="action-buttons">
                <button class="action-btn primary" @click="navigateTo('/recharge')">
                    充值
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
                        <span class="title">预估总资产</span>
                    </div>
                </div>
                <div class="asset-amount">
                    <div class="main-amount">{{ displayTotalAssets }}</div>
                    <div class="sub-amount">{{ displayTotalAssetsUsd }}</div>
                </div>
            </div>
            <div class="unrealized-card">
                <div class="unrealized-card-title">
                    未实现盈亏
                </div>
                <div class="unrealized-price" :class="unsettledValue >= 0 ? 'text-green' : 'text-red'">
                    {{ displayUnrealizedProfit }}
                </div>
                <div class="unrealized-price1" :class="unsettledValue >= 0 ? 'text-green' : 'text-red'">
                    {{ displayUnrealizedProfitCny }}
                </div>
            </div>
        </div>
        <div class="swapAssets_title">
            合约记录
        </div>
        <div class="swapAssets-box">
            <SwapAssets @wallet-data-updated="handleWalletDataUpdate" />
        </div>
    </div>

</template>

<script>
import SwapAssets from './components/SwapAssets.vue'
import BalanceVisibilityManager from '@/utils/balanceVisibility.js'

export default {
    name: 'TotalAssets',
    components: {
        SwapAssets
    },
    data() {
        return {
            isVisible: BalanceVisibilityManager.getVisibility(),
            totalAssets: {
                value: '0.0000',
                currency: 'USDT',
                usdValue: '0'
            },
            contractWalletData: {
                walletAsset: {
                    unsettledProfitAndLos: 0
                }
            },
        }
    },
    computed: {
        unsettledValue() {
            return this.contractWalletData?.walletAsset?.unsettledProfitAndLos ?? 0;
        },
        displayTotalAssets() {
            if (!this.isVisible) {
                return '****'
            }
            return this.MathFloor(this.totalAssets.value)
        },
        displayTotalAssetsUsd() {
            if (!this.isVisible) {
                return '≈ ****'
            }
            return `≈ ${this.MathFloor(this.totalAssets.value)} USD`
        },
        displayUnrealizedProfit() {
            if (!this.isVisible) {
                return '****'
            }
            return `${this.MathFloor(this.contractWalletData?.walletAsset?.unsettledProfitAndLos)} USDT`
        },
        displayUnrealizedProfitCny() {
            if (!this.isVisible) {
                return '≈ ****'
            }
            return `≈ $${this.MathFloor(this.contractWalletData?.walletAsset?.unsettledProfitAndLos)}`
        }
    },
    methods: {
        toggleVisibility() {
            this.isVisible = BalanceVisibilityManager.toggleVisibility()
        },
        selectPeriod(period) {
            this.selectedPeriod = period
        },
        navigateTo(path) {
            this.$router.push(path)
        },
        MathFloor(num) {
            return Math.floor(num * 1000) / 1000;
        },
        handleWalletDataUpdate(data) {
            this.contractWalletData = data;
            console.log('this.contractWalletData', this.contractWalletData)
            this.totalAssets = {
                value: data?.totalUSDT || '0.0000',
                currency: 'USDT',
                usdValue: data?.totalCny || '0'
            };
        },
    },
    mounted() {
        this.handleWalletDataUpdate()
    },
}
</script>

<style scoped>
.total-assets-page {
    padding: 36px 80px 80px 56px;
    min-height: 100vh;
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
    background: #fff;
    border-radius: 12px;
    padding: 24px;
    margin-bottom: 24px;
    border: 1px solid #eaeaed;
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
    border-radius: 4px;
    transition: all 0.2s;
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
    color: #000 !important;
    font-weight: 700;
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

/* 响应式设计 */
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

.unrealized-card {

    .unrealized-card-title {
        font-size: 14px;
        --un-text-opacity: 1;
        color: rgba(142, 142, 146, var(--un-text-opacity));
    }

    .unrealized-price {
        font-weight: 700;
        font-size: 24px;
    }

    .unrealized-price1 {
        font-size: 16px;
        --un-text-opacity: 1;
        color: rgba(142, 142, 146, var(--un-text-opacity));
    }
}

.text-green {
    color: #84cc16 !important;
}

.text-red {
    color: #f43f5e !important;

}

.swapAssets_title {
    font-size: 24px;
    color: #000;
    font-weight: 700;
    padding: 0 0 24px 0;
}

.swapAssets-box {
    border: 1px solid #eaeaed !important;
    border-radius: 12px;
}

::v-deep(.ivu-table-wrapper) {
    border: none !important;
}
</style>