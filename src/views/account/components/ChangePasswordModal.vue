<template>
    <div class="modal-overlay" v-if="visible" @click="handleOverlayClick">
        <div class="modal-container" @click.stop>
            <!-- 弹窗头部 -->
            <div class="modal-header">
                <h2 class="modal-title">修改登录密码</h2>
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
                    <!-- 旧登录密码 -->
                    <div class="form-group">
                        <label class="form-label">旧登录密码</label>
                        <div class="input-wrapper">
                            <input :type="showOldPassword ? 'text' : 'password'" v-model="formData.oldPassword"
                                class="form-input" placeholder="请输入密码" :class="{ 'error': errors.oldPassword }" />
                            <button type="button" class="toggle-password" @click="showOldPassword = !showOldPassword">
                                <img v-if="showOldPassword" src="../../../assets/svg/eye_closed.svg" alt="隐藏密码">
                                <img v-else src="../../../assets/svg/eye_open.svg" alt="显示密码">
                            </button>
                        </div>
                        <div v-if="errors.oldPassword" class="error-message">
                            {{ errors.oldPassword }}
                        </div>
                    </div>

                    <!-- 新登录密码 -->
                    <div class="form-group">
                        <label class="form-label">新登录密码</label>
                        <div class="input-wrapper">
                            <input :type="showNewPassword ? 'text' : 'password'" v-model="formData.newPassword"
                                class="form-input" placeholder="请输入密码" :class="{ 'error': errors.newPassword }" />
                            <button type="button" class="toggle-password" @click="showNewPassword = !showNewPassword">
                                <img v-if="showNewPassword" src="../../../assets/svg/eye_closed.svg" alt="隐藏密码">
                                <img v-else src="../../../assets/svg/eye_open.svg" alt="显示密码">
                            </button>
                        </div>
                        <div v-if="errors.newPassword" class="error-message">
                            {{ errors.newPassword }}
                        </div>
                    </div>

                    <!-- 确认新密码 -->
                    <div class="form-group">
                        <label class="form-label">确认新密码</label>
                        <div class="input-wrapper">
                            <input :type="showConfirmPassword ? 'text' : 'password'" v-model="formData.confirmPassword"
                                class="form-input" placeholder="请输入密码"
                                :class="{ 'error': errors.confirmPassword || passwordMismatch }" />
                            <button type="button" class="toggle-password"
                                @click="showConfirmPassword = !showConfirmPassword">
                                <img v-if="showConfirmPassword" src="../../../assets/svg/eye_closed.svg" alt="隐藏密码">
                                <img v-else src="../../../assets/svg/eye_open.svg" alt="显示密码"></button>
                        </div>
                        <div v-if="errors.confirmPassword" class="error-message">
                            {{ errors.confirmPassword }}
                        </div>
                        <div v-if="passwordMismatch" class="error-message">
                            请输入
                        </div>
                    </div>

                    <!-- 邮箱验证码 -->
                    <div class="form-group">
                        <label class="form-label">{{ settingData.phoneVerified == 1 ? '手机验证码' : '邮箱验证码' }} ({{
                            maskedEmail
                            }})</label>
                        <div class="verification-wrapper">
                            <input type="text" v-model="formData.emailCode" style="border: none;"
                                class="form-input verification-input" placeholder="请输入验证码"
                                :class="{ 'error': errors.emailCode }" maxlength="6" />
                            <button type="button" class="send-code-btn" @click="sendEmailCode"
                                :disabled="codeSending || countdown > 0">
                                {{ getCodeButtonText }}
                            </button>
                        </div>
                        <div v-if="errors.emailCode" class="error-message">
                            {{ errors.emailCode }}
                        </div>
                    </div>

                    <!-- 提交按钮 -->
                    <div class="form-actions">
                        <button type="submit" class="submit-btn">
                            {{ submitting ? '修改中...' : '修改' }}
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
    name: 'ChangePasswordModal',
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
                newPassword: '',
                confirmPassword: '',
                emailCode: ''
            },
            VerificationData: {
                geetest_challenge: '',
                geetest_seccode: '',
                geetest_validate: '',
            },
            settingData: null,
            captchaObj: null,
            errors: {},
            showOldPassword: false,
            showNewPassword: false,
            showConfirmPassword: false,
            codeSending: false,
            countdown: 0,
            submitting: false,
            countdownTimer: null
        };
    },
    computed: {
        maskedEmail() {
            const email = this.$store.getters.member?.username;
            return this.maskEmail(email);
        },

        passwordMismatch() {
            return this.formData.newPassword &&
                this.formData.confirmPassword &&
                this.formData.newPassword !== this.formData.confirmPassword;
        },

        isFormValid() {
            return this.formData.oldPassword &&
                this.formData.newPassword &&
                this.formData.confirmPassword &&
                this.formData.emailCode &&
                !this.passwordMismatch &&
                Object.keys(this.errors).length === 0;
        },

        getCodeButtonText() {
            if (this.codeSending) return '发送中...';
            if (this.countdown > 0) return `${this.countdown}s`;
            return '立即获取';
        }
    },
    methods: {
        maskEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return email;
            }
            const [username, domain] = email.split('@');

            if (username.length <= 3) {
                return username.charAt(0) + '**@' + domain;
            }

            const maskedUsername = username.substring(0, 2) + '**' + username.substring(username.length - 1);
            return maskedUsername + '@' + domain || '';
        },

        validateForm() {
            this.errors = {};

            if (!this.formData.oldPassword) {
                this.errors.oldPassword = '请输入旧密码';
            }

            if (!this.formData.newPassword) {
                this.errors.newPassword = '请输入新密码';
            }

            if (!this.formData.confirmPassword) {
                this.errors.confirmPassword = '请确认新密码';
            }

            if (!this.formData.emailCode) {
                this.errors.emailCode = '请输入邮箱验证码';
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
                console.log(result)
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
            console.log(this.$store.state.setting.phoneVerified)
            if (this.$store.state.setting.phoneVerified == 1) {
                this.$http
                    .post(this.host + "/mobile/update/password/code", {
                        geetest_challenge: this.VerificationData.geetest_challenge,
                        geetest_validate: this.VerificationData.geetest_validate,
                        geetest_seccode: this.VerificationData.geetest_seccode
                    })
                    .then(response => {
                        var resp = response.body;
                        if (resp.code == 0) {
                            this.$Message.success(resp.message);
                        } else {
                            this.$Message.error(resp.message);
                        }
                    });
            } else {
                this.$http
                    .post(this.host + "/approve/update/password/email", {
                        geetest_challenge: this.VerificationData.geetest_challenge,
                        geetest_validate: this.VerificationData.geetest_validate,
                        geetest_seccode: this.VerificationData.geetest_seccode
                    })
                    .then(response => {
                        var resp = response.body;
                        if (resp.code == 0) {
                            this.$Message.success(resp.message);
                        } else {
                            this.$Message.error(resp.message);
                        }
                    });
            }
        },

        async sendEmailCode() {
            this.codeSending = true;
            this.captchaObj.verify();
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
        getMember() {
            var self = this;
            this.$http
                .post(this.host + "/approve/security/setting")
                .then(response => {
                });
        },

        async handleSubmit() {
            console.log('this.$store.state.setting', this.$store.state.setting)
            this.validateForm();
            if (!this.isFormValid) {
                return;
            }
            let param = {};
            param["oldPassword"] = this.formData.oldPassword;
            param["newPassword"] = this.formData.newPassword;
            param["code"] = this.formData.emailCode;
            param["verify"] = this.$store.state.setting.phoneVerified !== 0 ? '0' : '1'
            this.submitting = true;
            try {
                this.$http
                    .post(this.host + "/approve/update/password", param)
                    .then(response => {
                        var resp = response.body;
                        if (resp.code == 0) {
                            let self = this;
                            this.$Message.success(resp.message);
                            this.getMember();
                            self.$store.commit('setMember', null);
                            this.closeModal();
                            this.resetForm();
                            this.clearLocalData()
                            setTimeout(() => {
                                self.$router.push("/login");
                            }, 100);
                        } else {
                            this.$Message.error(resp.message);
                        }
                    });
            } catch (error) {
                this.$Message.error(error.message);
            } finally {
                this.submitting = false;
            }
        },

        closeModal() {
            this.$emit('close');
        },

        clearLocalData() {
            localStorage.removeItem('token');
            localStorage.removeItem('MEMBER');
        },

        handleOverlayClick() {
            this.closeModal();
        },

        showOtherMethods() {
            console.log('显示其他验证方式');
        },

        resetForm() {
            this.formData = {
                oldPassword: '',
                newPassword: '',
                confirmPassword: '',
                emailCode: ''
            };
            this.errors = {};
            this.showOldPassword = false;
            this.showNewPassword = false;
            this.showConfirmPassword = false;
        }
    },
    created() {
        this.settingData = this.$store.state.setting
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
    align-items: center;
    gap: 8px;
    padding: 12px;
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

.input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
}

.form-input {
    border: 1px solid #d9d9d9;
    border-radius: 9999px;
    width: 100%;
    padding: 12px 16px;
    font-size: 14px;
    transition: border-color 0.3s ease;
    background: white;
}

.form-input:focus {
    outline: none;
    border-color: rgba(208, 245, 0);
    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.1);
}

