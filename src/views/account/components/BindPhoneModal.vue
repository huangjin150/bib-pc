<template>
    <div class="modal-overlay" v-if="visible" @click="handleOverlayClick">
        <div class="modal-container" @click.stop>
            <!-- 弹窗头部 -->
            <div class="modal-header">
                <h2 class="modal-title">绑定手机号</h2>
                <button class="close-btn" @click="closeModal">
                    <i class="close-icon">✕</i>
                </button>
            </div>

            <!-- 安全提示 -->
            <div class="security-notice">
                <div class="notice-icon">
                    <img src="../../../assets/svg/errorIcon.svg" alt="">
                </div>
                <div class="notice-text">
                    为保证资产安全，修改安全设置后将限制及法币交易服务24小时
                </div>
            </div>

            <!-- 表单内容 -->
            <div class="modal-body">
                <form @submit.prevent="handleSubmit">
                    <!-- 手机号 -->
                    <div class="form-group">
                        <label class="form-label">手机号</label>
                        <div class="phone-input-wrapper">
                            <input type="tel" v-model="formData.phoneNumber" class="phone-input" placeholder="请输入手机号"
                                :class="{ 'error': errors.phoneNumber }" />
                        </div>
                        <div v-if="errors.phoneNumber" class="error-message">
                            {{ errors.phoneNumber }}
                        </div>
                    </div>

                    <!-- 登录密码 -->
                    <div class="form-group">
                        <label class="form-label">登录密码</label>
                        <div class="password-input-wrapper">
                            <input :type="showPassword ? 'text' : 'password'" v-model="formData.loginPassword"
                                class="form-input" placeholder="请输入登录密码" :class="{ 'error': errors.loginPassword }" />
                        </div>
                        <div v-if="errors.loginPassword" class="error-message">
                            {{ errors.loginPassword }}
                        </div>
                    </div>

                    <!-- 短信验证码 -->
                    <div class="form-group">
                        <label class="form-label">短信验证码</label>
                        <div class="verification-wrapper">
                            <input type="text" v-model="formData.smsCode" class="form-input verification-input"
                                placeholder="请输入验证码" :class="{ 'error': errors.smsCode }" maxlength="6" />
                            <button type="button" class="send-code-btn" @click="sendSmsCode"
                                :disabled="codeSending || countdown > 0 || !isPhoneValid">
                                {{ getSmsCodeButtonText }}
                            </button>
                        </div>
                        <div v-if="errors.smsCode" class="error-message">
                            {{ errors.smsCode }}
                        </div>
                    </div>

                    <!-- 提交按钮 -->
                    <div class="form-actions">
                        <button type="submit" class="submit-btn">
                            {{ submitting ? '绑定中...' : '绑定' }}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import gtInit from "../../../assets/js/gt.js";

