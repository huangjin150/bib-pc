<template>
    <div class="container flex_between" style="padding: 70px 0;">
        <div class="flex_between" style="gap: 48px; margin: 0 auto;">
            <div class="left-section">
                <div class="animation-area">
                    <div class="welcome-text">
                        <p>找回您的账户密码</p>
                        <p>安全验证，快速重置</p>
                        <div style="font-size: 16px; color:rgba(142, 142, 146);margin-bottom: 25px;">安全、流畅、简单！</div>
                    </div>
                    <div class="animation-graphic">
                        <img src="../../assets/svg/login_logo.svg" alt="">
                    </div>
                </div>
            </div>

            <div class="right-section">
                <div class="login-form-container">
                    <h1 style="text-align: start; font-size: 32px; font-weight: 700;">重置密码</h1>

                    <!-- 统一重置表单 -->
                    <div class="register-form">
                        <div class="register-input-group">
                            <label class="register-label">手机号/邮箱</label>
                            <input type="text" v-model="resetForm.account" placeholder="请输入手机号或邮箱" class="form-input"
                                :class="{ 'error': accountError }" />
                            <div v-if="accountError" class="error-message">{{ accountError }}</div>
                        </div>

                        <div class="register-input-group">
                            <label class="register-label">验证码</label>
                            <div class="verification-wrapper">
                                <input type="text" v-model="resetForm.verificationCode" placeholder="请输入验证码"
                                    class="form-input" :class="{ 'error': verificationCodeError }" />
                                <button class="verification-btn" @click="sendVerificationCode"
                                    :disabled="countdown > 0">
                                    {{ countdown > 0 ? `${countdown}s` : '获取验证码' }}
                                </button>
                            </div>
                            <div v-if="verificationCodeError" class="error-message">{{ verificationCodeError }}</div>
                        </div>

                        <div class="register-input-group">
                            <label class="register-label">新密码</label>
                            <div class="register-password-wrapper">
                                <input :type="showNewPassword ? 'text' : 'password'" v-model="resetForm.newPassword"
                                    placeholder="请输入新密码" class="form-input" :class="{ 'error': newPasswordError }" />
                                <button type="button" class="register-password-toggle"
                                    @click="showNewPassword = !showNewPassword">
                                    <img v-if="showNewPassword" src="../../assets/svg/eye_closed.svg" alt="">
                                    <img v-else src="../../assets/svg/eye_open.svg" alt="">
                                </button>
                            </div>
                            <div v-if="newPasswordError" class="error-message">{{ newPasswordError }}</div>
                        </div>

                        <div class="register-input-group">
                            <label class="register-label">确认密码</label>
                            <div class="register-password-wrapper">
                                <input :type="showConfirmPassword ? 'text' : 'password'"
                                    v-model="resetForm.confirmPassword" placeholder="请再次输入新密码" class="form-input"
                                    :class="{ 'error': confirmPasswordError }" />
                                <button type="button" class="register-password-toggle"
                                    @click="showConfirmPassword = !showConfirmPassword">
                                    <img v-if="showConfirmPassword" src="../../assets/svg/eye_closed.svg" alt="">
                                    <img v-else src="../../assets/svg/eye_open.svg" alt="">
                                </button>
                            </div>
                            <div v-if="confirmPasswordError" class="error-message">{{ confirmPasswordError }}</div>
                        </div>

                        <button class="register-submit-btn" @click="handleReset">
                            重置密码
                        </button>

                        <div class="login-redirect">
                            <span class="login-text">想起密码了？</span>
                            <a href="#" class="login-link" @click="$router.push('/login')">返回登录</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import gtInit from "../../assets/js/gt.js";
const mobilereg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/,
    emailReg = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
