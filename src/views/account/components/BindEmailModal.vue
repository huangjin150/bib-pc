<template>
    <div v-if="visible" class="modal-overlay" @click="closeModal">
        <div class="modal-container" @click.stop>
            <!-- 标题栏 -->
            <div class="modal-header">
                <h3 class="modal-title">绑定邮箱</h3>
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
                <span>为保证资产安全，修改安全设置后提现及法币交易服务将暂停24小时</span>
            </div>

            <!-- 表单内容 -->
            <div class="modal-body">
                <!-- 邮箱 -->
                <div class="form-group">
                    <label class="form-label">邮箱</label>
                    <input type="email" v-model="formData.email" class="form-input" placeholder="请输入邮箱"
                        :class="{ 'error': errors.email }" @input="validateEmail" />
                    <div v-if="errors.email" class="error-message">{{ errors.email }}</div>
                </div>

                <!-- 登录密码 -->
                <div class="form-group">
                    <label class="form-label">登录密码</label>
                    <div class="input-wrapper">
                        <input :type="showPassword ? 'text' : 'password'" v-model="formData.password" class="form-input"
                            placeholder="请输入登录密码" :class="{ 'error': errors.password }" @input="validatePassword" />
                        <button type="button" class="toggle-password" @click="showPassword = !showPassword">
                            <img v-if="showPassword" src="../../../assets/svg/eye_closed.svg" alt="隐藏密码">
                            <img v-else src="../../../assets/svg/eye_open.svg" alt="显示密码">
                        </button>
                    </div>
                    <div v-if="errors.password" class="error-message">{{ errors.password }}</div>
                </div>

                <!-- 邮箱验证码 -->
                <div class="form-group">
                    <label class="form-label">邮箱验证码</label>
                    <div class="verification-input-wrapper">
                        <input type="text" v-model="formData.emailCode" class="form-input verification-input"
                            placeholder="请输入验证码" :class="{ 'error': errors.emailCode }" @input="validateEmailCode"
                            maxlength="6" />
                        <button class="send-code-btn" @click="sendEmailCode" :disabled="emailCodeCountdown > 0">
                            {{ emailCodeCountdown > 0 ? `${emailCodeCountdown}s后重发` : '立即获取' }}
                        </button>
                    </div>
                    <div v-if="errors.emailCode" class="error-message">{{ errors.emailCode }}</div>
                </div>
            </div>

            <!-- 按钮区域 -->
            <div class="modal-footer">
                <button class="confirm-btn" @click="handleConfirm">
                    <span v-if="loading" class="loading-spinner"></span>
                    {{ loading ? '绑定中...' : '绑定' }}
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import gtInit from "../../../assets/js/gt.js";

