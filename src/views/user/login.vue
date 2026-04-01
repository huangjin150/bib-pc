<template>
  <div class="login-page">
    <div class="login-layout">
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
        <div v-if="!registrationStatus" class="right-section">
          <div class="login-form-container">
            <div class="panel-header">
              <h1 class="panel-title">欢迎来到 Bibcoin</h1>
              <button class="switch-btn" @click="registrationJump">立即注册</button>
            </div>
            <div class="form-content">
              <div class="login-form">
                <div class="tab-buttons">
                  <button class="tab-btn active">账号</button>
                </div>

                <div class="input-group">
                  <input type="email" v-model="loginForm.username" placeholder="输入您的账号" class="form-input" />
                </div>

                <div class="input-group">
                  <div class="password-input">
                    <input :type="showPassword ? 'text' : 'password'" v-model="loginForm.password" placeholder="输入您的密码"
                      class="form-input" />
                    <button v-if="showPassword" type="button" @click="showPassword = !showPassword"
                      class="password-toggle">
                      <img src="../../assets/svg/eye_closed.svg" alt="">
                    </button>
                    <button v-else type="button" @click="showPassword = !showPassword" class="password-toggle">
                      <img src="../../assets/svg/eye_open.svg" alt="">
                    </button>
                  </div>
                </div>

                <div class="form-footer">
                  <a @click.prevent="forgotPassword" href="#" class="forgot-password">忘记密码?</a>
                </div>

                <button class="login-btn" @click="handleLogin">
                  登录
                </button>

                <div class="bottom-tip">
                  <span class="muted-text">没有账户?</span>
                  <span class="register_btn" @click="registrationJump">立即注册</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="register-section">
          <div class="register-container">
            <div class="panel-header">
              <h1 class="panel-title">欢迎来到 EasiCoin</h1>
              <button class="switch-btn" @click="registrationStatus = false">返回登录</button>
            </div>

            <div class="register-tabs">
              <button :class="['register-tab-btn', { active: registerTab === 'email' }]" @click="registerTab = 'email'">
                邮箱
              </button>
              <button :class="['register-tab-btn', { active: registerTab === 'phone' }]" @click="registerTab = 'phone'">
                手机号
              </button>
            </div>

            <div v-if="registerTab === 'email'" class="register-form">
              <div class="register-input-group">
                <input type="email" v-model="registerForm.email" placeholder="电子邮件地址" class="form-input"
                  :class="{ 'error': emailError }" />
                <div v-if="emailError" class="error-message">{{ emailError }}</div>
              </div>

              <div class="register-input-group">
                <div class="verification-wrapper">
                  <input type="text" v-model="registerForm.emailVerificationCode" placeholder="请输入验证码"
                    class="form-input" :class="{ 'error': verificationCodeError }" />
                  <button class="verification-btn" @click="sendEmailVerificationCode" :disabled="emailCountdown > 0">
                    {{ emailCountdown > 0 ? `${emailCountdown}s` : '获取验证码' }}
                  </button>
                </div>
                <div v-if="verificationCodeError" class="error-message">{{ verificationCodeError }}</div>
              </div>

              <div class="register-input-group">
                <div class="register-password-wrapper">
                  <input :type="showRegisterPassword ? 'text' : 'password'" v-model="registerForm.password"
                    placeholder="输入您的密码" class="form-input" :class="{ 'error': passwordError }" />
                  <button type="button" class="register-password-toggle"
                    @click="showRegisterPassword = !showRegisterPassword">
                    <img v-if="showRegisterPassword" src="../../assets/svg/eye_closed.svg" alt="">
                    <img v-else src="../../assets/svg/eye_open.svg" alt="">
                  </button>
                </div>
                <div v-if="passwordError" class="error-message">{{ passwordError }}</div>
              </div>

              <div class="register-input-group">
                <input type="text" :disabled="promotionStatus" v-model="registerForm.inviteCode" placeholder="邀请码"
                  class="form-input" />
              </div>

              <button class="register-submit-btn" @click="handleEmailRegister">
                注册
              </button>

              <div class="login-redirect">
                <span class="login-text">已有账户？</span>
                <a href="#" class="login-link" @click.prevent="registrationStatus = false">登录</a>
              </div>
            </div>

            <div v-else class="register-form">
              <div class="register-input-group">
                <input type="tel" v-model="registerForm.phone" placeholder="请输入手机号" class="form-input"
                  :class="{ 'error': phoneError }" />
                <div v-if="phoneError" class="error-message">{{ phoneError }}</div>
              </div>

              <div class="register-input-group">
                <div class="register-password-wrapper">
                  <input :type="showRegisterPassword ? 'text' : 'password'" v-model="registerForm.password"
                    placeholder="输入您的密码" class="form-input" :class="{ 'error': phonePasswordError }" />
                  <button type="button" class="register-password-toggle"
                    @click="showRegisterPassword = !showRegisterPassword">
                    <img v-if="showRegisterPassword" src="../../assets/svg/eye_closed.svg" alt="">
                    <img v-else src="../../assets/svg/eye_open.svg" alt="">
                  </button>
                </div>
                <div v-if="phonePasswordError" class="error-message">{{ phonePasswordError }}</div>
              </div>

              <div class="register-input-group">
                <div class="verification-wrapper">
                  <input type="text" v-model="registerForm.verificationCode" placeholder="请输入验证码" class="form-input"
                    :class="{ 'error': phoneVerificationCodeError }" />
                  <button class="verification-btn" @click="sendEmailVerificationCode" :disabled="countdown > 0">
                    {{ countdown > 0 ? `${countdown}s` : '获取验证码' }}
                  </button>
                </div>
                <div v-if="phoneVerificationCodeError" class="error-message">{{ phoneVerificationCodeError }}</div>
              </div>

              <div class="register-input-group">
                <input type="text" :disabled="promotionStatus" v-model="registerForm.inviteCode" placeholder="邀请码"
                  class="form-input" />
              </div>

              <button class="register-submit-btn" @click="handlePhoneRegister">
                注册
              </button>

              <div class="login-redirect">
                <span class="login-text">已有账户？</span>
                <a href="#" class="login-link" @click.prevent="registrationStatus = false">登录</a>
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

