<template>
    <div v-if="visible" class="modal-overlay" @click="closeModal">
        <div class="modal-container" @click.stop>
            <!-- 标题栏 -->
            <div class="modal-header">
                <h3 class="modal-title">{{ isModifyMode ? '修改资金密码' : '设置资金密码' }}</h3>
                <button class="close-btn" @click="closeModal">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M13 1L1 13M1 1L13 13" stroke="#999" stroke-width="2" stroke-linecap="round" />
                    </svg>
                </button>
            </div>

            <!-- 安全提示 -->
            <div class="security-notice">
                <div class="notice-icon">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <circle cx="8" cy="8" r="7" stroke="#ff6b6b" stroke-width="2" />
                        <path d="M8 4v4M8 10h.01" stroke="#ff6b6b" stroke-width="2" stroke-linecap="round" />
                    </svg>
                </div>
                <span>为保证资金安全，资金密码设置后将用于提现及法币交易等操作</span>
            </div>

            <!-- 表单内容 -->
            <div class="modal-body">
                <div v-if="isModifyMode" class="form-group">
                    <label class="form-label">原资金密码</label>
                    <div class="password-input-wrapper">
                        <input :type="showOldPassword ? 'text' : 'password'" v-model="formData.oldPassword"
                            class="form-input" placeholder="请输入原资金密码" :class="{ 'error': errors.oldPassword }"
                            maxlength="20" />
                        <button type="button" class="toggle-password" @click="showOldPassword = !showOldPassword">
                            <img v-if="showOldPassword" src="../../../assets/svg/eye_open.svg" alt="">
                            <img v-else src="../../../assets/svg/eye_closed.svg" alt="">
                        </button>
                    </div>
                    <div v-if="errors.oldPassword" class="error-message">{{ errors.oldPassword }}</div>
                </div>

                <!-- 新资金密码 -->
                <div class="form-group">
                    <label class="form-label">{{ isModifyMode ? '新资金密码' : '资金密码' }}</label>
                    <div class="password-input-wrapper">
                        <input :type="showPassword ? 'text' : 'password'" v-model="formData.password" class="form-input"
                            placeholder="请输入资金密码" :class="{ 'error': errors.password }" maxlength="20" />
                        <button type="button" class="toggle-password" @click="showPassword = !showPassword">
                            <img v-if="showPassword" src="../../../assets/svg/eye_open.svg" alt="">
                            <img v-else src="../../../assets/svg/eye_closed.svg" alt="">
                        </button>
                    </div>
                    <div v-if="errors.password" class="error-message">{{ errors.password }}</div>
                </div>

                <!-- 确认资金密码 -->
                <div class="form-group">
                    <label class="form-label">{{ isModifyMode ? '确认新资金密码' : '确认资金密码' }}</label>
                    <div class="password-input-wrapper">
                        <input :type="showConfirmPassword ? 'text' : 'password'" v-model="formData.confirmPassword"
                            class="form-input" placeholder="请再次输入资金密码" :class="{ 'error': errors.confirmPassword }"
                            @input="validateConfirmPassword" maxlength="20" />
                        <button type="button" class="toggle-password"
                            @click="showConfirmPassword = !showConfirmPassword">
                            <img v-if="showConfirmPassword" src="../../../assets/svg/eye_open.svg" alt="">
                            <img v-else src="../../../assets/svg/eye_closed.svg" alt="">
                        </button>
                    </div>
                    <div v-if="errors.confirmPassword" class="error-message">{{ errors.confirmPassword }}</div>
                </div>
            </div>

            <!-- 按钮区域 -->
            <div class="modal-footer">
                <button class="confirm-btn" @click="handleConfirm">
                    <span v-if="loading" class="loading-spinner"></span>
                    {{ loading ? (isModifyMode ? '修改中...' : '设置中...') : (isModifyMode ? '确认修改' : '确定') }}
                </button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'SetFundPasswordModal',
    props: {
        visible: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            formData: {
                oldPassword: '',
                password: '',
                confirmPassword: ''
            },
            errors: {
                oldPassword: '',
                password: '',
                confirmPassword: ''
            },
            showPassword: false,
            showConfirmPassword: false,
            loading: false,
            settingData: null,
            showOldPassword: false,

        }
    },
    computed: {
        // 表单验证
        isFormValid() {
            const baseValid = this.formData.password &&
                this.formData.confirmPassword &&
                !this.errors.password &&
                !this.errors.confirmPassword;

            // 如果是修改模式，还需要验证原密码
            if (this.isModifyMode) {
                return baseValid && this.formData.oldPassword && !this.errors.oldPassword;
            }

            return baseValid;
        },
        isModifyMode() {
            return this.settingData && this.settingData.fundsVerified == 1;
        },

    },
    methods: {
        // 关闭弹框
        closeModal() {
            this.$emit('close');
            this.resetForm();
        },

        // 重置表单
        resetForm() {
            this.formData = {
                password: '',
                confirmPassword: ''
            };
            this.errors = {
                password: '',
                confirmPassword: ''
            };
            this.showPassword = false;
            this.showConfirmPassword = false;
            this.loading = false;
        },

        // 验证确认密码
        validateConfirmPassword() {
            const confirmPassword = this.formData.confirmPassword;
            if (!confirmPassword) {
                this.errors.confirmPassword = '请确认资金密码';
            } else if (confirmPassword !== this.formData.password) {
                this.errors.confirmPassword = '两次输入的密码不一致';
            } else {
                this.errors.confirmPassword = '';
            }
        },

        async handleConfirm() {
            this.validateConfirmPassword();

            if (!this.isFormValid) {
                return;
            }

            this.loading = true;
            if (this.settingData.fundsVerified == 1) {
                // 修改资金密码
                this.$http
                    .post(this.host + this.api.uc.FundNewPassword, {
                        oldPassword: this.formData.oldPassword,
                        newPassword: this.formData.password
                    }).then(response => {
                        var resp = response.body;
                        this.$Message.success(resp.message);

                    })
            } else {
                // 设置资金密码
                this.$http
                    .post(this.host + this.api.uc.FundPassword, {
                        jyPassword: this.formData.password
                    }).then(response => {
                        var resp = response.body;
                        this.$Message.success(resp.message);

                    })
            }
            this.closeModal();
        }
    },

    watch: {
        visible(newVal) {
            if (!newVal) {
                this.resetForm();
            }
        },
        storeSetting: {
            handler(newVal) {
                if (newVal) {
                    this.settingData = newVal
                }
            },
            immediate: true
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.settingData = this.$store.state.setting
        })
    },
}
</script>

