<template>
    <div class="forgot-page">
        <div class="forgot-layout">
            <div class="left-section">
                <div class="animation-area">
                    <div class="welcome-text">
                        <h2>邀请朋友进行交易，您和您的朋友</h2>
                        <h2>共享20%佣金</h2>
                        <p>安全、流畅、简单</p>
                    </div>
                    <div class="animation-graphic">
                        <img class="poster-image" src="../../assets/images/login-poster.png" alt="">
                        <img class="aperture-image" src="../../assets/images/aperture.png" alt="">
                    </div>
                </div>
            </div>

            <div class="auth-panel">
                <div class="right-section">
                    <div class="login-form-container">
                        <div class="panel-header">
                            <h1 class="panel-title">重置密码</h1>
                            <button class="switch-btn" @click="$router.push('/login')">返回登录</button>
                        </div>

                        <div class="register-form">
                            <div class="register-input-group">
                                <input type="text" v-model="resetForm.account" placeholder="请输入手机号或邮箱" class="form-input"
                                    :class="{ 'error': accountError }" />
                                <div v-if="accountError" class="error-message">{{ accountError }}</div>
                            </div>

                            <div class="register-input-group">
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
                                <a href="#" class="login-link" @click.prevent="$router.push('/login')">返回登录</a>
                            </div>
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
                params["account"] = this.resetForm.account;
                params["code"] = this.resetForm.verificationCode;
                params["mode"] = 0;
                params["password"] = this.resetForm.newPassword;
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
.forgot-page {
    min-height: 100vh;
    background: #000;
    padding: 80px 32px 40px;
    box-sizing: border-box;
}

.forgot-layout {
    max-width: 1280px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 72px;
}

.left-section {
    flex: 1;
    min-width: 0;
}

.animation-area {
    max-width: 520px;
    padding: 20px 10px 20px 0;
}

.welcome-text h2 {
    text-align: center;
    margin: 0;
    color: #fff;
    font-size: 32px;
    line-height: 1.16;
    font-weight: 700;
}

.welcome-text p {
    margin: 18px 0 0;
    text-align: center;
    font-size: 18px;
    color: #8e8e92;
}

.animation-graphic {
    display: flex;
    align-items: center;
    flex-direction: column;
    margin-top: 42px;
    position: relative;
}

.poster-image {
    width: 250px;
    position: relative;
    z-index: 2;
    animation: loginPosterFloat 3.6s ease-in-out infinite;
}

.aperture-image {
    width: 220px;
    margin-top: 12px;
    transform-origin: center center;
    animation: loginAperturePulse 3.6s ease-in-out infinite;
}

.auth-panel {
    width: 100%;
    max-width: 460px;
    flex-shrink: 0;
}

.right-section {
    width: 100%;
}

.login-form-container {
    width: 100%;
}

.panel-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 28px;
}

.panel-title {
    margin: 0;
    color: #fff;
    font-size: 38px;
    font-weight: 700;
    line-height: 1.2;
}

.switch-btn {
    height: 38px;
    padding: 0 18px;
    border-radius: 999px;
    border: 1px solid #2d2d2d;
    background: #151515;
    color: #fff;
    font-size: 14px;
    cursor: pointer;
}

.register-form {
    margin-top: 0;
}

.register-input-group {
    margin-bottom: 18px;
}

.form-input {
    width: 100%;
    height: 54px;
    padding: 0 18px;
    border: 1px solid #1f1f1f;
    border-radius: 12px;
    font-size: 15px;
    color: #fff;
    background: #050505;
    box-sizing: border-box;
    transition: border-color 0.2s, background-color 0.2s;
}

.form-input::placeholder {
    color: #555;
}

.form-input:focus {
    outline: none;
    border-color: #2f2f2f;
    background: #090909;
}

.form-input.error {
    border-color: #ff4d4f;
}

.verification-wrapper {
    display: flex;
    gap: 10px;
    align-items: center;
}

.verification-wrapper .form-input {
    flex: 1;
}

.verification-btn {
    height: 54px;
    padding: 0 16px;
    border-radius: 12px;
    border: 1px solid #242424;
    background: #111;
    color: #fff;
    font-size: 14px;
    white-space: nowrap;
    cursor: pointer;
}

.verification-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.register-password-wrapper {
    position: relative;
}

.register-password-toggle {
    position: absolute;
    right: 16px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
}

.register-password-toggle img {
    width: 18px;
    height: 18px;
    opacity: 0.7;
}

.error-message {
    color: #ff4d4f;
    font-size: 12px;
    margin-top: 6px;
    margin-left: 2px;
}

.register-submit-btn {
    width: 100%;
    height: 54px;
    margin-top: 28px;
    border: none;
    border-radius: 12px;
    background: #f2f2f2;
    color: #111;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: opacity 0.2s ease;
}

.register-submit-btn:hover {
    opacity: 0.92;
}

.login-redirect {
    margin-top: 18px;
    text-align: center;
}

.login-text {
    color: #8e8e92;
    font-size: 14px;
    margin-right: 6px;
}

.login-link {
    color: #d4ff00;
    text-decoration: none;
    font-weight: 500;
    font-size: 14px;
}

@keyframes loginPosterFloat {
    0% {
        transform: translateY(0);
    }

    50% {
        transform: translateY(-18px);
    }

    100% {
        transform: translateY(0);
    }
}

@keyframes loginAperturePulse {
    0% {
        transform: scaleX(0.92);
        opacity: 0.72;
    }

    50% {
        transform: scaleX(1.1);
        opacity: 1;
    }

    100% {
        transform: scaleX(0.92);
        opacity: 0.72;
    }
}

@media (max-width: 1100px) {
    .forgot-layout {
        gap: 36px;
    }
}

@media (max-width: 900px) {
    .forgot-page {
        padding: 40px 20px;
    }

    .forgot-layout {
        flex-direction: column;
        align-items: stretch;
    }

    .left-section {
        display: none;
    }

    .auth-panel {
        max-width: 100%;
    }
}

@media (max-width: 520px) {
    .panel-header {
        flex-direction: column;
        align-items: flex-start;
    }

    .panel-title {
        font-size: 30px;
    }

    .verification-wrapper {
        flex-direction: column;
        align-items: stretch;
    }
}
</style>
