<template>
    <div class="total-assets-container" @mouseenter="handleMouseEnter" @mouseleave="showAssetsMenu = false">
        <div class="download-btn flex_center">
            <TotalAssetsIcon style="width: 20px; height: 20px;" :size="14" className="download-btn1" />
        </div>
        <div v-if="showAssetsMenu" class="dropdown-position">
            <div class="dropdown-arrow"></div>
            <div class="assets-dropdown">
                <div class="assets-header">
                    <div class="assets-title">
                        <span class="title-text">总资产估值</span>
                        <div class="visibility-toggle" @click="toggleVisibility">
                            <img v-if="isVisible" src="../assets/svg/eye_open.svg" alt="">
                            <img v-else src="../assets/svg/eye_closed.svg" alt="">
                        </div>
                    </div>
                    <div class="assets-amount">
                        <div class="amount-value">{{ displayTotalAssets }}</div>
                        <div class="amount-usd">{{ displayTotalAssetsUsd }}</div>
                    </div>
                </div>

                <div class="action-buttons">
                    <div class="action-btn" @click="navigateTo('/recharge')">
                        <div class="action-icon">
                            <img style="width: 24px; height: 24px;" src="../assets/svg/xiazai.svg" alt="">
                        </div>
                        <span>充值</span>
                    </div>
                    <div class="action-btn" @click="navigateTo('/withdraw')">
                        <div class="action-icon">
                            <img style="width: 24px; height: 24px;" src="../assets/svg/withdrawal.svg" alt="">
                        </div>
                        <span>提现</span>
                    </div>
                    <div class="action-btn" @click="navigateTo('/assets/transfer')">
                        <div class="action-icon">
                            <img style="width: 24px; height: 24px;" src="../assets/svg/transfer.svg" alt="">
                        </div>
                        <span>划转</span>
                    </div>
                    <div class="action-btn" @click="navigateTo('/transferUser')">
                        <div class="action-icon">
                            <img style="width: 24px; height: 24px;" src="../assets/svg/transfer_fff.svg" alt="">
                        </div>
                        <span>转账</span>
                    </div>
                </div>

                <div class="my-assets-section">
                    <div class="section-title">我的资产</div>
                </div>

                <div class="menu-items">
                    <div class="menu-item" @click="navigateTo('/assets/overview')">
                        <div class="menu-icon">
                            <img src="../assets/svg/asset.svg" alt="">
                        </div>
                        <span>资产总览</span>
                    </div>
                    <div class="menu-item" @click="navigateTo('/assets/spot')">
                        <div class="menu-icon">
                            <img src="../assets/svg/spot_order.svg" alt="">
                        </div>
                        <span>资金账户</span>
                    </div>
                    <div class="menu-item" @click="navigateTo('/assets/contract')">
                        <div class="menu-icon">
                            <img src="../assets/svg/contract_order.svg" alt="">
                        </div>
                        <span>合约账户</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import TotalAssetsIcon from '@/components/svg/TotalAssetsIcon.vue'
import BalanceVisibilityManager from '@/utils/balanceVisibility.js'

