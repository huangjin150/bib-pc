<template>
    <div class="withdrawal-container">
        <div class="withdrawal-header">
            <h2 class="title">提现</h2>
        </div>

        <div style="display: flex; gap: 30px;">
            <div class="withdrawal-form">
                <div class="form-section">
                    <div class="section-header">
                        <span class="step-number">1</span>
                        <span class="section-title">选择币种</span>
                    </div>
                    <div class="currency-selector">
                        <div class="selected-currency">
                            <!-- <img src="/images/usdt-icon.png" alt="USDT" class="currency-icon"> -->
                            <span class="currency-name">USDT</span>
                        </div>
                    </div>
                </div>

                <div class="form-section">
                    <div class="section-header">
                        <span class="step-number">2</span>
                        <span class="section-title">提现至</span>
                    </div>
                    <div style="padding-left: 35px;">
                        <div class="withdrawal-type">
                            <div class="type-tab active">
                                <span style="font-size: 12px;">链上地址</span>
                            </div>
                        </div>

                        <div class="warning-notice">
                            <i class="warning-icon"></i>
                            <span>请确保提现平台支持您提现的代币和网络，如果您提现了错误的代币和网络，可能会导致资产丢失</span>
                        </div>

                        <div class="network-section">
                            <div class="flex">
                                <label class="field-label">提现网络</label>

                            </div>
                            <div class="network-selector">
                                <div class="selected-network" @click="showNetworkDropdown = !showNetworkDropdown">
                                    <span class="network-placeholder">{{ selectedNetwork }}</span>
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
                                <div v-if="networkError" class="error-message">{{ networkErrorMessage }}</div>
                            </div>
                        </div>
                        <div class="address-section">
                            <div class="flex" style="margin-bottom: 8px;">
                                <label class="field-label">提现地址</label>
                                <span @click="addressJumpto" style="cursor: pointer;">添加地址</span>
                            </div>
                            <div class="address-selector">
                                <div class="selected-address" @click="showAddressDropdown = !showAddressDropdown">
                                    <span class="address-placeholder">{{ withdrawalAddress || '选择已保存的地址' }}</span>
                                    <svg class="dropdown-arrow" :class="{ 'rotated': showAddressDropdown }" width="12"
                                        height="12" viewBox="0 0 12 12">
                                        <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" stroke-width="1.5"
                                            fill="none" />
                                    </svg>
                                </div>
                                <div v-if="showAddressDropdown" class="address-dropdown">
                                    <div v-for="addr in address" :key="addr.id" class="address-option"
                                        @click="selectAddress(addr)">
                                        <div class="address-info">
                                            <span class="address-name">{{ addr.name || addr.address }}</span>
                                            <span class="address-value">({{ addr.address }})</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div v-if="addressError" class="error-message">{{ addressErrorMessage }}</div>
                        </div>
                    </div>
                </div>
                <div class="nextstep-box" v-if="!addresStatus">
                    <div @click="nextstepClick" class="nextstep">下一步</div>
                </div>
                <div v-if="addresStatus" class="form-section">
                    <div class="section-header">
                        <span class="step-number">3</span>
                        <span class="section-title">提现金额</span>
                    </div>

                    <div class="amount-section">
                        <div class="amount-input-wrapper">
                            <div class="flex">
                                <label class="field-label">提现金额</label>
                            </div>

                            <div class="amount-input-container">
                                <input type="text" @blur="withdrawalAmountChange" class="amount-input"
                                    placeholder="单笔可提: 10~1,000,000,000" v-model="withdrawalAmount">
                                <div class="currency-suffix">
                                    <span class="available">可用<span style="color: #000;"> {{ coinList.balance }}
                                            USDT</span></span>
                                    <div class="flex_alicenter" style="margin-left: 6px;">
                                        <div class="i-tabler"></div>
                                        <span @click="transferClick" class="max-btn">划转</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="fee-info">
                            <div class="fee-row">
                                <span class="fee-label">手续费</span>
                                <span class="fee-value">{{ withdrawFee }} USDT</span>
                            </div>
                            <div class="fee-row">
                                <span class="fee-label">到账数量</span>
                                <span class="fee-value">{{ withdrawalAmount - withdrawFee }} USDT</span>
                            </div>
                        </div>
                    </div>
                    <div class="submit-section">
                        <button @click="withdrawalSubmit" class="submit-btn">提现</button>
                    </div>
                </div>
            </div>

            <div class="withdrawal-tips">
                <div class="border">
                    <div class="tips-header">
                        <h3>温馨提示</h3>
                    </div>
                    <div class="tips-content">
                        <ul class="tips-list">
                            <li>最小提币额为10</li>
                            <li>请核实并输入正确的网络信息，任何错误可能导致资产丢失</li>
                            <li>为保障资金安全，当您账户安全策略变更、密码修改、使用新地址提币，我们会对提币进行人工审核，请耐心等待工作人员电话或邮件联系</li>
                            <li>请务必确认电脑及浏览器安全，防止信息被篡改或泄露。</li>
                        </ul>
                    </div>
                </div>

                <div class="common-questions">
                    <h2>常见问题</h2>
                    <div class="question-list">
                        <div class="question-item">
                            <span>如何完成提现操作？</span>
                            <i class="arrow-right"></i>
                        </div>
                        <div class="question-item">
                            <span>提现到错误地址怎么办？</span>
                            <i class="arrow-right"></i>
                        </div>
                        <div class="question-item">
                            <span>提币不成功的原因</span>
                            <i class="arrow-right"></i>
                        </div>
                        <div class="question-item">
                            <span>关于BIBCEX提币费用说明</span>
                            <i class="arrow-right"></i>
                        </div>
                        <div class="question-item">
                            <span>提币时显示的常见报错及含义</span>
                            <i class="arrow-right"></i>
                        </div>
                    </div>
                    <div class="more-questions">
                        <span>更多 ></span>
                    </div>
                </div>
            </div>
        </div>
        <div>
            <withdraw />
        </div>
        <Modal v-model="modal" width="450">
            <p slot="header">
                提示
            </p>
            <Form class="withdraw-form-inline" ref="formInline" :model="formInline.inline">
                <FormItem>
                    <Input style="width: 100%;" type="password" v-model="formInline.fundpwd"
                        :placeholder="$t('otc.chat.msg7')"></Input>
                </FormItem>
            </Form>
            <div slot="footer">
                <span style="margin-right:50px" @click="cancel">取消</span>
                <span
                    style="cursor: pointer; background:#000;color:#fff;width:80px;border-radius:30px;display:inline-block;text-align:center;height:30px;line-height: 30px;"
                    @click="ok">确定</span>
            </div>
        </Modal>
    </div>
