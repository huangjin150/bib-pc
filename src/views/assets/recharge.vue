<template>
    <div class="deposit-page">
        <div class="container">
            <div class="deposit-content">
                <h1 class="page-title">充值</h1>
                <div class="main-content">
                    <!-- 左侧充值表单 -->
                    <div class="deposit-form">
                        <div class="form-section">
                            <div class="step-header">
                                <span class="step-number">1</span>
                                <span class="step-title">选择币种</span>
                            </div>
                            <div class="currency-selector">
                                <div class="selected-currency">
                                    <!-- <img src="../../assets/svg/usdt-icon.svg" alt="USDT" class="currency-icon"> -->
                                    <span class="currency-name">USDT</span>
                                </div>
                            </div>
                        </div>
                        <div class="form-section">
                            <div class="step-header">
                                <span class="step-number">2</span>
                                <span class="step-title">选择网络</span>
                            </div>
                            <div class="network-selector">
                                <div class="selected-network" @click="showNetworkDropdown = !showNetworkDropdown">
                                    <span class="network-placeholder">{{ selectedNetworks }}</span>
                                    <svg class="dropdown-arrow" :class="{ 'rotated': showNetworkDropdown }" width="12"
                                        height="12" viewBox="0 0 12 12">
                                        <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" stroke-width="1.5"
                                            fill="none" />
                                    </svg>
                                </div>
                                <div v-if="showNetworkDropdown" class="network-dropdown">
                                    <div v-for="network in netwokers" :key="network.id" class="network-option"
                                        @click="selectNetwork(network)">
                                        <span>{{ network.name }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="form-section">
                            <div class="step-header" :style="{ opacity: selectedNetworks !== '选择网络' ? 1 : 0.5 }">
                                <span class="step-number">3</span>
                                <span class="step-title">充值地址</span>
                            </div>
                            <div v-if="selectedNetworks !== '选择网络'">
                                <div class="address-section">
                                    <div class="qr-code-container">
                                        <div class="qr-code">
                                            <div class="qr-placeholder">
                                                <qriously :value="rechargeAddress" :size="120"
                                                    background-color="#ffffff" foreground-color="#000000" />
                                            </div>
                                        </div>
                                    </div>
                                    <div class="address-info">
                                        <div class="address">USDT 地址</div>
                                        <div class="address-input">
                                            <input type="text" v-model="rechargeAddress" readonly placeholder="">
                                            <div class="copy-btn" @click="copyAddress">
                                                <img src="../../assets/images/copy.svg" alt="">
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="describe">
                                    <div class="flex">
                                        <div class="describe_label">
                                            最小充币数量
                                        </div>
                                        <div class="describe_value">
                                            {{ depositAddress.minRecharge }} USDT
                                        </div>
                                    </div>
                                    <div class="flex">
                                        <div class="describe_label">
                                            充币账户
                                        </div>
                                        <div class="describe_value">
                                            资金账户
                                        </div>
                                    </div>
                                    <div class="flex">
                                        <div class="describe_label">
                                            充币到账时间
                                        </div>
                                        <div class="describe_value">
                                            约 {{ depositAddress.expectedTimeOfReceipt }} 分钟
                                        </div>
                                    </div>
                                    <div class="flex">
                                        <div class="describe_label">
                                            合约地址
                                        </div>
                                        <div class="describe_value">
                                            {{ getLastChars(walletData.coinVo?.contractAddressBsc) }} </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 右侧提示信息 -->
                    <div class="info-panel">
                        <div class="tips-section">
                            <h3 class="tips-title">温馨提示</h3>
                            <ul class="tips-list">
                                <li>请勿向此地址存入非 USDT 资产，否则将导致资产无法找回</li>
                                <li>请确保存款金额超过最低门槛，以确保成功入账</li>
                                <li>请确保您的浏览器和网络环境安全，并考虑启用多重安全设置</li>
                            </ul>
                        </div>
                        <div class="faq-section">
                            <div class="faq-header">
                                <h3 class="faq-title">常见问题</h3>
                                <a href="#" class="more-link">更多 ></a>
                            </div>
                            <div class="faq-list">
                                <div class="faq-item">
                                    <svg class="faq-icon" width="16" height="16" viewBox="0 0 16 16"
                                        fill="currentColor">
                                        <path
                                            d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                                        <path
                                            d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286zm1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94z" />
                                    </svg>
                                    <span>为什么充值不到账？</span>
                                </div>
                                <div class="faq-item">
                                    <svg class="faq-icon" width="16" height="16" viewBox="0 0 16 16"
                                        fill="currentColor">
                                        <path
                                            d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                                        <path
                                            d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286zm1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94z" />
                                    </svg>
                                    <span>充值时间和到账时间的差异？</span>
                                </div>
                                <div class="faq-item">
                                    <svg class="faq-icon" width="16" height="16" viewBox="0 0 16 16"
                                        fill="currentColor">
                                        <path
                                            d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                                        <path
                                            d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286zm1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94z" />
                                    </svg>
                                    <span>忘记/错误标签(Tag/Memo)找回申请指南</span>
                                </div>
                                <div class="faq-item">
                                    <svg class="faq-icon" width="16" height="16" viewBox="0 0 16 16"
                                        fill="currentColor">
                                        <path
                                            d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                                        <path
                                            d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286zm1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94z" />
                                    </svg>
                                    <span>如何解决充值错误？</span>
                                </div>
                                <div class="faq-item">
                                    <svg class="faq-icon" width="16" height="16" viewBox="0 0 16 16"
                                        fill="currentColor">
                                        <path
                                            d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                                        <path
                                            d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286zm1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94z" />
                                    </svg>
                                    <span>如何给我的BIBCEX账户充值数字货币？</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="recharge_box">
            <Recharge @wallet-data-updated="handleWalletDataUpdate" />
        </div>
    </div>
</template>

<script>
import Recharge from './components/Recharge.vue'

export default {
    name: 'DepositPage',
    components: {
        Recharge
    },
    data() {
        return {
            showCurrencyDropdown: false,
            showNetworkDropdown: false,
            selectedCurrency: {
                code: 'USDT',
                icon: '../../assets/svg/usdt-icon.svg'
            },
            selectedNetwork: null,
            selectedNetworks: '选择网络',
            depositAddress: '',
            currencies: [
                { code: 'USDT', icon: '../../assets/svg/usdt-icon.svg' },
                { code: 'BTC', icon: '../../assets/svg/btc-icon.svg' },
                { code: 'ETH', icon: '../../assets/svg/eth-icon.svg' }
            ],
            netwokers: [
            ],
            rechargeAddress: '',
            walletData: {}
        }
    },
    methods: {
        selectCurrency(currency) {
            this.selectedCurrency = currency
            this.showCurrencyDropdown = false
            this.generateDepositAddress()
        },
        selectNetwork(network) {
            this.selectedNetwork = network
            this.selectedNetworks = network.name
            this.showNetworkDropdown = false
            this.generateDepositAddress()
        },
        generateDepositAddress() {
            if (this.selectedCurrency && this.selectedNetwork) {
                this.netwokers.forEach(item => {
                    if (item.id == this.selectedNetwork.id) {
                        this.depositAddress = item
                        this.getRechargeAddress()
                    }
                });
            }
        },
        async getRechargeAddress() {
            await this.$http
                .post(this.host + "/asset/wallet/reset-address", {
                    unit: 'USDT'
                })
                .then(response => {
                    var resp = response.body;
                    if (resp.code == 0) {
                        this.rechargeAddress = '0x' + resp.data.address;
                    } else {
                        this.$Message.error(resp.message);
                    }
                });
        },
        async newwokerlistGet() {
            await this.$http
                .get(this.host + "/blockchain", {})
                .then(response => {
                    var resp = response.body;
                    if (resp.code == 0) {
                        this.netwokers = resp.data;
                    } else {
                        this.$Message.error(resp.message);
                    }
                });
        },
        handleWalletDataUpdate(data) {
            for (let i = 0; i < data.coinList.data.length; i++) {
                var coin = data.coinList.data[i];
                if (coin.coinVo.canRecharge == 1) {
                    this.walletData = coin
                }
            }
        },
        getLastChars(str) {
            if (typeof str !== 'string') return '';
            return str.slice(-5);
        },
        copyAddress() {
            if (this.rechargeAddress) {
                navigator.clipboard.writeText(this.rechargeAddress).then(() => {
                    this.$Message.success('地址已复制到剪贴板')
                })
            }
        }
    },
    mounted() {
        this.newwokerlistGet()
    }
}
</script>

<style scoped>
.deposit-page {
    min-height: 100vh;
}

.container {
    max-width: 1260px;
    padding-bottom: 40px;
    margin: 0 auto;
}

.deposit-content {
    background: white;
}

.page-title {
    font-size: 36px;
    font-weight: 700;
    color: #1a1a1a;
    padding: 48px 0;
}

.main-content {
    display: flex;
    gap: 60px;
}

.deposit-form {
    border: 1px solid #eaeaed;
    border-radius: 1rem;
    padding: 24px;
    flex: 2;
}

.form-section {

    margin-bottom: 40px;

    .describe {
        margin-top: 16px;
        display: flex;
        flex-direction: column;
        gap: 16px;

        .describe_label {
            --un-text-opacity: 1;
            color: rgba(142, 142, 146, var(--un-text-opacity));
        }

        .describe_value {
            font-size: 1.125rem;
            line-height: 1.75rem;
        }
    }
}

.step-header {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
}

.step-number {
    width: 30px;
    height: 30px;
    background: #1a1a1a;
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-weight: 600;
    margin-right: 12px;
}

.step-title {
    font-size: 16px;
    font-weight: 600;
    color: #1a1a1a;
}

.currency-selector,
.network-selector {
    position: relative;
}

.selected-network {
    display: flex;
    align-items: center;
    padding: 8px 16px;
    border: 1px solid #e5e5e5;
    border-radius: 99999px;
    cursor: pointer;
    background: white;
    transition: border-color 0.2s;
}

.selected-currency {
    display: flex;
    align-items: center;
    padding: 8px 16px;
    border: 1px solid #e5e5e5;
    border-radius: 99999px;
    background: white;
    transition: border-color 0.2s;
}


.selected-network:hover {
    border-color: #d0f500;
}

.currency-icon {
    width: 24px;
    height: 24px;
    margin-right: 12px;
}

.currency-name {
    flex: 1;
    font-size: 16px;
    font-weight: 500;
}

.network-placeholder {
    flex: 1;
    font-size: 16px;
    color: #999;
}

.dropdown-arrow {
    transition: transform 0.2s;
}

.dropdown-arrow.rotated {
    transform: rotate(180deg);
}

.currency-dropdown,
.network-dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: white;
    border: 1px solid #e5e5e5;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    z-index: 10;
    max-height: 200px;
    overflow-y: auto;
}