<style scoped>
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

.modal-container {
    background: white;
    border-radius: 8px;
    width: 480px;
    max-width: 90vw;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 24px;
    border-bottom: 1px solid #f0f0f0;
}

.modal-title {
    font-size: 18px;
    font-weight: 600;
    color: #333;
    margin: 0;
}

.close-btn {
    background: none;
    border: none;
    cursor: pointer;
    padding: 4px;
    border-radius: 4px;
    transition: background-color 0.2s;
}

.close-btn:hover {
    background-color: #f5f5f5;
}

.security-notice {
    --un-bg-opacity: 1;
    background-color: rgba(248, 248, 248, var(--un-bg-opacity));
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 20px 24px;
    padding: 12px 16px;
    border-radius: 6px;
    font-size: 14px;
    line-height: 1.5;
}

.notice-icon {
    flex-shrink: 0;
    margin-top: 1px;
}

.modal-body {
    padding: 0 24px 20px;
}

.form-group {
    margin-bottom: 20px;
}

.form-label {
    display: block;
    font-size: 14px;
    font-weight: 500;
    color: #333;
    margin-bottom: 8px;
}

.password-input-wrapper {
    position: relative;
}

.form-input {
    width: 100%;
    padding: 12px 40px 12px 16px;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 14px;
    transition: border-color 0.2s;
    box-sizing: border-box;
}

.form-input:focus {
    outline: none;
    border-color: #007bff;
}

.form-input.error {
    border-color: #dc3545;
}

.toggle-password {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    cursor: pointer;
    padding: 4px;
    border-radius: 4px;
}

.error-message {
    color: #dc3545;
    font-size: 12px;
    margin-top: 4px;
}

.password-strength {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 16px;
    font-size: 12px;
}

.strength-label {
    color: #666;
}

.strength-bars {
    display: flex;
    gap: 4px;
}

.strength-bar {
    width: 20px;
    height: 4px;
    background: #e5e5e5;
    border-radius: 2px;
    transition: background-color 0.2s;
}

.strength-bar.weak {
    background: #ff6b6b;
}

.strength-bar.medium {
    background: #ffa726;
}

.strength-bar.strong {
    background: #4caf50;
}

.strength-text {
    color: #666;
    font-weight: 500;
}

.password-requirements {
    background: #f8f9fa;
    padding: 12px 16px;
    border-radius: 6px;
    margin-bottom: 20px;
}

.requirement-title {
    font-size: 12px;
    color: #666;
    margin-bottom: 8px;
    font-weight: 500;
}

.requirement-list {
    list-style: none;
    padding: 0;
    margin: 0;
    font-size: 12px;
}

.requirement-list li {
    padding: 2px 0;
    color: #999;
    position: relative;
    padding-left: 16px;
}

.requirement-list li:before {
    content: '×';
    position: absolute;
    left: 0;
    color: #dc3545;
    font-weight: bold;
}

.requirement-list li.valid {
    color: #4caf50;
}

.requirement-list li.valid:before {
    content: '✓';
    color: #4caf50;
}

.modal-footer {
    display: flex;
    gap: 12px;
    padding: 20px 24px;
    border-top: 1px solid #f0f0f0;
}

.cancel-btn,
.confirm-btn {
    flex: 1;
    padding: 13px 24px;
    border-radius: 99999px;
    font-size: 14px;
    font-weight: 500;
    line-height: 12px;
    cursor: pointer;
    transition: all 0.2s;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
}

.cancel-btn {
    background: #f5f5f5;
    color: #666;
}

.cancel-btn:hover:not(:disabled) {
    background: #e5e5e5;
}

.confirm-btn {
    background: #000;
    color: white;
}

.confirm-btn:hover {
    --un-border-opacity: 1;
    background-color: rgba(208, 245, 0, var(--un-border-opacity))
}

.confirm-btn:disabled {
    background: #ccc;
    cursor: not-allowed;
}

.loading-spinner {
    width: 14px;
    height: 14px;
    border: 2px solid transparent;
    border-top: 2px solid currentColor;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

@media (max-width: 768px) {
    .modal-container {
        width: 95vw;
        margin: 20px;
    }

    .modal-header,
    .modal-body,
    .modal-footer {
        padding-left: 16px;
        padding-right: 16px;
    }
}
</style>