export default {
    name: 'BindPhoneModal',
    props: {
        visible: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            formData: {
                phoneNumber: '',
                loginPassword: '',
                smsCode: '',
            },
            VerificationData: {
                geetest_challenge: '',
                geetest_seccode: '',
                geetest_validate: '',
            },
            captchaObj: null,
            errors: {},
            codeSending: false,
            countdown: 0,
            submitting: false,
            countdownTimer: null,
            showPassword: false
        };
    },
    computed: {
        isPhoneValid() {
            return this.formData.phoneNumber && this.formData.phoneNumber.length >= 11;
        },

        isFormValid() {
            return this.formData.phoneNumber &&
                this.formData.loginPassword &&
                this.formData.smsCode &&
                Object.keys(this.errors).length === 0;
        },

        getSmsCodeButtonText() {
            if (this.codeSending) return '发送中...';
            if (this.countdown > 0) return `${this.countdown}s`;
            return '立即获取';
        }
    },
    methods: {
        validateForm() {
            this.errors = {};

            if (!this.formData.phoneNumber) {
                this.errors.phoneNumber = '请输入手机号';
            } else if (!/^\d{11,15}$/.test(this.formData.phoneNumber)) {
                this.errors.phoneNumber = '请输入有效的手机号';
            }

            if (!this.formData.loginPassword) {
                this.errors.loginPassword = '请输入登录密码';
            }

            if (!this.formData.smsCode) {
                this.errors.smsCode = '请输入短信验证码';
            }
        },

        async sendSmsCode() {
            if (!this.isPhoneValid) {
                this.$Message.error('请先输入有效的手机号');
                return;
            }
            this.captchaObj.verify();
            this.codeSending = true;

            try {
                this.startCountdown();
            } catch (error) {
                this.$Message.error('发送失败，请重试');
            } finally {
                this.codeSending = false;
            }
        },
        initGtCaptchas() {
            var that = this;
            this.$http.get(this.host + this.api.uc.captcha).then(function (res) {
                window.initGeetest(
                    {
                        // 以下配置参数来自服务端 SDK
                        gt: res.body.gt,
                        challenge: res.body.challenge,
                        offline: !res.body.success, //表示用户后台检测极验服务器是否宕机
                        new_captcha: res.body.new_captcha, //用于宕机时表示是新验证码的宕机
                        product: "bind",
                        width: "100%"
                    },
                    this.handler
                );
            });
        },
        handler(captchaObj) {
            captchaObj.onReady(() => {
                $("#wait").hide();
            }).onSuccess(() => {
                let result = captchaObj.getValidate();
                if (!result) {
                    this.$Message.error("请完成验证");
                } else {
                    this.VerificationData = result;
                    this.sendCodeAfterCaptcha();
                }
            });
            this.captchaObj = captchaObj;
        },

        sendCodeAfterCaptcha() {
            this.$http
                .post(this.host + "/mobile/bind/code", {
                    country: '中国',
                    geetest_challenge: this.VerificationData.geetest_challenge,
                    geetest_validate: this.VerificationData.geetest_validate,
                    geetest_seccode: this.VerificationData.geetest_seccode,
                    phone: this.formData.phoneNumber,
                })
                .then(response => {
                    var resp = response.body;
                    if (resp.code == 0) {
                        this.$Message.success(resp.message);
                    } else {
                        this.$Message.error(resp.message);
                    }
                });
        },

        startCountdown() {
            this.countdown = 60;
            this.countdownTimer = setInterval(() => {
                this.countdown--;
                if (this.countdown <= 0) {
                    clearInterval(this.countdownTimer);
                    this.countdownTimer = null;
                }
            }, 1000);
        },

        async handleSubmit() {
            this.validateForm();

            if (!this.isFormValid) {
                return;
            }

            this.submitting = true;

            try {
                this.$http
                    .post(this.host + "/approve/bind/phone", {
                        country: '中国',
                        phone: this.formData.phoneNumber,
                        code: this.formData.smsCode,
                        password: this.formData.loginPassword
                    })
                    .then(response => {
                        var resp = response.body;
                        if (resp.code == 0) {
                            this.$Message.success(resp.message);
                        } else {
                            this.$Message.error(resp.message);
                        }
                    });
                this.$Message.success('手机号绑定成功');
                this.closeModal();
                this.resetForm();
                this.$emit('success');
            } catch (error) {
                this.$Message.error(error.message || '绑定失败，请重试');
            } finally {
                this.submitting = false;
            }
        },

        closeModal() {
            this.$emit('close');
        },

        handleOverlayClick() {
            this.closeModal();
        },

        resetForm() {
            this.formData = {
                phoneNumber: '',
                loginPassword: '',
                smsCode: '',
            };
            this.errors = {};
            this.showPassword = false;
        }
    },
    created() {
        this.initGtCaptchas()
    },

    beforeDestroy() {
        if (this.countdownTimer) {
            clearInterval(this.countdownTimer);
        }
    }
};
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
    border-radius: 12px;
    width: 90%;
    max-width: 480px;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 24px 24px 0 24px;
    margin-bottom: 20px;
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
    font-size: 18px;
    color: #999;
    cursor: pointer;
    padding: 4px;
    border-radius: 4px;
    transition: background 0.2s ease;
}

.close-btn:hover {
    background: #f5f5f5;
}

.close-icon {
    display: block;
    line-height: 1;
}

.security-notice {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    padding: 12px 24px;
    --un-bg-opacity: 1;
    background-color: rgba(248, 248, 248, var(--un-bg-opacity));
    border-radius: 6px;
    margin: 0 24px 24px 24px;
}