export default {
  name: 'UserLogin',
  data() {
    return {
      activeTab: 'email',
      showPassword: false,
      registrationStatus: false,
      registerTab: 'email',
      showRegisterPassword: false,
      countdown: 0,
      emailCountdown: 0,
      codeText: '获取验证码',
      captchaObj: null,
      emailError: '',
      passwordError: '',
      verificationCodeError: '',
      phoneError: '',
      phoneVerificationCodeError: '',
      phonePasswordError: '',
      promotionStatus: false,
      VerificationData: {
        geetest_challenge: '',
        geetest_seccode: '',
        geetest_validate: '',
      },
      loginForm: {
        username: '',
        password: ''
      },
      phoneForm: {
        phone: '',
        password: ''
      },
      registerForm: {
        email: '',
        phone: '',
        password: '',
        verificationCode: '',
        emailVerificationCode: '',
        inviteCode: ''
      }
    }
  },

  watch: {
    '$route'(to, from) {
      this.handleRouteChange()
    }
  },
  computed: {
    routeCode: function () {
      return this.$route.query.code || localStorage.getItem('promotion_code') || "";
    }
  },
  created: function () {
    this.initGtCaptchas()
    let code = this.$route.query.code || this.routeCode;
    if (!code) {
      const search = window.location.search;
      const params = new URLSearchParams(search);
      const codes = params.get('code');
      if (codes) {
        this.registerForm.inviteCode = codes;
        this.promotionStatus = true
      }
    }
    if (code) {
      this.registerForm.inviteCode = code;
      this.promotionStatus = true
    }
    if (this.$route.query.tab === 'register') {
      this.registrationStatus = true
    }

  },
  methods: {
    clearPhoneErrors() {
      this.phoneError = ''
      this.phonePasswordError = ''
      this.phoneVerificationCodeError = ''
    },
    validatePhoneForm() {
      this.clearPhoneErrors()
      let isValid = true

      // 手机号校验
      if (!this.registerForm.phone) {
        this.phoneError = '请输入手机号'
        isValid = false
      }

      // 验证码校验
      if (!this.registerForm.verificationCode) {
        this.phoneVerificationCodeError = '请输入验证码'
        isValid = false
      }

      // 密码校验
      if (!this.registerForm.password) {
        this.phonePasswordError = '请输入密码'
        isValid = false
      }

      return isValid
    },

    //登录
    handleLogin() {
      this.$http.post(this.host + this.api.uc.login, this.loginForm).then(response => {
        var resp = response.body;
        if (resp.code == 0) {
          this.$Message.success(this.$t("uc.login.success"));
          this.$store.commit("setMember", response.body.data);
          this.$store.commit("setToken", response.body.data.token);
          if (this.$route.query.key != null && this.$route.query.key != "") {
            localStorage.setItem("USERKEY", this.$route.query.key);
          }
          this.$router.push("/");
        } else {
          this.$Message.error(resp.message);
        }
      });
    },

    clearErrors() {
      this.emailError = ''
      this.passwordError = ''
      this.verificationCodeError = ''
    },

    isValidEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailRegex.test(email)
    },

    validateEmailForm() {
      this.clearErrors()
      let isValid = true

      // 邮箱校验
      if (!this.registerForm.email) {
        this.emailError = '请输入邮箱'
        isValid = false
      }

      // 验证码校验
      if (!this.registerForm.emailVerificationCode) {
        this.verificationCodeError = '请输入验证码'
        isValid = false
      }

      // 密码校验
      if (!this.registerForm.password) {
        this.passwordError = '请输入密码'
        isValid = false
      }

      return isValid
    },

    handleRouteChange() {
      let code = this.$route.query.code || this.routeCode;
      if (!code) {
        const search = window.location.search;
        const params = new URLSearchParams(search);
        const codes = params.get('code');
        if (codes) {
          this.registerForm.inviteCode = codes;
          this.promotionStatus = true
        }
      }

      if (code) {
        this.registerForm.inviteCode = code;
        this.promotionStatus = true
      }

      // 监听 tab 参数变化
      if (this.$route.query.tab === 'register') {
        this.registrationStatus = true
      } else {
        this.registrationStatus = false // 重置为登录状态
      }
    },

    registrationJump() {
      this.registrationStatus = true
    },

    afterValidate() {
      if (this.registerTab == 'email') {
        //发送邮件
        var params = {};
        params["email"] = this.registerForm.email;
        params["geetest_challenge"] = this.VerificationData.geetest_challenge;
        params["geetest_seccode"] = this.VerificationData.geetest_seccode;
        params["geetest_validate"] = this.VerificationData.geetest_validate;
        console.log('this.host', this.host)
        this.$http.post(this.host + "/reg/email/code", params).then(response => {
          console.log('response', response)
          var resp = response.body;
          if (resp.code == 0) {
            this.$Message.success(resp.message);
            this.startEmailCountdown()
          } else {
            this.$Message.error(resp.message);

          }
        });
      } else {
        var that = this
        var params = {};
        params["phone"] = this.registerForm.phone;
        params["country"] = '中国';
        params["geetest_challenge"] = this.VerificationData.geetest_challenge;
        params["geetest_seccode"] = this.VerificationData.geetest_seccode;
        params["geetest_validate"] = this.VerificationData.geetest_validate;

        this.$http.post(this.host + "/mobile/code", params).then(response => {
          var resp = response.body;
          if (resp.code == 0) {
            this.$Message.success(resp.message);
            this.sendVerificationCode()

          } else {
            this.$Message.error(resp.message);
          }
        });
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
          this.afterValidate();
        }
      });
      this.captchaObj = captchaObj;
    },

    //获取邮箱验证码
    sendEmailVerificationCode() {
      if (this.registerTab == 'email') {
        if (!this.registerForm.email) {
          this.emailError = '请先输入邮箱'
          return
        }
        this.captchaObj.verify();
      } else if (this.registerTab == 'phone') {
        if (!this.registerForm.phone) {
          this.phoneError = '请先输入手机号'
          return
        }
        this.captchaObj.verify();
        this.startEmailCountdown()
      }
    },

    startEmailCountdown() {
      this.emailCountdown = 60
      const timer = setInterval(() => {
        this.emailCountdown--
        if (this.emailCountdown <= 0) {
          clearInterval(timer)
        }
      }, 1000)
    },

    //邮箱注册
    handleEmailRegister() {
      if (!this.validateEmailForm()) {
        return
      }
      let params = {}

      params['email'] = this.registerForm.email,
        params["superPartner"] = "";
      params['username'] = this.registerForm.email,
        params['password'] = this.registerForm.password,
        params['country'] = '中国',
        params['visitCode'] = 'undefined',
        params['code'] = this.registerForm.emailVerificationCode,
        params['promotion'] = this.registerForm.inviteCode,
        this.$http.post(this.host + '/register/email', params).then(response => {
          if (response.body.code === 0) {
            this.$Message.success('注册成功')
            this.registrationStatus = false
          } else {
            this.$Message.error(response.body.message)
          }
        })
    },

    //手机注册
    handlePhoneRegister() {
      if (!this.validatePhoneForm()) {
        return
      }
      let params = {}
      params['superPartner'] = '',
        params['phone'] = this.registerForm.phone,
        params['username'] = this.registerForm.phone,
        params['password'] = this.registerForm.password,
        params['country'] = '中国',
        params['code'] = this.registerForm.verificationCode,
        params['promotion'] = this.registerForm.inviteCode,

        this.$http.post(this.host + '/register/phone', params).then(response => {
          if (response.body.code === 0) {
            this.$Message.success('注册成功')
            this.registrationStatus = false
          } else {
            this.$Message.error(response.body.message)
          }
        })
    },

    sendVerificationCode() {
      if (!this.registerForm.phone) {
        this.$Message.warning('请先输入手机号');
        return
      }
      this.countdown = 60
      const timer = setInterval(() => {
        this.countdown--
        if (this.countdown <= 0) {
          clearInterval(timer)
        }
      }, 1000)
    },

    forgotPassword() {
      this.$router.push('/forgotpassword')
    }
  },
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  background: #000;
  padding: 80px 32px 40px;
  box-sizing: border-box;
}

