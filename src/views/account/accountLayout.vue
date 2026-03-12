<template>
  <div class="account-layout">
    <div class="">
      <div class="layout-wrapper">
        <!-- 左侧菜单 -->
        <div class="sidebar">
          <nav class="nav-menu">
            <router-link v-for="item in menuItems" :key="item.path" :to="item.path" class="nav-item"
              active-class="active">
              <img :src="item.icon" alt="" class="nav-icon">
              <span style="margin-left: 5px;">{{ item.name }}</span>
            </router-link>
          </nav>
        </div>

        <!-- 右侧路由出口 -->
        <div class="main-content">
          <router-view></router-view>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'accountLayout',
  data() {
    return {
      menuItems: [
        {
          name: '总览',
          path: '/account/overview',
          icon: require('../../assets/svg/all.svg')
        },
        // {
        //   name: '安全中心',
        //   path: '/account/security',
        //   icon: require('../../assets/svg/secure.svg')
        // },
        {
          name: '卡券中心',
          path: '/cards',
          icon: require('../../assets/svg/cardCoupons.svg')
        },
        {
          name: '邀请好友',
          path: '/invite',
          icon: require('../../assets/svg/invite.svg')
        },
      ]
    }
  },
  computed: {
    userEmail() {
      const member = this.$store.getters.member;
      return member ? member.email : '23**7@qq.com';
    },
    userUID() {
      const member = this.$store.getters.member;
      return member ? member.uid : '888311878';
    }
  }
}
</script>

<style scoped>
.account-layout {
  min-height: 100vh;
}

.layout-wrapper {
  display: flex;
}

.sidebar {
  width: 280px;
  border-right: 1px solid #eaeaed;
  background: white;
  min-height: 100vh;
  padding: 36px 0 0 0;
}

.user-info-section {
  text-align: center;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
  margin-bottom: 20px;
}

.user-avatar img {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  margin-bottom: 10px;
}

.user-details h3 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 5px;
  color: #333;
}

.user-details p {
  font-size: 14px;
  color: #666;
}

.nav-menu {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.nav-item {
  display: flex;
  margin-right: 24px;
  align-items: center;
  gap: 12px;
  margin-bottom: 10px;
  padding: 12px 16px;
  border-radius: 6px;
  cursor: pointer;
  color: #000;
  transition: all 0.3s ease;
  font-size: 14px;
  text-decoration: none;
}

.nav-item:hover {
  --un-bg-opacity: 1;
  background-color: rgba(248, 248, 248, var(--un-bg-opacity));
}

.nav-item.active {
  --un-bg-opacity: 1;
  background-color: rgba(248, 248, 248, var(--un-bg-opacity));
  font-weight: 500;
}

.nav-icon {}

.main-content {
  width: 1272px;
  background: white;
  border-radius: 8px;
  padding: 30px;
  min-height: 600px;
}
</style>