.notice-icon {
    font-size: 16px;
    flex-shrink: 0;
    margin-top: 2px;
}

.notice-text {
    font-size: 14px;
    line-height: 1.4;
}

.modal-body {
    padding: 0 24px 24px 24px;
}

.form-group {
    margin-bottom: 20px;
}

.form-label {
    display: block;
    font-size: 14px;
    color: #333;
    margin-bottom: 8px;
    font-weight: 500;
}

.phone-input-wrapper {
    display: flex;
    gap: 0;
    border: 1px solid #d9d9d9;
    border-radius: 9999px;
    overflow: hidden;
}

.phone-input-wrapper:focus-within {
    border-color: none;
}

.phone-input-wrapper.error {
    border-color: #ff4d4f;
}

.country-code-selector {
    background: #f8f9fa;
    border-right: 1px solid #e9ecef;
}

.country-select {
    background: transparent;
    border: none;
    padding: 12px 8px 12px 12px;
    font-size: 14px;
    color: #333;
    cursor: pointer;
    outline: none;
    min-width: 60px;
}

.phone-input {
    flex: 1;
    border: none;
    padding: 10px 16px;
    border-radius: 9999px;
    font-size: 14px;
    outline: none;
    background: white;
}

.phone-input::placeholder {
    color: #bfbfbf;
}

.form-input {
    width: 100%;
    padding: 10px 16px;
    border: 1px solid #d9d9d9;
    border-radius: 9999px;
    font-size: 14px;
    transition: border-color 0.3s ease;
    background: white;
}

.form-input:focus {
    outline: none;
    border-color: none;
}

.form-input.error {
    border-color: #ff4d4f;
}

.form-input::placeholder {
    color: #bfbfbf;
}

.verification-wrapper {
    border: 1px solid #d9d9d9;
    border-radius: 99999px;
    display: flex;
    gap: 12px;
    align-items: center;
}

.verification-input {
    border: none !important;
}

.send-code-btn {
    background: #000;
    color: white;
    border: none;
    padding: 10px 20px;
    text-align: center;
    border-radius: 99999px;
    font-size: 14px;
    cursor: pointer;
    white-space: nowrap;
    transition: background 0.3s ease;
}

.send-code-btn:hover:not(:disabled) {
    background: #333;
}

.send-code-btn:disabled {
    background: #d9d9d9;
    cursor: not-allowed;
}

.error-message {
    color: #ff4d4f;
    font-size: 12px;
    margin-top: 4px;
    line-height: 1.4;
}

.form-actions {
    margin-top: 32px;
}

.submit-btn {
    background: #000;
    color: white;
    border: none;
    padding: 10px 24px;
    line-height: 1.2;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 600;
    border-radius: 9999px;
    cursor: pointer;
    transition: background 0.3s ease;
    width: 100%;
}

.submit-btn:hover:not(:disabled) {
    background: #333;
}

.submit-btn:disabled {
    background: #d9d9d9;
    cursor: not-allowed;
}

.password-input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
    border: 1px solid #d9d9d9;
    border-radius: 9999px;
    overflow: hidden;
}

.password-input-wrapper:focus-within {
    border-color: none;
}

.password-input-wrapper.error {
    border-color: #ff4d4f;
}

.password-input-wrapper .form-input {
    border: none !important;
    padding-right: 45px;
}

.password-toggle-btn {
    position: absolute;
    right: 12px;
    background: none;
    border: none;
    cursor: pointer;
    padding: 4px;
    color: #999;
    font-size: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.password-toggle-btn:hover {
    color: #666;
}


/* 响应式设计 */
@media (max-width: 480px) {
    .modal-container {
        width: 95%;
        margin: 20px;
    }

    .modal-header,
    .modal-body {
        padding-left: 20px;
        padding-right: 20px;
    }

    .security-notice {
        margin-left: 20px;
        margin-right: 20px;
    }

    .verification-wrapper {
        flex-direction: column;
        align-items: stretch;
    }

    .send-code-btn {
        min-width: auto;
    }

    .phone-input-wrapper {
        flex-direction: column;
    }

    .country-code-selector {
        border-right: none;
        border-bottom: 1px solid #e9ecef;
    }
}
</style>