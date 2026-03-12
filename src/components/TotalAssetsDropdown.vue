<template>
    <div class="total-assets-container" @mouseenter="handleMouseEnter" @mouseleave="showAssetsMenu = false">
        <!-- 总资产按钮 -->
        <div class="download-btn flex_center">
            <TotalAssetsIcon style="width: 20px; height: 20px;" :size="14" className="download-btn1" />
        </div>
        <!-- 总资产下拉菜单 -->
        <div v-if="showAssetsMenu" style="position: absolute; top: 35px; right: -50px;">
            <!-- 资产信息头部 -->
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

                <!-- 操作按钮 -->
                <div class="action-buttons">
                    <div class="action-btn" @click="navigateTo('/recharge')">
                        <div class="action-icon">
                            <img style="width: 32px; height: 32px;" src="../assets/svg/xiazai.svg" alt="">
                        </div>
                        <span>充值</span>
                    </div>

                    <div class="action-btn" @click="navigateTo('/withdraw')">
                        <div class="action-icon">
                            <img style="width: 32px; height: 32px;" src="../assets/svg/withdrawal.svg" alt="">

                        </div>
                        <span>提现</span>
                    </div>

                    <div class="action-btn" @click="navigateTo('/assets/transfer')">
                        <div class="action-icon">
                            <img style="width: 32px; height: 32px;" src="../assets/svg/transfer.svg" alt="">
                        </div>
                        <span>划转</span>
                    </div>
                </div>

                <!-- 我的资产 -->
                <div class="my-assets-section">
                    <div class="section-title">我的资产</div>
                </div>

                <!-- 菜单项 -->
                <div class="menu-items">
                    <div class="menu-item" @click="navigateTo('/assets')">
                        <div class="menu-icon">
                            <img src="../assets/svg/property.svg" alt="">
                        </div>
                        <span>资产总览</span>
                    </div>

                    <div class="menu-item" @click="navigateTo('/assets/spot')">
                        <div class="menu-icon">
                            <img src="../assets/svg/instock.svg" alt="">
                        </div>
                        <span>现货账户</span>
                    </div>

                    <div class="menu-item" @click="navigateTo('/assets/contract')">
                        <div class="menu-icon">
                            <img src="../assets/svg/contract.svg" alt="">
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
            return `${this.MathFloor(this.userinfo.balance + this.contractWallet.usdtBalance)}USDT`
        },
        displayTotalAssetsUsd() {
            if (!this.isVisible) {
                return '≈ $****'
            }
            return `≈ $ ${this.MathFloor(this.userinfo.balance + this.contractWallet.usdtBalance)} `
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
            //获取合约账户
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
                    console.log('this.userinfo', this.userinfo)
                });
        },
        MathFloor(num) {
            return Math.floor(num * 1000) / 1000;
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
    background: #fff;
    border: 1px solid #e5e5e5;
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
    min-width: 320px;
    z-index: 1000;
    overflow: hidden;
    animation: fadeInDown 0.2s ease-out;
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

.assets-header {
    padding: 20px;
    border-bottom: 1px solid #f0f0f0;
}


.assets-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;

    .title-text {
        font-size: 14px;
        color: #666;
        font-weight: 500;
    }

    .visibility-toggle {
        cursor: pointer;
        color: #999;
        transition: color 0.2s;

        &:hover {
            color: #666;
        }
    }
}

.assets-amount {
    .amount-value {
        font-size: 24px;
        font-weight: 700;
        color: #333;
        margin-bottom: 4px;
    }

    .amount-usd {
        font-size: 14px;
        color: #999;
    }
}

.action-buttons {
    display: flex;
    padding: 16px 20px;
    gap: 12px;
    border-bottom: 1px solid #f0f0f0;
}

.action-btn {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 8px;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.2s;

    .action-icon {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 8px;
        color: #fff;

        &:hover {
            background-color: #c6f700;
        }

    }

    span {
        font-size: 12px;
        color: #333;
        font-weight: 500;
    }
}

.my-assets-section {
    padding: 16px 20px 8px;

    .section-title {
        font-size: 14px;
        color: #666;
        font-weight: 500;
    }
}

.menu-items {
    padding: 0 0 8px;
}

.menu-item {
    display: flex;
    align-items: center;
    padding: 12px 20px;
    cursor: pointer;
    transition: background-color 0.2s;
    color: #333;

    &:hover {
        background-color: #f8f9fa;
    }

    .menu-icon {
        width: 20px;
        height: 20px;
        margin-right: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #666;
    }

    span {
        font-size: 14px;
        font-weight: 500;
    }
}

@media (max-width: 768px) {
    .assets-dropdown {
        min-width: 280px;
        right: -20px;
    }
}
</style>