.login-layout {
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

.welcome-text h2 span {
  color: #d4ff00;
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

.animation-graphic img {
  display: block;
  width: min(100%, 420px);
  height: auto;
}

.poster-image {
  width: 250px !important;
  position: relative;
  z-index: 2;
  animation: loginPosterFloat 3.6s ease-in-out infinite;
}

.aperture-image {
  width: 220px !important;
  margin-top: 12px;
  transform-origin: center center;
  animation: loginAperturePulse 3.6s ease-in-out infinite;
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

.auth-panel {
  width: 100%;
  max-width: 460px;
  flex-shrink: 0;
}

.right-section,
.register-section {
  width: 100%;
}

.login-form-container,
.register-container {
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

.form-content {
  margin-top: 0;
}

.tab-buttons,
.register-tabs {
  display: flex;
  align-items: center;
  gap: 28px;
  padding-bottom: 14px;
  border-bottom: 1px solid #1d1d1d;
  margin-bottom: 22px;
}

.tab-btn,
.register-tab-btn {
  padding: 0 0 8px;
  border: none;
  border-radius: 0;
  background: transparent;
  color: #8e8e92;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
}

.tab-btn.active,
.register-tab-btn.active {
  color: #d4ff00;
  border-bottom: 2px solid #d4ff00;
}

.input-group,
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

.password-input,
.register-password-wrapper {
  position: relative;
}

.password-toggle,
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

.password-toggle img,
.register-password-toggle img {
  width: 18px;
  height: 18px;
  opacity: 0.7;
}

.form-footer {
  text-align: right;
  margin-top: 4px;
}

.forgot-password,
.login-link,
.register_btn {
  color: #fff;
  cursor: pointer;
  text-decoration: none;
}

.forgot-password {
  font-size: 14px;
  color: #b7b7b7;
}

.login-btn,
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

.login-btn:hover,
.register-submit-btn:hover {
  opacity: 0.92;
}

.bottom-tip,
.login-redirect {
  margin-top: 18px;
  text-align: center;
}

.muted-text,
.login-text {
  color: #8e8e92;
  font-size: 14px;
  margin-right: 6px;
}

.register_btn,
.login-link {
  color: #d4ff00;
  font-size: 14px;
  font-weight: 500;
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

.form-input.error {
  border-color: #ff4d4f;
}

.error-message {
  color: #ff4d4f;
  font-size: 12px;
  margin-top: 6px;
  margin-left: 2px;
}

@media (max-width: 1100px) {
  .login-layout {
    gap: 36px;
  }

  .welcome-text h2 {
    font-size: 44px;
  }
}

@media (max-width: 900px) {
  .login-page {
    padding: 40px 20px;
  }

  .login-layout {
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
