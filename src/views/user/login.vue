<template>
  <div class="container flex_between " style="padding: 70px 0; ">
    <div class="flex_between " style="gap: 48px; margin: 0 auto;">
      <div class="left-section">
        <div class="animation-area">
          <div class="welcome-text">
            <p>邀请朋友进行交易，您和您的朋友</p>
            <p>共享20%佣金</p>
            <div style="font-size: 16px; color:rgba(142, 142, 146);margin-bottom: 25px; ">安全、流畅、简单！</div>
          </div>
          <div class="animation-graphic">
            <img src="../../assets/svg/login_logo.svg" alt="">
          </div>
        </div>
      </div>

      <div v-if="!registrationStatus" class="right-section">.
        <div class="login-form-container">
          <h1 style="text-align: start; font-size: 32px; font-weight: 700;color: #000;">欢迎来到 Abtcoin</h1>
          <div class="form-content">
            <!-- 登录表单 -->
            <div class="login-form">
              <div class="input-group">
                <label>账号</label>
                <input type="email" v-model="loginForm.username" placeholder="请输入账号" class="form-input" />
              </div>

              <div class="input-group">
                <label>密码</label>
                <div class="password-input">
                  <input :type="showPassword ? 'text' : 'password'" v-model="loginForm.password" placeholder="请输入密码"
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
                <a @click="forgotPassword" href="#" class="forgot-password">忘记密码？</a>
              </div>

              <button class="login-btn" @click="handleLogin">
                登录
              </button>

              <div>
                <span style="color: rgba(142, 142, 146)">没有账户? </span>
                <span class="register_btn" @click="registrationJump">注册</span>
              </div>

            </div>
          </div>
        </div>
      </div>
      <div v-else class="register-section">
        <div class="register-container">
          <!-- 标题 -->
          <h1 class="register-title">立即开始</h1>

          <!-- 选项卡 -->
          <div class="register-tabs">
            <button :class="['register-tab-btn', { active: registerTab === 'email' }]" @click="registerTab = 'email'">
              邮箱
            </button>
            <button :class="['register-tab-btn', { active: registerTab === 'phone' }]" @click="registerTab = 'phone'">
              手机号码
            </button>
          </div>

          <!-- 邮箱注册表单 -->
          <div v-if="registerTab === 'email'" class="register-form">
            <div class="register-input-group">
              <label class="register-label">邮箱</label>
              <input type="email" v-model="registerForm.email" placeholder="请输入邮箱" class="form-input"
                :class="{ 'error': emailError }" />
              <div v-if="emailError" class="error-message">{{ emailError }}</div>
            </div>

            <div class="register-input-group">
              <label class="register-label">验证码</label>
              <div class="verification-wrapper">
                <input type="text" v-model="registerForm.emailVerificationCode" placeholder="请输入验证码" class="form-input"
                  :class="{ 'error': verificationCodeError }" />
                <button class="verification-btn" @click="sendEmailVerificationCode" :disabled="emailCountdown > 0">
                  {{ emailCountdown > 0 ? `${emailCountdown}s` : '获取验证码' }}
                </button>
              </div>
              <div v-if="verificationCodeError" class="error-message">{{ verificationCodeError }}</div>
            </div>

            <div class="register-input-group">
              <label class="register-label">密码</label>
              <div class="register-password-wrapper">
                <input :type="showRegisterPassword ? 'text' : 'password'" v-model="registerForm.password"
                  placeholder="请输入密码" class="form-input" :class="{ 'error': passwordError }" />
                <button type="button" class="register-password-toggle"
                  @click="showRegisterPassword = !showRegisterPassword">
                  <img v-if="showRegisterPassword" src="../../assets/svg/eye_closed.svg" alt="">
                  <img v-else src="../../assets/svg/eye_open.svg" alt="">
                </button>
              </div>
              <div v-if="passwordError" class="error-message">{{ passwordError }}</div>
            </div>

            <!-- 邀请码 -->
            <div class="register-input-group">
              <div class="invite-label-row">
                <label class="register-label">邀请码</label>
              </div>
              <input type="text" :disabled="promotionStatus" v-model="registerForm.inviteCode" placeholder=""
                class="form-input" />
            </div>
            <button class="register-submit-btn" @click="handleEmailRegister">
              注册
            </button>

            <div class="login-redirect">
              <span class="login-text">已有账户？</span>
              <a href="#" class="login-link" @click="registrationStatus = false">登录</a>
            </div>
          </div>

          <!-- 手机号注册表单 -->
          <div v-else class="register-form">
            <div class="register-input-group">
              <label class="register-label">手机号</label>
              <input type="tel" v-model="registerForm.phone" placeholder="请输入手机号" class="form-input"
                :class="{ 'error': phoneError }" />
              <div v-if="phoneError" class="error-message">{{ phoneError }}</div>
            </div>

            <div class="register-input-group">
              <label class="register-label">密码</label>
              <div class="register-password-wrapper">
                <input :type="showRegisterPassword ? 'text' : 'password'" v-model="registerForm.password"
                  placeholder="请输入密码" class="form-input" :class="{ 'error': phonePasswordError }" />
                <button type="button" class="register-password-toggle"
                  @click="showRegisterPassword = !showRegisterPassword">
                  <img v-if="showRegisterPassword" src="../../assets/svg/eye_closed.svg" alt="">
                  <img v-else src="../../assets/svg/eye_open.svg" alt="">
                </button>
              </div>
              <div v-if="phonePasswordError" class="error-message">{{ phonePasswordError }}</div>
            </div>

            <div class="register-input-group">
              <label class="register-label">验证码</label>
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
              <div class="invite-label-row">
                <label class="register-label">邀请码</label>
              </div>
              <input type="text" :disabled="promotionStatus" v-model="registerForm.inviteCode" placeholder=""
                class="form-input" />
            </div>

            <button class="register-submit-btn" @click="handlePhoneRegister">
              注册
            </button>

            <div class="login-redirect">
              <span class="login-text">已有账户？</span>
              <a href="#" class="login-link" @click="registrationStatus = false">登录</a>
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


