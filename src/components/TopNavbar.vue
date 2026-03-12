<template>
  <div class="top-navbar">
    <div class="navbar-container">
      <div class="navbar-left">
        <router-link to="/">
          <div class="logo-section">
            <img src="../assets/images/logo1.png" alt="">
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
                <div class="user-dropdown"></div>
                <div class="user-header">
                  <div class="user-avatar">
                    <UserInfoIcon style="width: 24px; height: 24px;" :size="16" />
                  </div>
                  <div class="user-details">
                    <div class="user-email">{{ userEmail }}</div>
                    <div class="user-uid">UID:{{ userUID }}</div>
                  </div>
                </div>

                <!-- 菜单 -->
                <div class="menu-items">
                  <div class="menu-item" @click="navigateTo('/account/overview')">
                    <div class="menu-icon"><img src="../assets/svg/all.svg" alt=""></div>
                    <span>总览</span>
                  </div>

                  <div class="menu-item" @click="navigateTo('/cards')">
                    <div class="menu-icon"><img src="../assets/svg/cardCoupons.svg" alt=""></div>
                    <span>卡券中心</span>
                  </div>

                  <div class="menu-item" @click="navigateTo('/invite')">
                    <div class="menu-icon"><img src="../assets/svg/invite.svg" alt=""></div>
                    <span>邀请好友</span>
                  </div>
                </div>

                <div class="logout-section">
                  <button class="logout-btn" @click="handleLogout">退出</button>
                </div>
              </div>
            </div>
          </div>

        </div>

        <!-- 下载按钮 -->
        <div style="position: relative;">
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

        <!-- 主题切换 -->
        <!-- <button class="theme-btn" @click="toggleTheme">
          <BrightColorIcon style="width: 20px; height: 20px;" :size="14" className="theme-btn1" />
        </button> -->

        <!-- 注册按钮 -->
        <button v-if="!isLogin" @click="goToRegister" class="register-btn">
          注册
        </button>

        <!-- 登录按钮 -->
        <button v-if="!isLogin" class="login-btn" @click="$router.push('/login')">
          登录
        </button>
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
      currentLang: 'zh',
      navItems: [
        { name: '行情', path: '/market' },
        { name: '合约', path: '/swap' },
        { name: '事件合约', path: '/eventContract' },
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
    width: 120px;
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
  gap: 20px;
}

.nav-item {
  color: #fff;
  text-decoration: none;
  font-weight: 700;
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
  font-weight: 700;
  color: #fff;
  padding: 8px 18px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
}

.register-btn:hover {
  border-color: #555;
  background: #2a2a2a;
  color: white;
}

.login-btn {
  background: #c6f700;
  border: none;
  color: #1a1a1a;
  padding: 8px 18px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s;
}

.login-btn:hover {
  background: #b8e600;
  transform: translateY(-1px);
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
  right: -0;
}

.user-dropdown {
  background-color: #fff;
  border-radius: 8px;
  min-width: 280px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  z-index: 1001;
  margin-top: 8px;
  overflow: hidden;
}

.user-header {
  display: flex;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #cccaca;
}

.user-avatar {
  width: 40px;
  height: 40px;
  background: #c6f700;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
}

.user-details {
  flex: 1;
}

.user-email {
  color: #000;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 4px;
}

.user-uid {
  color: #999;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.menu-items {
  padding: 8px 0;
}

.menu-item {
  color: #000;
  display: flex;
  align-items: center;
  padding: 12px 16px;
  cursor: pointer;
  transition: background 0.3s;
  gap: 12px;
}

.menu-item:hover {
  background: #f5f5f5;
}

.menu-icon {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
}

.logout-section {
  padding: 12px 16px;
  border-top: 1px solid #cccaca;
}

.logout-btn {
  width: 100%;
  background: none;
  border: none;
  color: #ff4757;
  font-weight: 700;
  padding: 2px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.3s;
}

.logout-btn:hover {
  background: rgba(255, 71, 87, 0.1);
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
</style>