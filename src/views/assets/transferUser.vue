<template>
    <div class="transfer-container">
        <div class="transfer-header">
            <h2 class="title">转账</h2>
        </div>

        <div class="transfer-form">
            <!-- 对方账号ID -->
            <div class="form-section">
                <div class="section-title">对方账号</div>
                <div class="amount-input-wrapper">
                    <input type="text" class="amount-input" placeholder="请输入对方的账号" v-model="recipientId"
                        @input="validateRecipient">
                </div>
                <div class="error-message" v-if="recipientError">
                    {{ recipientErrorMessage }}
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
                    确认转账
                </button>
            </div>
        </div>

        <div class="transfer-header">
            <h2 class="title">转账记录</h2>
        </div>

        <div>
            <SwapAssets ref="swapAssetsRef" symbol="29" />
        </div>
    </div>
</template>

<script>
import SwapAssets from './components/SwapAssets.vue'
export default {
    name: 'TransferUser',
    components: {
        SwapAssets
    },
    data() {
        return {
            recipientId: '',
            recipientError: false,
            recipientErrorMessage: '',
            transferAmount: '',
            showCurrencyDropdown: false,
            selectedCurrency: 'USDT',
            balance: 0,
            num: 0,
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
            return this.recipientId && this.transferAmount && parseFloat(this.transferAmount) > 0 && parseFloat(this.transferAmount) <= this.balance
        }
    },
    methods: {
        selectCurrency(currency) {
            this.selectedCurrency = currency.symbol
            this.showCurrencyDropdown = false
        },

        validateRecipient() {
            this.recipientError = false;
            this.recipientErrorMessage = '';

            if (!this.recipientId || this.recipientId.trim() === '') {
                this.recipientError = true;
                this.recipientErrorMessage = '请输入对方账号';
                return false;
            }
            return true;
        },

        validateAmount() {
            this.amountError = false;
            this.amountErrorMessage = '';

            if (!this.transferAmount || this.transferAmount === '') {
                this.amountError = true;
                this.amountErrorMessage = '请输入转账数量';
                return false;
            }

            const amount = parseFloat(this.transferAmount);
            if (isNaN(amount) || amount <= 0) {
                this.amountError = true;
                this.amountErrorMessage = '请输入有效的转账数量';
                return false;
            }

            const currentBalance = this.assetsWallet.balance || 0;
            if (amount > currentBalance) {
                this.amountError = true;
                this.amountErrorMessage = '转账数量不能超过可用余额';
                return false;
            }

            return true;
        },

        setMaxAmount() {
            this.transferAmount = this.assetsWallet.balance ? this.MathFloor(this.assetsWallet.balance) : 0
        },

        confirmTransfer() {
            const isRecipientValid = this.validateRecipient();
            const isAmountValid = this.validateAmount();

            if (!isRecipientValid || !isAmountValid) {
                return;
            }
            let params = {
                to: this.recipientId, // 接收人（账号或者UID）
                amount: this.transferAmount
            };

            this.$http
                .post(this.swapHost + "/wallet/transfer", params)
                .then(response => {
                    const resp = response.body
                    if (resp.code == 0) {
                        this.transferAmount = ''
                        this.recipientId = ''
                        if (this.$refs.swapAssetsRef) {
                            this.$refs.swapAssetsRef.getList(0)
                        }
                        this.init()
                        this.$Notice.success({
                            title: '转账成功',
                            desc: '转账成功'
                        });
                    } else {
                        this.$Notice.error({
                            title: '转账失败',
                            desc: resp.message || '转账失败'
                        });
                    }
                });
        },

        MathFloor(num) {
            return Math.floor(num * 1000) / 1000;
        },

        getAssetWallet() {
            //获取资金账户余额作为转账余额
            this.$http
                .post(this.host + "/asset/wallet")
                .then(response => {
                    var resp = response.body;
                    if (resp.data && resp.data.length > 0) {
                        this.assetsWallet = resp.data[0]
                        this.num = this.assetsWallet.balance
                        this.balance = this.num
                    }
                });
        },
        init() {
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
        max-width: 1260px;
        background: #ffffff;
        border-radius: 16px;
        padding: 24px;
        border: 1px solid #f0f0f0;

        .form-section {
            margin-bottom: 24px;

            &:last-child {
                margin-bottom: 0;
            }

            .section-title {
                font-size: 16px;
                font-weight: 500;
                color: #1a1a1a;
                margin-bottom: 16px;
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
                    box-sizing: border-box;

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