.currency-option,
.network-option {
    display: flex;
    align-items: center;
    padding: 12px 16px;
    cursor: pointer;
    transition: background-color 0.2s;
}

.currency-option:hover,
.network-option:hover {
    background-color: #f5f5f5;
}

.network-option {
    justify-content: space-between;
}

.network-fee {
    font-size: 12px;
    color: #666;
}

.address-section {
    padding: 24px;
    background-color: #f8f8f8;
    display: flex;
    gap: 24px;
    align-items: flex-start;
}

.qr-code-container {
    flex-shrink: 0;
}

.qr-code {
    width: 120px;
    height: 120px;
    border: 1px solid #e5e5e5;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.qr-placeholder {
    color: #999;
    text-align: center;
}

.address-info {
    flex: 1;

    .address {
        --un-text-opacity: 1;
        color: rgba(142, 142, 146, var(--un-text-opacity));
    }
}

.address-input {
    background-color: #fff;
    display: flex;
    align-items: center;
    border: 1px solid #e5e5e5;
    border-radius: 15px;
    overflow: hidden;
}

.address-input input {
    flex: 1;
    padding: 8px;
    border: none;
    outline: none;
    font-size: 14px;
}

.copy-btn {
    padding: 8px 12px;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;

    img {
        width: 14px;
        height: 14px;
    }
}


