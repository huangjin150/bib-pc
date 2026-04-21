<template>
  <div class="top-navbar">
    <div class="navbar-container">
      <div class="navbar-left">
        <router-link to="/">
          <div class="logo-section">
            <img src="../assets/images/logo-338.png" alt="">
          </div>
        </router-link>
        <!-- <div>
          <div class="btn dropDown flex">
          </div>
        </div> -->
        <!-- 导航菜单 -->
        <div class="navbar-center">
          <nav class="main-nav">
            <router-link v-for="item in navItems" :key="item.path" :to="item.path" class="nav-item">
              {{ item.name }}
              <img v-if="item.path === '/prediction'" style="margin-left: 6px;" src="../assets/svg/mini_hot.svg" alt="">
            </router-link>
          </nav>
        </div>
      </div>

      <div class="navbar-right">
        <div v-if="isLogin">
          <TotalAssetsDropdown />
        </div>
        <!-- 用户信息按钮 -->
        <div v-if="isLogin" class="user-info-container" @mouseenter="showUserMenu = true"
          @mouseleave="showUserMenu = false">
          <button class="download-btn flex_center">
            <UserInfoIcon style="width: 20px; height: 20px;" :size="14" className="download-btn1" />
          </button>

          <!-- 用户下拉菜单 -->
          <div class="user_po">
            <div v-if="showUserMenu">
              <div class="reserveaSeat"></div>
              <div class="user-dropdown">
                <div class="user-header-card">
                  <div class="user-avatar">
                    <UserInfoIcon style="width: 22px; height: 22px;" :size="16" />
                  </div>
                  <div class="user-details">
                    <div class="user-email">{{ userEmail }}</div>
                    <div class="user-uid">UID:{{ userUID }}</div>
                  </div>
                </div>

                <!-- 菜单 -->
                <div class="menu-items">
                  <div class="menu-item" @click="navigateTo('/account/overview')">
                    <div class="menu-icon"><img src="../assets/svg/asset.svg" alt=""></div>
                    <span>总览</span>
                  </div>

                  <div class="menu-item" @click="navigateTo('/cards')">
                    <div class="menu-icon"><img src="../assets/svg/coupon.svg" alt=""></div>
                    <span>卡券中心</span>
                  </div>

                  <div class="menu-item" @click="navigateTo('/invite')">
                    <div class="menu-icon"><img src="../assets/svg/invitation.svg" alt=""></div>
                    <span>邀请好友</span>
                  </div>

                  <div class="menu-item" @click="openPreferences">
                    <div class="menu-icon"><img src="../assets/svg/setting.svg" alt=""></div>
                    <span>偏好设置</span>
                  </div>
                </div>

                <div class="logout-section">
                  <button class="logout-btn" @click="handleLogout">退出登录</button>
                </div>
              </div>
            </div>
          </div>

        </div>

        <!-- 登录按钮 -->
        <div v-if="!isLogin" class="login-btn" @click="$router.push('/login')">
          登录
        </div>

        <div v-if="!isLogin" @click="goToRegister" class="register-btn">
          注册
        </div>

        <!-- 下载按钮 -->
        <div style="position: relative;margin-left: 20px;">
          <button class="download-btn flex_center" @mouseenter="showdownload = true" @mouseleave="showdownload = false">
            <DownloadIcon style="width: 20px; height: 20px;" :size="14" className="download-btn1" />
          </button>
          <div v-if="showdownload" class="showdownload_box">
            <div style="background-color: #000; padding: 10px">
              <div style="text-align: center; color: #fff;font-weight: 700;">
                扫码下载APP
              </div>
              <div class="">
                <img style="width: 160px; height: 160px;" src="../assets/images/unload_code.png" alt="">
              </div>
            </div>
          </div>
        </div>


        <!-- 选择语言 -->
        <!-- <button class="global-btn flex_center">
          <LanguangeIcon style="width: 20px; height: 20px;" :size="14" className="global-btn1" />
        </button> -->

        <!-- 偏好设置弹窗 -->
        <Modal v-model="showPreferencesModal" title="偏好设置" :footer-hide="true" width="400"
          class-name="vertical-center-modal preference-modal">
          <div class="pref-content">
            <div class="pref-form-group">
              <label class="pref-label">涨跌颜色显示</label>
              <div class="pref-select-wrapper">
                <div class="pref-radio-option" :class="{ active: upColor === 'green' }" @click="setUpColor('green')">
                  <div class="radio-circle">
                    <div class="radio-inner" v-if="upColor === 'green'"></div>
                  </div>
                  <span class="radio-text">绿涨红跌 (Green Up / Red Down)</span>
                </div>
                <div class="pref-radio-option" :class="{ active: upColor === 'red' }" @click="setUpColor('red')">
                  <div class="radio-circle">
                    <div class="radio-inner" v-if="upColor === 'red'"></div>
                  </div>
                  <span class="radio-text">红涨绿跌 (Red Up / Green Down)</span>
                </div>
              </div>
            </div>

            <div class="pref-footer">
              <button class="pref-save-btn" @click="showPreferencesModal = false">确定</button>
            </div>
          </div>
        </Modal>

        <!-- 主题切换 -->
        <!-- <button class="theme-btn" @click="toggleTheme">
          <BrightColorIcon style="width: 20px; height: 20px;" :size="14" className="theme-btn1" />
        </button> -->

        <!-- 注册按钮 -->
      </div>
    </div>
  </div>