.form-input.error {
    border-color: #ff4d4f;
}

.form-input::placeholder {
    color: #bfbfbf;
}

.toggle-password {
    position: absolute;
    right: 12px;
    background: none;
    border: none;
    cursor: pointer;
    padding: 4px;
    color: #999;
    font-size: 16px;
}

.toggle-password:hover {
    color: #666;
}

.verification-wrapper {
    border: 1px solid #d9d9d9;
    border-radius: 9999px;
    display: flex;
    gap: 12px;
    align-items: center;
}

.verification-input {
    flex: 1;
}

.send-code-btn {
    background: #000;
    color: white;
    border: none;
    padding: 12px 20px;
    border-radius: 99999px;
    font-size: 14px;
    cursor: pointer;
    white-space: nowrap;
    transition: background 0.3s ease;
    min-width: 80px;
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
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-top: 32px;
}

.submit-btn {
    background: #000;
    color: white;
    border: none;
    line-height: 12px;
    padding: 13px 16px;
    border-radius: 99999px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.3s ease;
}

.submit-btn:hover:not(:disabled) {
    background: #333;
}

.submit-btn:disabled {
    background: #d9d9d9;
    cursor: not-allowed;
}

.other-method-btn {
    background: transparent;
    color: #52c41a;
    border: none;
    padding: 12px 24px;
    border-radius: 6px;
    font-size: 14px;
    cursor: pointer;
    transition: background 0.3s ease;
}

.other-method-btn:hover {
    background: #f6ffed;
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
}
</style>