.bitcoin-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 3rem;
  color: #f7931a;
  animation: float 3s ease-in-out infinite;
}

.shield-icon {
  position: absolute;
  top: 30%;
  right: 20%;
  font-size: 2rem;
  animation: pulse 2s infinite;
}

.orbit-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 200px;
  height: 200px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  animation: rotate 10s linear infinite;
}

.floating-elements {
  position: absolute;
  width: 100%;
  height: 100%;
}

.element {
  position: absolute;
  font-size: 1.5rem;
  animation: float 4s ease-in-out infinite;
}

.element:nth-child(1) {
  top: 20%;
  left: 20%;
  animation-delay: -1s;
}

.element:nth-child(2) {
  bottom: 20%;
  right: 30%;
  animation-delay: -2s;
}

.element:nth-child(3) {
  top: 60%;
  left: 10%;
  animation-delay: -3s;
}

.feature-tags {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 30px;
}

.tag {
  background: rgba(255, 255, 255, 0.2);
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.9rem;
  backdrop-filter: blur(10px);
}

.right-section {
  width: 450px;
  background: white;
  display: flex;
}

.login-form-container {
  width: 100%;

}

.tab-buttons {
  margin-top: 20px;
  display: flex;
  margin-bottom: 30px;
}

.tab-btn {
  text-align: center;
  width: 100px;
  border: none;
  padding: 8px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
}

.tab-btn.active {
  background-color: #D0f500;
}

.input-group {
  margin-bottom: 20px;
}

.input-group label {
  display: block;
  text-align: start;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
}

.form-input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #eaeaed;
  border-radius: 20px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.form-input:focus {
  outline: none;
  border-color: #D0f500;
}

.password-input,
.verification-input {
  position: relative;
  display: flex;
  align-items: center;
}

.password-toggle {
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
}

.verify-btn {
  margin-left: 10px;
  padding: 12px 20px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  white-space: nowrap;
  font-size: 0.9rem;
}

.login-btn {
  width: 100%;
  padding: 10px 15px;
  background: #000;
  color: white;
  border: none;
  border-radius: 20px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  margin: 20px 0;
  transition: background 0.3s;
}


.forgot-password {
  color: #84cc16;
  text-decoration: none;
  font-size: 0.9rem;
}

.social-login {
  margin-top: 30px;
}

.divider {
  text-align: center;
  margin: 20px 0;
  position: relative;
}

.divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: #eee;
}

.divider span {
  background: white;
  padding: 0 15px;
  color: #999;
  position: relative;
}

.social-buttons {
  display: flex;
  justify-content: center;
  gap: 15px;
}