</template>


<script>
import DownloadIcon from '@/components/svg/DownloadIcon.vue'
import LanguangeIcon from '@/components/svg/languageIcon.vue'
import BrightColorIcon from '@/components/svg/BrightColorIcon.vue'
import UserInfoIcon from '@/components/svg/UserInfoIcon.vue'
import TotalAssetsDropdown from '@/components/TotalAssetsDropdown.vue'


export default {
  components: {
    DownloadIcon,
    LanguangeIcon,
    BrightColorIcon,
    UserInfoIcon,
    TotalAssetsDropdown
  },
  name: 'TopNavbar',
  data() {
    return {
      showLangMenu: false,
      showUserMenu: false,
      showdownload: false,
      showPreferencesModal: false,
      currentLang: 'zh',
      upColor: localStorage.getItem('upColor') || 'green', // 'green' or 'red'
      navItems: [
        { name: '行情', path: '/market' },
        { name: '合约', path: '/swap' },
        { name: '事件合约', path: '/eventContract' },
        { name: '预测合约', path: '/prediction' },
        { name: '公告中心', path: '/announcement/0' },
        { name: '平台介绍', path: '/introduce' },
      ]
    }
  },
  computed: {
    isLogin: function () {
      return this.$store.getters.isLogin;
    },
    userEmail() {
      const member = this.$store.getters.member;
      return member.username
    },
    userUID() {
      const member = this.$store.getters.member;
      return member.promotionCode
    },
    isDarkTheme() {
      return this.$store.getters.isDarkTheme;
    }
  },
  methods: {
    selectLanguage(lang) {
      this.currentLang = lang
      this.showLangMenu = false
    },
    toggleTheme() {
      this.$store.commit('toggleTheme');
    },
    toggleUserMenu() {
      this.showUserMenu = !this.showUserMenu
    },

    goToRegister() {
      this.$router.push({ path: '/login', query: { tab: 'register' } })
    },

    navigateTo(path) {
      this.$router.push(path)
      this.showUserMenu = false
    },

    handleLogout() {
      this.$store.commit('setMember', null)
      this.$store.commit('setToken', null)
      localStorage.removeItem('MEMBER')
      localStorage.removeItem('TOKEN')
      this.showUserMenu = false
      this.$router.push('/login')
    },
    openPreferences() {
      this.showUserMenu = false;
      this.showPreferencesModal = true;
    },
    setUpColor(color) {
      this.upColor = color;
      localStorage.setItem('upColor', color);
      // Optional: trigger an event or Vuex mutation if other components need to react instantly without reload
      // We will reload the page for simplicity to apply changes everywhere easily
      window.location.reload();
    }
  },
  mounted() {
    document.addEventListener('click', (e) => {
      if (!this.$el.contains(e.target)) {
        this.showLangMenu = false
        this.showUserMenu = false
      }
    })
  }
}
</script>