export default {
    name: 'ForgotPassword',
    data() {
        return {
            showNewPassword: false,
            showConfirmPassword: false,
            countdown: 0,
            captchaObj: null,
            accountType: '', // 'email' 或 'phone'

            // 错误信息
            accountError: '',
            verificationCodeError: '',
            newPasswordError: '',
            confirmPasswordError: '',

            _captchaResult: {
                geetest_challenge: '',
                geetest_seccode: '',
                geetest_validate: '',
            },

            resetForm: {
                account: '',
                verificationCode: '',
                newPassword: '',
                confirmPassword: ''
            }
        }
    },

    watch: {
        // 监听输入，清除错误信息
        'resetForm.account'() {
            if (this.accountError) this.accountError = ''
        },
        'resetForm.verificationCode'() {
            if (this.verificationCodeError) this.verificationCodeError = ''
        },
        'resetForm.newPassword'() {
            if (this.newPasswordError) this.newPasswordError = ''
        },
        'resetForm.confirmPassword'() {
            if (this.confirmPasswordError) this.confirmPasswordError = ''
        }
    },

    created() {
        this.initGtCaptchas()
    },

    methods: {
        // 邮箱验证
        isValidEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            return emailRegex.test(email)
        },

        // 手机号验证
        isValidPhone(phone) {
            const phoneRegex = /^1[3-9]\d{9}$/
            return phoneRegex.test(phone)
        },

        // 判断账号类型
        getAccountType(account) {
            if (this.isValidEmail(account)) {
                return 'email'
            } else if (this.isValidPhone(account)) {
                return 'phone'
            }
            return ''
        },

        // 密码强度验证
        validatePasswordStrength(password) {
            if (password.length < 6) {
                return '密码长度至少6位'
            }
            if (password.length > 20) {
                return '密码长度不能超过20位'
            }
            return ''
        },

        // 清除所有错误
        clearErrors() {
            this.accountError = ''
            this.verificationCodeError = ''
            this.newPasswordError = ''
            this.confirmPasswordError = ''
        },

        // 验证重置表单
        validateResetForm() {
            this.clearErrors()
            let isValid = true

            // 账号校验
            if (!this.resetForm.account) {
                this.accountError = '请输入手机号或邮箱'
                isValid = false
            } else {
                this.accountType = this.getAccountType(this.resetForm.account)
                if (!this.accountType) {
                    this.accountError = '请输入正确的手机号或邮箱格式'
                    isValid = false
                }
            }

            // 验证码校验
            if (!this.resetForm.verificationCode) {
                this.verificationCodeError = '请输入验证码'
                isValid = false
            } else if (this.resetForm.verificationCode.length !== 6) {
                this.verificationCodeError = '验证码应为6位数字'
                isValid = false
            }

            // 新密码校验
            if (!this.resetForm.newPassword) {
                this.newPasswordError = '请输入新密码'
                isValid = false
            } else {
                const passwordError = this.validatePasswordStrength(this.resetForm.newPassword)
                if (passwordError) {
                    this.newPasswordError = passwordError
                    isValid = false
                }
            }

            // 确认密码校验
            if (!this.resetForm.confirmPassword) {
                this.confirmPasswordError = '请确认新密码'
                isValid = false
            } else if (this.resetForm.newPassword !== this.resetForm.confirmPassword) {
                this.confirmPasswordError = '两次输入的密码不一致'
                isValid = false
            }

            return isValid
        },


        // 发送验证码
        sendVerificationCode() {
            if (!this.resetForm.account) {
                this.accountError = '请先输入手机号或邮箱'
                return
            }
            this.captchaObj.verify();
        },
        emailReset() {
            var params = {};
            params["account"] = this.resetForm.account;
            params["geetest_challenge"] = this._captchaResult.geetest_challenge; //极验验证二次验证表单数据 chllenge
            params["geetest_validate"] = this._captchaResult.geetest_validate; //极验验证二次验证表单数据 validate
            params["geetest_seccode"] = this._captchaResult.geetest_seccode; //极验验证二次验证表单数据 seccode

            this.$http.post(this.host + "/reset/email/code", params).then(response => {
                var resp = response.body;
                if (resp.code == 0) {
                    this.$Message.success(resp.message)
                    this.startCountdown()
                } else {
                    this.$Message.error(resp.message)

                }
            });
        },

        afterValidate() {
            if (emailReg.test(this.resetForm.account)) {
                //发送邮件
                var params = {};
                params["account"] = this.resetForm.account;
                params["geetest_challenge"] = this._captchaResult.geetest_challenge; //极验验证二次验证表单数据 chllenge
                params["geetest_validate"] = this._captchaResult.geetest_validate; //极验验证二次验证表单数据 validate
                params["geetest_seccode"] = this._captchaResult.geetest_seccode; //极验验证二次验证表单数据 seccode

                this.$http.post(this.host + "/reset/email/code", params).then(response => {
                    var resp = response.body;
                    if (resp.code == 0) {
                        this.$Message.success(resp.message)
                        this.startCountdown()

                    } else {
                        this.$Message.success(resp.message)
                    }
                });
            } else {
                var params = {};
                var that = this
                params["account"] = this.resetForm.account;
                params["geetest_challenge"] = this._captchaResult.geetest_challenge; //极验验证二次验证表单数据 chllenge
                params["geetest_validate"] = this._captchaResult.geetest_validate; //极验验证二次验证表单数据 validate
                params["geetest_seccode"] = this._captchaResult.geetest_seccode; //极验验证二次验证表单数据 seccode
                this.$http.post(this.host + "/mobile/reset/code", params).then(response => {
                    var resp = response.body;
                    if (resp.code == 0) {
                        this.$Message.success(resp.message)
                        this.startCountdown()

                    } else {
                        this.$Message.success(resp.message)

                    }
                });
            }
        },

        // 验证码倒计时
        startCountdown() {
            this.countdown = 60
            const timer = setInterval(() => {
                this.countdown--
                if (this.countdown <= 0) {
                    clearInterval(timer)
                }
            }, 1000)
        },

        handleReset() {
            if (!this.validateResetForm()) {
                return
            }
            console.log(this.resetForm)
            if (emailReg.test(this.resetForm.account)) {
                let params = {};
                params["account"] = this.resetForm.account;
                params["code"] = this.resetForm.verificationCode;
                params["mode"] = 1;
                params["password"] = this.resetForm.newPassword;
                this.$http
                    .post(this.host + "/reset/login/password", params)
                    .then(response => {
                        let resp = response.body;
                        if (resp.code == 0) {
                            this.$Message.success(resp.message)
                            this.$router.push("/login");
                        } else {
                            this.$Message.error(resp.message)

                        }
                    });
            } else {
                let params = {};
                params["account"] = this.formInline.account;
                params["code"] = this.formInline.verificationCode;
                params["mode"] = 0;
                params["password"] = this.formInline.newPassword;
                this.$http
                    .post(this.host + "/reset/login/password", params)
                    .then(response => {
                        var resp = response.body;
                        if (resp.code == 0) {
                            this.$Message.success(resp.message)
                            this.$router.push("/login");
                        } else {
                            this.$Message.error(resp.message)

                        }
                    });
            }
        },

        // 初始化极验验证码
        initGtCaptchas() {
            var that = this;
            this.$http.get(this.host + this.api.uc.captcha).then(function (res) {
                window.initGeetest(
                    {
                        gt: res.body.gt,
                        challenge: res.body.challenge,
                        offline: !res.body.success,
                        new_captcha: res.body.new_captcha,
                        product: "bind",
                        width: "100%"
                    },
                    that.handler
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
                    this._captchaResult = result;
                    mobilereg.test(this.resetForm.account) && this.afterValidate();
                    emailReg.test(this.resetForm.account) && this.emailReset();
                }
            });
            this.captchaObj = captchaObj;
        }
    }
}
</script>