</template>

<script>
import Withdraw from './components/Withdraw.vue';
export default {
    name: 'Withdrawal',
    components: {
        Withdraw
    },
    data() {
        return {
            withdrawalAddress: '',
            withdrawalAddressData: '',
            withdrawalAmount: '',
            addresStatus: false,
            selectedCurrency: 'USDT',
            showNetworkDropdown: false,
            selectedNetwork: '选择网络',
            selectedNetworkData: {},
            coinList: {},
            netwokers: [],
            withdrawFee: 0,
            addressError: false,
            addressErrorMessage: '',
            networkError: false,
            networkErrorMessage: '',
            showAddressDropdown: false,
            address: [],
            formInline: {
                code: "",
                fundpwd: ""
            },
            modal: false
        }
    },
    computed: {
    },
    watch: {
        coinList: function () {
            console.log('this.coinList11111', this.coinList)
            this.withdrawFee =
                this.coinList.minTxFee +
                (this.coinList.maxTxFee - this.coinList.minTxFee) / 2;
        }
    },
    methods: {
        validateAddress() {
            if (!this.withdrawalAddress || this.withdrawalAddress.trim() === '') {
                this.addressError = true;
                this.addressErrorMessage = '请输入提现地址';
                return false;
            }

            this.addressError = false;
            this.addressErrorMessage = '';
            return true;
        },
        validateNetwork() {
            if (!this.selectedNetwork || this.selectedNetwork === '选择网络') {
                this.networkError = true;
                this.networkErrorMessage = '请选择提现网络';
                return false;
            }

            this.networkError = false;
            this.networkErrorMessage = '';
            return true;
        },
        getAddrList() {
            //获取地址
            this.$http
                .post(this.host + "/withdraw/support/coin/info")
                .then(response => {
                    var resp = response.body;
                    if (resp.code == 0 && resp.data.length > 0) {
                        this.coinList = resp.data[0];
                        console.log('this.coinList', this.coinList)
                    } else {
                        this.$Message.error(resp.message);
                    }
                    if (resp.data[0].addresses.length > 0) {
                        this.address = resp.data[0].addresses
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
        selectNetwork(network) {
            this.selectedNetwork = network.name;
            this.selectedNetworkData = network
            console.log('this.selectedNetworkData', this.selectedNetworkData)
            this.showNetworkDropdown = false;
            this.withdrawalAddress = '';
            this.networkError = false;
            this.networkErrorMessage = '';
        },
        selectManualInput() {
            this.withdrawalAddress = '';
            this.showAddressDropdown = false;
        },
        nextstepClick() {
            if (!this.validateAddress()) {
                return
            }
            if (!this.validateNetwork()) {
                return
            }
            console.log('addressErrorMessage', this.withdrawalAddress)
            if (this.withdrawalAddress.toString().length != 42 || !this.withdrawalAddress.toString().startsWith('0x')) {
                this.$Message.error('提现地址有误');
                return
            }
            this.addresStatus = !this.addresStatus
        },
        withdrawalAmountChange() {
            console.log(this.withdrawalAmount)
        },

        selectAddress(addr) {
            this.withdrawalAddress = addr.address;
            this.withdrawalAddressData = addr
            console.log('this.withdrawalAddressData', this.withdrawalAddressData)
            this.showAddressDropdown = false;
            this.addressError = false;
            this.addressErrorMessage = '';
        },

        getList(pageNo, pageSize, type) {
            //获取地址
            let params = {};
            params["pageNo"] = pageNo;
            params["pageSize"] = pageSize;
            params["unit"] = type;
            this.$http
                .post(this.host + "/withdraw/address/page", params)
                .then(response => {
                    var resp = response.body;
                    if (resp.code == 0 && resp.data.records) {
                        this.dataRecharge = resp.data.records;
                        this.dataCount = resp.data.total;
                    } else {
                        this.$Message.error(resp.message);
                    }
                    this.loading = false;
                });
        },
        withdrawalSubmit() {
            this.modal = true
        },
        addressJumpto() {
            this.$router.push('/account/withdrawAddress')

        },

        ok() {
            let params = {};
            params["unit"] = 'USDT';
            params["address"] = this.withdrawalAddressData.id;
            params["amount"] = this.withdrawalAmount;
            params["fee"] = this.withdrawFee;
            params["jyPassword"] = this.formInline.fundpwd;
            params["chainId"] = this.selectedNetworkData.id;
            this.$http
                .post(this.host + "/withdraw/apply/code", params)
                .then(response => {
                    this.formInline.fundpwd = "";
                    var resp = response.body;
                    if (resp.code == 0) {
                        this.modal = false;
                        this.formInline.code = "";
                        this.formInline.fundpwd = "";
                        this.$Message.success('提币成功');
                    } else {
                        this.$Message.error(resp.message);
                    }
                });
        },
        cancel() {
            this.modal = false;
            this.formInline.code = "";
            this.formInline.fundpwd = "";
        },
        transferClick() {
            this.$router.push('/assets/transfer')
        }
    },
    mounted() {
        this.getAddrList()
        this.newwokerlistGet()
    }
}
</script>

<style lang="scss" scoped>
.withdrawal-container {
    max-width: 1260px;
    margin: 0 auto;
    gap: 40px;
    min-height: 100vh;

    .withdrawal-header {
        padding: 48px 0;

        .title {
            font-size: 36px;
            font-weight: 600;
            color: #1a1a1a;
            margin: 0;
        }
    }

    .withdrawal-form {
        flex: 2 2 0%;
        background: #ffffff;
        border-radius: 20px;
        padding: 20px;
        border: 1px solid #eaeaed;

        .form-section {
            margin-bottom: 2ch;

            .section-header {
                display: flex;
                align-items: center;
                margin-bottom: 10px;

                .step-number {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    width: 21px;
                    height: 21px;
                    background: #1a1a1a;
                    color: #ffffff;
                    border-radius: 50%;
                    font-size: 14px;
                    font-weight: 600;
                    margin-right: 12px;
                }

                .section-title {
                    font-size: 14px;
                    color: #1a1a1a;
                }
            }

            .currency-selector {
                padding-left: 35px;

                .selected-currency {
                    display: flex;
                    align-items: center;
                    padding: 7px 16px;
                    border: 1px solid #e1e5e9;
                    border-radius: 99999px;
                    background: #ffffff;
                    transition: all 0.2s ease;

                    &:hover {
                        border-color: #00d4aa;
                    }

                    .currency-icon {
                        width: 24px;
                        height: 24px;
                        margin-right: 8px;
                        border-radius: 50%;
                    }

                    .currency-name {
                        font-size: 16px;
                        font-weight: 500;
                        color: #1a1a1a;
                        margin-right: auto;
                    }

                    .arrow-down {
                        width: 0;
                        height: 0;
                        border-left: 4px solid transparent;
                        border-right: 4px solid transparent;
                        border-top: 4px solid #666;
                    }
                }
            }

            .withdrawal-type {
                margin-bottom: 15px;

                .type-tab {
                    padding: 5px 12px 4px 12px;
                    display: inline-block;
                    font-size: 12px;
                    cursor: pointer;

                    &.active {
                        border-bottom: 4px solid rgba(208, 245, 0, 1);
                    }
                }
            }

            .warning-notice {
                display: flex;
                align-items: flex-start;
                padding: 16px;
                background-color: #f8f8f8;
                border-radius: 8px;
                margin-bottom: 20px;

                .warning-icon {
                    margin-right: 2px;
                    width: 20px;
                    height: 20px;
                    color: rgba(220, 38, 38, 1);
                    background-image: url('../../assets/svg/warn.svg');
                }

                span {
                    font-size: 14px;
                    line-height: 1.4;
                }
            }

            .network-section {
                margin-bottom: 16px;

                .field-label {
                    display: block;
                    font-size: 14px;
                    font-weight: 500;
                    color: #1a1a1a;
                    margin-bottom: 8px;
                }

                .network-info {
                    position: relative;
                    display: flex;
                    flex-direction: column;
                    padding: 7px 16px;
                    border: 1px solid #e1e5e9;
                    border-radius: 99999px;

                    .network-name {
                        cursor: pointer;
                        font-size: 16px;
                        font-weight: 500;
                        color: #1a1a1a;
                    }

                    .contract-address {
                        font-size: 12px;
                        color: #666;
                    }

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
                    }
                }
            }

            .address-section {
                .address-selector {
                    position: relative;

                    .selected-address {
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        height: 40px;
                        padding: 7px 16px;
                        border: 1px solid #e1e5e9;
                        border-radius: 99999px;
                        cursor: pointer;
                        background: #ffffff;
                        transition: border-color 0.2s ease;

                        &:hover {
                            border-color: #00d4aa;
                        }

                        .address-placeholder {
                            font-size: 14px;
                            color: #999999;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                        }

                        .dropdown-arrow {
                            transition: transform 0.2s ease;

                            &.rotated {
                                transform: rotate(180deg);
                            }
                        }
                    }

                    .address-dropdown {
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
                        margin-top: 4px;

                        .address-option {
                            padding: 12px 16px;
                            cursor: pointer;
                            transition: background-color 0.2s;
                            border-bottom: 1px solid #f5f5f5;

                            &:hover {
                                background-color: #f5f5f5;
                            }

                            &:last-child {
                                border-bottom: none;
                            }

                            &.manual-input {
                                color: #00d4aa;
                                font-weight: 500;
                            }

                            .address-info {
                                display: flex;
                                align-items: center;

                                .address-name {
                                    font-size: 14px;
                                    font-weight: 500;
                                    color: #1a1a1a;
                                    margin-bottom: 2px;
                                }

                                .address-value {
                                    font-size: 12px;
                                    color: #666;
                                    overflow: hidden;
                                    text-overflow: ellipsis;
                                    white-space: nowrap;
                                }
                            }
                        }
                    }
                }

                .error-message {
                    color: #dc2626;
                    font-size: 12px;
                    margin-top: 4px;
                }
            }

            .amount-section {
                padding-left: 35px;

                .amount-input-wrapper {
                    .field-label {
                        display: block;
                        font-size: 14px;
                        font-weight: 500;
                        color: #1a1a1a;
                        margin-bottom: 8px;
                    }

                    .amount-limits {
                        display: flex;
                        align-items: center;
                        margin-bottom: 4px;

                        .limit-text {
                            font-size: 12px;
                            color: #666;
                            margin-right: 4px;
                        }

                        .info-icon {
                            width: 12px;
                            height: 12px;
                            background: #ccc;
                            border-radius: 50%;
                            cursor: pointer;
                        }
                    }

                    .amount-range {
                        margin-bottom: 12px;

                        .range-text {
                            font-size: 12px;
                            color: #999;
                        }
                    }

                    .amount-input-container {
                        position: relative;
                        margin-bottom: 20px;

                        .amount-input {
                            height: 40px;
                            width: 100%;
                            padding: 7px 16px;
                            border: 1px solid #e1e5e9;
                            border-radius: 99999px;
                            font-size: 14px;
                            color: #1a1a1a;
                            background: #ffffff;
                            transition: border-color 0.2s ease;

                            &:focus {
                                outline: none;
                                border-color: #00d4aa;
                            }

                        }

                        .currency-suffix {
                            display: flex;
                            align-items: center;
                            justify-content: flex-end;
                            margin-top: 8px;

                            .available {
                                font-size: 14px;
                                color: #666;
                            }

                            .max-btn {
                                margin-left: 4px;
                                font-size: 14px;
                                color: #84cc16;
                                cursor: pointer;

                                &:hover {
                                    color: #84cc16;
                                }
                            }
                        }
                    }
                }

                .fee-info {
                    border-radius: 8px;
                    padding: 16px;
                    margin-bottom: 12px;

                    .fee-row {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        margin-bottom: 8px;

                        &:last-child {
                            margin-bottom: 0;
                        }

                        .fee-label {
                            font-size: 14px;
                        }

                        .fee-value {
                            font-size: 14px;
                            font-weight: 500;
                            color: #1a1a1a;
                        }
                    }
                }

                .fee-note {
                    font-size: 12px;
                    color: #666;
                    text-align: center;
                }
            }
        }

        .submit-section {
            padding-left: 35px;

            .submit-btn {
                width: 100%;
                padding: 10px 12px;
                background: #1a1a1a;
                color: #ffffff;
                border: none;
                border-radius: 99999px;
                font-size: 12px;
                cursor: pointer;
                transition: all 0.2s ease;

                &:hover:not(:disabled) {
                    background: #333;
                }

                &:disabled {
                    background: #ccc;
                    cursor: not-allowed;
                }
            }
        }
    }

    .withdrawal-tips {
        flex: 1;
        background: #ffffff;
        height: fit-content;

        .tips-header {
            margin-bottom: 20px;

            h3 {
                font-size: 16px;
                font-weight: 600;
                color: #1a1a1a;
                margin: 0;
            }
        }

        .border {
            border-radius: 12px;
            padding: 24px;
            border: 1px solid #eaeaed;

        }

        .tips-content {
            margin-bottom: 24px;

            .tips-list {
                list-style: none;
                padding: 0;
                margin: 0;

                li {
                    position: relative;
                    padding-left: 16px;
                    margin-bottom: 12px;
                    font-size: 14px;
                    color: #666;
                    line-height: 1.4;

                    &::before {
                        content: '•';
                        position: absolute;
                        left: 0;
                        color: #00d4aa;
                        font-weight: bold;
                    }

                    &:last-child {
                        margin-bottom: 0;
                    }
                }
            }
        }

        .common-questions {
            margin-top: 20px;
            border-radius: 12px;
            padding: 24px;
            border: 1px solid #eaeaed;

            h2 {
                font-weight: 600;
                color: #1a1a1a;
                margin: 0 0 16px 0;
            }

            .question-list {
                .question-item {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 12px 0;
                    border-bottom: 1px solid #f0f0f0;
                    cursor: pointer;
                    transition: color 0.2s ease;

                    &:hover {
                        color: #00d4aa;
                    }

                    &:last-child {
                        border-bottom: none;
                    }

                    span {
                        font-size: 14px;
                        color: inherit;
                    }

                    .arrow-right {
                        width: 0;
                        height: 0;
                        border-top: 4px solid transparent;
                        border-bottom: 4px solid transparent;
                        border-left: 4px solid #ccc;
                    }
                }
            }

            .more-questions {
                text-align: right;
                margin-top: 16px;

                span {
                    font-size: 14px;
                    color: #00d4aa;
                    cursor: pointer;

                    &:hover {
                        color: #00b894;
                    }
                }
            }
        }
    }
}

// 响应式设计
@media (max-width: 768px) {
    .withdrawal-container {
        flex-direction: column;
        padding: 16px;
        gap: 20px;

        .withdrawal-tips {
            width: 100%;
        }
    }
}

.i-tabler {
    background-image: url('../../assets/svg/transfer1.svg');
    width: 16px;
    height: 16px;
    line-height: 21px;
    margin-bottom: 3px;
}

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

.nextstep-box {
    padding-left: 35px;


    .nextstep {
        cursor: pointer;
        background-color: #000;
        padding: 10px 12px;
        font-size: 12px;
        border-radius: 9999px;
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
    }
}

.error-message {
    margin: 10px;
    color: red;
}

::v-deep(.ivu-form-item) {
    width: 100% !important;
}
</style>