<style scoped>
.top-navbar {
  background: #1a1a1a;
  border-bottom: 1px solid #333;
  position: sticky;
  top: 0;
  z-index: 1001;
  height: 70px;
}

.navbar-container {
  background: #1a1a1a;

  width: 100%;
  box-sizing: border-box;
  position: fixed;
  top: 0;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  padding: 0 32px;
  height: 70px;
}

.dropDown {
  border: 1px solid #464545;
  padding: 8px;
  border-radius: 9999px;

}

.navbar-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;

  img {
    width: 140px;
    height: auto
  }
}

.logo-icon {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-symbol {
  font-size: 24px;
  color: #00d4aa;
  font-weight: bold;
}

.logo-text {
  font-size: 20px;
  font-weight: bold;
  color: white;
  letter-spacing: -0.5px;
}

.language-selector {
  position: relative;
}

.lang-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: 1px solid #333;
  color: #ccc;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
}

.lang-btn:hover {
  border-color: #555;
  background: #2a2a2a;
}

.lang-icon {
  font-size: 16px;
}

.dropdown-arrow {
  font-size: 10px;
  transition: transform 0.3s;
}

.lang-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  background: #2a2a2a;
  border: 1px solid #333;
  border-radius: 6px;
  min-width: 120px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  z-index: 1001;
  margin-top: 4px;
}

.lang-option {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  color: #ccc;
  cursor: pointer;
  transition: background 0.3s;
}

.lang-option:hover {
  background: #333;
}

.flag {
  font-size: 16px;
}

.navbar-center {
  flex: 1;
  display: flex;
  justify-content: center;
}

.main-nav {
  display: flex;
  gap: 30px;
}

.nav-item {
  color: #fff;
  text-decoration: none;
  font-size: 14px;
  padding: 8px 0;
  position: relative;
  transition: color 0.3s;
}

.nav-item:hover {
  color: #00d4aa;
}



.nav-item.active::after {
  content: '';
  position: absolute;
  bottom: -20px;
  left: 0;
  right: 0;
  height: 2px;
  background: #00d4aa;
}

.navbar-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.download-btn,
.global-btn,
.theme-btn {
  width: 36px;
  height: 36px;
  border: none;
  color: #fff;
  border-radius: 9999px;
  cursor: pointer;
  background-color: transparent;
  transition: all 0.3s;
  border: 1px solid #464545;
}

.download-btn:hover,
.global-btn:hover,
.theme-btn:hover {
  background: rgba(208, 245, 0);
  color: #000;

  .download-btn1 {
    color: #000;

  }
}

.register-btn {
  background: none;
  border: 1px solid #333;
  background-color: #fff;
  color: #000;
  border-radius: 15px;
  text-align: center;
  cursor: pointer;
  line-height: 35px;
  width: 70px;
  font-size: 14px;
  transition: all 0.3s;
}

.register-btn:hover {
  background: #a7a3a3;
}

.login-btn {
  border: none;
  color: #fff;
  background-color: #37393a;
  line-height: 35px;
  width: 70px;
  border-radius: 15px;
  text-align: center;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
}

.login-btn:hover {
  background: #424242;
}

@media (max-width: 768px) {
  .navbar-container {
    padding: 0 15px;
  }

  .main-nav {
    gap: 20px;
  }

  .nav-item {
    font-size: 14px;
  }

  .navbar-right {
    gap: 8px;
  }
}

@media (max-width: 480px) {
  .main-nav {
    display: none;
  }

  .navbar-left {
    gap: 10px;
  }
}

:global(.dark-theme) .top-navbar {
  background: #0a0a0a;
  border-bottom-color: #222;
}

.download-btn1 {
  color: #fff;
  cursor: pointer;
}

.download-btn1:hover {
  color: #000;
}

.user-info-container {
  position: relative;
  display: inline-block;
}

.user_po {
  position: absolute;
  top: 30px;
  right: 0;
}