.social-btn {
  width: 50px;
  height: 50px;
  border: 1px solid #ddd;
  border-radius: 50%;
  background: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.social-btn:hover {
  border-color: #667eea;
  transform: translateY(-2px);
}

.social-icon {
  font-size: 1.2rem;
}

/* 动画效果 */
@keyframes float {

  0%,
  100% {
    transform: translateY(0px);
  }

  50% {
    transform: translateY(-20px);
  }
}

@keyframes pulse {

  0%,
  100% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.1);
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

/* 响应式设计 */
@media (max-width: 768px) {
  .login-container {
    flex-direction: column;
  }

  .left-section {
    min-height: 40vh;
  }

  .right-section {
    width: 100%;
  }
}

.form-footer {
  text-align: start;
}

/* 注册页面样式 */
.register-section {
  width: 450px;
  background: white;
  display: flex;
}

.register-container {
  width: 100%;
  padding: 0;
}

.register-title {
  font-size: 32px;
  font-weight: 700;
  color: #1a1a1a;
  text-align: left;
}

.register-tabs {
  display: flex;
  gap: 8px;
  margin-top: 20px;
  margin-bottom: 30px;
}

.register-tab-btn {
  padding: 8px 10px;
  width: 100px;
  border: none;
  border-radius: 24px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: #f5f5f5;
  color: #666;
}

.register-tab-btn.active {
  background-color: #d0f500;
  color: #1a1a1a;
}

.register-form {
  width: 100%;
}

.register-input-group {
  margin-bottom: 24px;
}

.invite-label-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.register-label {
  display: block;
  text-align: start;
  font-size: 14px;
  font-weight: 500;
  color: #1a1a1a;
}

.optional-text {
  font-size: 12px;
  color: #999;
  font-weight: 400;
}

.register-input {
  width: 100%;
  padding: 16px;
  border: 1px solid #e5e5e5;
  border-radius: 12px;
  font-size: 16px;
  color: #1a1a1a;
  background-color: #fff;
  transition: border-color 0.3s ease;
  box-sizing: border-box;
}

.register-input:focus {
  outline: none;
  border-color: #d0f500;
}

.register-input::placeholder {
  color: #999;
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
}

.register-password-toggle img {
  width: 20px;
  height: 20px;
}

.verification-wrapper {
  height: 42px;
  display: flex;
  gap: 11px;
  align-items: stretch;
}

.verification-input {
  flex: 1;
}

.verification-btn {
  padding: 12px 16px;
  background-color: #f5f5f5;
  border: 1px solid #e5e5e5;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  color: #666;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.3s ease;
}

.verification-btn:hover:not(:disabled) {
  background-color: #e8e8e8;
}

.verification-btn:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.agreement-wrapper {
  margin-bottom: 32px;
}

.agreement-checkbox {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  cursor: pointer;
  line-height: 1.5;
}

.checkbox-input {
  display: none;
}

.checkbox-mark {
  width: 18px;
  height: 18px;
  border: 2px solid #e5e5e5;
  border-radius: 4px;
  background-color: #fff;
  position: relative;
  flex-shrink: 0;
  margin-top: 2px;
  transition: all 0.3s ease;
}

.checkbox-input:checked+.checkbox-mark {
  background-color: #d0f500;
  border-color: #d0f500;
}

.checkbox-input:checked+.checkbox-mark::after {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #1a1a1a;
  font-size: 12px;
  font-weight: bold;
}

.agreement-text {
  font-size: 14px;
  color: #666;
  line-height: 1.5;
}

.agreement-link {
  color: #d0f500;
  text-decoration: none;
  font-weight: 500;
}

.agreement-link:hover {
  text-decoration: underline;
}

.register-submit-btn {
  width: 100%;
  padding: 12px 16px;
  background-color: #1a1a1a;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-bottom: 24px;
}

.register-submit-btn:hover {
  background-color: #333;
}

.login-redirect {
  text-align: center;
  margin-bottom: 32px;
}

.login-text {
  font-size: 14px;
  color: #999;
  margin-right: 8px;
}

.login-link {
  font-size: 14px;
  color: #1a1a1a;
  text-decoration: none;
  font-weight: 500;
}

.login-link:hover {
  text-decoration: underline;
}

.social-login-wrapper {
  text-align: center;
}

.social-divider {
  font-size: 14px;
  color: #999;
  margin-bottom: 20px;
}

.social-icons {
  display: flex;
  justify-content: center;
  gap: 16px;
}

.social-icon-btn {
  width: 48px;
  height: 48px;
  border: 1px solid #e5e5e5;
  border-radius: 12px;
  background-color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  transition: all 0.3s ease;
}

.social-icon-btn:hover {
  border-color: #d0f500;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.social-icon-btn.google {
  color: #4285f4;
}

.social-icon-btn.telegram {
  color: #0088cc;
}

.social-icon-btn.apple {
  color: #000;
}

.form-content {
  margin-top: 40px;
}

.register_btn {
  cursor: pointer;
}

.form-input.error {
  border-color: #ff4757;
}

.error-message {
  color: #ff4757;
  font-size: 12px;
  margin-top: 4px;
  margin-left: 4px;
}

.verification-btn:disabled {
  background-color: #f5f5f5;
  color: #999;
  cursor: not-allowed;
}
</style>