export default {
    name: 'TotalAssetsDropdown',
    components: {
        TotalAssetsIcon
    },

    data() {
        return {
            isVisible: BalanceVisibilityManager.getVisibility(),
            showAssetsMenu: false,
            contractWallet: {},
            userinfo: {}
        }
    },
    computed: {
        displayTotalAssets() {
            if (!this.isVisible) {
                return '****'
            }
            return `${this.MathFloor((this.userinfo.balance || 0) + (this.contractWallet.usdtBalance || 0))} USDT`
        },
        displayTotalAssetsUsd() {
            if (!this.isVisible) {
                return '≈ $****'
            }
            return `≈ $ ${this.MathFloor((this.userinfo.balance || 0) + (this.contractWallet.usdtBalance || 0))}`
        },
    },
    methods: {
        toggleVisibility() {
            this.isVisible = BalanceVisibilityManager.toggleVisibility()
        },
        navigateTo(path) {
            this.$router.push(path)
            this.showAssetsMenu = false
        },
        handleMouseEnter() {
            this.init()
            this.showAssetsMenu = true
        },
        getWalletInfo() {
            this.$http
                .post(this.swapHost + "/wallet/list")
                .then(response => {
                    var resp = response.body;
                    this.contractWallet = resp.data || {}
                });
        },
        getAssetWallet() {
            this.$http
                .post(this.host + "/asset/wallet")
                .then(response => {
                    var resp = response.body;
                    this.userinfo = (resp.data && resp.data[0]) || {}
                });
        },
        MathFloor(num) {
            return Math.floor((Number(num) || 0) * 1000) / 1000;
        },
        init() {
            this.getWalletInfo()
            this.getAssetWallet()
        }
    }
}
</script>

<style scoped>
.total-assets-container {
    position: relative;
    display: inline-block;
}

.dropdown-position {
    position: absolute;
    top: 35px;
    right: -40px;
}

.download-btn {
    width: 36px;
    height: 36px;
    border: none;
    color: #fff;
    border-radius: 9999px;
    cursor: pointer;
    background-color: transparent;
    border: 1px solid #464545;

    &:hover {
        background: rgba(208, 245, 0);
        color: #000;

        .download-btn1 {
            color: #000;
        }
    }
}

.download-btn1 {
    color: #fff;
    cursor: pointer;
}

.assets-dropdown {
    width: 340px;
    background: #161616;
    border: 1px solid #2a2a2a;
    border-radius: 18px;
    box-shadow: 0 16px 40px rgba(0, 0, 0, 0.32);
    z-index: 1000;
    overflow: hidden;
    animation: fadeInDown 0.2s ease-out;
    padding: 10px;
}

.dropdown-arrow {
    height: 10px;
    background-color: transparent;
}

@keyframes fadeInDown {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.visibility-toggle {
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
}

.visibility-toggle img {
    width: 16px;
    height: 16px;
}

.assets-header {
    padding: 12px 12px 16px;
    border-bottom: 1px solid #2a2a2a;
}

.assets-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
}

.title-text {
    font-size: 14px;
    color: #8e8e92;
    font-weight: 500;
}

.amount-value {
    font-size: 24px;
    font-weight: 700;
    color: #fff;
    margin-bottom: 4px;
}

.amount-usd {
    font-size: 14px;
    color: #8e8e92;
}

.action-buttons {
    display: flex;
    gap: 10px;
    padding: 16px 8px;
    border-bottom: 1px solid #2a2a2a;
}

.action-btn {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 10px 6px;
    border-radius: 12px;
    cursor: pointer;
    transition: 0.2s;
}

.action-btn:hover {
    background: #1f1f1f;
}

.action-icon {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: #232323;
    display: flex;
    align-items: center;
    justify-content: center;
}

.action-btn span {
    font-size: 13px;
    color: #f5f5f5;
}

.my-assets-section {
    padding: 14px 10px 8px;
}

.section-title {
    font-size: 14px;
    color: #8e8e92;
    font-weight: 500;
}

.menu-items {
    padding: 4px 0 10px;
}

.menu-item {
    display: flex;
    align-items: center;
    padding: 12px 10px;
    cursor: pointer;
    transition: 0.2s;
    color: #fff;
    border-radius: 12px;

    &:hover {
        background-color: #1f1f1f;
    }

    .menu-icon {
        width: 32px;
        height: 32px;
        margin-right: 14px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 8px;
        flex-shrink: 0;
    }

    .menu-icon img {
        width: 18px;
        height: 18px;
    }

    span {
        font-size: 16px;
        font-weight: 500;
        color: #f5f5f5;
    }
}

@media (max-width: 768px) {
    .assets-dropdown {
        width: 300px;
    }
}
</style>