.user-dropdown {
  width: 320px;
  background: #161616;
  border: 1px solid #2a2a2a;
  border-radius: 18px;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.32);
  z-index: 1001;
  margin-top: 8px;
  overflow: hidden;
  padding: 12px;
}

.user-header-card {
  display: flex;
  align-items: center;
  padding: 12px;
  border-radius: 16px;
  background: linear-gradient(250deg, rgba(192, 195, 215, .6) 4.54%, rgba(106, 107, 118, .6) 34.29%, rgba(89, 93, 105, .6) 41.53%, rgba(62, 63, 67, .6) 102.52%);
  margin-bottom: 12px;
}

.user-avatar {
  width: 44px;
  height: 44px;
  background: #f2f2f2;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  color: #9ed321;
  flex-shrink: 0;
}

.user-details {
  flex: 1;
  min-width: 0;
}

.user-email {
  color: #fff;
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 6px;
  word-break: break-all;
}

.user-uid {
  color: rgba(255, 255, 255, 0.82);
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.menu-items {
  padding: 4px 0 10px;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 12px 10px;
  cursor: pointer;
  transition: background 0.2s;
  gap: 14px;
  border-radius: 12px;
}

.menu-item:hover {
  background: #1f1f1f;
}

.menu-icon {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  flex-shrink: 0;
}

.menu-icon img {
  width: 18px;
  height: 18px;
}

.menu-item span {
  color: #f5f5f5;
  font-size: 16px;
  font-weight: 500;
}

.logout-section {
  padding-top: 10px;
}

.logout-btn {
  width: 100%;
  height: 44px;
  background: transparent;
  border: 1px solid #2b2b2b;
  color: #fff;
  font-weight: 600;
  padding: 0;
  border-radius: 14px;
  cursor: pointer;
  font-size: 18px;
  transition: all 0.2s ease;
}

.logout-btn:hover {
  background: #1f1f1f;
  border-color: #3a3a3a;
}

.reserveaSeat {
  height: 10px;
  background-color: transparent;
}

.showdownload_box {
  border-radius: 10px;
  position: absolute;
  top: 50px;
  right: -20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.preference-modal {
  ::v-deep .ivu-modal-content {
    background-color: #ffffff;
    color: #333333;
    border-radius: 16px;
    border: none;
    overflow: hidden;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  }

  ::v-deep .ivu-modal-header {
    background-color: #ffffff;
    border-bottom: 1px solid #f3f4f6;
    padding: 16px 24px;
  }

  ::v-deep .ivu-modal-header-inner {
    color: #111827;
    font-size: 16px;
    font-weight: 600;
    letter-spacing: 0.5px;
  }

  ::v-deep .ivu-modal-close .ivu-icon-ios-close {
    color: #9ca3af;
    transition: color 0.2s;
  }

  ::v-deep .ivu-modal-close .ivu-icon-ios-close:hover {
    color: #4b5563;
  }
}

.pref-content {
  padding: 12px 16px;
}

.pref-form-group {
  margin-bottom: 24px;
}

.pref-label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #6b7280;
  margin-bottom: 12px;
}

.pref-select-wrapper {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.pref-radio-option {
  display: flex;
  align-items: center;
  padding: 16px;
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #f9fafb;
    border-color: #d1d5db;
  }

  &.active {
    background-color: rgba(171, 225, 39, 0.1);
    border-color: #ABE127;
  }
}

.radio-circle {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 2px solid #d1d5db;
  margin-right: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.pref-radio-option.active .radio-circle {
  border-color: #ABE127;
}

.radio-inner {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #ABE127;
}

.radio-text {
  font-size: 15px;
  color: #4b5563;
  font-weight: 500;
}

.pref-radio-option.active .radio-text {
  color: #111827;
}

.pref-footer {
  margin-top: 12px;
  padding-top: 16px;
  text-align: right;
}

.pref-save-btn {
  background-color: #ABE127;
  color: #000;
  border: none;
  padding: 10px 32px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: #bdf23a;
    box-shadow: 0 4px 12px rgba(171, 225, 39, 0.3);
  }

  &:active {
    transform: translateY(1px);
  }
}
</style>
