<template>
    <div class="transfer-container">
        <div class="transfer-header">
            <h2 class="title">划转</h2>
        </div>

        <div class="transfer-form">
            <!-- 选择账户 -->
            <div class="form-section">
                <div class="section-title">选择账户</div>

                <div class="account-transfer">
                    <div class="account-item">
                        <div class="account-icon">
                            <img v-if="mode == 1" src="../../assets/svg/instock.svg" alt="">
                            <img v-else src="../../assets/svg/contract.svg" alt="">

                        </div>
                        <div>
                            <span class="account-type">从</span>
                        </div>
                        <div class="account-info">
                            <span v-if="mode == 1" class="account-name">{{ fundAccount }}</span>
                            <span v-else class="account-name">{{ contractAccount }}</span>

                        </div>
                    </div>

                    <div class="flex">
                        <span class="account-icon" style="margin-right: 0px;">
                            <img src="../../assets/svg/arrow.9eafc86c.svg" alt="">
                        </span>
                        <span class="horizontal">
                        </span>
                        <span @click="transferClick" class="transfer2btn">
                            <img src="../../assets/svg/transfer2.svg" alt="">
                        </span>
                    </div>



                    <div class="account-item">
                        <div class="account-icon">
                            <img v-if="mode == 1" src="../../assets/svg/contract.svg" alt="">

                            <img v-else src="../../assets/svg/instock.svg" alt="">
                        </div>
                        <div>
                            <span class="account-type">到</span>
                        </div>
                        <div class="account-info">
                            <span v-if="mode == 1" class="account-name">{{ contractAccount }}</span>
                            <span v-else class="account-name">{{ fundAccount }}</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 选择币种 -->
            <div class="form-section">
                <div class="section-title">选择币种</div>

                <div class="currency-selector">
                    <div class="selected-currency" @click="showCurrencyDropdown = !showCurrencyDropdown">
                        <div class="currency-info">
                            <div class="currency-icon">
                            </div>
                            <span class="currency-name">USDT</span>
                        </div>
                        <svg class="dropdown-arrow" :class="{ 'rotated': showCurrencyDropdown }" width="12" height="12"
                            viewBox="0 0 12 12">
                            <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" stroke-width="1.5" fill="none" />
                        </svg>
                    </div>

                    <div v-if="showCurrencyDropdown" class="currency-dropdown">
                        <div v-for="currency in currencies" :key="currency.symbol" class="currency-option"
                            @click="selectCurrency(currency)">
                            <div class="currency-info">
                                <!-- <img :src="currency.icon" :alt="currency.symbol" class="coin-icon"> -->
                                <span class="currency-name">{{ currency.symbol }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 数量 -->
            <div class="form-section">
                <div class="section-title">数量</div>

                <div class="amount-input-wrapper">
                    <input type="text" class="amount-input" placeholder="输入数量" v-model="transferAmount"
                        @input="validateAmount">
                    <div class="amount-suffix">
                        <span class="currency-label">USDT</span>
                        <div class="max-btn" @click="setMaxAmount">最大</div>
                    </div>
                </div>
                <div class="error-message" v-if="amountError">
                    {{ amountErrorMessage }}
                </div>
                <div class="balance-info">
                    <span class="balance-text">余额：<span class="balance-amount">{{ num }}</span>USDT</span>
                </div>
            </div>

            <div class="submit-section">
                <button class="transfer-btn" @click="confirmTransfer">
                    确认划转
                </button>
            </div>
        </div>

        <div class="transfer-header">
            <h2 class="title">划转记录</h2>
        </div>

        <div>
            <SwapAssets ref="swapAssetsRef" symbol="29" />
        </div>
    </div>
</template>

<script>
import SwapAssets from './components/SwapAssets.vue'
export default {
    name: 'Transfer',
    components: {
        SwapAssets
    },
    data() {
        return {
            transferAmount: '',
            showCurrencyDropdown: false,
            selectedCurrency: 'USDT',
            fromAccount: 'spot',
            toAccount: 'contract',
            balance: 0,
            mode: '1',
            swapAssetsRef: null,
            num: 0,
            fundAccount: '资金账户',
            contractAccount: '合约账户',
            contractWallet: {},
            assetsWallet: {},
            currencies: [
                { symbol: 'USDT', icon: '/images/usdt-icon.png' },
            ],
            amountError: false,
            amountErrorMessage: ''
        }
    },
    computed: {
        canTransfer() {
            return this.transferAmount && parseFloat(this.transferAmount) > 0 && parseFloat(this.transferAmount) <= this.balance
        }
    },
    methods: {
        selectCurrency(currency) {
            this.selectedCurrency = currency.symbol
            this.showCurrencyDropdown = false
        },

        validateAmount() {
            this.amountError = false;
            this.amountErrorMessage = '';

            if (!this.transferAmount || this.transferAmount === '') {
                this.amountError = true;
                this.amountErrorMessage = '请输入划转数量';
                return false;
            }

            const amount = parseFloat(this.transferAmount);
            if (isNaN(amount) || amount <= 0) {
                this.amountError = true;
                this.amountErrorMessage = '请输入有效的划转数量';
                return false;
            }

            const currentBalance = this.mode == 1 ? this.assetsWallet.balance : this.contractWallet.canUse;
            if (amount > currentBalance) {
                this.amountError = true;
                this.amountErrorMessage = '划转数量不能超过可用余额';
                return false;
            }

            return true;
        },

        setMaxAmount() {
            if (this.mode == 2) {
                this.transferAmount = this.contractWallet.canUse < 0 ? 0 : this.MathFloor(this.contractWallet.canUse)
            } else {
                this.transferAmount = this.MathFloor(this.assetsWallet.balance)

            }
        },

        confirmTransfer() {
            if (!this.validateAmount()) {
                return;
            }
            let params = {
                unit: "USDT",
                from: this.mode == 1 ? 0 : 1,
                to: this.mode == 1 ? 1 : 0,
                amount: this.transferAmount
            };

            this.$http
                .post(this.swapHost + "/wallet/trans", params)
                .then(response => {
                    const resp = response.body
                    if (resp.code == 0) {
                        this.transferAmount = ''
                        this.$refs.swapAssetsRef.getList(0)
                        this.init()
                        this.$Notice.success({
                            title: '划转成功',
                            desc: this.$t("swap.success")
                        });
                    }
                });
        },

        MathFloor(num) {
            return Math.floor(num * 1000) / 1000;
        },

        transferClick() {
            if (this.mode == 1) {
                this.mode = 2
                this.num = this.contractWallet.canUse < 0 ? 0 : this.MathFloor(this.contractWallet.canUse)

            } else {
                this.mode = 1
                this.num = this.MathFloor(this.assetsWallet.balance)

            }
            this.transferAmount = ''
        },

        getContractWallet() {
            this.$http
                .post(this.swapHost + "/wallet/list")
                .then(response => {
                    var resp = response.body;
                    this.contractWallet = resp.data
                    if (this.mode == 2) {
                        this.num = this.contractWallet.canUse < 0 ? 0 : this.contractWallet.canUse
                    }
                });
        },

        getAssetWallet() {
            //获取资金账户
            this.$http
                .post(this.host + "/asset/wallet")
                .then(response => {
                    var resp = response.body;
                    this.assetsWallet = resp.data[0]
                    if (this.mode == 1) {
                        this.num = this.assetsWallet.balance
                    }
                });
        },
        init() {
            this.getContractWallet()
            this.getAssetWallet()
        }
    },
    mounted() {
        this.init()
    }
}
</script>

<style lang="scss" scoped>
.transfer-container {
    max-width: 1260px;
    margin: 0 auto;
    min-height: 100vh;

    .transfer-header {
        padding: 24px 0 32px 0;

        .title {
            font-size: 36px;
            font-weight: 600;
            color: #1a1a1a;
            margin: 0;
        }
    }

    .transfer-form {
        max-width: 800px;
        background: #ffffff;
        border-radius: 16px;
        padding: 24px;
        border: 1px solid #f0f0f0;

        .form-section {
            margin-bottom: 12px;

            &:last-child {
                margin-bottom: 0;
            }

            .section-title {
                font-size: 16px;
                font-weight: 500;
                color: #1a1a1a;
                margin-bottom: 16px;
            }

            .account-transfer {
                padding: 16px;
                border-radius: 12px;
                border: 1px solid #e9ecef;

                .account-item {
                    display: flex;
                    align-items: center;
                    flex: 1;

                    .account-icon {
                        width: 40px;
                        height: 40px;
                        background: #ffffff;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }

                    .account-info {
                        display: flex;
                        flex-direction: column;
                        padding-left: 40px;

                        .account-type {
                            font-size: 12px;
                            color: #666666;
                            margin-bottom: 2px;
                        }

                        .account-name {
                            font-size: 14px;
                            font-weight: 500;
                            color: #1a1a1a;
                        }
                    }
                }

                .transfer-arrow {
                    margin: 0 16px;

                    .arrow-icon {
                        color: #666666;
                    }
                }
            }

            .currency-selector {
                position: relative;

                .selected-currency {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 7px 16px;
                    border: 1px solid #e1e5e9;
                    border-radius: 99999px;
                    cursor: pointer;
                    background: #ffffff;
                    transition: all 0.2s ease;

                    &:hover {
                        border-color: #00d4aa;
                    }

                    .currency-info {
                        display: flex;
                        align-items: center;

                        .currency-icon {
                            margin-right: 8px;

                            .coin-icon {
                                width: 24px;
                                height: 24px;
                                border-radius: 50%;
                            }
                        }

                        .currency-name {
                            font-size: 16px;
                            font-weight: 500;
                            color: #1a1a1a;
                        }
                    }

                    .dropdown-arrow {
                        transition: transform 0.2s ease;
                        color: #666666;

                        &.rotated {
                            transform: rotate(180deg);
                        }
                    }
                }

                .currency-dropdown {
                    position: absolute;
                    top: 100%;
                    left: 0;
                    right: 0;
                    background: white;
                    border: 1px solid #e5e5e5;
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                    z-index: 10;
                    margin-top: 4px;
                    max-height: 200px;
                    overflow-y: auto;

                    .currency-option {
                        display: flex;
                        align-items: center;
                        padding: 12px 16px;
                        cursor: pointer;
                        transition: background-color 0.2s;

                        &:hover {
                            background-color: #f5f5f5;
                        }

                        .currency-info {
                            display: flex;
                            align-items: center;

                            .coin-icon {
                                width: 20px;
                                height: 20px;
                                border-radius: 50%;
                                margin-right: 8px;
                            }

                            .currency-name {
                                font-size: 14px;
                                color: #1a1a1a;
                            }
                        }
                    }
                }
            }

            .amount-input-wrapper {
                position: relative;
                margin-bottom: 8px;

                .amount-input {
                    width: 100%;
                    height: 40px;
                    padding: 7px 120px 7px 16px;
                    border: 1px solid #e1e5e9;
                    border-radius: 99999px;
                    font-size: 16px;
                    color: #1a1a1a;
                    background: #ffffff;
                    transition: border-color 0.2s ease;

                    &:focus {
                        outline: none;
                        border-color: #00d4aa;
                    }

                    &::placeholder {
                        color: #999999;
                    }
                }

                .amount-suffix {
                    position: absolute;
                    right: 12px;
                    top: 50%;
                    transform: translateY(-50%);
                    display: flex;
                    align-items: center;
                    gap: 8px;

                    .currency-label {
                        font-size: 14px;
                        color: #666666;
                    }

                    .max-btn {
                        padding: 4px 8px;
                        color: #84cc16;
                        border: none;
                        border-radius: 4px;
                        font-size: 12px;
                        font-weight: 500;
                        cursor: pointer;
                        transition: all 0.2s ease;
                    }
                }
            }

            .balance-info {
                text-align: end;

                .balance-text {
                    font-size: 14px;
                    color: #666666;

                    .balance-amount {
                        color: #1a1a1a;
                        font-weight: 500;
                    }
                }
            }
        }

        .submit-section {
            .transfer-btn {
                width: 100%;
                height: 40px;
                background: #1a1a1a;
                color: #ffffff;
                border: none;
                border-radius: 99999px;
                font-size: 16px;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.2s ease;

                &:hover:not(:disabled) {
                    background: #333333;
                }

                &:disabled {
                    background: #cccccc;
                    cursor: not-allowed;
                }
            }
        }
    }
}

.horizontal {
    padding: 0 0 0 60px;
    display: block;
    height: 1px;
    background-color: #eaeaed;
    width: 75%;
}

.account-icon {
    width: 40px;
    height: 40px;
    background: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
}

.transfer2btn {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    cursor: pointer;
    justify-content: center;
    border-radius: 32px;
    border: 1px solid #eaeaed;

    &:hover {
        background-color: #84cc16;
    }
}

.error-message {
    color: #ff4d4f;
    font-size: 12px;
    margin-bottom: 8px;
    padding-left: 16px;
}

::v-deep(.ivu-table-wrapper) {
    border: none;
}
</style>