.info-panel {
    flex: 1;
    max-width: 400px;
}

.tips-section {
    border-radius: 16px;
    padding: 16px;
    margin-bottom: 24px;
    border: 1px solid #eaeaed;
}

.tips-title {
    font-size: 16px;
    font-weight: 600;
    color: #1a1a1a;
    margin-bottom: 16px;
}

.tips-list {
    list-style: none;
    padding: 0;
    margin: 0;
}

.tips-list li {
    font-size: 14px;
    color: #666;
    line-height: 1.6;
    margin-bottom: 12px;
    position: relative;
    padding-left: 8px;
}

.tips-list li:before {
    content: '•';
    color: #d0f500;
    position: absolute;
    left: 0;
}

.faq-section {
    background: white;
    border: 1px solid #e5e5e5;
    border-radius: 8px;
    padding: 24px;
}

.faq-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.faq-title {
    font-size: 16px;
    font-weight: 600;
    color: #1a1a1a;
}

.more-link {
    font-size: 14px;
    color: #666;
    text-decoration: none;
}

.more-link:hover {
    color: #d0f500;
}

.faq-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.faq-item {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 14px;
    color: #1a1a1a;
    cursor: pointer;
    transition: color 0.2s;
}

.faq-item:hover {
    color: #d0f500;
}

.faq-icon {
    flex-shrink: 0;
    color: #666;
}

@media (max-width: 768px) {
    .main-content {
        flex-direction: column;
        gap: 40px;
    }

    .address-section {
        flex-direction: column;
        align-items: center;
    }

    .deposit-content {
        padding: 20px;
    }
}

.recharge_box {
    max-width: 1260px;
    margin: 0 auto;
    border: 1px solid #e5e5e5;
    border-radius: 12px;
}
</style>