<style scoped>
.login-container {
    display: flex;
    min-height: 100vh;
}

.left-section {
    border-radius: 20px;
    background-image: url('../../assets/svg/bg_line.svg');
    background-position: center bottom;
    background-repeat: no-repeat;
    background-size: 100%;
    opacity: 1;
    border: 1px solid #eaeaed;
}

.animation-area {
    width: 436px;
    height: 548px;
    padding: 32px;
    padding-top: 58px;
    text-align: center;
}

.welcome-text h1 {
    font-size: 2.5rem;
    font-weight: bold;
    margin-bottom: 20px;
    background: linear-gradient(45deg, #fff, #f0f8ff);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

.welcome-text p {
    margin: 8px 0;
    opacity: 0.9;
    color: #000;
    font-size: 24px;
    font-weight: 700;
}

.right-section {
    width: 450px;
    background: white;
    display: flex;
}

.login-form-container {
    width: 100%;
}

.register-tabs {
    margin-top: 20px;
    display: flex;
    margin-bottom: 30px;
    gap: 10px;
}

.register-tab-btn {
    flex: 1;
    border: none;
    padding: 12px 20px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    background-color: #f5f5f5;
    color: #666;
    transition: all 0.3s ease;
}

.register-tab-btn.active {
    background-color: #D0f500;
    color: #000;
}

.register-form {
    margin-top: 20px;
}

.register-input-group {
    margin-bottom: 20px;
}

.register-label {
    display: block;
    margin-bottom: 8px;
    font-weight: 500;
    color: #333;
}

.form-input {
    width: 100%;
    padding: 12px 16px;
    border: 1px solid #ddd;
    border-radius: 99999px;
    font-size: 14px;
    transition: border-color 0.3s ease;
    box-sizing: border-box;
}

.form-input:focus {
    outline: none;
    border-color: #D0f500;
}

.form-input.error {
    border-color: #ff4757;
}

.verification-wrapper {
    display: flex;
    gap: 10px;
}

.verification-wrapper .form-input {
    flex: 1;
}

.verification-btn {
    padding: 12px 16px;
    background-color: #f5f5f5;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    white-space: nowrap;
    transition: background-color 0.3s ease;
}

.verification-btn:hover {
    background-color: #b8dd00;
}

.verification-btn:disabled {
    background-color: #ccc;
    cursor: not-allowed;
}

.register-password-wrapper {
    position: relative;
}

.register-password-toggle {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    cursor: pointer;
    padding: 4px;
}

.register-password-toggle img {
    width: 20px;
    height: 20px;
}

.error-message {
    color: #ff4757;
    font-size: 12px;
    margin-top: 5px;
}

.register-submit-btn {
    width: 100%;
    padding: 7px;
    background-color: #000;
    border: none;
    border-radius: 99999px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    color: #fff;
    margin-top: 20px;
    transition: background-color 0.3s ease;
}

.login-redirect {
    text-align: center;
    margin-top: 20px;
}

.login-text {
    color: #666;
    font-size: 14px;
}

.login-link {
    color: #D0f500;
    text-decoration: none;
    font-weight: 500;
    margin-left: 5px;
}

.login-link:hover {
    text-decoration: underline;
}

/* 动画效果 */
@keyframes float {

    0%,
    100% {
        transform: translateY(0px);
    }

    50% {
        transform: translateY(-10px);
    }
}

@keyframes pulse {

    0%,
    100% {
        opacity: 1;
    }

    50% {
        opacity: 0.5;
    }
}

@keyframes rotate {
    from {
        transform: translate(-50%, -50%) rotate(0deg);
    }

    to {
        transform: translate(-50%, -50%) rotate(360deg);
    }
}
</style>