export default {
    name: 'BindEmailModal',
    props: {
        visible: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            formData: {
                email: '',
                password: '',
                emailCode: ''
            },
            errors: {
                email: '',
                password: '',
                emailCode: ''
            },
            captchaObj: null,
            VerificationData: {
                geetest_challenge: '',
                geetest_seccode: '',
                geetest_validate: '',
            },
            loading: false,
            showPassword: false,
            emailCodeCountdown: 0,
            emailCodeTimer: null
        }
    },
    computed: {
        canSendEmailCode() {
            return this.formData.email && this.validateEmailFormat(this.formData.email) && !this.errors.email;
        },

        // 表单验证
        isFormValid() {
            return this.formData.email &&
                this.formData.password &&
                this.formData.emailCode &&
                !this.errors.email &&
                !this.errors.password &&
                !this.errors.emailCode;
        }
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
                email: '',
                password: '',
                emailCode: ''
            };
            this.errors = {
                email: '',
                password: '',
                emailCode: ''
            };
            this.loading = false;
            this.showPassword = false;
            this.clearTimers();
        },

        // 清除定时器
        clearTimers() {
            if (this.emailCodeTimer) {
                clearInterval(this.emailCodeTimer);
                this.emailCodeTimer = null;
            }
            this.emailCodeCountdown = 0;
        },

        // 验证邮箱格式
        validateEmailFormat(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        },

        // 验证邮箱
        validateEmail() {
            const email = this.formData.email;

            if (!email) {
                this.errors.email = '请输入邮箱地址';
            } else if (!this.validateEmailFormat(email)) {
                this.errors.email = '请输入正确的邮箱格式';
            } else {
                this.errors.email = '';
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
            if (this.formData.email) {
                this.$http
                    .post(this.host + "/bind/email/code", {
                        email: this.formData.email,
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
                    }).catch(error => {
                        this.$Message.error(resp.message);
                    });

            } else {
                this.$refs.formValidate2.validateField("mail");
            }
        },

        // 验证密码
        validatePassword() {
            const password = this.formData.password;

            if (!password) {
                this.errors.password = '请输入登录密码';
            } else if (password.length < 6) {
                this.errors.password = '密码长度不能少于6位';
            } else if (password.length > 20) {
                this.errors.password = '密码长度不能超过20位';
            } else {
                this.errors.password = '';
            }
        },

        // 验证邮箱验证码
        validateEmailCode() {
            const code = this.formData.emailCode;

            if (!code) {
                this.errors.emailCode = '请输入邮箱验证码';
            } else if (code.length !== 6) {
                this.errors.emailCode = '验证码必须为6位数字';
            } else if (!/^\d{6}$/.test(code)) {
                this.errors.emailCode = '验证码只能包含数字';
            } else {
                this.errors.emailCode = '';
            }
        },

        // 发送邮箱验证码
        async sendEmailCode() {
            if (!this.formData.email) {
                return;
            }
            this.startEmailCodeCountdown();
            this.captchaObj.verify();

        },

        // 开始邮箱验证码倒计时
        startEmailCodeCountdown() {
            this.emailCodeCountdown = 60;
            this.emailCodeTimer = setInterval(() => {
                this.emailCodeCountdown--;
                if (this.emailCodeCountdown <= 0) {
                    clearInterval(this.emailCodeTimer);
                    this.emailCodeTimer = null;
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

        // 确认绑定
        async handleConfirm() {
            this.validateEmail();
            this.validatePassword();
            this.validateEmailCode();
            if (!this.isFormValid) {
                return;
            }
            this.loading = true;
            let param = {};
            param["email"] = this.formData.email;
            param["code"] = this.formData.emailCode;
            param["password"] = this.formData.password;
            this.$http
                .post(this.host + "/approve/bind/email", param)
                .then(response => {
                    var resp = response.body;
                    if (resp.code == 0) {
                        this.$Message.success(this.$t("uc.safe.save_success"));
                        this.getMember();
                        this.closeModal();

                    } else {
                        this.$Message.error(resp.message);
                    }
                });
        }
    },

    watch: {
        visible(newVal) {
            if (!newVal) {
                this.resetForm();
            }
        }
    },
    mounted() {
        this.initGtCaptchas()
    },

    beforeDestroy() {
        this.clearTimers();
    }
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
    z-index: 100;
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
    display: flex;
    align-items: center;
    --un-bg-opacity: 1;
    background-color: rgba(248, 248, 248, var(--un-bg-opacity));
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

.form-input {
    width: 100%;
    padding: 10px 16px;
    border: 1px solid #ddd;
    border-radius: 9999px;
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

.input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
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

.verification-input-wrapper {
    display: flex;
    border-radius: 9999px;
    border: 1px solid #ddd;
    gap: 12px;
}

.verification-input {
    border: none;
    flex: 1;
}

.send-code-btn {
    padding: 12px 16px;
    background: #000;
    color: white;
    border: none;
    border-radius: 99999px;
    font-size: 14px;
    cursor: pointer;
    transition: background-color 0.2s;
    white-space: nowrap;
    min-width: 100px;
}

.send-code-btn:hover:not(:disabled) {
    background: #333;
}

.send-code-btn:disabled {
    background: #ccc;
    cursor: not-allowed;
}

.error-message {
    color: #dc3545;
    font-size: 12px;
    margin-top: 4px;
}

.modal-footer {
    padding: 20px 24px;
    border-top: 1px solid #f0f0f0;
}

.confirm-btn {
    width: 100%;
    padding: 13px 24px;
    background: #000;
    color: white;
    border: none;
    line-height: 12px;
    border-radius: 99999px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
}

.confirm-btn:hover:not(:disabled) {
    background: #333;
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

/* 响应式设计 */
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

    .verification-input-wrapper {
        flex-direction: column;
    }

    .send-code-btn {
        min-width: auto;
    }
}
</style>